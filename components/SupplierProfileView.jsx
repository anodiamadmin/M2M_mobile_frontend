import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function SupplierProfileView({ supplier }) {
  if (!supplier) return null;

  // Use the data from your MOCK_BIKES supplier object
  return (
    <View style={styles.container}>
      {/* Avatar / Icon Header */}
      <View style={styles.avatarCircle}>
        <Ionicons name="business" size={40} color={Colors.primary} />
      </View>
      
      <Label variant="subheading" bold style={styles.name}>
        {supplier.name}
      </Label>
      
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={14} color={Colors.placeholderTextColor} />
        <Label variant="caption" style={styles.locationText}>
          {supplier.location || "Sydney, AU"}
        </Label>
      </View>

      {/* Trust Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Label bold style={styles.statValue}>4.9</Label>
          <Label variant="caption" style={styles.statLabel}>Rating</Label>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Label bold style={styles.statValue}>120+</Label>
          <Label variant="caption" style={styles.statLabel}>Rides</Label>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Label bold style={styles.statValue}>2yr</Label>
          <Label variant="caption" style={styles.statLabel}>Partner</Label>
        </View>
      </View>

      {/* Bio / Description */}
      <View style={styles.bioSection}>
        <Label variant="body" style={styles.bioText}>
          Professional fleet manager specializing in high-performance urban e-bikes. 
          All rides are safety-checked and fully charged before pickup.
        </Label>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  name: {
    color: Colors.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    color: Colors.placeholderTextColor,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: Colors.black,
  },
  statLabel: {
    color: Colors.placeholderTextColor,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border,
  },
  bioSection: {
    width: '100%',
  },
  bioText: {
    textAlign: 'center',
    color: Colors.black,
    lineHeight: 20,
    fontSize: 14,
  },
});