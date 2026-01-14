import { View } from "react-native";
import Label from "@components/Label";

export default function MyBikes() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Label size={22} bold>
        Your E-Bikes
      </Label>
    </View>
  );
}
