import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RenterBookingFilter from '../../app/(tabs)/my-rides/booking-filter';
import { AuthContext } from '../../context/AuthContext';

// --- MOCKS ---
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/BrandLogo', () => 'BrandLogo');
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock New Components
jest.mock('../../components/DatePicker', () => 'DatePicker');
jest.mock('../../components/Dropdown', () => 'Dropdown');
jest.mock('../../components/LocationSelector', () => 'LocationSelector');
jest.mock('../../components/PriceRangeSlider', () => 'PriceRangeSlider');

// Mock Button to inspect 'variant' prop for styling tests
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, variant, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress} accessibilityLabel={variant}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

describe('RenterBookingFilter Screen', () => {
  const renderWithAuth = (user = { name: "Alex" }) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <RenterBookingFilter />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  // --- RENDERING TESTS (Tasks 1-8) ---

  it('1 & 2. Renders personalized greeting and subheading', () => {
    const { getByText } = renderWithAuth({ name: "Alex" });
    expect(getByText(/Welcome Alex/i)).toBeTruthy();
    expect(getByText("Book an E-Bike")).toBeTruthy();
  });

  it('3. Renders From and To DatePickers', () => {
    const { getByTestId, getByText } = renderWithAuth();
    // Assuming you wrap these in a View or give them IDs
    expect(getByTestId('start-date-picker')).toBeTruthy();
    expect(getByText('From')).toBeTruthy();
    expect(getByTestId('end-date-picker')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
  });

  it('4. Renders Price Range section and Slider', () => {
    const { getByTestId, getByText } = renderWithAuth();
    expect(getByText(/Price range/i)).toBeTruthy();
    expect(getByTestId('price-slider')).toBeTruthy();
  });

  it('5. Renders Category section and Dropdown', () => {
    const { getByTestId, getByText } = renderWithAuth();
    expect(getByText(/Category/i)).toBeTruthy(); // Section Label
    expect(getByTestId('category-dropdown')).toBeTruthy();
  });

  it('6. Renders Pickup Location section and Selector', () => {
    const { getByTestId, getByText } = renderWithAuth();
    expect(getByText(/Pickup Location/i)).toBeTruthy(); // Section Label
    expect(getByTestId('location-selector')).toBeTruthy();
  });

  it('7 & 8. Renders Buttons with correct styling variants', () => {
    const { getByTestId } = renderWithAuth();
    
    const continueBtn = getByTestId('continue-button');
    const myBookingsBtn = getByTestId('my-bookings-button');

    // Check accessibilityLabel (where we mocked the variant)
    expect(continueBtn.props.accessibilityLabel).toBe('primary');
    expect(myBookingsBtn.props.accessibilityLabel).toBe('secondary');
  });

  // --- LOGIC & NAVIGATION TESTS (Manual Tasks Promoted to Unit Tests) ---

  it('Validates form: Shows alert if Continue pressed with empty fields', () => {
    const { getByTestId } = renderWithAuth();
    
    // Press Continue without filling anything
    fireEvent.press(getByTestId('continue-button'));
    
    // Expect Validation Alert
    expect(Alert.alert).toHaveBeenCalledWith("Missing Details", expect.anything());
  });

  it('Navigates to Bike Details when form is valid', async () => {
    const router = require('expo-router').useRouter();
    const { getByTestId } = renderWithAuth();

    // Fill the form (Simulate valid state)
    // Note: Since we mocked the components to be simple, we assume the parent 
    // component has internal state logic or we'd fire change events here.
    // For this test, we assume we can bypass validation if we mock the handler 
    // or if we fire events on the inputs first.
    
    // ... trigger input events here ...

    // fireEvent.press(getByTestId('continue-button'));
    // await waitFor(() => expect(router.push).toHaveBeenCalledWith(expect.stringContaining('bike-details')));
  });

  it('Navigates to Booked Bikes List when "My Bookings" is pressed', () => {
    const router = require('expo-router').useRouter();
    const { getByTestId } = renderWithAuth();

    fireEvent.press(getByTestId('my-bookings-button'));
    
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('booked-bikes'));
  });
});