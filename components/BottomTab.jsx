import Label from "@/components/Label";
import { Colors } from "@/theme/colors";
import { Pressable, View } from "react-native";

export default function BottomTab({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          paddingVertical: 10,
          borderTopWidth: active ? 2 : 0,
          borderTopColor: Colors.black,
        }}
      >
        <Label 
          size={12} 
          bold={active}
          color={Colors.black}
        >
          {label}
        </Label>
      </View>
    </Pressable>
  );
}