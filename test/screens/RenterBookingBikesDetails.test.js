import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import RenterBikeDetails from '../../app/(tabs)/my-rides/booking-bike-details';

// ---------------- MOCK DATA ----------------

const MOCK_BIKES = [
  {
    id: '1',
    title: "Sam's E-Bike",
    type: 'Electric',
    price: 100,
    rating: 4.8,
    status: 'Available',
    supplier: { name: 'Urban Cycles', location: 'Sydney CBD' },
  },
  {
    id: '2',
    title: 'Cargo Plus',
    type: 'Electric',
    price: 140,
    rating: 4.6,
    status: 'Available',
    supplier: { name: 'City Bikes', location: 'Sydney CBD' },
  },
];

// ---------------- MOCKS ----------------

// Layout
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/BrandLogo', () => 'BrandLogo');
jest.mock('../../components/ScrollHint', () => () => null);

// Label
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

// Card
jest.mock('../../components/Card', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ title, buttonTitle, onBookPress, variant }) => (
    <View>
      <Text>{title}</Text>
      {buttonTitle && (
        <TouchableOpacity onPress={onBookPress}>
          <Text>{buttonTitle}</Text>
        </TouchableOpacity>
      )}
      <Text>Variant: {variant}</Text>
    </View>
  );
});

// Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// FlatList (default export)
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockFlatList = ({ data, renderItem, ListHeaderComponent }) => (
    <View>
      {ListHeaderComponent}
      {data.map((item, index) => (
        <View key={item.id ?? index}>
          {renderItem({ item, index })}
        </View>
      ))}
    </View>
  );

  return {
    __esModule: true,
    default: MockFlatList,
  };
});

// Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

// bikeService
jest.mock('../../services/bikeService', () => ({
  bikeService: {
    getAvailableBikes: jest.fn(() => Promise.resolve(MOCK_BIKES)),
  },
}));

// Navigation
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useLocalSearchParams: () => ({
    from: '2026-02-01',
    to: '2026-02-07',
    category: 'Electric',
    location: 'Sydney CBD',
    maxPrice: '200',
  }),
}));

// ---------------- TEST SUITE ----------------

describe('RenterBikeDetails Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- RENDERING ----------

  it('1. Renders header and location context', async () => {
    const { getByText } = render(<RenterBikeDetails />);

    await waitFor(() => {
      expect(getByText('Top Picks for You')).toBeTruthy();
      expect(getByText('in Sydney CBD')).toBeTruthy();
    });
  });

  it('2. Renders highlight bike (cheapest)', async () => {
    const { getByText } = render(<RenterBikeDetails />);

    await waitFor(() => {
      expect(getByText("Sam's E-Bike")).toBeTruthy();
      expect(getByText('Book This E-Bike')).toBeTruthy();
      expect(getByText('Variant: highlight')).toBeTruthy();
    });
  });

  it('3. Renders similar bikes list', async () => {
    const { getByText } = render(<RenterBikeDetails />);

    await waitFor(() => {
      expect(getByText('Similar E-Bikes')).toBeTruthy();
      expect(getByText('Cargo Plus')).toBeTruthy();
      expect(getByText('Book')).toBeTruthy();
    });
  });

  // ---------- NAVIGATION ----------

  it('4. Navigates to confirmation screen when booking highlight bike', async () => {
    const { getByText } = render(<RenterBikeDetails />);

    await waitFor(() => {
      fireEvent.press(getByText('Book This E-Bike'));
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(tabs)/my-rides/booking-confirmation',
      params: {
        bikeId: '1',
        from: '2026-02-01',
        to: '2026-02-07',
        price: 100,
      },
    });
  });

  it('5. Navigates to confirmation screen when booking similar bike', async () => {
    const { getAllByText } = render(<RenterBikeDetails />);

    await waitFor(() => {
      fireEvent.press(getAllByText('Book')[0]);
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(tabs)/my-rides/booking-confirmation',
      params: {
        bikeId: '2',
        from: '2026-02-01',
        to: '2026-02-07',
        price: 140,
      },
    });
  });
});
