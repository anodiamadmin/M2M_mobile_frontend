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
  Ionicons: () => 'Icon',
}));

describe('LocationSelector Component', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders placeholder text when no value is selected', () => {
    const { getByText } = render(<LocationSelector />);
    expect(getByText('Select Pickup Location')).toBeTruthy();
  });

  it('renders the selected value when provided', () => {
    const { getByText } = render(<LocationSelector value="Sydney CBD" />);
    expect(getByText('Sydney CBD')).toBeTruthy();
  });

  it('requests permission and fetches location when clicked', async () => {
    // 1. Setup Success Mocks
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: -33.86, longitude: 151.20 }
    });
    Location.reverseGeocodeAsync.mockResolvedValue([{ city: 'Sydney', name: 'CBD' }]);

    const mockOnSelect = jest.fn();
    const { getByTestId } = render(
      <LocationSelector onLocationSelected={mockOnSelect} testID="loc-selector" />
    );

    // 2. Trigger Press
    fireEvent.press(getByTestId('loc-selector'));

    // 3. Verify Logic
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      // Expect it to format the address and call parent
      expect(mockOnSelect).toHaveBeenCalledWith(expect.stringContaining('Sydney'));
    });
  });

  it('handles permission denial gracefully', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });
    const mockOnSelect = jest.fn();

    const { getByTestId } = render(
        <LocationSelector onLocationSelected={mockOnSelect} testID="loc-selector" />
    );

    fireEvent.press(getByTestId('loc-selector'));

    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
      // Should likely alert user, but for component test, ensuring it didn't fetch is key
    });
  });
});