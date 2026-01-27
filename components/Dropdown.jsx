import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Label from "./Label";
import { Colors } from "../theme/colors";

export default function Dropdown({
  label,
  value,
  options = [],
  placeholder = "Select",
  onSelect,
  testID,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect?.(option);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Label variant="label" style={styles.label}>
          {label}
        </Label>
      )}

      <TouchableOpacity
        testID={testID}
        style={styles.input}
        activeOpacity={0.8}
        onPress={() => setOpen(!open)}
      >
        <Label
          secondary
          color={value ? Colors.black : Colors.tabInactive}
        >
          {value || placeholder}
        </Label>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.tabInactive}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.options}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => handleSelect(option)}
            >
              <Label>{option}</Label>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  options: {
    marginTop: 6,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 6,
    elevation: 3,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
