// we will add google places later

import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function LocationSelector({
  value,
  onLocationSelected,
  placeholder = "Enter or Select Location",
  testID,
}) {
  const [loading, setLoading] = useState(false);

  // Auto-detect location handler
  const handleCurrentLocationPress = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address && address.length > 0) {
        // Construct a readable string
        const formatted = [
          address[0].name,
          address[0].street,
          address[0].city,
        ]
          .filter(Boolean) // Remove null/undefined parts
          .join(", ");

        onLocationSelected?.(formatted);
      }
    } catch (error) {
      console.log("Location error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Label variant="label" style={styles.label}>
        Pickup location
      </Label>

      <View style={styles.inputContainer}>
        {/* ✅ MANUAL INPUT */}
        <TextInput
          testID={`${testID}-input`}
          style={styles.textInput}
          value={value}
          onChangeText={onLocationSelected}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholderTextColor || "#999"}
        />

        {/* ✅ AUTO-DETECT BUTTON */}
        <TouchableOpacity 
          testID={`${testID}-gps-button`}
          onPress={handleCurrentLocationPress} 
          disabled={loading}
          style={styles.iconButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.primary} // Highlighted color to show it's clickable
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, 
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border || "transparent", 
  },
  textInput: {
    flex: 1, // Takes up remaining space
    fontSize: 14,
    color: Colors.black,
    height: "100%",
    fontFamily: "System", // Or your custom font
  },
  iconButton: {
    paddingLeft: 10,
    height: "100%",
    justifyContent: "center",
  }
});