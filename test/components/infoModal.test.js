import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import InfoModal from '../../components/InfoModal';

// --- MOCKS ---
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

describe('InfoModal Component', () => {
  
  it('renders the title prop correctly', () => {
    const { getByText } = render(
      <InfoModal title="Terms of Service">
        <Text>Content</Text>
      </InfoModal>
    );
    expect(getByText('Terms of Service')).toBeTruthy();
  });

  it('renders children content', () => {
    const { getByText } = render(
      <InfoModal title="Title">
        <Text>Specific Modal Details</Text>
      </InfoModal>
    );
    expect(getByText('Specific Modal Details')).toBeTruthy();
  });

  it('renders the OK button and handles close interaction', () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <InfoModal title="Title" onClose={mockOnClose}>
        <Text>Content</Text>
      </InfoModal>
    );

    const button = getByText('OK');
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});