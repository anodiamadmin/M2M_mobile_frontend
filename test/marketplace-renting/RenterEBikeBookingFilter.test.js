import React from 'react';
import { render } from '@testing-library/react-native';
import RenterEBikeBookingFilter from '../../src/screens/RenterEBikeBookingFilter';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterE-BikeBookingFilter', () => {
  const mockUsername = 'John';

  const renderScreen = () =>
    render(<RenterEBikeBookingFilter username={mockUsername} />);

  it('renders Welcome username heading', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('welcome-heading')).toHaveTextContent(
      `Welcome ${mockUsername}`
    );
  });

  it('renders "Book an E-Bike" subheading', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('book-ebike-subheading')).toBeTruthy();
  });

  it('renders From and To date pickers', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('from-date-picker')).toBeTruthy();
    expect(getByTestId('to-date-picker')).toBeTruthy();
  });

  it('renders Price Range label and slider', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('price-range-label')).toBeTruthy();
    expect(getByTestId('price-range-slider')).toBeTruthy();
  });

  it('renders Category label and dropdown', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('category-label')).toBeTruthy();
    expect(getByTestId('category-dropdown')).toBeTruthy();
  });

  it('renders Pickup Location label and picker', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('pickup-location-label')).toBeTruthy();
    expect(getByTestId('location-picker')).toBeTruthy();
  });

  it('renders Continue button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('continue-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });

  it('renders Visit My Bookings button with secondary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('visit-bookings-button');

    expect(button).toBeTruthy();
    expect(button.props.style.color).toBe(Colors.white);
  });
});
