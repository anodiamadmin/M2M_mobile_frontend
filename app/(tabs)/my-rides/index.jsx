import Label from "@components/Label";
import { View } from "react-native";

export default function MyRides() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Label size={20} bold>
        Filter Rides
      </Label>
    </View>
  );
}
