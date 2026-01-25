import { fireEvent, render } from '@testing-library/react-native';
import Terms from '../app/(public)/terms';

// 1. Mock Router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

// 2. Mock UI Components (Pass props through so we can click them)
jest.mock('../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, onPress, ...props }) => (
    <Text onPress={onPress} {...props}>{children}</Text>
  );
});

// Mock visual wrappers to avoid clutter
jest.mock('../components/ScreenWrapper', () => ({ children }) => children);
jest.mock('../components/BrandLogo', () => 'BrandLogo');

describe('Terms & Conditions', () => {
  it('renders correctly and handles navigation', () => {
    const { getByText } = render(<Terms />);
    
    // Check Header
    expect(getByText('Terms & Conditions')).toBeTruthy();
    
    // Check "Ok" Button Logic
    fireEvent.press(getByText('Ok'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('handles "Read more" interaction', () => {
    // Spy on console.log since your component logs to it
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const { getByText } = render(<Terms />);
    
    fireEvent.press(getByText('Read more'));
    
    expect(consoleSpy).toHaveBeenCalledWith("Read More Clicked");
    consoleSpy.mockRestore();
  });
});