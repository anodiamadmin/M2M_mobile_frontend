import { fireEvent, render } from '@testing-library/react-native';
import PriceRangeSlider from '../../components/PriceRangeSlider';

describe('PriceRangeSlider Component', () => {
  const mockOnChange = jest.fn();

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<PriceRangeSlider testID="slider" />);
    expect(getByTestId('slider')).toBeTruthy();
  });

  it('displays the correct min and max labels', () => {
    // Assuming the component takes min/max props to display labels
    render(
      <PriceRangeSlider min={10} max={500}/>
    );
    expect(getByTestId('min-price')).toHaveTextContent('10');
    expect(getByTestId('max-price')).toHaveTextContent('500');

  });

  it('calls onValueChange when interaction occurs', () => {
    // Note: Testing actual dragging is difficult in RNTL.
    // We usually test that the underlying component receives the prop or 
    // we simulate a specific event if we build it from scratch.
    // Here, we check if the component exposes the interaction handler.
    const { getByTestId } = render(
        <PriceRangeSlider onValueChange={mockOnChange} testID="slider" />
    );
    
    // Simulate a change event (implementation dependent, assuming standard event)
    fireEvent(getByTestId('slider'), 'valueChange', [20, 80]);
    expect(mockOnChange).toHaveBeenCalledWith([20, 80]);
  });
});