import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LandingScreen from '../LandingScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Landing Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Landing screen', () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText('Micro2Move')).toBeTruthy();
  });

  it('shows Rent, List and Explore options', () => {
    const { getByText } = render(<LandingScreen />);

    expect(getByText('Rent a Bike')).toBeTruthy();
    expect(getByText('List a Bike')).toBeTruthy();
    expect(getByText('Explore')).toBeTruthy();
  });

  it('navigates when Rent a Bike is pressed', () => {
    const { getByText } = render(<LandingScreen />);

    fireEvent.press(getByText('Rent a Bike'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
