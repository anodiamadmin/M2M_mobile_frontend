import { fireEvent, render } from '@testing-library/react-native';
import BikeCarousel from '../../components/BikeCarousel';

// Mock BikeCard so we don't test nested logic
jest.mock('../../components/BikeCard', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

const MOCK_DATA = [
  { id: '1', title: 'Bike A' },
  { id: '2', title: 'Bike B' },
];

describe('BikeCarousel Component', () => {
  it('renders a list of bikes', () => {
    const { getByText } = render(<BikeCarousel data={MOCK_DATA} />);
    expect(getByText('Bike A')).toBeTruthy();
    expect(getByText('Bike B')).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    const { toJSON } = render(<BikeCarousel data={[]} />);
    // Should render nothing (null)
    expect(toJSON()).toBeNull();
  });

  it('passes click events from child cards', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <BikeCarousel data={MOCK_DATA} onItemPress={mockPress} />
    );

    fireEvent.press(getByText('Bike A'));
    expect(mockPress).toHaveBeenCalledWith(MOCK_DATA[0]);
  });
});