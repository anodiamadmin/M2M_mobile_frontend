import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import SignUp from '../app/(auth)/signup';
import { AuthStatus } from '../constants/types';
import { authService } from '../services/authService';
import { isAtLeast16, isValidEmail } from '../utils/validators';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockResolveIntent = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack, replace: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../hooks/useIntent', () => ({
  useIntent: () => ({ resolveIntent: mockResolveIntent }),
}));

jest.mock('../services/authService', () => ({
  authService: { register: jest.fn() },
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
}));

jest.mock('../utils/validators', () => ({
  isAtLeast16: jest.fn(),
  isValidEmail: jest.fn(),
}));

jest.mock('../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, testID, disabled }) => (
    <TouchableOpacity testID={testID} onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../components/Checkbox', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ checked, onPress, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
      <Text>{checked ? '[✓]' : '[ ]'}</Text>
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

jest.mock('../components/DatePicker', () => {
  const { Button } = require('react-native');
  return ({ onChange, testID }) => (
    <Button testID={testID} title="Mock Date" onPress={() => onChange(new Date("2000-01-01"))} />
  );
});

jest.mock('../components/ImageUploader', () => {
  const { Button } = require('react-native');
  return ({ onImageSelected, testID }) => (
    <Button testID={testID} title="Mock Upload" onPress={() => onImageSelected("file://mock-image.jpg")} />
  );
});

jest.mock('../components/BrandLogo', () => 'BrandLogo');
jest.mock('../components/ScreenWrapper', () => ({ children }) => children);

import { AuthContext } from '../context/AuthContext';
const renderWithContext = (component, contextOverrides = {}) => {
  const defaultContext = { setAuthStatus: jest.fn() };
  return render(
    <AuthContext.Provider value={{ ...defaultContext, ...contextOverrides }}>
      {component}
    </AuthContext.Provider>
  );
};

describe('<SignUp /> Integration', () => {
  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
    jest.useFakeTimers(); 
    isAtLeast16.mockReturnValue(true);
    isValidEmail.mockReturnValue(true);
    authService.register.mockResolvedValue({ access_token: 'fake-jwt' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const fillForm = (getByTestId) => {
    fireEvent.changeText(getByTestId('nameInput'), 'John Doe');
    fireEvent.changeText(getByTestId('emailInput'), 'john@test.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'password123');
    fireEvent.press(getByTestId('dobPicker'));
    fireEvent.press(getByTestId('idUploader'));
    fireEvent.press(getByTestId('selfieUploader'));
    fireEvent.press(getByTestId('termsCheckbox'));
  };

  it('shows error if fields are missing', () => {
    const { getByTestId } = renderWithContext(<SignUp />);
    fireEvent.press(getByTestId('signUpButton'));
    expect(Alert.alert).toHaveBeenCalledWith("Missing Fields", expect.anything());
  });

  it('shows error if email is invalid', () => {
    isValidEmail.mockReturnValue(false); 
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId);
    fireEvent.press(getByTestId('signUpButton'));
    expect(Alert.alert).toHaveBeenCalledWith("Invalid Email", expect.anything());
  });

  it('shows error if user is underage', () => {
    isAtLeast16.mockReturnValue(false);
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId);
    fireEvent.press(getByTestId('signUpButton'));
    expect(Alert.alert).toHaveBeenCalledWith("Age Restriction", expect.anything());
  });

  it('shows error if photos are missing', () => {
    const { getByTestId } = renderWithContext(<SignUp />);
    fireEvent.changeText(getByTestId('nameInput'), 'John Doe');
    fireEvent.changeText(getByTestId('emailInput'), 'john@test.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'password123');
    fireEvent.press(getByTestId('dobPicker'));
    fireEvent.press(getByTestId('termsCheckbox'));
    
    fireEvent.press(getByTestId('signUpButton'));
    expect(Alert.alert).toHaveBeenCalledWith("Photos Required", expect.anything());
  });

  it('shows error if terms not accepted', () => {
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId); 
    fireEvent.press(getByTestId('termsCheckbox'));
    fireEvent.press(getByTestId('signUpButton'));
    expect(Alert.alert).toHaveBeenCalledWith("Terms Required", expect.anything());
  });

  it('navigates to Terms screen', () => {
    const { getByText } = renderWithContext(<SignUp />);
    fireEvent.press(getByText("Terms & Conditions"));
    expect(mockPush).toHaveBeenCalledWith("/terms");
  });

  it('navigates back to Sign In', () => {
    const { getByText } = renderWithContext(<SignUp />);
    fireEvent.press(getByText("Sign in"));
    expect(mockBack).toHaveBeenCalled();
  });

  it('handles unexpected errors during verification phase', async () => {
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId);
    Alert.alert.mockImplementationOnce(() => {
      throw new Error("Simulation Crash");
    });
    fireEvent.press(getByTestId('signUpButton'));
    act(() => { jest.advanceTimersByTime(2000); });
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error:", expect.any(Error));
    });
  });

  it('handles server registration failure (Specific Error)', async () => {
    authService.register.mockRejectedValue({
      response: { data: { detail: "Email already in use" } }
    });
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId);
    fireEvent.press(getByTestId('signUpButton'));
    act(() => { jest.advanceTimersByTime(2000); });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Identity Verified", expect.anything(), expect.anything());
    });
    const alertButtons = Alert.alert.mock.calls[0][2];
    const createAccountBtn = alertButtons.find(b => b.text === "Create Account");
    await act(async () => {
      await createAccountBtn.onPress();
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Email already in use");
    });
  });

  it('handles generic registration failure', async () => {
    authService.register.mockRejectedValue(new Error("Network Error"));
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId);
    fireEvent.press(getByTestId('signUpButton'));
    act(() => { jest.advanceTimersByTime(2000); });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Identity Verified", expect.anything(), expect.anything());
    }); 
    const alertButtons = Alert.alert.mock.calls[0][2];
    const createAccountBtn = alertButtons.find(b => b.text === "Create Account");
    await act(async () => {
      await createAccountBtn.onPress();
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Registration failed.");
    });
  });

  it('handles registration success but missing access_token (Uncovered Branch)', async () => {
    authService.register.mockResolvedValue({ success: true }); 
    const { getByTestId } = renderWithContext(<SignUp />);
    fillForm(getByTestId);
    fireEvent.press(getByTestId('signUpButton'));
    act(() => { jest.advanceTimersByTime(2000); });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Identity Verified", expect.anything(), expect.anything());
    }); 
    const alertButtons = Alert.alert.mock.calls[0][2];
    const createAccountBtn = alertButtons.find(b => b.text === "Create Account");  
    await act(async () => {
      await createAccountBtn.onPress();
    });
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
      expect(mockResolveIntent).not.toHaveBeenCalled();
    });
  });

  it('successfully registers, saves token, and resolves intent', async () => {
    const setAuthStatusSpy = jest.fn();
    const { getByTestId } = renderWithContext(<SignUp />, { setAuthStatus: setAuthStatusSpy });
    fillForm(getByTestId);
    fireEvent.press(getByTestId('signUpButton'));
    act(() => { jest.advanceTimersByTime(2000); });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Identity Verified", expect.anything(), expect.anything());
    });
    const alertButtons = Alert.alert.mock.calls[0][2];
    const createAccountBtn = alertButtons.find(b => b.text === "Create Account");
    await act(async () => {
      await createAccountBtn.onPress();
    });
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user_token', 'fake-jwt');
      expect(setAuthStatusSpy).toHaveBeenCalledWith(AuthStatus.AUTHENTICATED);
      expect(mockResolveIntent).toHaveBeenCalled();
    });
  });
});