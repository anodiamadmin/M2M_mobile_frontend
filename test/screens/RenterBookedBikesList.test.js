import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
// Points to the Home Screen (index.jsx)
import RenterBookedBikesList from '../../app/(tabs)/my-rides/index';
// We need AuthContext to mock the "Welcome John" message
import { AuthContext } from '../../context/AuthContext';

// --- MOCKS ---

// 1. UI Wrappers
jest.mock('../../components/ScreenWrapper', () => ({ children }) => <>{children}</>);
jest.mock('../../components/BrandLogo', () => 'BrandLogo');
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// 2. Mock DatePicker
jest.mock('../../components/DatePicker', () => {
  const { View, Text } = require('react-native');
  return ({ label, testID }) => (
    <View testID={testID}>
      <Text>{label}</Text>
    </View>
  );
});

// 3. Mock CardCarousel (The unified list component)
// We mock it to ensure the screen passes the correct props to it
jest.mock('../../components/CardCarousel', () => {
  const { View, Text } = require('react-native');
  return ({ data, title, testID, onItemPress }) => (
    <View testID={testID}>
      <Text>{title}</Text>
      {/* Render simple text for items to verify data passing */}
      {data.map((item) => (
        <Text key={item.id} onPress={() => onItemPress(item)}>
          {item.title}
        </Text>
      ))}
    </View>
  );
});

// 4. Mock Button
jest.mock('../../components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, variant, testID }) => (
    <TouchableOpacity testID={testID} onPress={onPress} accessibilityLabel={variant}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

// 5. Navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('RenterBookedBikesList Screen', () => {
  
  // Helper to render with specific User Context
  const renderWithAuth = (user = { name: "John" }) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <RenterBookedBikesList />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- RENDERING TESTS ---

  it('1. Renders "Welcome [Name]" and "Your Bookings"', () => {
    const { getByText } = renderWithAuth({ name: "John" });
    expect(getByText(/Welcome John/i)).toBeTruthy();
    expect(getByText("Your Bookings")).toBeTruthy();
  });

  it('2. Renders "From" and "To" date pickers', () => {
    const { getByTestId, getByText } = renderWithAuth();
    expect(getByTestId('from-date-picker')).toBeTruthy();
    expect(getByText('From')).toBeTruthy();
    
    expect(getByTestId('to-date-picker')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
  });

  it('3. Renders the CardCarousel with correct booking data', () => {
    const { getByTestId, getByText } = renderWithAuth();
    
    // Verify the carousel container exists
    expect(getByTestId('bookings-carousel')).toBeTruthy();

    // Verify it rendered the bike titles (mocked in CardCarousel above)
    expect(getByText("Sam's E-Bike")).toBeTruthy();
    expect(getByText("Bruna A1 Cargo")).toBeTruthy();
  });

  it('4. Renders "Book a Bike" button', () => {
    const { getByTestId } = renderWithAuth();
    const btn = getByTestId('book-new-bike-button');
    expect(btn).toBeTruthy();
  });

  // --- INTERACTION TESTS ---

  it('5. Navigates to Filter Screen when "Book a Bike" is pressed', () => {
    const { getByTestId } = renderWithAuth();
    fireEvent.press(getByTestId('book-new-bike-button'));
    // Ensure it goes to the filter screen
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('booking-filter'));
  });

  it('6. Navigates to Booked Ride Details when a card is pressed', () => {
    const { getByText } = renderWithAuth();
    
    // Simulate pressing the item inside our mocked Carousel
    fireEvent.press(getByText("Sam's E-Bike"));
    
    // Should go to the details/status screen
    // Note: We check that it passes the specific ID (e.g., '1') in params
    expect(mockPush).toHaveBeenCalledWith({
      pathname: expect.stringContaining('booked-ride-details'),
      params: expect.objectContaining({ id: '1' })
    });
  });
});