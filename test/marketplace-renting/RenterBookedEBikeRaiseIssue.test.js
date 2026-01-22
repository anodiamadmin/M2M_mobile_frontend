import React from 'react';
import { render } from '@testing-library/react-native';
import RenterBookedEBikeRaiseIssue from '../../src/screens/RenterBookedEBikeRaiseIssue';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterBookedE-Bike Raise Issue (Sprint 3.10)', () => {
  const renderScreen = () =>
    render(<RenterBookedEBikeRaiseIssue />);

  it("renders 'Raise Issue' heading", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('raise-issue-heading')).toBeTruthy();
  });

  it('renders camera picker component', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('camera-picker')).toBeTruthy();
  });

  it('renders description input with 500 character limit', () => {
    const { getByTestId } = renderScreen();
    const input = getByTestId('issue-description-input');

    expect(input).toBeTruthy();
    expect(input.props.maxLength).toBe(500);
  });

  it('renders Raise Issue + Cancel Booking button with secondary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('raise-cancel-button');

    expect(button).toBeTruthy();
    expect(button.props.style.color).toBe(Colors.white);
  });

  it('renders Ignore Issue, Go Back button with primary styling', () => {
    const { getByTestId } = renderScreen();
    const button = getByTestId('ignore-go-back-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
