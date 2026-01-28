import { fireEvent, render } from '@testing-library/react-native';
import PriceRangeSlider from '../../components/PriceRangeSlider';

describe('PriceRangeSlider Component', () => {
  const mockOnChange = jest.fn();

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <PriceRangeSlider testID="slider" />
    );

    expect(getByTestId('slider')).toBeTruthy();
  });

  it('displays the correct min and max labels', () => {
    const { getByTestId } = render(
      <PriceRangeSlider min={10} max={500} />
    );

    expect(getByTestId('min-price')).toHaveTextContent(/10/);
    expect(getByTestId('max-price')).toHaveTextContent(/500/);
  });

  it('calls onValueChange when interaction occurs', () => {
    const { getByTestId } = render(
      <PriceRangeSlider
        testID="slider"
        onValueChange={mockOnChange}
      />
    );

    fireEvent(getByTestId('slider'), 'valueChange', [20, 80]);

    expect(mockOnChange).toHaveBeenCalledWith([20, 80]);
  });
});
