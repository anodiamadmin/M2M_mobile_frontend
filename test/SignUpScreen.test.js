import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../SignUpScreen';

const mockContinue = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../useSignUp', () => ({
  useSignUp: () => ({
    continueSignUp: mockContinue,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Sign Up Screen', () => {
  it('renders all fields and actions', () => {
    const { getByText, getByPlaceholderText } = render(<SignUpScreen />);

    expect(getByPlaceholderText('Full Name')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('calls continue on Continue press', () => {
    const { getByText } = render(<SignUpScreen />);

    fireEvent.press(getByText('Continue'));
    expect(mockContinue).toHaveBeenCalled();
  });
});
