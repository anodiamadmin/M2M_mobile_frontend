import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LandingScreen from '../LandingScreen';

const mockNavigate = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('../useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Post Landing Navigation', () => {
  it('authenticated user goes to Rent flow', () => {
    mockUseAuth.mockReturnValue({ authStatus: 'AUTHENTICATED' });

    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('Rent a Bike'));

    expect(mockNavigate).toHaveBeenCalledWith(
      'RenterE-BikeFilter',
      expect.any(Object)
    );
  });

  it('unauthenticated user goes to SignIn', () => {
    mockUseAuth.mockReturnValue({ authStatus: 'UNAUTHENTICATED' });

    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('List a Bike'));

    expect(mockNavigate).toHaveBeenCalledWith('SignIn');
  });
});
