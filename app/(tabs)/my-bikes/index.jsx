import Label from "@components/Label";
import { View } from "react-native";

export default function MyBikes() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Label size={20} bold>
        List an E-Bike
      </Label>
    </View>
  );
}
