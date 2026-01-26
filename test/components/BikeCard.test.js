import { fireEvent, render } from '@testing-library/react-native';
import BikeCard from '../../components/BikeCard';

// Mocks
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'Icon',
}));
// Mock VerifiedBadge to keep unit test isolated
jest.mock('../../components/VerifiedBadge', () => 'VerifiedBadge');

const MOCK_BIKE = {
  id: '1',
  title: 'Test Bike',
  price: 50,
  image: 'https://example.com/bike.png',
  type: 'Mountain',
  isVerified: true,
};

describe('BikeCard Component', () => {
  
  it('renders correctly in "highlight" mode', () => {
    const { getByText, getByTestId } = render(
      <BikeCard {...MOCK_BIKE} variant="highlight" testID="card" />
    );

    // Should show title and price
    expect(getByText('Test Bike')).toBeTruthy();
    expect(getByText('$50/week')).toBeTruthy();
    
    // Check for Cheapest badge which is specific to highlight mode in our design
    expect(getByText('Cheapest')).toBeTruthy();
  });

  it('renders correctly in "compact" mode', () => {
    const { getByText, queryByText } = render(
      <BikeCard {...MOCK_BIKE} variant="compact" testID="card" />
    );

    expect(getByText('Test Bike')).toBeTruthy();
    // Compact mode should NOT have the Cheapest badge
    expect(queryByText('Cheapest')).toBeNull();
  });

  it('renders the VerifiedBadge component if isVerified is true', () => {
    const { getByText, rerender, queryByText } = render(
      <BikeCard {...MOCK_BIKE} isVerified={true} />
    );
    expect(getByText('VerifiedBadge')).toBeTruthy();

    rerender(<BikeCard {...MOCK_BIKE} isVerified={false} />);
    expect(queryByText('VerifiedBadge')).toBeNull();
  });

  it('calls onPress when clicked', () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <BikeCard {...MOCK_BIKE} onPress={mockPress} testID="touchable-card" />
    );

    fireEvent.press(getByTestId('touchable-card'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});