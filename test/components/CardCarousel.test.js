import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import CardCarousel from '../../components/CardCarousel';

// ---------------- MOCKS ----------------

// Mock Label
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});

// Mock Card
jest.mock('../../components/Card', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ title, variant, buttonTitle, onBookPress }) => (
    <View>
      <Text>{title}</Text>
      <Text testID="variant-label">{variant}</Text>
      <TouchableOpacity onPress={onBookPress}>
        <Text>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
});

// Mock FlatList (default export)
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockFlatList = ({ data, renderItem }) => (
    <View>
      {data.map((item, index) => (
        <View key={item.id ?? index}>
          {renderItem({ item, index })}
        </View>
      ))}
    </View>
  );

  return {
    __esModule: true,
    default: MockFlatList,
  };
});

// ---------------- TEST DATA ----------------

const MOCK_DATA = [
  { id: '1', title: 'Item A', price: 10 },
  { id: '2', title: 'Item B', price: 20 },
];

// ---------------- TEST SUITE ----------------

describe('CardCarousel Component', () => {
  it('1. Renders a list of cards', () => {
    const { getByText } = render(<CardCarousel data={MOCK_DATA} />);

    expect(getByText('Item A')).toBeTruthy();
    expect(getByText('Item B')).toBeTruthy();
  });

  it('2. Renders optional section title when provided', () => {
    const { getByText } = render(
      <CardCarousel data={MOCK_DATA} title="Featured Bikes" />
    );

    expect(getByText('Featured Bikes')).toBeTruthy();
  });

  it('3. Renders nothing when data is empty', () => {
    const { toJSON } = render(<CardCarousel data={[]} />);
    expect(toJSON()).toBeNull();
  });

  it('4. Always passes "standard" variant to Card', () => {
    const { getAllByTestId } = render(<CardCarousel data={MOCK_DATA} />);

    const variants = getAllByTestId('variant-label');
    expect(variants[0].children[0]).toBe('standard');
    expect(variants[1].children[0]).toBe('standard');
  });

  it('5. Passes actionLabel as button title to all cards', () => {
    const { getAllByText } = render(
      <CardCarousel data={MOCK_DATA} actionLabel="Reserve" />
    );

    const buttons = getAllByText('Reserve');
    expect(buttons.length).toBe(MOCK_DATA.length);
  });

  it('6. Calls onBookPress with correct item when card button is pressed', () => {
    const onBookPress = jest.fn();

    const { getAllByText } = render(
      <CardCarousel data={MOCK_DATA} onBookPress={onBookPress} />
    );

    fireEvent.press(getAllByText('Book Ride')[0]);

    expect(onBookPress).toHaveBeenCalledWith(MOCK_DATA[0]);
  });
});
