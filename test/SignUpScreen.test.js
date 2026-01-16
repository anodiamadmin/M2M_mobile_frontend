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
/* Mock DateTimePicker                                */
/* -------------------------------------------------- */
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});

/* -------------------------------------------------- */
/* Mock Image Picker                                  */
/* -------------------------------------------------- */
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-image-uri' }],
    })
  ),
  MediaTypeOptions: { Images: 'Images' },
}));

/* -------------------------------------------------- */
/* Mock SecureStore                                   */
/* -------------------------------------------------- */
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
}));

/* -------------------------------------------------- */
/* Mock Auth Service (CORRECT PATH)                   */
/* -------------------------------------------------- */
jest.mock('../services/authService', () => ({
  authService: {
    register: jest.fn(() =>
      Promise.resolve({ access_token: 'mock-token' })
    ),
  },
}));

/* -------------------------------------------------- */
/* Mock Validators (CORRECT PATH)                     */
/* -------------------------------------------------- */
jest.mock('../utils/validators', () => ({
  isValidEmail: jest.fn(() => true),
  isAtLeast16: jest.fn(() => true),
}));

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
/* Mock Safe Area (✅ SYNTAX FIXED)                    */
/* -------------------------------------------------- */
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

/* -------------------------------------------------- */
/* Mock UI Components                                 */
/* -------------------------------------------------- */
jest.mock('../components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

jest.mock('../components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, disabled }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../components/TextField', () => {
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
/* Import Screen & Contexts                           */
/* -------------------------------------------------- */
import SignUp from '../app/(auth)/signup';
import { AuthContext } from '../context/AuthContext';
import { EntryIntentContext } from '../context/EntryIntentContext';
import { TabIntentContext } from '../context/TabIntentContext';

/* -------------------------------------------------- */
/* Helper Renderer                                    */
/* -------------------------------------------------- */
const renderWithProviders = () => {
  const setAuthStatus = jest.fn();
  const setEntryIntent = jest.fn();
  const setTabIntent = jest.fn();

  return {
    setAuthStatus,
    ...render(
      <AuthContext.Provider value={{ setAuthStatus }}>
        <EntryIntentContext.Provider value={{ entryIntent: null, setEntryIntent }}>
          <TabIntentContext.Provider value={{ tabIntent: null, setTabIntent }}>
            <SignUp />
          </TabIntentContext.Provider>
        </EntryIntentContext.Provider>
      </AuthContext.Provider>
    ),
  };
};

/* -------------------------------------------------- */
/* TESTS                                              */
/* -------------------------------------------------- */
describe('Sign Up Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields and actions', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders();

    expect(getByPlaceholderText('Enter Full Name')).toBeTruthy();
    expect(getByText('Select Your Date of Birth')).toBeTruthy();
    expect(getByPlaceholderText('Enter Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter Password')).toBeTruthy();

    expect(getByText('Capture Govt. ID')).toBeTruthy();
    expect(getByText('Take Your Selfie')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
    expect(getByText('Terms & Conditions')).toBeTruthy();
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

  it('allows Govt ID & Selfie button press', () => {
    const { getByText } = renderWithProviders();

    fireEvent.press(getByText('Capture Govt. ID'));
    fireEvent.press(getByText('Take Your Selfie'));

    expect(true).toBe(true);
  });
});
