import Label from "@/components/Label";
import { Colors } from "@/theme/colors";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textSize = 20,
  disabled = false,
  textColor, // 👈 1. Add the prop here
}) {
  const isSecondary = variant === "secondary";
  const isHyperlink = variant === "hyperlink";
  
  // Default values
  let backgroundColor = Colors.primary;
  let borderColor = Colors.transparent;
  let borderWidth = 0;
  let finalTextColor = Colors.white; // Default for primary

  // Variant Logic
  if (isSecondary) {
    backgroundColor = Colors.transparent;
    borderColor = Colors.primary;
    borderWidth = 2;
    finalTextColor = Colors.primary;
  } else if (isHyperlink) {
    backgroundColor = Colors.transparent;
    borderColor = Colors.transparent;
    borderWidth = 0;
    finalTextColor = Colors.primary;
  }

  // 👈 2. Override: If user passed a textColor, use it!
  if (textColor) {
    finalTextColor = textColor;
  }

  // Disabled Logic (Always wins)
  if (disabled) {
    backgroundColor = isHyperlink ? Colors.transparent : Colors.border;
    borderColor = Colors.transparent;
    finalTextColor = Colors.tabInactive;
  }

  const Content = (
    <Label
      bold
      secondary
      size={textSize}
      color={finalTextColor} // 👈 3. Use the calculated color
      style={isHyperlink ? { textDecorationLine: "underline" } : undefined}
    >
      {title}
    </Label>
  );

  if (isHyperlink) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.5}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={style}
      >
        {Content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        { backgroundColor, borderColor, borderWidth },
        style,
      ]}
    >
      {Content}
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