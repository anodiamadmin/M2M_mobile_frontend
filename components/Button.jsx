import Label from "@/components/Label";
import { Colors } from "@/theme/colors";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textSize = 20,
  disabled = false
}) {
  const isSecondary = variant === "secondary";
  const isHyperlink = variant === "hyperlink";
  
  let backgroundColor = Colors.primary;
  let borderColor = Colors.transparent;
  let borderWidth = 0;
  let textColor = Colors.white;

  if (isSecondary) {
    backgroundColor = Colors.transparent;
    borderColor = Colors.primary;
    borderWidth = 2;
    textColor = Colors.primary;
  } else if (isHyperlink) {
    backgroundColor = Colors.transparent;
    borderColor = Colors.transparent;
    borderWidth = 0;
    textColor = Colors.primary;
  }

  if (disabled) {
    backgroundColor = isHyperlink ? Colors.transparent : Colors.border;
    borderColor = Colors.transparent;
    textColor = Colors.tabInactive;
  }

  if (isHyperlink) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.5}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={style}
      >
        <Label
          bold
          secondary
          size={textSize}
          color={textColor}
          style={{ textDecorationLine: "underline" }}
        >
          {title}
        </Label>
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
        size={textSize} 
        color={textColor}
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