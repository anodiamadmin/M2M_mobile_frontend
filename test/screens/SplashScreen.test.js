import { act, render, waitFor } from '@testing-library/react-native';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from '../../app/splash';
import { AuthStatus } from '../../constants/types';
import { AuthContext } from '../../context/AuthContext';

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../../components/ScreenWrapper', () => {
  const { View } = require('react-native');
  return ({ children }) => <View>{children}</View>;
});
jest.mock('../../components/Label', () => 'Label');

const renderWithAuth = (status) => {
  return render(
    <AuthContext.Provider value={{ authStatus: status }}>
      <SplashScreenComponent />
    </AuthContext.Provider>
  );
};

describe('Splash Screen', () => {
  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Happy Path: Loads Image -> Hides Splash -> Waits 2s -> Navigates', async () => {
    const { getByTestId } = renderWithAuth(AuthStatus.AUTHENTICATED);

    const image = getByTestId('splash-image');
    await act(async () => {
      image.props.onLoad(); 
    });

    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/explore');
    });
  });

  it('Error Path: Handles native splash error gracefully', async () => {
    SplashScreen.hideAsync.mockRejectedValue(new Error("Native Failure"));
    const { getByTestId } = renderWithAuth(AuthStatus.UNAUTHENTICATED);
    const image = getByTestId('splash-image');
    await act(async () => {
      image.props.onLoad();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/landing');
    });
  });

  it('Waits indefinitely if AuthStatus is UNKNOWN', async () => {
    const { getByTestId } = renderWithAuth(AuthStatus.UNKNOWN);
    const image = getByTestId('splash-image');
    await act(async () => {
      image.props.onLoad();
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});