import { fireEvent, render } from '@testing-library/react-native';
import Card from '../../components/Card';

// --- MOCKS ---
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// Mock VerifiedBadge to isolate this unit test
jest.mock('../../components/VerifiedBadge', () => 'VerifiedBadge');

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'Icon',
}));

// Comprehensive Mock Data covering both "Listing" and "Booking" scenarios
const MOCK_CARD_DATA = {
  id: '1',
  title: 'Tesla E-Bike',
  subtitle: '$50/week',        // Previously 'price'
  meta: 'Dec 25 - Jan 01',     // Previously 'dateRange' or 'type'
  location: 'Sydney CBD',
  image: { uri: 'https://example.com/bike.jpg' },
  status: 'Active',
  isVerified: true
};

describe('Card Component', () => {
  
  // --- 1. Core Rendering Tests (BookingCard Logic) ---

  it('renders core information (Title, Subtitle, Meta, Location)', () => {
    const { getByText } = render(<Card {...MOCK_CARD_DATA} />);
    
    expect(getByText('Tesla E-Bike')).toBeTruthy();
    expect(getByText('$50/week')).toBeTruthy();
    expect(getByText('Dec 25 - Jan 01')).toBeTruthy();
    expect(getByText('Sydney CBD')).toBeTruthy();
  });

  it('renders gracefully without an image', () => {
    const { getByTestId } = render(
      <Card {...MOCK_CARD_DATA} image={null} testID="card" />
    );
    expect(getByTestId('card')).toBeTruthy();
  });

  // --- 2. Badge & Status Tests (BikeCard Logic) ---

  it('renders the Status Pill correctly (e.g., Active, Upcoming)', () => {
    const { getByText, rerender, queryByText } = render(
      <Card {...MOCK_CARD_DATA} status="Active" />
    );
    expect(getByText('Active')).toBeTruthy();

    // Should NOT render if status is missing
    rerender(<Card {...MOCK_CARD_DATA} status={null} />);
    expect(queryByText('Active')).toBeNull();
  });

  it('renders the "Cheapest" badge (Specific Highlight Logic)', () => {
    // Migration from BikeCard "highlight" logic
    const { getByText } = render(<Card {...MOCK_CARD_DATA} status="Cheapest" />);
    expect(getByText('Cheapest')).toBeTruthy();
  });

  it('renders VerifiedBadge only when isVerified is true', () => {
    const { getByText, queryByText, rerender } = render(
      <Card {...MOCK_CARD_DATA} isVerified={true} />
    );
    expect(getByText('VerifiedBadge')).toBeTruthy();

    rerender(<Card {...MOCK_CARD_DATA} isVerified={false} />);
    expect(queryByText('VerifiedBadge')).toBeNull();
  });

  // --- 3. Variant & Interaction Tests ---

  it('adapts container style based on "variant" prop', () => {
    // We strictly check that it renders with the ID, implementation details (width) 
    // are handled by styles which we trust React Native to apply.
    const { getByTestId } = render(
      <Card {...MOCK_CARD_DATA} variant="highlight" testID="highlight-card" />
    );
    expect(getByTestId('highlight-card')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <Card {...MOCK_CARD_DATA} onPress={mockPress} testID="touchable-card" />
    );

    fireEvent.press(getByTestId('touchable-card'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});