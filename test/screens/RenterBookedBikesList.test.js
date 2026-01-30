import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import RenterBookedBikesList from '../../app/(tabs)/my-rides/index';
import { AuthContext } from '../../context/AuthContext';

// ---------------- MOCK DATA ----------------

const MOCK_BOOKINGS = [
  {
    id: '1',
    title: "Sam's E-Bike",
    price: 120,
    status: 'Active',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    image: null,
    rating: 4.8,
    supplier: {
      name: 'Bike Hub',
      location: 'Sydney CBD',
    },
  },
  {
    id: '2',
    title: 'Bruna A1 Cargo',
    price: 140,
    status: 'Upcoming',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    image: null,
    rating: 4.5,
    supplier: {
      name: 'Cargo Rentals',
      location: 'Sydney',
    },
  },
];

// ---------------- MOCKS ----------------

// ScreenWrapper
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);

// BrandLogo
jest.mock('../../components/BrandLogo', () => 'BrandLogo');

// Label
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

// DateRangePicker
jest.mock('../../components/DateRangePicker', () => {
  const { View, Text } = require('react-native');
  return () => (
    <View>
      <Text>DateRangePicker</Text>
    </View>
  );
});

// Card (highlight)
jest.mock('../../components/Card', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ title, buttonTitle, onBookPress }) => (
    <View>
      <Text>{title}</Text>
      {buttonTitle && (
        <TouchableOpacity onPress={onBookPress}>
          <Text>{buttonTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

// CardCarousel
jest.mock('../../components/CardCarousel', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ data, onBookPress }) => (
    <View>
      {data.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onBookPress(item)}
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
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

// bikeService
jest.mock('../../services/bikeService', () => ({
  bikeService: {
    getMyBookings: jest.fn(() => Promise.resolve(MOCK_BOOKINGS)),
  },
}));

// Navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ---------------- TEST SUITE ----------------

describe('RenterBookedBikesList Screen', () => {
  const renderWithAuth = (user = { name: 'John Doe' }) =>
    render(
      <AuthContext.Provider value={{ user }}>
        <RenterBookedBikesList />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- RENDERING ----------

  it('1. Renders welcome message with first name', async () => {
    const { getByText } = renderWithAuth();

    await waitFor(() => {
      expect(getByText('Welcome John')).toBeTruthy();
    });
  });

  it('2. Renders active booking and booking history list', async () => {
    const { getByText } = renderWithAuth();

    await waitFor(() => {
      expect(getByText("Sam's E-Bike")).toBeTruthy(); // highlight
      expect(getByText('Bruna A1 Cargo')).toBeTruthy(); // carousel
    });
  });

  it('3. Renders "Book a New E-Bike" CTA', async () => {
    const { getByText } = renderWithAuth();

    await waitFor(() => {
      expect(getByText('Book a New E-Bike')).toBeTruthy();
    });
  });

  // ---------- INTERACTIONS ----------

  it('4. Navigates to booking filter when CTA is pressed', async () => {
    const { getByText } = renderWithAuth();

    await waitFor(() => {
      fireEvent.press(getByText('Book a New E-Bike'));
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/(tabs)/my-rides/booking-filter'
    );
  });

  it('5. Navigates to current booking when Manage Ride is pressed', async () => {
    const { getByText } = renderWithAuth();

    await waitFor(() => {
      fireEvent.press(getByText('Manage Ride'));
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/(tabs)/my-rides/current-booking',
      })
    );
  });

  it('6. Navigates to current booking when a carousel item is pressed', async () => {
    const { getByText } = renderWithAuth();

    await waitFor(() => {
      fireEvent.press(getByText('Bruna A1 Cargo'));
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/(tabs)/my-rides/current-booking',
      })
    );
  });
});
