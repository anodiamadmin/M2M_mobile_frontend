import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import ScrollHint from '../../components/ScrollHint';

// ---------------- MOCKS ----------------

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }) => {
    const { Text } = require('react-native');
    return <Text>{name}</Text>;
  },
}));

// Mock Animated to avoid native driver crashes
jest.spyOn(Animated, 'timing').mockImplementation(() => ({
  start: jest.fn(),
}));

jest.spyOn(Animated, 'loop').mockImplementation((animation) => ({
  start: jest.fn(),
  stop: jest.fn(),
}));

// ---------------- TEST SUITE ----------------

describe('ScrollHint Component', () => {
  it('1. Renders when visible is true', () => {
    const { getByText } = render(<ScrollHint visible={true} />);
    expect(getByText('chevron-down')).toBeTruthy();
  });

  it('2. Renders when visible is false (faded but mounted)', () => {
    const { getByText } = render(<ScrollHint visible={false} />);
    expect(getByText('chevron-down')).toBeTruthy();
  });

  it('3. Does not crash when visibility toggles', () => {
    const { rerender, getByText } = render(<ScrollHint visible={true} />);

    rerender(<ScrollHint visible={false} />);
    rerender(<ScrollHint visible={true} />);

    expect(getByText('chevron-down')).toBeTruthy();
  });

  it('4. Always renders the chevron icon', () => {
    const { getByText } = render(<ScrollHint visible={true} />);
    expect(getByText('chevron-down')).toBeTruthy();
  });
});
