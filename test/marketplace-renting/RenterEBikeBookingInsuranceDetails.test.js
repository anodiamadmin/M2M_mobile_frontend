import React from 'react';
import { render } from '@testing-library/react-native';
import RenterEBikeOwnerDetails from '../../src/screens/RenterEBikeOwnerDetails';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterE-BikeBooking Selected Owner Details (3.3)', () => {
  const renderScreen = () =>
    render(<RenterEBikeOwnerDetails />);

  it('renders owner name heading', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('owner-name-heading')).toBeTruthy();
  });

  it('renders owner avatar', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('owner-avatar')).toBeTruthy();
  });

  it('renders owner bio with length less than 200 characters', () => {
    const { getByTestId } = renderScreen();
    const bio = getByTestId('owner-bio').props.children;

    expect(bio.length).toBeLessThan(200);
  });

  it('renders rating component', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('owner-rating')).toBeTruthy();
  });

  it('renders Community Activities hyperlink', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('community-activities-link')).toBeTruthy();
  });

  it('renders OK button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('ok-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
