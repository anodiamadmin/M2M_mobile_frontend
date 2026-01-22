import React from 'react';
import { render } from '@testing-library/react-native';
import RenterEBikeBookingBikeDetails from '../../src/screens/RenterEBikeBookingBikeDetails';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterE-BikeBookingBikeDetails', () => {
  const renderScreen = () =>
    render(<RenterEBikeBookingBikeDetails />);

  it('renders highlighted bike card', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('highlight-bike-card')).toBeTruthy();
  });

  it('renders bike metadata (price, type, pickup location, date range)', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('bike-price')).toBeTruthy();
    expect(getByTestId('bike-type')).toBeTruthy();
    expect(getByTestId('bike-pickup-location')).toBeTruthy();
    expect(getByTestId('bike-date-range')).toBeTruthy();
  });

  it('renders Book This E-Bike button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('book-ebike-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });

  it('renders Similar E-Bikes section and list', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('similar-bikes-heading')).toBeTruthy();
    expect(getByTestId('similar-bikes-list')).toBeTruthy();
  });
});
