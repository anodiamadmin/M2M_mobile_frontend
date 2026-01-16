import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

/* ======================================================
   MOCK: AuthContext (prevents SecureStore crash)
====================================================== */
jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({
      setAuthStatus: jest.fn(),
    }),
  };
});

/* ======================================================
   MOCK: EntryIntentContext
====================================================== */
jest.mock('../context/EntryIntentContext', () => {
  const React = require('react');
  return {
    EntryIntentContext: React.createContext({
      entryIntent: null,
      setEntryIntent: jest.fn(),
    }),
  };
});

/* ======================================================
   MOCK: TabIntentContext
====================================================== */
jest.mock('../context/TabIntentContext', () => {
  const React = require('react');
  return {
    TabIntentContext: React.createContext({
      tabIntent: null,
      setTabIntent: jest.fn(),
    }),
  };
});

/* ======================================================
   MOCK: expo-router (NO out-of-scope refs)
====================================================== */
jest.mock('expo-router', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();

  return {
    useRouter: () => ({
      replace: mockReplace,
      push: mockPush,
    }),
    __routerMocks: {
      mockReplace,
      mockPush,
    },
  };
});

/* ======================================================
   MOCK: SafeAreaInsets
====================================================== */
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

/* ======================================================
   MOCK: authService
====================================================== */
jest.mock('../services/authService', () => ({
  authService: {
    login: jest.fn(),
  },
}));

/* ======================================================
   MOCK: UI COMPONENTS
====================================================== */
jest.mock('../components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

jest.mock('../components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, testID, disabled }) => (
    <TouchableOpacity testID={testID} onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../components/TextField', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return ({ value, onChangeText, placeholder, testID }) => (
    <TextInput
      testID={testID}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  );
});

/* ======================================================
   IMPORT SCREEN LAST
====================================================== */
import SignIn from '../app/(auth)/signin';
import { authService } from '../services/authService';

/* ======================================================
   TESTS
====================================================== */
describe('Auth 1.3 – Sign In Screen', () => {
  let routerMocks;

  beforeEach(() => {
    jest.clearAllMocks();
    routerMocks = require('expo-router').__routerMocks;
    jest.spyOn(Alert, 'alert');
  });

  it('renders email, password, and actions', () => {
    const { getByTestId, getByText } = render(<SignIn />);

    expect(getByTestId('emailTextInput')).toBeTruthy();
    expect(getByTestId('passwordTextInput')).toBeTruthy();
    expect(getByTestId('SignInButton')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('shows alert when email or password is missing', async () => {
    const { getByTestId } = render(<SignIn />);

    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Missing Fields',
        'Please enter both email and password.'
      );
    });
  });

  it('logs in successfully and navigates to Explore', async () => {
    authService.login.mockResolvedValueOnce({});

    const { getByTestId } = render(<SignIn />);

    fireEvent.changeText(
      getByTestId('emailTextInput'),
      'test@email.com'
    );
    fireEvent.changeText(
      getByTestId('passwordTextInput'),
      'password123'
    );

    fireEvent.press(getByTestId('SignInButton'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        'test@email.com',
        'password123'
      );
      expect(routerMocks.mockReplace).toHaveBeenCalledWith(
        '/(tabs)/explore'
      );
    });
  });

  it('navigates to Sign Up screen on Sign Up press', () => {
    const { getByText } = render(<SignIn />);

    fireEvent.press(getByText('Sign Up'));

    expect(routerMocks.mockPush).toHaveBeenCalledWith(
      '/(auth)/signup'
    );
  });
});
