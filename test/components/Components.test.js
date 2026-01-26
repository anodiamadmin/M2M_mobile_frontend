import { render } from '@testing-library/react-native';
import { Keyboard, Platform, Text } from 'react-native';
import BrandLogo from '../../components/BrandLogo';
import EmailInput from '../../components/EmailInput';
import Label from '../../components/Label';
import PasswordInput from '../../components/PasswordInput';
import ScreenWrapper from '../../components/ScreenWrapper';
import TextField from '../../components/TextField';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 10, left: 0, right: 0 }),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('../../theme/fonts', () => ({
  Fonts: {
    primary: 'Primary-Regular',
    primaryBold: 'Primary-Bold',
    secondary: 'Secondary-Regular',
    secondaryBold: 'Secondary-Bold',
  },
}));

jest.spyOn(Keyboard, 'dismiss');

describe('Shared Components', () => {

  describe('Label', () => {
    it('renders with default styles (Primary Regular, Size 14) when no props provided', () => {
      const { getByText } = render(<Label>Default Text</Label>);
      const label = getByText('Default Text');
      
      const styles = label.props.style[0]; 
      expect(styles.fontSize).toBe(14);
      expect(styles.fontFamily).toBe(Fonts.primary);
      expect(styles.color).toBe(Colors.black);
    });

    it('renders heading variant (Primary Bold, Size 24)', () => {
      const { getByText } = render(<Label variant="heading">Heading</Label>);
      const label = getByText('Heading');
      const styles = label.props.style[0];
      expect(styles.fontSize).toBe(24);
      expect(styles.fontFamily).toBe(Fonts.primaryBold); 
      expect(styles.marginBottom).toBe(20);
    });

    it('renders body variant (Secondary Regular, Size 16)', () => {
      const { getByText } = render(<Label variant="body">Body Text</Label>);
      const label = getByText('Body Text'); 
      const styles = label.props.style[0];
      expect(styles.fontSize).toBe(16);
      expect(styles.fontFamily).toBe(Fonts.secondary); 
    });

    it('allows props to override variant styles', () => {
      const { getByText } = render(
        <Label variant="body" size={30} bold={true}>
          Override
        </Label>
      );
      const label = getByText('Override');
      const styles = label.props.style[0];
      expect(styles.fontSize).toBe(30); 
      expect(styles.fontFamily).toBe(Fonts.secondaryBold); 
    });

    it('renders Primary Bold when secondary is false and bold is true', () => {
      const { getByText } = render(
        <Label secondary={false} bold={true}>
          Primary Bold
        </Label>
      );
      const label = getByText('Primary Bold');
      expect(label.props.style[0].fontFamily).toBe(Fonts.primaryBold);
    });
  });

  describe('TextField', () => {
    it('displays error message and applies red border when error prop is set', () => {
      const { getByText, getByTestId } = render(
        <TextField 
          testID="error-input"
          label="Email" 
          value="bad-input" 
          error="Invalid Email Address" 
        />
      );
      expect(getByText('Invalid Email Address')).toBeTruthy();
      const input = getByTestId('error-input');
      const flatStyle = input.props.style.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      expect(flatStyle.borderColor).toBe(Colors.red);
      expect(flatStyle.borderWidth).toBe(1);
    });

    it('passes custom inputStyle and extra props correctly', () => {
      const { getByTestId } = render(
        <TextField 
          testID="custom-input"
          inputStyle={{ backgroundColor: 'yellow' }} 
          maxLength={10} 
        />
      );
      const input = getByTestId('custom-input');
      const flatStyle = input.props.style.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      expect(flatStyle.backgroundColor).toBe('yellow');
      expect(input.props.maxLength).toBe(10);
    });
  });

  describe('BrandLogo', () => {
    it('renders with PRIMARY color when variant is default (dark)', () => {
      const { getByText } = render(<BrandLogo />);
      const textLabel = getByText('micro2move');
      expect(textLabel.props.style[0].color).toBe(Colors.primary);
    });

    it('renders with WHITE color when variant is light', () => {
      const { getByText } = render(<BrandLogo variant="light" />);
      const textLabel = getByText('micro2move');
      expect(textLabel.props.style[0].color).toBe(Colors.white);
    });

    it('does not render text when showText is false', () => {
      const { queryByText } = render(<BrandLogo showText={false} />);
      expect(queryByText('micro2move')).toBeNull();
    });
  });

  describe('PasswordInput', () => {
    it('renders with secure text entry enabled by default', () => {
      const { getByPlaceholderText } = render(
        <PasswordInput 
          placeholder="Enter Password" 
          value="123" 
          onChangeText={() => {}} 
        />
      );
      const input = getByPlaceholderText('Enter Password');
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  describe('EmailInput', () => {
    it('renders with correct keyboard type and auto-capitalization', () => {
      const { getByPlaceholderText } = render(
        <EmailInput 
          value="test" 
          onChangeText={() => {}} 
          placeholder="Enter Email"
        />
      );
      const input = getByPlaceholderText('Enter Email');
      expect(input.props.keyboardType).toBe('email-address');
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('passes extra props (like styles or testID) to the underlying input', () => {
      const { getByTestId } = render(
        <EmailInput 
          testID="email-input"
          value="" 
          onChangeText={() => {}} 
        />
      );
      const input = getByTestId('email-input');
      expect(input).toBeTruthy();
    });
  });

  describe('ScreenWrapper', () => {
    it('renders standard view when mode is default', () => {
      const { getByText } = render(
        <ScreenWrapper mode="default">
          <Text>Content</Text>
        </ScreenWrapper>
      );
      expect(getByText('Content')).toBeTruthy();
    });

    it('uses default mode when mode prop is missing', () => {
      const { getByText } = render(
        <ScreenWrapper>
          <Text>Implicit Default</Text>
        </ScreenWrapper>
      );
      expect(getByText('Implicit Default')).toBeTruthy();
    });

    it('renders ScrollView when mode IS scroll', () => {
      const { getByText } = render(
        <ScreenWrapper mode="scroll">
          <Text>Scroll Content</Text>
        </ScreenWrapper>
      );
      expect(getByText('Scroll Content')).toBeTruthy();
    });

    it('renders Keyboard dismiss wrapper when mode is form', () => {
      const { getByText } = render(
        <ScreenWrapper mode="form">
          <Text>Form Content</Text>
        </ScreenWrapper>
      );
      expect(getByText('Form Content')).toBeTruthy();
    });

    it('uses iOS behavior for KeyboardAvoidingView on iOS', () => {
      Platform.OS = 'ios';
      const { toJSON } = render(
        <ScreenWrapper mode="form">
          <Text>iOS Form</Text>
        </ScreenWrapper>
      );
      expect(toJSON()).toBeTruthy();
    });

    it('uses default behavior for KeyboardAvoidingView on Android', () => {
      Platform.OS = 'android';
      const { toJSON } = render(
        <ScreenWrapper mode="form">
          <Text>Android Form</Text>
        </ScreenWrapper>
      );
      expect(toJSON()).toBeTruthy();
    });
  });
});