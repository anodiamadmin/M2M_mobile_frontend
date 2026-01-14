import { StyleSheet, TextInput, View } from "react-native";
import { Colors } from "../theme/colors";
import { Fonts } from "../theme/fonts";
import Label from "./Label";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  testID,
  style,
  inputStyle,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      
      {label && (
        <Label 
          secondary 
          bold 
          size={14} 
          color={Colors.primary} 
          style={styles.label}
        >
          {label}
        </Label>
      )}

      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          error && { borderColor: "red", borderWidth: 1 },
          inputStyle 
        ]}
        {...props}
      />

      {/* 3. Error Message */}
      {error && (
        <Label 
          secondary 
          size={12} 
          style={{ color: "red", marginTop: 4, marginLeft: 10 }}
        >
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
  input: {
    height: 50,
    backgroundColor: "#E6E6FA",
    borderRadius: 25, 
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: Fonts.secondary, 
    color: Colors.black,
    borderWidth: 1,
    borderColor: "transparent", 
  },
});