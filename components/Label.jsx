import { Text } from "react-native";
import { Colors } from "../theme/colors";
import { Fonts } from "../theme/fonts";

const VARIANTS = {
  heading:    { size: 24, bold: true,  secondary: false }, // Page Titles
  subheading: { size: 20, bold: true,  secondary: true },  // Section Headers
  body:       { size: 16, bold: false, secondary: true },  // Standard Text
  label:      { size: 14, bold: true,  secondary: true },  // Form Labels
  caption:    { size: 12, bold: false, secondary: true },  // Helper text
  small:      { size: 11, bold: false, secondary: true },  // Tiny details
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
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}