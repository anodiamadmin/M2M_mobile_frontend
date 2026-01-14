import { View, Text, TextInput } from "react-native";
import { Fonts } from "@theme/fonts";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  testID,
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontFamily: Fonts.secondaryBold,
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}

      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: error ? "red" : "#ccc",
          borderRadius: 6,
          padding: 12,
          fontFamily: Fonts.secondary,
        }}
      />

      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            marginTop: 4,
            fontFamily: Fonts.secondary,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
