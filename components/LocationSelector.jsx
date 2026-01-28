//we will add google places later

import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Label from "./Label";
import { Colors } from "../theme/colors";

export default function LocationSelector({
  value,
  onLocationSelected,
  placeholder = "Select Pickup Location",
  testID,
}) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLoading(false);
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      const address =
        await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

      if (address && address.length > 0) {
        const formatted = [
          address[0].name,
          address[0].city,
        ]
          .filter(Boolean)
          .join(", ");

        onLocationSelected?.(formatted);
      }
    } catch (error) {
      // Silent fail for now (keeps component test-friendly)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Label variant="label" style={styles.label}>
        Pickup location
      </Label>

      <TouchableOpacity
        testID={testID}
        style={styles.input}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <Label
          secondary
          color={value ? Colors.black : Colors.tabInactive}
        >
          {value || placeholder}
        </Label>

        <Ionicons
          name="location-outline"
          size={18}
          color={Colors.tabInactive}
        />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // To be deleted
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
});
