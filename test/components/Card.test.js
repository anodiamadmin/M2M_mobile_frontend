import { fireEvent, render } from '@testing-library/react-native';
import Card from '../../components/Card';

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

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

// ---------------- TEST DATA ----------------

const BASE_PROPS = {
  title: 'Tesla E-Bike',
  subtitle: 'Electric · Long Range',
  price: 50,
  image: { uri: 'https://example.com/bike.jpg' },
};

// ---------------- TEST SUITE ----------------

describe('Card Component', () => {
  // ---------- CORE RENDERING ----------

  it('1. Renders title, subtitle, and price', () => {
    const { getByText } = render(<Card {...BASE_PROPS} />);

    expect(getByText('Tesla E-Bike')).toBeTruthy();
    expect(getByText('Electric · Long Range')).toBeTruthy();

    // ✅ React Native–safe assertion for nested Text
    expect(getByText(/50/)).toBeTruthy();
    expect(getByText(/\/week/)).toBeTruthy();
  });

  it('2. Renders gracefully without image', () => {
    const { getByTestId } = render(
      <Card {...BASE_PROPS} image={null} testID="card" />
    );

    expect(getByTestId('card')).toBeTruthy();
  });

  // ---------- BADGE LOGIC ----------

  it('3. Renders badge when badgeText is provided', () => {
    const { getByText } = render(
      <Card {...BASE_PROPS} badgeText="Active" />
    );

    expect(getByText('Active')).toBeTruthy();
  });

  it('4. Does not render badge when badgeText is missing', () => {
    const { queryByText } = render(<Card {...BASE_PROPS} />);
    expect(queryByText(/active/i)).toBeNull();
  });

  // ---------- OPTIONAL DATA ----------

  it('5. Renders rating when provided', () => {
    const { getByText } = render(
      <Card {...BASE_PROPS} rating="4.8" />
    );

    expect(getByText('4.8')).toBeTruthy();
  });

  it('6. Renders store name when provided', () => {
    const { getByText } = render(
      <Card {...BASE_PROPS} storeName="E-Bike Hub" />
    );

    expect(getByText('E-Bike Hub')).toBeTruthy();
  });

  // ---------- VARIANTS ----------

  it('7. Renders highlight variant layout', () => {
    const { getByTestId } = render(
      <Card
        {...BASE_PROPS}
        variant="highlight"
        testID="highlight-card"
      />
    );

    expect(getByTestId('highlight-card')).toBeTruthy();
  });

  // ---------- INTERACTION ----------

  it('8. Calls onBookPress when button is pressed', () => {
    const onBookPress = jest.fn();

    const { getByText } = render(
      <Card
        {...BASE_PROPS}
        onBookPress={onBookPress}
        buttonTitle="Book Ride"
      />
    );

    fireEvent.press(getByText('Book Ride'));
    expect(onBookPress).toHaveBeenCalledTimes(1);
  });
});
