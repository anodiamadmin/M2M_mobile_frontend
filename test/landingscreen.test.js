import { fireEvent, render } from '@testing-library/react-native';
import Landing from '../app/landing';

// --- MOCKS ---

// 1. Mock Router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

// 2. Mock Safe Area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// 3. Mock the useIntent Hook
const mockSetRentIntent = jest.fn();
const mockSetListIntent = jest.fn();

jest.mock('../hooks/useIntent', () => ({
  useIntent: () => ({
    setRentIntent: mockSetRentIntent,
    setListIntent: mockSetListIntent,
  }),
}));

// 4. Mock UI Components
jest.mock('../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../components/Label', () => 'Label'); // Simple string mock for labels

// Mock Button to be interactive
jest.mock('../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

describe('Landing Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<Landing />);
    
    // Check for Main Buttons
    expect(getByText('Rent a Bike')).toBeTruthy();
    expect(getByText('List a Bike')).toBeTruthy();
    expect(getByText('Explore')).toBeTruthy();
  });

  it('calls setRentIntent when "Rent a Bike" is pressed', () => {
    const { getByText } = render(<Landing />);
    
    fireEvent.press(getByText('Rent a Bike'));

    // Verify the hook function was called
    expect(mockSetRentIntent).toHaveBeenCalledTimes(1);
  });

  it('calls setListIntent when "List a Bike" is pressed', () => {
    const { getByText } = render(<Landing />);
    
    fireEvent.press(getByText('List a Bike'));

    // Verify the hook function was called
    expect(mockSetListIntent).toHaveBeenCalledTimes(1);
  });

  it('navigates to Explore tab when "Explore" is pressed', () => {
    const { getByText } = render(<Landing />);
    
    fireEvent.press(getByText('Explore'));

    // Verify router.replace was called with correct path
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/explore');
  });
});