import { fireEvent, render } from '@testing-library/react-native';
// ✅ Points to the future screen file
import RenterBikeDetails from '../../app/(tabs)/my-rides/booking-bike-details';

// --- MOCKS ---

jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// Mock Expo Router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({
    start: '2026-02-01',
    end: '2026-02-07',
    loc: 'Sydney CBD'
  }),
}));

// Mock Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, variant, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress} accessibilityLabel={variant}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// Mock BikeCard (Crucial for testing variants)
jest.mock('../../components/Card', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ title, variant, price, isVerified, testID, onPress }) => (
    <TouchableOpacity testID={testID} onPress={onPress} accessibilityLabel={variant}>
      <View>
        <Text>{title}</Text>
        <Text>${price}/week</Text>
        {isVerified && <Text testID="verified-badge">Verified</Text>}
        {/* Helper text for variant verification */}
        <Text>Variant: {variant}</Text> 
      </View>
    </TouchableOpacity>
  );
});

// Mock FlatList for Similar Bikes
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const { View } = require('react-native');
  return ({ testID, data, renderItem }) => (
    <View testID={testID}>
      {data.map((item, index) => (
        <View key={item.id || index}>
          {renderItem({ item, index })}
        </View>
      ))}
    </View>
  );
});


describe('RenterBookingBikesDetails Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- RENDERING TESTS ---

  it('1. Renders the page header with location context', () => {
    const { getByText } = render(<RenterBikeDetails />);
    expect(getByText(/Top Pick for You/i)).toBeTruthy();
    expect(getByText(/Sydney CBD/i)).toBeTruthy();
  });

  it('2. Renders the main Highlight Card with correct variant', () => {
    const { getByTestId, getByText } = render(<RenterBikeDetails />);
    
    // Check main card existence
    const mainCard = getByTestId('highlight-bike-card');
    
    // Verify variant prop was passed
    expect(getByText(/Variant: highlightBikeCard/i)).toBeTruthy();
  });

  it('3. Renders "Cheapest" label if applicable', () => {
    const { getByText } = render(<RenterBikeDetails />);
    expect(getByText(/Cheapest/i)).toBeTruthy();
  });

  it('4. Renders "Book This E-Bike" button with primary styling', () => {
    const { getByTestId } = render(<RenterBikeDetails />);
    const bookButton = getByTestId('book-now-button');
    
    expect(bookButton).toBeTruthy();
    expect(bookButton.props.accessibilityLabel).toBe('primary');
  });

  it('5. Renders "Similar E-Bikes" section and list', () => {
    const { getByText, getByTestId } = render(<RenterBikeDetails />);
    expect(getByText(/Similar E-Bikes/i)).toBeTruthy();
    expect(getByTestId('similar-bikes-list')).toBeTruthy();
  });

  // --- NAVIGATION TESTS ---

  it('6. Navigates to Confirmation screen when Book button is pressed', () => {
    const { getByTestId } = render(<RenterBikeDetails />);
    fireEvent.press(getByTestId('book-now-button'));
    
    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: expect.stringContaining('booking-confirmation')
    }));
  });

  it('7. Navigates to details when a Similar Bike is pressed', () => {
    const { getAllByTestId } = render(<RenterBikeDetails />);
    
    // Get all similar cards
    const cards = getAllByTestId('similar-bike-card');
    
    if (cards.length > 0) {
      fireEvent.press(cards[0]);
      // Expect it to push to the same route (bike-details)
      expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
        pathname: expect.stringContaining('bike-details')
      }));
    }
  });
});