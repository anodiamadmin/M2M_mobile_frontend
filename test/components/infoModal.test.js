import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import InfoModal from '../../components/InfoModal';

// ---------------- MOCKS ----------------

jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// ---------------- TEST SUITE ----------------

describe('InfoModal Component', () => {

  it('1. Renders title when visible', () => {
    const { getByText } = render(
      <InfoModal title="Info" visible>
        <Text>Content</Text>
      </InfoModal>
    );

    expect(getByText('Info')).toBeTruthy();
  });

  it('2. Renders children content', () => {
    const { getByText } = render(
      <InfoModal title="Info" visible>
        <Text>Specific Modal Details</Text>
      </InfoModal>
    );

    expect(getByText('Specific Modal Details')).toBeTruthy();
  });

  it('3. Renders Close button and triggers onClose', () => {
    const mockOnClose = jest.fn();

    const { getByText } = render(
      <InfoModal title="Info" visible onClose={mockOnClose}>
        <Text>Content</Text>
      </InfoModal>
    );

    fireEvent.press(getByText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
