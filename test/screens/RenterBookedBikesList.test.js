import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import RenterBookedBikesList from '../../app/(tabs)/my-rides/index';
import { AuthContext } from '../../context/AuthContext';

// ---------- MOCKS ----------

// 1. Layout / UI
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/BrandLogo', () => 'BrandLogo');

jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// 2. Mock DateRangePicker
jest.mock('@components/DateRangePicker', () => {
  const { View, Text } = require('react-native');
  return ({ fromLabel, toLabel }) => (
    <View>
      <Text>{fromLabel}</Text>
      <Text>{toLabel}</Text>
    </View>
  );
});

// 3. Mock CardCarousel
jest.mock('../../components/CardCarousel', () => {
  const { View, Text } = require('react-native');
  return ({ data, title, testID, onItemPress }) => (
    <View testID={testID}>
      <Text>{title}</Text>
      {data.map(item => (
        <Text key={item.id} onPress={() => onItemPress(item)}>
          {item.title}
        </Text>
      ))}
    </View>
  );
});

// 4. Mock Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// 5. Mock Navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// ---------- TEST SUITE ----------

describe('RenterBookedBikesList Screen', () => {

  const renderWithAuth = (user = { name: 'John' }) =>
    render(
      <AuthContext.Provider value={{ user }}>
        <RenterBookedBikesList />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----- RENDER TESTS -----

  it('1. Renders welcome message and heading', () => {
    const { getByText } = renderWithAuth();
    expect(getByText('Welcome John')).toBeTruthy();
    expect(getByText('Your Bookings')).toBeTruthy();
  });

  it('2. Renders DateRangePicker with From and To labels', () => {
    const { getByText, getByTestId } = renderWithAuth();
    expect(getByTestId('start-date-picker')).toBeTruthy();
    expect(getByText('From')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
  });

  it('3. Renders CardCarousel with booking data', () => {
    const { getByTestId, getByText } = renderWithAuth();
    expect(getByTestId('bookings-carousel')).toBeTruthy();
    expect(getByText("Sam's E-Bike")).toBeTruthy();
    expect(getByText('Bruna A1 Cargo')).toBeTruthy();
  });

  it('4. Renders "Book a New E-Bike" button', () => {
    const { getByTestId } = renderWithAuth();
    expect(getByTestId('book-new-bike-button')).toBeTruthy();
  });

  // ----- INTERACTION TESTS -----

  it('5. Navigates to booking filter screen on CTA press', () => {
    const { getByTestId } = renderWithAuth();
    fireEvent.press(getByTestId('book-new-bike-button'));

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/my-rides/booking-filter')
    );
  });

  it('6. Navigates to booking bike details on card press', () => {
    const { getByText } = renderWithAuth();
    fireEvent.press(getByText("Sam's E-Bike"));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/my-rides/booking-bike-details',
      params: { id: '1' },
    });
  });
});
