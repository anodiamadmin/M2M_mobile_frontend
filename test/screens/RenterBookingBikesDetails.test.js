import { fireEvent, render } from '@testing-library/react-native';
import RenterBikeDetails from '../../app/(tabs)/my-rides/booking-bike-details';

// ---------- MOCKS ----------

jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);

jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// Navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => ({
    start: '2026-02-01',
    end: '2026-02-07',
    loc: 'Sydney CBD',
  }),
}));

// Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, variant, testID }) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      accessibilityLabel={variant}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// Card
jest.mock('../../components/Card', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ title, variant, price, isVerified, testID, onPress }) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      accessibilityLabel={variant}
    >
      <View>
        <Text>{title}</Text>
        <Text>${price}/week</Text>
        {isVerified && <Text testID="verified-badge">Verified</Text>}
        <Text>Variant: {variant}</Text>
      </View>
    </TouchableOpacity>
  );
});

// FlatList
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

// ---------- TEST SUITE ----------

describe('RenterBikeDetails Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- RENDERING ----------

  it('1. Renders header and location context', () => {
    const { getByText } = render(<RenterBikeDetails />);
    expect(getByText('Top Pick for You')).toBeTruthy();
    expect(getByText('Sydney CBD')).toBeTruthy();
  });

  it('2. Renders highlight bike card with correct variant', () => {
    const { getByText, getByTestId } = render(<RenterBikeDetails />);
    expect(getByTestId('highlight-bike-card')).toBeTruthy();
    expect(getByText('Variant: highlightBikeCard')).toBeTruthy();
  });

  it('3. Shows "Cheapest" label when bike is cheapest', () => {
    const { getByText } = render(<RenterBikeDetails />);
    expect(getByText('Cheapest')).toBeTruthy();
  });

  it('4. Renders Book button with primary variant', () => {
    const { getByTestId } = render(<RenterBikeDetails />);
    const btn = getByTestId('book-now-button');
    expect(btn).toBeTruthy();
    expect(btn.props.accessibilityLabel).toBe('primary');
  });

  it('5. Renders Similar Bikes list', () => {
    const { getByText, getByTestId } = render(<RenterBikeDetails />);
    expect(getByText('Similar E-Bikes')).toBeTruthy();
    expect(getByTestId('similar-bikes-list')).toBeTruthy();
  });

  // ---------- NAVIGATION ----------

  it('6. Navigates to confirmation screen on Book button press', () => {
    const { getByTestId } = render(<RenterBikeDetails />);
    fireEvent.press(getByTestId('book-now-button'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/my-rides/booking-confirmation',
      params: {
        start: '2026-02-01',
        end: '2026-02-07',
        loc: 'Sydney CBD',
      },
    });
  });

  it('7. Navigates to confirmation screen when similar bike is pressed', () => {
    const { getAllByTestId } = render(<RenterBikeDetails />);

    const cards = getAllByTestId('similar-bike-card');
    fireEvent.press(cards[0]);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/my-rides/booking-confirmation',
      params: { id: '2' },
    });
  });
});
