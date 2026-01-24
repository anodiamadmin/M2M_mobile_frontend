import { Text } from "react-native";
import { Colors } from "../theme/colors";
import { Fonts } from "../theme/fonts";

const VARIANTS = {
  heading:    { size: 24, bold: true,  secondary: false }, 
  subheading: { size: 20, bold: true,  secondary: true },  
  body:       { size: 16, bold: false, secondary: true },  
  label:      { size: 14, bold: true,  secondary: true },  
  caption:    { size: 12, bold: false, secondary: true },  
  small:      { size: 11, bold: false, secondary: true },  
};

export default function Label({
  children,
  variant,
  size,
  bold,
  secondary,
  color = Colors.black,
  
  style,
  ...props
}) {
  
  const variantStyles = VARIANTS[variant] || {};
  const finalSize = size ?? variantStyles.size ?? 14;
  const isBold = bold ?? variantStyles.bold ?? false;
  const isSecondary = secondary ?? variantStyles.secondary ?? false;

  const fontFamily = isSecondary
    ? (isBold ? Fonts.secondaryBold : Fonts.secondary)
    : (isBold ? Fonts.primaryBold : Fonts.primary);

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: finalSize,
          color,
          marginBottom: variant === 'heading' ? 20 : 0, 
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}