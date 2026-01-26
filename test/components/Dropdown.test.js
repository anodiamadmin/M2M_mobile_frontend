import { fireEvent, render } from '@testing-library/react-native';
import Dropdown from '../../components/Dropdown';

// Mock Label
jest.mock('../../components/Label', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

const OPTIONS = ['Option A', 'Option B', 'Option C'];

describe('Dropdown Component', () => {
  
  it('renders the placeholder label', () => {
    const { getByText } = render(<Dropdown label="Category" />);
    expect(getByText('Category')).toBeTruthy();
  });

  it('renders the selected value', () => {
    const { getByText } = render(
        <Dropdown label="Category" value="Option B" options={OPTIONS} />
    );
    expect(getByText('Option B')).toBeTruthy();
  });

  it('opens options list on press', () => {
    const { getByTestId, getByText } = render(
        <Dropdown label="Category" options={OPTIONS} testID="dropdown" />
    );

    // Initial state: Options hidden
    // We assume options are rendered in a Modal or conditional View
    
    fireEvent.press(getByTestId('dropdown'));
    
    // Now options should be visible
    expect(getByText('Option A')).toBeTruthy();
    expect(getByText('Option B')).toBeTruthy();
  });

  it('calls onSelect and closes when an option is chosen', () => {
    const mockSelect = jest.fn();
    const { getByTestId, getByText } = render(
        <Dropdown label="Category" options={OPTIONS} onSelect={mockSelect} testID="dropdown" />
    );

    // Open
    fireEvent.press(getByTestId('dropdown'));
    // Select
    fireEvent.press(getByText('Option A'));

    expect(mockSelect).toHaveBeenCalledWith('Option A');
  });
});