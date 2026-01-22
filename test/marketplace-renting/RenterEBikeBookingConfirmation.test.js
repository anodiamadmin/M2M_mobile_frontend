import React from 'react';
import { render } from '@testing-library/react-native';
import RenterEBikeBookingConfirmation from '../../src/screens/RenterEBikeBookingConfirmation';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterE-BikeBookingConfirmation (Sprint 3.2)', () => {
  const renderScreen = () =>
    render(<RenterEBikeBookingConfirmation />);

  it('renders highlighted bike card with highlightBikeCard variant', () => {
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

  it('renders Insurance Requirements section with Learn more link', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('insurance-requirements-label')).toBeTruthy();
    expect(getByTestId('insurance-learn-more-link')).toBeTruthy();
  });

  it('renders Insurance checkbox and hyperlink', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('insurance-checkbox')).toBeTruthy();
    expect(getByTestId('insurance-hyperlink')).toBeTruthy();
  });

  it('renders Book button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('book-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
