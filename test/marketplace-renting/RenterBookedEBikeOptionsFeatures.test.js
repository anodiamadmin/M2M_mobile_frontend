import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RenterBookedEBikeOptions from '../../src/screens/RenterBookedEBikeOptions';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterBookedE-BikeOptions (Sprint 3.10)', () => {
  const renderScreen = () =>
    render(<RenterBookedEBikeOptions />);

  it('renders checkbox component', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('features-checkbox')).toBeTruthy();
  });

  it('renders e-bike features hyperlink', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('ebike-features-link')).toBeTruthy();
  });

  it('renders Accept E-Bike button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('accept-ebike-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });

  it('opens features checklist bottom sheet on Accept E-Bike press', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('accept-ebike-button'));
    expect(getByTestId('features-bottom-sheet')).toBeTruthy();
  });
});
