import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
// Pointing to the file we will create
import RenterBookingConfirmation from '../../app/(tabs)/my-rides/booking-confirmation';

// --- MOCKS ---

// 1. Mock UI Components
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});
jest.mock('../../components/VerifiedBadge', () => 'VerifiedBadge');

// 2. Mock Expo Checkbox (Crucial for testing interaction)
jest.mock('expo-checkbox', () => {
  const { View } = require('react-native');
  return (props) => (
    <View 
      testID="insurance-checkbox" 
      onTouchEnd={() => props.onValueChange(!props.value)} 
    />
  );
});

// 3. Mock Router & Params
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({
    title: "Sam's E-Bike",
    price: "136",
    start: "2026-12-23",
    end: "2027-01-23"
  }),
}));

// 4. Mock Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, style, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress} style={style}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

describe('RenterBookingConfirmation Screen', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert'); // Spy on Alerts to verify validation messages
  });

  // --- RENDERING TESTS ---

  it('1. Renders bike details from params', () => {
    const { getByText } = render(<RenterBookingConfirmation />);
    expect(getByText("Sam's E-Bike")).toBeTruthy();
    expect(getByText("$136")).toBeTruthy();
    // Verify date rendering (checking partial string for resilience)
    expect(getByText(/Start:/i)).toBeTruthy();
  });

  it('2. Renders Owner Profile link', () => {
    const { getByText } = render(<RenterBookingConfirmation />);
    expect(getByText(/View Owner's Profile/i)).toBeTruthy();
  });

  it('3. Renders Insurance section with mandatory checkbox', () => {
    const { getByText, getByTestId } = render(<RenterBookingConfirmation />);
    expect(getByText(/Insurance Requirements/i)).toBeTruthy();
    expect(getByText(/Purchase mandatory/i)).toBeTruthy();
    expect(getByTestId('insurance-checkbox')).toBeTruthy();
  });

  // --- INTERACTION TESTS ---

  it('4. Navigates to Insurance Info Modal when "Learn more" is pressed', () => {
    const { getByText } = render(<RenterBookingConfirmation />);
    // Assuming "Learn more" is the clickable text inside the insurance block
    fireEvent.press(getByText(/Learn more/i));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('insurance-info-modal'));
  });

  it('5. Navigates to Owner Profile Modal when link is pressed', () => {
    const { getByText } = render(<RenterBookingConfirmation />);
    fireEvent.press(getByText(/View Owner's Profile/i));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('owner-profile-modal'));
  });

  it('6. Shows Alert (Validation Error) if Book pressed without Insurance', () => {
    const { getByTestId } = render(<RenterBookingConfirmation />);
    
    // Press Book immediately (Checkbox is false by default)
    fireEvent.press(getByTestId('book-button'));
    
    // Should trigger Alert, NOT navigation
    expect(Alert.alert).toHaveBeenCalledWith("Insurance Required", expect.anything());
    expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('(tabs)/my-rides'));
  });

  it('7. Books and Navigates Home when Insurance is checked', () => {
    const { getByTestId } = render(<RenterBookingConfirmation />);
    
    // 1. Check the box
    fireEvent(getByTestId('insurance-checkbox'), 'touchEnd');
    
    // 2. Press Book
    fireEvent.press(getByTestId('book-button'));
    
    // 3. Handle the Success Alert (Simulate pressing "OK" on the alert)
    // In Jest, Alert.alert is a mock. We need to grab the "OK" button callback manually.
    const alertCalls = Alert.alert.mock.calls;
    const successAlert = alertCalls.find(call => call[0] === "Booking Confirmed!");
    expect(successAlert).toBeTruthy();

    // Execute the "OK" button's onPress from the alert options
    const okButton = successAlert[2].find(btn => btn.text === "OK");
    okButton.onPress();

    // 4. Verify Navigation to Home List
    expect(mockPush).toHaveBeenCalledWith("/(tabs)/my-rides");
  });
});