import React from 'react';
import { render } from '@testing-library/react-native';
import RenterBookedEBikeFeaturesToCheck from '../../src/components/RenterBookedEBikeFeaturesToCheck';
import { Colors } from '../../src/theme/Colors';

describe('Marketplace Renting – RenterBookedE-Bike Features To Check (Sprint 3.10)', () => {
  const renderComponent = () =>
    render(<RenterBookedEBikeFeaturesToCheck />);

  it("renders heading 'Your E-Bike's Features to Check'", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('features-check-heading')).toBeTruthy();
  });

  it('renders features checklist bottom sheet', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('features-checklist-sheet')).toBeTruthy();
  });

  it('renders Raise Issue button with primary styling', () => {
    const { getByTestId } = renderComponent();
    const button = getByTestId('raise-issue-button');

    expect(button).toBeTruthy();
    expect(button.props.style.backgroundColor).toBe(Colors.primary);
  });
});
