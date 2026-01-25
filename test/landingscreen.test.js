import { fireEvent, render } from '@testing-library/react-native';
import Landing from '../app/landing';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockSetRentIntent = jest.fn();
const mockSetListIntent = jest.fn();

jest.mock('../hooks/useIntent', () => ({
  useIntent: () => ({
    setRentIntent: mockSetRentIntent,
    setListIntent: mockSetListIntent,
  }),
}));

jest.mock('../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../components/Label', () => 'Label');
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
    expect(getByText('Rent a Bike')).toBeTruthy();
    expect(getByText('List a Bike')).toBeTruthy();
    expect(getByText('Explore')).toBeTruthy();
  });

  it('calls setRentIntent when "Rent a Bike" is pressed', () => {
    const { getByText } = render(<Landing />);
    fireEvent.press(getByText('Rent a Bike'));
    expect(mockSetRentIntent).toHaveBeenCalledTimes(1);
  });

  it('calls setListIntent when "List a Bike" is pressed', () => {
    const { getByText } = render(<Landing />);   
    fireEvent.press(getByText('List a Bike'));
    expect(mockSetListIntent).toHaveBeenCalledTimes(1);
  });

  it('navigates to Explore tab when "Explore" is pressed', () => {
    const { getByText } = render(<Landing />);  
    fireEvent.press(getByText('Explore'));
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/explore');
  });
});