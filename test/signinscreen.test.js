import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignIn from '../app/(auth)/signin';
import { AuthStatus } from '../constants/types';
import { AuthContext } from '../context/AuthContext';
import { useIntent } from '../hooks/useIntent';
import { authService } from '../services/authService';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../hooks/useIntent', () => ({
  useIntent: jest.fn(), 
}));

jest.unmock('../context/AuthContext'); 

jest.mock('../services/authService', () => ({
  authService: { login: jest.fn() },
}));

jest.mock('../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../components/BrandLogo', () => 'BrandLogo');
jest.mock('../components/Label', () => 'Label');
jest.mock('../components/TextField', () => 'TextField');
jest.mock('../components/EmailInput', () => {
  const { TextInput } = require('react-native');
  return (props) => <TextInput {...props} />;
});
jest.mock('../components/PasswordInput', () => {
  const { TextInput } = require('react-native');
  return (props) => <TextInput {...props} />;
});

jest.mock('../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, testID, disabled }) => (
    <TouchableOpacity testID={testID} onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../components/ActionRow', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ actionText, onActionPress }) => (
    <TouchableOpacity onPress={onActionPress}>
      <Text>{actionText}</Text>
    </TouchableOpacity>
  );
});

describe('SignIn Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  it('shows alert on missing fields', () => {
    useIntent.mockReturnValue({ resolveIntent: jest.fn() });
    
    const { getByTestId } = render(
      <AuthContext.Provider value={{ setAuthStatus: jest.fn() }}>
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.press(getByTestId('SignInButton'));
    expect(Alert.alert).toHaveBeenCalledWith("Missing Fields", expect.anything());
  });

  it('shows alert on server failure', async () => {
    useIntent.mockReturnValue({ resolveIntent: jest.fn() });
    authService.login.mockRejectedValue({ response: { data: { detail: "Invalid credentials" } } });

    const { getByTestId } = render(
      <AuthContext.Provider value={{ setAuthStatus: jest.fn() }}>
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByTestId('emailTextInput'), 'wrong@test.com');
    fireEvent.changeText(getByTestId('passwordTextInput'), 'wrongpass');
    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Login Failed", "Invalid credentials");
    });
  });

  it('handles generic network errors gracefully', async () => {
    useIntent.mockReturnValue({ resolveIntent: jest.fn() });
    authService.login.mockRejectedValue(new Error("Network Error"));

    const { getByTestId } = render(
      <AuthContext.Provider value={{ setAuthStatus: jest.fn() }}>
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByTestId('emailTextInput'), 'test@test.com');
    fireEvent.changeText(getByTestId('passwordTextInput'), 'password');
    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Login Failed", expect.anything());
    });
  });

  it('Happy Path: logs in, updates status, and resolves intent', async () => {
    const resolveIntentSpy = jest.fn();
    const setAuthStatusSpy = jest.fn();

    useIntent.mockReturnValue({ resolveIntent: resolveIntentSpy });
    authService.login.mockResolvedValue({ token: 'fake-token' });

    const { getByTestId } = render(
      <AuthContext.Provider value={{ setAuthStatus: setAuthStatusSpy }}>
        <SignIn />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByTestId('emailTextInput'), 'valid@user.com');
    fireEvent.changeText(getByTestId('passwordTextInput'), 'password123');
    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(setAuthStatusSpy).toHaveBeenCalledWith(AuthStatus.AUTHENTICATED);
      expect(resolveIntentSpy).toHaveBeenCalled(); 
    });
  });

  it('navigates to sign up screen when link is pressed', () => {
    useIntent.mockReturnValue({ resolveIntent: jest.fn() });
    const { getByText } = render(
      <AuthContext.Provider value={{ setAuthStatus: jest.fn() }}>
        <SignIn />
      </AuthContext.Provider>
    );
    
    fireEvent.press(getByText("Sign Up"));
    });
});