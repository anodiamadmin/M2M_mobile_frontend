import Label from "@/components/Label";
import { Colors } from "@/theme/colors";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textSize = 20
}) {
  const isSecondary = variant === "secondary";
  const isHyperlink = variant === "hyperlink";
  
  let backgroundColor = Colors.primary;
  let borderColor = "transparent";
  let borderWidth = 0;
  let textColor = Colors.white;

  if (isSecondary) {
    backgroundColor = "transparent";
    borderColor = Colors.primary;
    borderWidth = 2;
    textColor = Colors.primary;
  } else if (isHyperlink) {
    backgroundColor = "transparent";
    borderColor = "transparent";
    borderWidth = 0;
    textColor = Colors.primary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          borderWidth,
        },
        style,
      ]}
    >
      <Label
        bold
        secondary
        size={textSize} // Now uses the prop instead of hardcoded 20
        color={textColor}
        style={isHyperlink ? { textDecorationLine: "underline" } : undefined}
      >
        {title}
      </Label>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
    marginVertical: 10,
  },
});