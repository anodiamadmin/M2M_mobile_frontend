import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { bikeService } from "../../../services/bikeService";
import { Colors } from "../../../theme/colors";

export default function CurrentBooking() {
  const router = useRouter();
  const { bikeId } = useLocalSearchParams();
  
  const [bike, setBike] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Today's date for logic: Jan 29, 2026
  const today = new Date();

  useEffect(() => {
    const fetchBike = async () => {
      if (bikeId) {
        const data = await bikeService.getBikeById(bikeId);
        setBike(data);
        setLoading(false);
      }
    };
    fetchBike();
  }, [bikeId]);

  // Determine the current phase of the booking
  const phase = useMemo(() => {
    if (!bike) return "loading";
    
    const start = new Date(bike.startDate);
    
    if (isAccepted) return "IN_PROGRESS"; // Rider has the bike
    if (today >= start) return "READY_FOR_PICKUP"; // Start date hit, not accepted yet
    return "UPCOMING"; // Future booking
  }, [bike, isAccepted]);

  const handleCancel = () => {
    Alert.alert("Cancel Booking", "Are you sure? This action cannot be undone.", [
      { text: "Keep Booking", style: "cancel" },
      { text: "Cancel Ride", style: "destructive", onPress: () => router.replace("/(tabs)/my-rides") }
    ]);
  };

  const handleAccept = () => {
    Alert.alert("E-Bike Accepted", "Enjoy your battle-hardened ride!", [
      { text: "Let's Go!", onPress: () => setIsAccepted(true) }
    ]);
  };

  if (loading) return null;

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Label variant="heading" style={styles.header}>
          {phase === "IN_PROGRESS" ? "Active Ride" : "Booking Details"}
        </Label>

        {/* The Persistent Bike Card */}
        <View style={styles.cardSection}>
          <Card
            variant="highlight"
            title={bike.title}
            subtitle={bike.type.toUpperCase()}
            price={bike.price}
            image={bike.image}
            rating={bike.rating}
            isVerified={bike.isVerified}
            storeName={bike.supplier?.name}
            badgeText={phase === "IN_PROGRESS" ? "Riding" : bike.status.toUpperCase()}
          />
        </View>

        {/* Dynamic State Info */}
        <View style={styles.statusBox}>
          <Ionicons 
            name={phase === "IN_PROGRESS" ? "bicycle" : "time-outline"} 
            size={24} 
            color={Colors.primary} 
          />
          <Label style={styles.statusText}>
            {phase === "UPCOMING" && `Pickup scheduled for ${new Date(bike.startDate).toLocaleDateString()}`}
            {phase === "READY_FOR_PICKUP" && "The bike is ready! Please verify the condition at the hub."}
            {phase === "IN_PROGRESS" && "Ride in progress. Return by " + new Date(bike.endDate).toLocaleDateString()}
          </Label>
        </View>

        {/* BOTTOM ACTION BUTTONS */}
        <View style={styles.footer}>
          
          {phase === "UPCOMING" && (
            <Button 
              title="Cancel Booking" 
              variant="secondary" 
              onPress={handleCancel}
              style={styles.cancelBtn}
            />
          )}

          {phase === "READY_FOR_PICKUP" && (
            <Button 
              title="Accept E-Bike" 
              variant="primary" 
              onPress={handleAccept}
            />
          )}

          {phase === "IN_PROGRESS" && (
            <Button 
              title="Return E-Bike" 
              variant="primary" 
              onPress={() => router.replace("/(tabs)/my-rides")}
              style={{ backgroundColor: Colors.secondary }}
            />
          )}
          
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 20, color: Colors.black },
  cardSection: { marginBottom: 24 },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    gap: 12,
  },
  statusText: { flex: 1, fontSize: 14, color: Colors.black, lineHeight: 20 },
  footer: { marginTop: 'auto', gap: 12 },
  cancelBtn: { borderColor: '#EF4444' } // Red border for cancel
});