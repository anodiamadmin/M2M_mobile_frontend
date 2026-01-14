import { View } from "react-native";
import Label from "@components/Label";

export default function BikeList() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Label size={20} bold>
        Bike Listings
      </Label>
    </View>
  );
}
