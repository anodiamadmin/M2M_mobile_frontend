import React from 'react';
import { render } from '@testing-library/react-native';
import RenterBookedEBikeOptions from '../../src/screens/RenterBookedEBikeOptions';

describe('Marketplace Renting – RenterBookedE-BikeOptions (Sprint 3.9)', () => {
  const renderScreen = () =>
    render(<RenterBookedEBikeOptions />);

  it('renders highlighted bike card', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('highlight-bike-card')).toBeTruthy();
  });

  it('renders bike details (price, type, pickup location, date range)', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('bike-price')).toBeTruthy();
    expect(getByTestId('bike-type')).toBeTruthy();
    expect(getByTestId('pickup-location')).toBeTruthy();
    expect(getByTestId('date-range')).toBeTruthy();
  });

  it("renders View Owner's Profile hyperlink", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('view-owner-profile-link')).toBeTruthy();
  });

  it('renders Insurance Details hyperlink', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('insurance-details-link')).toBeTruthy();
  });

  it('renders Cancel Booking hyperlink', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('cancel-booking-link')).toBeTruthy();
  });
});
