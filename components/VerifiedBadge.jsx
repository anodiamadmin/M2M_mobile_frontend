import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

export default function VerifiedBadge({ showText = false }) {
  return (
    <View style={styles.container}>
      {/* Wrapping icon to make mocked text queryable */}
      <Text>
        <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
      </Text>

      {showText && <Text style={styles.text}>Verified</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
});
