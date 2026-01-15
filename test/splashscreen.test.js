import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import SplashScreen from '../app/splash';
import { Image } from 'react-native';

jest.useFakeTimers();

/**
 * Mock expo-router safely
 */
jest.mock('expo-router', () => {
  const replace = jest.fn();
  return {
    useRouter: () => ({ replace }),
    __mockReplace: replace,
  };
});

/**
 * ✅ FIXED Label mock
 */
jest.mock('@components/Label', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return ({ children }) => <Text>{children}</Text>;
});

describe('Splash Screen', () => {
  let replaceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    replaceMock = require('expo-router').__mockReplace;
  });

  it('renders splash screen immediately on app launch', () => {
    const { getByText } = render(<SplashScreen />);
    expect(getByText('Making Sydney E-bike Friendly')).toBeTruthy();
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
