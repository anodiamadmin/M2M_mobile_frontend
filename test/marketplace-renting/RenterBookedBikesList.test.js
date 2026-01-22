import React from 'react';
import { render } from '@testing-library/react-native';
import RenterBookedBikesList from '../../src/screens/RenterBookedBikesList';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterBookedBikesList (Sprint 3.6)', () => {
  const mockUsername = 'Alex';

  const renderScreen = () =>
    render(<RenterBookedBikesList username={mockUsername} />);

  it('renders Welcome username heading', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('welcome-heading')).toHaveTextContent(
      `Welcome ${mockUsername}`
    );
  });

  it('renders "Your Bookings" subheading', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('your-bookings-subheading')).toBeTruthy();
  });

  it('renders From and To date pickers', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('from-date-picker')).toBeTruthy();
    expect(getByTestId('to-date-picker')).toBeTruthy();
  });

  it('renders bookings list cards component', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('bookings-list')).toBeTruthy();
  });

  it('renders Book an E-Bike button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('book-ebike-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
