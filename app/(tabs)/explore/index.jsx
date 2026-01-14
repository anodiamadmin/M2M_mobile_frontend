import { View } from "react-native";
import Label from "@components/Label";

export default function Explore() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Label size={20} bold>
        Explore E-Bikes
      </Label>
    </View>
  );
}
