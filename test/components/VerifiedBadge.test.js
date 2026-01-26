import { render } from '@testing-library/react-native';
import VerifiedBadge from '../../components/VerifiedBadge';

// Mock Ionicons to avoid rendering issues
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'Icon',
}));

describe('VerifiedBadge Component', () => {
  it('renders the icon by default', () => {
    const { getByText } = render(<VerifiedBadge />);
    expect(getByText('Icon')).toBeTruthy();
  });

  it('renders text when showText is true', () => {
    const { getByText } = render(<VerifiedBadge showText={true} />);
    expect(getByText('Verified')).toBeTruthy();
  });

  it('does not render text by default', () => {
    const { queryByText } = render(<VerifiedBadge />);
    expect(queryByText('Verified')).toBeNull();
  });
});