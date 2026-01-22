import React from 'react';
import { render } from '@testing-library/react-native';
import RenterBookedEBikeCancellationOption from '../../src/screens/RenterBookedEBikeCancellationOption';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterBookedE-BikeCancellationOption (Sprint 3.9)', () => {
  const renderScreen = () =>
    render(<RenterBookedEBikeCancellationOption />);

  it('renders highlighted bike card', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('highlight-bike-card')).toBeTruthy();
  });

  it('renders price, cancellation charge, and return amount sections', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('bike-price')).toBeTruthy();
    expect(getByTestId('cancellation-charge')).toBeTruthy();
    expect(getByTestId('return-amount')).toBeTruthy();
  });

  it('renders Cancellation Policy section with Read more link', () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId('cancellation-policy-section')).toBeTruthy();
    expect(getByTestId('cancellation-read-more-link')).toBeTruthy();
  });

  it('renders Confirm button with secondary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('confirm-cancel-button');

    expect(button).toBeTruthy();
    expect(button.props.style.color).toBe(Colors.white);
  });

  it('renders Do Not Cancel, Go Back button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('go-back-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
