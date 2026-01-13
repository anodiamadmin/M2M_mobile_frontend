import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../SignUpScreen';

const mockSubmit = jest.fn();

jest.mock('../useSignUp', () => ({
  useSignUp: () => ({
    submitSignUp: mockSubmit,
  }),
}));

describe('KYC Validation', () => {
  it('blocks signup without T&C', () => {
    const { getByText } = render(<SignUpScreen />);

    fireEvent.press(getByText('Continue'));
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('blocks short password', () => {
    const { getByPlaceholderText, getByText } =
      render(<SignUpScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Create Password'),
      '123'
    );

    fireEvent.press(getByText('Continue'));
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
