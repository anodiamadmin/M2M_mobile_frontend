import Label from "@components/Label";
import { View } from "react-native";

export default function MyRides() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Label size={20} bold>
        Book an E-Bike
      </Label>
    </View>
  );
}
