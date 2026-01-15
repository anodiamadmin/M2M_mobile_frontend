import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

/* -------------------------------------------------- */
/* Mock expo-vector-icons                             */
/* -------------------------------------------------- */
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }) => <Text>{name}</Text>,
  };
});

/* -------------------------------------------------- */
/* Mock expo-router                                   */
/* -------------------------------------------------- */
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
    back: mockBack,
  }),
}));

/* -------------------------------------------------- */
/* Mock UI components                                 */
/* -------------------------------------------------- */
jest.mock('@components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

jest.mock('@components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('@components/TextField', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return ({ placeholder, value, onChangeText }) => (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
});

/* -------------------------------------------------- */
/* Import contexts & screen AFTER mocks               */
/* -------------------------------------------------- */
import SignUp from '../app/(auth)/signup';
import { AuthContext } from '../context/AuthContext';
import { EntryIntentContext } from '../context/EntryIntentContext';
import { TabIntentContext } from '../context/TabIntentContext';

/* -------------------------------------------------- */
/* Helper: render with providers                      */
/* -------------------------------------------------- */
const renderWithProviders = ({
  entryIntent = null,
  tabIntent = null,
} = {}) => {
  const setAuthStatus = jest.fn();
  const setEntryIntent = jest.fn();
  const setTabIntent = jest.fn();

  const utils = render(
    <AuthContext.Provider value={{ setAuthStatus }}>
      <EntryIntentContext.Provider value={{ entryIntent, setEntryIntent }}>
        <TabIntentContext.Provider value={{ tabIntent, setTabIntent }}>
          <SignUp />
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

/* -------------------------------------------------- */
/* Tests                                              */
/* -------------------------------------------------- */
describe('Sign Up Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required input fields and actions', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders();

    expect(getByPlaceholderText('Enter Full Name')).toBeTruthy();
    expect(getByPlaceholderText('DD/MM/YYYY')).toBeTruthy();
    expect(getByPlaceholderText('Enter Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter Password')).toBeTruthy();

    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
    expect(getByText('Terms & Conditions')).toBeTruthy();
  });

  it('sets authStatus to AUTHENTICATED on Continue press', () => {
    const { getByText, setAuthStatus } = renderWithProviders();

    fireEvent.press(getByText('Continue'));

    expect(setAuthStatus).toHaveBeenCalledWith('AUTHENTICATED');
  });

  it('falls back to Explore when no intents exist', () => {
    const { getByText } = renderWithProviders();

    fireEvent.press(getByText('Continue'));

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/explore');
  });

  it('navigates to Terms & Conditions screen', () => {
    const { getByText } = renderWithProviders();

    fireEvent.press(getByText('Terms & Conditions'));

    expect(mockPush).toHaveBeenCalledWith('terms&conditions');
  });

  it('navigates back on Sign in press', () => {
    const { getByText } = renderWithProviders();

    fireEvent.press(getByText('Sign in'));

    expect(mockBack).toHaveBeenCalled();
  });
});
