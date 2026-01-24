import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../theme/colors";

export default function Checkbox({ 
  checked, 
  onPress, 
  style,
  size = 22 // Default size from your code
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      // HitSlop makes it easier to tap without increasing visual size
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
      style={[
        styles.base, 
        { width: size, height: size },
        checked ? styles.checked : styles.unchecked,
        style
      ]}
    >
      {checked && (
        <Ionicons name="checkmark" size={size * 0.7} color={Colors.white} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  unchecked: {
    backgroundColor: Colors.surface, // Your specific grey
    borderColor: Colors.borderDark,
  },
  checked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  }
});