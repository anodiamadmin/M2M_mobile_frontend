import { Text } from "react-native";
import { Fonts } from "@theme/fonts";

export default function Label({
  children,
  size = 14,
  bold = false,
  color = "#000",
  style,
}) {
  return (
    <Text
      style={[
        {
          fontFamily: bold ? Fonts.primaryBold : Fonts.primary,
          fontSize: size,
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
