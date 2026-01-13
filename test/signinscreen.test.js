import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignInScreen from '../SignInScreen';

const mockSignIn = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Sign In Screen', () => {
  it('renders email, password and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('calls signIn on button press', () => {
    const { getByText } = render(<SignInScreen />);

    fireEvent.press(getByText('Sign In'));
    expect(mockSignIn).toHaveBeenCalled();
  });
});
