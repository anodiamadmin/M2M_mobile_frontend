import React from 'react';
import { render } from '@testing-library/react-native';
import RenterEBikeBookingInsuranceDetails from '../../src/screens/RenterEBikeBookingInsuranceDetails';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterE-BikeBooking Insurance Details (3.4)', () => {
  const renderScreen = () =>
    render(<RenterEBikeBookingInsuranceDetails />);

  it('renders Insurance Details heading', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('insurance-details-heading')).toBeTruthy();
  });

  it('renders Read more hyperlink', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('insurance-read-more-link')).toBeTruthy();
  });

  it('renders OK button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('insurance-ok-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
