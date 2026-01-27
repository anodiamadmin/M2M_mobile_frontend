import { fireEvent, render } from '@testing-library/react-native';
import CardCarousel from '../../components/CardCarousel';

// Mock the child Card component to avoid testing nested logic again.
// We capture props to ensure they are passed down correctly.
jest.mock('../../components/Card', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, variant, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
      <Text testID="variant-label">{variant}</Text>
    </TouchableOpacity>
  );
});

const MOCK_DATA = [
  { id: '1', title: 'Item A', price: '$10' },
  { id: '2', title: 'Item B', price: '$20' },
];

describe('CardCarousel Component', () => {
  
  it('renders a list of cards', () => {
    const { getByText } = render(<CardCarousel data={MOCK_DATA} />);
    expect(getByText('Item A')).toBeTruthy();
    expect(getByText('Item B')).toBeTruthy();
  });

  it('renders an optional section title', () => {
    const { getByText } = render(
      <CardCarousel data={MOCK_DATA} title="Featured Bikes" />
    );
    expect(getByText('Featured Bikes')).toBeTruthy();
  });

  it('handles empty data gracefully (renders nothing)', () => {
    const { toJSON } = render(<CardCarousel data={[]} />);
    expect(toJSON()).toBeNull();
  });

  it('passes "cardVariant" prop down to children cards', () => {
    const { getAllByTestId } = render(
      <CardCarousel data={MOCK_DATA} cardVariant="highlight" />
    );
    
    // Check that the mock Card received the variant prop
    const variants = getAllByTestId('variant-label');
    expect(variants[0].children[0]).toBe('highlight');
  });

  it('passes click events from child cards up to parent', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <CardCarousel data={MOCK_DATA} onItemPress={mockPress} />
    );

    fireEvent.press(getByText('Item A'));
    // Ensure the entire item object is passed back
    expect(mockPress).toHaveBeenCalledWith(MOCK_DATA[0]);
  });
});