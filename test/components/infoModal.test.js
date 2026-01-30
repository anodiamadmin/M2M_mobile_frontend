import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import InfoModal from '../../components/InfoModal';

// ---------------- MOCKS ----------------

jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }) => <Text>{name}</Text>,
  };
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

  it('3. Calls onClose when close icon is pressed', () => {
    const mockOnClose = jest.fn();

    const { getByText } = render(
      <InfoModal title="Info" visible onClose={mockOnClose}>
        <Text>Content</Text>
      </InfoModal>
    );

    // "close" comes from Ionicons name
    fireEvent.press(getByText('close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('4. Does not render when visible=false', () => {
    const { queryByText } = render(
      <InfoModal title="Hidden" visible={false}>
        <Text>Hidden Content</Text>
      </InfoModal>
    );

    expect(queryByText('Hidden')).toBeNull();
  });
});
