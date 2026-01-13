import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExploreScreen from '../ExploreScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Explore Screen', () => {
  it('renders Explore and tabs', () => {
    const { getByText } = render(<ExploreScreen />);

    expect(getByText('Explore')).toBeTruthy();
    expect(getByText('My Rides')).toBeTruthy();
    expect(getByText('My Bikes')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  it('pressing tabs triggers navigation', () => {
    const { getByText } = render(<ExploreScreen />);

    fireEvent.press(getByText('My Rides'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
