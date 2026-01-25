import { fireEvent, render } from '@testing-library/react-native';
import Terms from '../app/(public)/terms';

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

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

jest.mock('../components/ScreenWrapper', () => ({ children }) => children);
jest.mock('../components/BrandLogo', () => 'BrandLogo');

describe('Terms & Conditions', () => {
  it('renders correctly and handles navigation', () => {
    const { getByText } = render(<Terms />);
    expect(getByText('Terms & Conditions')).toBeTruthy();
    fireEvent.press(getByText('Ok'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('handles "Read more" interaction', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});   
    const { getByText } = render(<Terms />); 
    fireEvent.press(getByText('Read more'));
    expect(consoleSpy).toHaveBeenCalledWith("Read More Clicked");
    consoleSpy.mockRestore();
  });
});