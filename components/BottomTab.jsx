import { View, Text, Pressable } from "react-native";
import { Fonts } from "@theme/fonts";

export default function BottomTab({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          paddingVertical: 10,
          borderTopWidth: active ? 2 : 0,
          borderTopColor: "#000",
        }}
      >
        <Text
          style={{
            fontFamily: active ? Fonts.primaryBold : Fonts.primary,
            fontSize: 12,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
