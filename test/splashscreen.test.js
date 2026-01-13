import { act, render } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';

jest.useFakeTimers();

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Splash Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders splash screen immediately on app launch', () => {
    const { getByText } = render(<SplashScreen />);
    expect(getByText('Micro2Move')).toBeTruthy();
  });

  it('displays logo, tagline and brand values', () => {
    const { getByText } = render(<SplashScreen />);

    expect(getByText('Making Sydney E-bike Friendly')).toBeTruthy();
    expect(getByText('Affordable Reliable Safe')).toBeTruthy();
  });

  it('waits 3 seconds before navigating', () => {
    render(<SplashScreen />);

    act(() => {
      jest.advanceTimersByTime(2900);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to Landing after timeout', () => {
    render(<SplashScreen />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('Landing');
  });
});
