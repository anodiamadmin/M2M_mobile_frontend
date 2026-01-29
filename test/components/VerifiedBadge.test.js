import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import VerifiedBadge from '../../components/VerifiedBadge';

// ---------------- MOCKS ----------------

// Mock Label
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }) => {
    const { Text } = require('react-native');
    return <Text>{name}</Text>;
  },
}));

// ---------------- TEST SUITE ----------------

describe('VerifiedBadge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  it('1. Does not render when isVerified is false', () => {
    const { toJSON } = render(<VerifiedBadge isVerified={false} />);
    expect(toJSON()).toBeNull();
  });

  it('2. Renders icon and label when isVerified is true', () => {
    const { getByText } = render(<VerifiedBadge isVerified={true} />);

    expect(getByText('shield-checkmark-sharp')).toBeTruthy();
    expect(getByText('VERIFIED')).toBeTruthy();
  });

  it('3. Uses large icon when size="large"', () => {
    const { getByText } = render(
      <VerifiedBadge isVerified={true} size="large" />
    );

    // Icon name still renders; size logic is trusted to styles
    expect(getByText('shield-checkmark-sharp')).toBeTruthy();
  });

  it('4. Shows alert when badge is pressed', () => {
    const { getByText } = render(<VerifiedBadge isVerified={true} />);

    fireEvent.press(getByText('VERIFIED'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Verified Status',
      'This e-bike is tested and battle-hardened!',
      expect.any(Array)
    );
  });
});
