import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import CurrentBooking from '../../app/(tabs)/my-rides/current-booking';

// ---------------- MOCK DATA ----------------

const MOCK_BIKE = {
  id: '1',
  title: "Sam's E-Bike",
  type: 'Electric',
  price: 136,
  startDate: '2026-01-01',
  endDate: '2026-01-07',
  status: 'Active',
  isVerified: true,
  rating: 4.6,
  supplier: {
    name: 'Bike Co',
    location: 'Sydney CBD',
  },
};

// ---------------- GLOBAL MOCKS ----------------

// Auto-confirm alerts
jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
  const confirm = buttons?.find(b => b.text === 'Confirm' || b.text === 'OK');
  confirm?.onPress?.();
});

// Icons (SAFE mock)
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: () => null,
  };
});

// Layout
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/ScrollHint', () => () => null);

// Label
jest.mock('../../components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

// Button
jest.mock('../../components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, disabled }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// Card
jest.mock('../../components/Card', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );
});

// Checkbox
jest.mock('../../components/Checkbox', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ checked, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{checked ? 'Checked' : 'Unchecked'}</Text>
    </TouchableOpacity>
  );
});

// InfoModal
jest.mock('../../components/InfoModal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ visible, title, children }) =>
    visible ? (
      <View>
        <Text>{title}</Text>
        {children}
      </View>
    ) : null;
});

// Others
jest.mock('../../components/SupplierProfileView', () => () => null);
jest.mock('../../components/ImageUploader', () => () => null);

// Service
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
  }),
}));

// ---------------- TESTS ----------------

describe('CurrentBooking Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Shows loading indicator initially', () => {
    const { getByTestId, UNSAFE_getByType } = render(<CurrentBooking />);
    // ActivityIndicator has no text → this is the correct assertion
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('2. Renders Active Ride header and bike card', async () => {
    const { getByText } = render(<CurrentBooking />);

    await waitFor(() => {
      expect(getByText('Active Ride')).toBeTruthy();
      expect(getByText("Sam's E-Bike")).toBeTruthy();
    });
  });

  it('3. Shows Ride in Progress info box', async () => {
    const { getByText } = render(<CurrentBooking />);

    await waitFor(() => {
      expect(getByText('Ride in Progress')).toBeTruthy();
    });
  });

  it('4. Allows returning the bike', async () => {
    const { getByText } = render(<CurrentBooking />);

    await waitFor(() => {
      fireEvent.press(getByText('Return E-Bike'));
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/my-rides');
    });
  });

  it('5. Opens Raise Issue modal', async () => {
    const { getByText } = render(<CurrentBooking />);

    await waitFor(() => {
      fireEvent.press(getByText('Report an Incident'));
    });

    await waitFor(() => {
      expect(getByText('Report Incident')).toBeTruthy();
    });
  });

  it('6. Allows switching booking state using debug controls', async () => {
    const { getByText } = render(<CurrentBooking />);

    await waitFor(() => {
      fireEvent.press(getByText('Set Upcoming'));
    });

    await waitFor(() => {
      expect(getByText('Upcoming Reservation')).toBeTruthy();
    });
  });
});

