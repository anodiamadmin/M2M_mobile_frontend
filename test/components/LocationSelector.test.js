import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import LocationSelector from '../../components/LocationSelector';

// --- MOCKS ---

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('LocationSelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. renders placeholder text when no value is selected', () => {
    const { getByPlaceholderText } = render(
      <LocationSelector testID="loc-selector" />
    );

    expect(
      getByPlaceholderText('Enter or Select Location')
    ).toBeTruthy();
  });

  it('2. renders the selected value when provided', () => {
    const { getByDisplayValue } = render(
      <LocationSelector
        testID="loc-selector"
        value="Sydney CBD"
      />
    );

    expect(getByDisplayValue('Sydney CBD')).toBeTruthy();
  });

  it('3. requests permission and fetches location when GPS button is pressed', async () => {
    // Arrange
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'granted',
    });

    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: -33.86, longitude: 151.2 },
    });

    Location.reverseGeocodeAsync.mockResolvedValue([
      {
        name: 'CBD',
        street: 'George St',
        city: 'Sydney',
      },
    ]);

    const mockOnSelect = jest.fn();

    const { getByTestId } = render(
      <LocationSelector
        testID="loc-selector"
        onLocationSelected={mockOnSelect}
      />
    );

    // Act
    fireEvent.press(getByTestId('loc-selector-gps-button'));

    // Assert
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(Location.reverseGeocodeAsync).toHaveBeenCalled();

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.stringContaining('Sydney')
      );
    });
  });

  it('4. handles permission denial gracefully', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'denied',
    });

    const mockOnSelect = jest.fn();

    const { getByTestId } = render(
      <LocationSelector
        testID="loc-selector"
        onLocationSelected={mockOnSelect}
      />
    );

    fireEvent.press(getByTestId('loc-selector-gps-button'));

    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });
});