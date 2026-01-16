import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Image } from 'react-native';

/**
 * 🔹 Mock expo-secure-store (prevents ESM crash)
 */
jest.mock('expo-secure-store');

/**
 * 🔹 Mock expo-router
 */
jest.mock('expo-router', () => {
  const replace = jest.fn();
  return {
    useRouter: () => ({ replace }),
    __mockReplace: replace,
  };
});

/**
 * 🔹 Mock Label component
 */
jest.mock('@components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return ({ children }) => <Text>{children}</Text>;
});

/**
 * 🔹 Mock AuthContext completely
 * (Prevents SecureStore + side effects)
 */
jest.mock('../context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({
      authStatus: 'UNAUTHENTICATED',
    }),
  };
});

import SplashScreen from '../app/splash';

jest.useFakeTimers();

describe('Splash Screen', () => {
  let replaceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    replaceMock = require('expo-router').__mockReplace;
  });

  it('renders splash screen immediately on app launch', () => {
    const { getByText } = render(<SplashScreen />);

    expect(
      getByText('Making Sydney E-bike Friendly')
    ).toBeTruthy();
  });

  it('displays logo, tagline and brand values', () => {
    const { getByText } = render(<SplashScreen />);

    expect(getByText('Making Sydney E-bike Friendly')).toBeTruthy();
    expect(getByText('Affordable')).toBeTruthy();
    expect(getByText('Reliable')).toBeTruthy();
    expect(getByText('Safe')).toBeTruthy();
  });

  it('does not navigate before 3 seconds', () => {
    render(<SplashScreen />);

    act(() => {
      jest.advanceTimersByTime(2900);
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('navigates to Landing screen after 3 seconds once image loads', () => {
    const { UNSAFE_getByType } = render(<SplashScreen />);
    const image = UNSAFE_getByType(Image);

    act(() => {
      fireEvent(image, 'load');
      jest.advanceTimersByTime(3000);
    });

    expect(replaceMock).toHaveBeenCalledWith('/landing');
  });
});
