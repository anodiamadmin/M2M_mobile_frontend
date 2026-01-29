import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RenterBookingFilter from '../../app/(tabs)/my-rides/booking-filter';
import { AuthContext } from '../../context/AuthContext';

// ---------------- MOCKS ----------------

// Layout wrappers
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/BrandLogo', () => 'BrandLogo');
jest.mock('../../components/ScrollHint', () => () => null);

// Label
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

// Navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// DateRangePicker
jest.mock('../../components/DateRangePicker', () => {
  const { View, Text } = require('react-native');
  return ({ fromLabel, toLabel }) => (
    <View>
      <Text>{fromLabel}</Text>
      <Text>{toLabel}</Text>
    </View>
  );
});

// Other inputs
jest.mock('../../components/PriceRangeSlider', () => () => null);
jest.mock('../../components/Dropdown', () => () => null);
jest.mock('../../components/LocationSelector', () => () => null);

// Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, variant }) => (
    <TouchableOpacity onPress={onPress} accessibilityLabel={variant}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// ---------------- TEST SUITE ----------------

describe('RenterBookingFilter Screen', () => {
  const renderWithAuth = (user = { name: 'Alex Johnson' }) =>
    render(
      <AuthContext.Provider value={{ user }}>
        <RenterBookingFilter />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  // ---------- RENDERING ----------

  it('1. Renders welcome message with first name', () => {
    const { getByText } = renderWithAuth();
    expect(getByText('Welcome Alex')).toBeTruthy();
    expect(
      getByText('Set your preferences to find the perfect ride.')
    ).toBeTruthy();
  });

  it('2. Renders DateRangePicker with From and To labels', () => {
    const { getByText } = renderWithAuth();
    expect(getByText('From')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
  });

  it('3. Renders action buttons', () => {
    const { getByText } = renderWithAuth();
    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Visit My Bookings')).toBeTruthy();
  });

  // ---------- LOGIC ----------

  it('4. Shows validation alert when Continue is pressed with empty form', () => {
    const { getByText } = renderWithAuth();

    fireEvent.press(getByText('Continue'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Missing Details',
      'Please fill all fields before continuing'
    );
  });

  it('5. Navigates to My Bookings tab when button is pressed', () => {
    const { getByText } = renderWithAuth();

    fireEvent.press(getByText('Visit My Bookings'));

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/my-rides');
  });
});
