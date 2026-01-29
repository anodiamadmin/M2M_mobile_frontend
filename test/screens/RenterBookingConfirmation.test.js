import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RenterBookingConfirmation from '../../app/(tabs)/my-rides/booking-confirmation';

// ---------------- MOCK DATA ----------------

const MOCK_BIKE = {
  id: '1',
  title: "Sam's E-Bike",
  type: 'Electric',
  price: 136,
  rating: 4.8,
  status: 'Available',
  isVerified: true,
  supplier: {
    name: 'Urban Cycles',
    location: 'Sydney CBD',
  },
};

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
  const { View, Text } = require('react-native');
  return ({ title, price }) => (
    <View>
      <Text>{title}</Text>
      <Text>${price}</Text>
    </View>
  );
});

// Checkbox
jest.mock('../../components/Checkbox', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ checked, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{checked ? 'CHECKED' : 'UNCHECKED'}</Text>
    </TouchableOpacity>
  );
});

// Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, disabled }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// InfoModal & SupplierProfileView (UI-only)
jest.mock('../../components/InfoModal', () => ({ children, visible }) =>
  visible ? children : null
);
jest.mock('../../components/SupplierProfileView', () => () => null);

// Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

// bikeService
jest.mock('../../services/bikeService', () => ({
  bikeService: {
    getBikeById: jest.fn(() => Promise.resolve(MOCK_BIKE)),
  },
}));

// Router
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
  }),
  useLocalSearchParams: () => ({
    bikeId: '1',
    from: '2026-12-23',
    to: '2027-01-23',
  }),
}));

// ---------------- TEST SUITE ----------------

describe('RenterBookingConfirmation Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  // ---------- RENDERING ----------

  it('1. Renders bike details after loading', async () => {
    const { getByText } = render(<RenterBookingConfirmation />);

    await waitFor(() => {
      expect(getByText("Sam's E-Bike")).toBeTruthy();
      expect(getByText('$136')).toBeTruthy();
    });
  });

  it('2. Displays calculated total price', async () => {
    const { getByText } = render(<RenterBookingConfirmation />);

    // 31 days → 5 weeks → 5 × 136 = 680
    await waitFor(() => {
      expect(getByText('$680')).toBeTruthy();
    });
  });

  // ---------- INSURANCE FLOW ----------

  it('3. Confirm button is disabled until insurance is accepted', async () => {
    const { getByText } = render(<RenterBookingConfirmation />);

    await waitFor(() => {
      expect(getByText('Accept Insurance to Book')).toBeTruthy();
    });
  });

  it('4. Enables confirmation after insurance checkbox is pressed', async () => {
    const { getByText } = render(<RenterBookingConfirmation />);

    await waitFor(() => {
      fireEvent.press(getByText('UNCHECKED'));
    });

    expect(getByText('Confirm Booking')).toBeTruthy();
  });

  it('5. Confirms booking and navigates to My Rides', async () => {
    const { getByText } = render(<RenterBookingConfirmation />);

    await waitFor(() => {
      fireEvent.press(getByText('UNCHECKED'));
    });

    fireEvent.press(getByText('Confirm Booking'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Success',
      'E-Bike booked successfully!'
    );

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/my-rides');
  });
});
