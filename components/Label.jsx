import { Colors } from "@theme/colors";
import { Fonts } from "@theme/fonts";
import { Text } from "react-native";

export default function Label({
  children,
  size = 14,
  bold = false,
  secondary = false,
  color = Colors.black,
  style,
  ...props
}) {
  
  const fontFamily = secondary
    ? (bold ? Fonts.secondaryBold : Fonts.secondary)
    : (bold ? Fonts.primaryBold : Fonts.primary);

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize: size,
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