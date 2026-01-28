import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RenterBookingFilter from '../../app/(tabs)/my-rides/booking-filter';
import { AuthContext } from '../../context/AuthContext';

// ---------------- MOCKS ----------------

// Layout
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/BrandLogo', () => 'BrandLogo');

jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// Navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// DateRangePicker
jest.mock('@components/DateRangePicker', () => {
  const { View, Text } = require('react-native');
  return ({ fromLabel, toLabel }) => (
    <View>
      <Text>{fromLabel}</Text>
      <Text>{toLabel}</Text>
    </View>
  );
});

// Other Inputs
jest.mock('@components/Dropdown', () => 'Dropdown');
jest.mock('@components/LocationSelector', () => 'LocationSelector');
jest.mock('@components/PriceRangeSlider', () => 'PriceRangeSlider');

// Button
jest.mock('@components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, variant, testID }) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      accessibilityLabel={variant}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// ---------------- TEST SUITE ----------------

describe('RenterBookingFilter Screen', () => {
  const renderWithAuth = (user = { name: 'Alex' }) =>
    render(
      <AuthContext.Provider value={{ user }}>
        <RenterBookingFilter />
      </AuthContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  // ---------- RENDER TESTS ----------

  it('1. Renders welcome message and heading', () => {
    const { getByText } = renderWithAuth();
    expect(getByText('Welcome Alex')).toBeTruthy();
    expect(getByText('Book an E-Bike')).toBeTruthy();
  });

  it('2. Renders DateRangePicker with From and To labels', () => {
    const { getByTestId, getByText } = renderWithAuth();
    expect(getByTestId('start-date-picker')).toBeTruthy();
    expect(getByText('From')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
  });

  it('3. Renders PriceRangeSlider', () => {
    const { getByTestId } = renderWithAuth();
    expect(getByTestId('price-slider')).toBeTruthy();
  });

  it('4. Renders Category Dropdown', () => {
    const { getByTestId } = renderWithAuth();
    expect(getByTestId('category-dropdown')).toBeTruthy();
  });

  it('5. Renders Location Selector', () => {
    const { getByTestId } = renderWithAuth();
    expect(getByTestId('location-selector')).toBeTruthy();
  });

  it('6. Renders Continue and My Bookings buttons with correct variants', () => {
    const { getByTestId } = renderWithAuth();

    expect(getByTestId('continue-button').props.accessibilityLabel)
      .toBe('primary');

    expect(getByTestId('my-bookings-button').props.accessibilityLabel)
      .toBe('secondary');
  });

  // ---------- LOGIC & NAVIGATION ----------

  it('7. Shows validation alert if Continue is pressed with empty form', () => {
    const { getByTestId } = renderWithAuth();

    fireEvent.press(getByTestId('continue-button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Missing Details',
      'Please fill all fields before continuing'
    );
  });

  it('8. Navigates to My Bookings when button is pressed', () => {
    const { getByTestId } = renderWithAuth();

    fireEvent.press(getByTestId('my-bookings-button'));

    expect(mockPush).toHaveBeenCalledWith('/my-rides');
  });
});
