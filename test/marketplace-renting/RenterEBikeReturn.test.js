import React from 'react';
import { render } from '@testing-library/react-native';
import RenterEBikeReturn from '../../src/screens/RenterEBikeReturn';

describe('Marketplace Renting – RenterE-BikeReturn (Sprint 3.13)', () => {
  const renderScreen = () =>
    render(<RenterEBikeReturn />);

  it('renders Return E-Bike heading', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('return-ebike-heading')).toBeTruthy();
  });

  it('renders camera picker component', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('camera-picker')).toBeTruthy();
  });

  it('renders Rate Your Experience section', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('rating-section')).toBeTruthy();
  });

  it('renders comment input with 500 character limit', () => {
    const { getByTestId } = renderScreen();
    const input = getByTestId('comment-input');

    expect(input).toBeTruthy();
    expect(input.props.maxLength).toBe(500);
  });
});
