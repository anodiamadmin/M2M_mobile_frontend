import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";

import BrandLogo from "../../../components/BrandLogo";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Checkbox from "../../../components/Checkbox";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ScrollHint from "../../../components/ScrollHint"; // ✅ Modular Component

import { bikeService } from "../../../services/bikeService";
import { Colors } from "../../../theme/colors";

export default function RenterBookingConfirmation() {
  const router = useRouter();
  const { bikeId, from, to } = useLocalSearchParams();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insuranceAccepted, setInsuranceAccepted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // 1. Fetch Bike Details
  useEffect(() => {
    const fetchBike = async () => {
      try {
        if (bikeId) {
          const data = await bikeService.getBikeById(bikeId);
          setBike(data);
        }
      } catch (error) {
        Alert.alert("Error", "Could not load bike details.");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [bikeId]);

  // 2. Hide Hint on Scroll
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 30 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  // 3. Price Calculation
  const { weeks, totalPrice } = useMemo(() => {
    if (!from || !to || !bike) return { weeks: 0, totalPrice: 0 };
    const startDate = new Date(from);
    const endDate = new Date(to);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const calculatedWeeks = Math.max(1, Math.ceil(diffDays / 7));
    return { weeks: calculatedWeeks, totalPrice: calculatedWeeks * bike.price };
  }, [from, to, bike]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    // ✅ edges override fixes the "boundary" on top of the tab bar
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.headerSpacing}>
        <BrandLogo />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* TOP SECTION: Highlight Card */}
          <View style={styles.cardWrapper}>
            <Card
              variant="highlight"
              title={bike.title}
              subtitle={`${bike.type} E-BIKE`.toUpperCase()}
              price={bike.price}
              image={bike.image}
              rating={bike.rating}
              badgeText={bike.status?.toUpperCase()} 
            />
          </View>

          {/* DETAILS SECTION */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <Label variant="body" secondary style={styles.detailText}>
                {bike.supplier?.location || "Location provided upon booking"}
              </Label>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Label variant="body" secondary style={styles.detailText}>
                From <Label variant="body" bold secondary>{new Date(from).toLocaleDateString()}</Label> To <Label variant="body" bold secondary>{new Date(to).toLocaleDateString()}</Label>
              </Label>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
              <Label variant="body" secondary style={styles.detailText}>
                Total ({weeks} weeks): <Label variant="body" bold secondary color={Colors.primary}>${totalPrice}</Label>
              </Label>
            </View>

            <View style={styles.supplierRow}>
              <Ionicons name="business-outline" size={20} color={Colors.primary} />
              <Button 
                title={`About ${bike.supplier?.name}`}
                variant="hyperlink"
                onPress={() => Alert.alert("Profile", "Supplier Profile Modal")}
                style={styles.hyperlinkButton}
                textSize={16} 
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* INSURANCE SECTION */}
          <View style={styles.checkboxRow}>
            <Checkbox
              checked={insuranceAccepted}
              onPress={() => setInsuranceAccepted(!insuranceAccepted)}
              size={24}
            />
            <Label variant="body" secondary style={styles.checkboxLabel}>
              Purchase mandatory{" "}
              <Label 
                variant="body" bold secondary
                color={Colors.primary} 
                style={{ textDecorationLine: 'underline' }}
                onPress={() => Alert.alert("Insurance", "Policy details...")}
              >
                insurance
              </Label>
            </Label>
          </View>

          <Button
            title={insuranceAccepted ? "Book" : "Accept Insurance to Book"}
            variant="primary"
            onPress={() => router.push("/(tabs)/my-rides")}
            disabled={!insuranceAccepted}
            style={{ 
              marginTop: 10,
              opacity: insuranceAccepted ? 1 : 0.5 
            }}
          />
        </ScrollView>

        <ScrollHint visible={!hasScrolled} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerSpacing: { marginTop: 10, marginBottom: 5, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 60, paddingHorizontal: 16, paddingTop: 5 },
  cardWrapper: { marginBottom: 20 },
  detailsContainer: { gap: 12, marginBottom: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailText: { color: "#4B5563", flex: 1 },
  supplierRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  hyperlinkButton: { margin: 0, padding: 0, minHeight: 0, alignSelf: 'flex-start' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 },
  checkboxLabel: { color: Colors.black, flex: 1 },
});