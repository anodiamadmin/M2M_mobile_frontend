import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RenterEBikeCurrentBooking from '../../src/screens/RenterEBikeCurrentBooking';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterE-BikeCurrentBooking (Sprint 3.12)', () => {
  const renderScreen = () =>
    render(<RenterEBikeCurrentBooking />);

  it('renders Return E-Bike button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('return-ebike-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });

  it('renders premature return modal on Return E-Bike press', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('return-ebike-button'));
    expect(getByTestId('premature-return-modal')).toBeTruthy();
  });

  it('renders Keep Riding and Return Anyway buttons with correct styling', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('return-ebike-button'));

    expect(getByTestId('keep-riding-button').props.style.backgroundColor)
      .toBe(Colors.primary);

    expect(getByTestId('return-anyway-button').props.style.color)
      .toBe(Colors.white);
  });
});
