import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select Date",
  minDate,
  maxDate,
  error,
  style,
  inputStyle
}) {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (event.type === 'dismissed') {
       return;
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayString = value 
    ? `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    : "";

  return (
    <View style={[styles.container, style]}>
      
      {label && (
        <Label variant="label" color={Colors.primary} style={styles.label}>
          {label}
        </Label>
      )}

      <TouchableOpacity
        onPress={() => setShow(!show)}
        activeOpacity={0.8}
        style={[
          styles.inputContainer,
          inputStyle,
          error && { borderColor: Colors.red, borderWidth: 1 }
        ]}
      >
        <Label 
          secondary
          size={16} 
          color={displayString ? Colors.black : Colors.tabInactive}
        >
          {displayString || placeholder}
        </Label>
        
        <Ionicons name="calendar-outline" size={20} color={Colors.tabInactive} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value || new Date()}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minDate}
          maximumDate={maxDate}
          textColor={Colors.black}
          accentColor={Colors.primary}
        />
      )}

      {error && (
        <Label variant="caption" color={Colors.red} style={styles.errorText}>
          {error}
        </Label>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.transparent, 
  },
  errorText: {
    marginTop: 4, 
    marginLeft: 10
  }
});