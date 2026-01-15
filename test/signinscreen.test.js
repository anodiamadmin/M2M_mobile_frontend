import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignIn from '../app/(auth)/signin';
import { AuthContext } from '../context/AuthContext';
import { EntryIntentContext } from '../context/EntryIntentContext';
import { TabIntentContext } from '../context/TabIntentContext';

/**
 * -----------------------------
 * Mock expo-router
 * -----------------------------
 */
jest.mock('expo-router', () => {
  const replace = jest.fn();
  const push = jest.fn();

  return {
    useRouter: () => ({
      replace,
      push,
    }),
    __mockRouter: { replace, push },
  };
});

/**
 * -----------------------------
 * Mock UI components
 * -----------------------------
 */
jest.mock('../components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

jest.mock('../components/Button', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return ({ title, onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID}>
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

/**
 * -----------------------------
 * Helper: render with contexts
 * -----------------------------
 */
const renderWithContexts = ({
  authStatus = 'UNAUTHENTICATED',
  entryIntent = null,
  tabIntent = null,
} = {}) => {
  const setAuthStatus = jest.fn();
  const setEntryIntent = jest.fn();
  const setTabIntent = jest.fn();

  const utils = render(
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      <EntryIntentContext.Provider value={{ entryIntent, setEntryIntent }}>
        <TabIntentContext.Provider value={{ tabIntent, setTabIntent }}>
          <SignIn />
        </TabIntentContext.Provider>
      </EntryIntentContext.Provider>
    </AuthContext.Provider>
  );

  return {
    ...utils,
    setAuthStatus,
    setEntryIntent,
    setTabIntent,
  };
};

describe('Sign In Screen', () => {
  let router;

  beforeEach(() => {
    jest.clearAllMocks();
    router = require('expo-router').__mockRouter;
  });

  it('renders email, password and buttons', () => {
    const { getByTestId, getByText } = renderWithContexts();

    expect(getByTestId('emailTextInput')).toBeTruthy();
    expect(getByTestId('passwordTextInput')).toBeTruthy();
    expect(getByTestId('SignInButton')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('sets authStatus to AUTHENTICATED on sign in', () => {
    const { getByTestId, setAuthStatus } = renderWithContexts();

    fireEvent.press(getByTestId('SignInButton'));

    expect(setAuthStatus).toHaveBeenCalledWith('AUTHENTICATED');
  });

  it('respects tabIntent priority (RIDES)', () => {
    const { getByTestId, setTabIntent } = renderWithContexts({
      tabIntent: 'RIDES',
    });

    fireEvent.press(getByTestId('SignInButton'));

    expect(router.replace).toHaveBeenCalledWith('/(tabs)/my-rides');
    expect(setTabIntent).toHaveBeenCalledWith(null);
  });

  it('respects entryIntent when no tabIntent (RENT)', () => {
    const { getByTestId, setEntryIntent } = renderWithContexts({
      entryIntent: 'RENT',
    });

    fireEvent.press(getByTestId('SignInButton'));

    expect(router.replace).toHaveBeenCalledWith('/(tabs)/my-rides/filter');
    expect(setEntryIntent).toHaveBeenCalledWith(null);
  });

  it('falls back to explore when no intents exist', () => {
    const { getByTestId } = renderWithContexts();

    fireEvent.press(getByTestId('SignInButton'));

    expect(router.replace).toHaveBeenCalledWith('/(tabs)/explore');
  });

  it('navigates to Sign Up screen on Sign Up press', () => {
    const { getByText } = renderWithContexts();

    fireEvent.press(getByText('Sign Up'));

    expect(router.push).toHaveBeenCalledWith('/(auth)/signup');
  });
});
