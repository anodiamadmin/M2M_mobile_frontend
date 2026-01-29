import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";

import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Checkbox from "../../../components/Checkbox";
import ImageUploader from "../../../components/ImageUploader";
import InfoModal from "../../../components/InfoModal";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ScrollHint from "../../../components/ScrollHint";
import SupplierProfileView from "../../../components/SupplierProfileView";

import { bikeService } from "../../../services/bikeService";
import { Colors } from "../../../theme/colors";

const BouncingIcon = ({ name, color, size }) => {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -6, duration: 600, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 600, useNativeDriver: true })
      ]), { iterations: 6 } 
    ).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ translateY: bounce }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const FEATURES_LIST = [
  "Battery charges and holds power",
  "Motor assist functioning smoothly",
  "Brakes responsive and reliable",
  "Lights and indicators working",
  "Display and controls operational",
  "Tyres properly inflated, no damage",
  "Frame, seat, pedals secure"
];

export default function CurrentBooking() {
  const router = useRouter();
  const { bikeId } = useLocalSearchParams();
  
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Modals
  const [isSupplierVisible, setSupplierVisible] = useState(false);
  const [isInsuranceVisible, setInsuranceVisible] = useState(false); 
  const [isCancelSheetVisible, setCancelSheetVisible] = useState(false); 
  const [isPolicyModalVisible, setPolicyModalVisible] = useState(false); 
  const [isFeaturesModalVisible, setFeaturesModalVisible] = useState(false);
  const [isRaiseIssueVisible, setRaiseIssueVisible] = useState(false); 
  
  const [localStatus, setLocalStatus] = useState(null); 
  const [issueDescription, setIssueDescription] = useState(""); 
  const [issueImage, setIssueImage] = useState(null); 
  
  const [featuresConfirmed, setFeaturesConfirmed] = useState(false);
  const [featureChecks, setFeatureChecks] = useState(new Array(FEATURES_LIST.length).fill(true));

  useEffect(() => {
    const fetchBike = async () => {
      try {
        if (bikeId) {
          const data = await bikeService.getBikeById(bikeId);
          setBike(data);
          if (data.status === "Active") setLocalStatus("Active");
        }
      } catch (error) {
        Alert.alert("Error", "Could not load booking details");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [bikeId]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 30 && !hasScrolled) setHasScrolled(true);
  };

  const bookingPhase = useMemo(() => {
    if (!bike) return "LOADING";
    if (localStatus === "Active") return "ACTIVE_RIDE"; 
    const today = new Date();
    today.setHours(0,0,0,0);
    const startDate = new Date(bike.startDate);
    startDate.setHours(0,0,0,0);
    if (today >= startDate) return "READY_FOR_PICKUP";
    return "UPCOMING";
  }, [bike, localStatus]);

  const bookingDetails = useMemo(() => {
     if(!bike) return null;
     const start = new Date(bike.startDate);
     const end = new Date(bike.endDate);
     const diffTime = Math.abs(end - start);
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
     const weeks = Math.max(1, Math.ceil(diffDays / 7));
     const total = weeks * bike.price;
     return { startStr: start.toLocaleDateString(), endStr: end.toLocaleDateString(), weeks, totalPrice: total };
  }, [bike]);

  const handleConfirmPickup = () => {
    Alert.alert("Ride Started", "Have a safe journey!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/my-rides") }
    ]);
  };

  const handleReturn = () => {
    Alert.alert("Return E-Bike", "Please ensure the bike is locked.", [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => router.replace("/(tabs)/my-rides") }
    ]);
  };

  const handleConfirmCancel = () => {
    setCancelSheetVisible(false);
    Alert.alert("Cancelled", "Your booking has been cancelled successfully.", [
        { text: "OK", onPress: () => router.back() }
    ]);
  };

  const handleSubmitIssue = () => {
    setRaiseIssueVisible(false);
    if (bookingPhase === "READY_FOR_PICKUP") {
        Alert.alert("Booking Cancelled", "Issue reported. Your booking has been cancelled.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    } else {
        Alert.alert("Report Submitted", "Our support team will contact you shortly.", [
            { text: "OK" }
        ]);
    }
  };

  const toggleFeature = (index) => {
    const updated = [...featureChecks];
    updated[index] = !updated[index];
    setFeatureChecks(updated);
  };

  const canRaiseIssue = featureChecks.some((isChecked) => !isChecked);

  if (loading || !bike) {
    return (
        <ScreenWrapper>
            <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
        </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
          <ScrollView 
            contentContainerStyle={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
                <Label variant="heading">{bookingPhase === "ACTIVE_RIDE" ? "Active Ride" : "Booking Details"}</Label>
                <View style={[styles.statusBadge, bookingPhase === "ACTIVE_RIDE" ? { backgroundColor: Colors.success } : bookingPhase === "READY_FOR_PICKUP" ? { backgroundColor: Colors.primary } : { backgroundColor: Colors.secondary }]}>
                    <Label style={styles.statusText}>{bookingPhase === "ACTIVE_RIDE" ? "RIDING" : bookingPhase === "READY_FOR_PICKUP" ? "READY" : "BOOKED"}</Label>
                </View>
            </View>

            <View style={styles.cardWrapper}>
                <Card variant="highlight" title={bike.title} subtitle={`${bike.type} E-BIKE`} price={bike.price} image={bike.image} rating={bike.rating} isVerified={bike.isVerified} storeName={bike.supplier?.name} onSupplierPress={() => setSupplierVisible(true)} badgeText="" />
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={20} color={Colors.primary} />
                    <Label variant="body" secondary style={styles.detailText}>{bike.supplier?.location || "Location provided upon booking"}</Label>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                    <Label variant="body" secondary style={styles.detailText}>From <Label variant="body" bold secondary>{bookingDetails?.startStr}</Label> To <Label variant="body" bold secondary>{bookingDetails?.endStr}</Label></Label>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
                    <Button title="View Owner's Profile" variant="hyperlink" onPress={() => setSupplierVisible(true)} style={styles.hyperlinkButton} textSize={15} />
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
                    <Button title="Insurance details" variant="hyperlink" onPress={() => setInsuranceVisible(true)} style={styles.hyperlinkButton} textSize={15} />
                </View>
            </View>

            <View style={styles.divider} />

            {/* Info Box */}
            <View style={styles.infoBox}>
                
                {/* ✅ UPDATED: Bouncing Icon for ALL 3 States */}
                {bookingPhase === "UPCOMING" ? (
                    <BouncingIcon name="time-outline" size={24} color={Colors.black} />
                ) : bookingPhase === "READY_FOR_PICKUP" ? (
                    <BouncingIcon name="location-outline" size={24} color={Colors.black} />
                ) : (
                    // ✅ Active Ride now bounces too
                    <BouncingIcon name="speedometer-outline" size={24} color={Colors.black} />
                )}
                
                <View style={styles.infoContent}>
                    <Label bold style={styles.infoTitle}>
                        {bookingPhase === "UPCOMING" && "Upcoming Reservation"}
                        {bookingPhase === "READY_FOR_PICKUP" && "Ready for Pickup"}
                        {bookingPhase === "ACTIVE_RIDE" && "Ride in Progress"}
                    </Label>
                    <Label variant="caption" style={styles.infoBody}>
                        {bookingPhase === "UPCOMING" && "You can cancel free of charge up to 24 hours before your pickup time."}
                        {bookingPhase === "READY_FOR_PICKUP" && "Please visit the supplier location to pick up your bike. Verify features before accepting."}
                        {bookingPhase === "ACTIVE_RIDE" && "Ride carefully! Remember to lock the bike securely when parking."}
                    </Label>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
                {bookingPhase === "UPCOMING" && <Button title="Cancel Booking" variant="secondary" onPress={() => setCancelSheetVisible(true)} />}
                
                {bookingPhase === "READY_FOR_PICKUP" && (
                    <View style={{ gap: 16 }}>
                        <View style={styles.checkboxRow}>
                            <Checkbox checked={featuresConfirmed} onPress={() => setFeaturesConfirmed(!featuresConfirmed)} size={24} />
                            <Label variant="body" secondary style={styles.checkboxLabel}>I confirm all <Label variant="body" bold color={Colors.primary} style={{ textDecorationLine: 'underline' }} onPress={() => setFeaturesModalVisible(true)}>e-bike features</Label> are working fine.</Label>
                        </View>
                        <Button title="Accept E-Bike" variant="primary" disabled={!featuresConfirmed} style={{ opacity: featuresConfirmed ? 1 : 0.5 }} onPress={handleConfirmPickup} />
                    </View>
                )}

                {bookingPhase === "ACTIVE_RIDE" && (
                    <View style={{ gap: 10 }}>
                        <Button title="Return E-Bike" variant="primary" onPress={handleReturn} />
                        <Button title="Report Issue" variant="secondary" onPress={() => setRaiseIssueVisible(true)} />
                    </View>
                )}
            </View>

            {/* Debug Controls */}
            <View style={styles.debugBox}>
                <Label bold style={{marginBottom:8}}>🚧 Debug Controls (Testing)</Label>
                <View style={{flexDirection:'row', gap:8, flexWrap:'wrap'}}>
                    <Button title="Set Upcoming" variant="secondary" textSize={10} style={styles.debugBtn} onPress={() => { setBike({...bike, startDate: "2026-03-01"}); setLocalStatus(null); }} />
                    <Button title="Set Ready" variant="secondary" textSize={10} style={styles.debugBtn} onPress={() => { setBike({...bike, startDate: "2026-01-29"}); setLocalStatus(null); }} />
                    <Button title="Set Active" variant="secondary" textSize={10} style={styles.debugBtn} onPress={() => setLocalStatus("Active")} />
                </View>
            </View>
          </ScrollView>
          <ScrollHint visible={!hasScrolled} />
      </View>

      {/* --- MODALS --- */}
      <InfoModal visible={isSupplierVisible} title="Supplier Profile" onClose={() => setSupplierVisible(false)}><SupplierProfileView supplier={bike.supplier} /></InfoModal>
      
      <InfoModal visible={isInsuranceVisible} title="Insurance" showCloseButton={false} onClose={() => setInsuranceVisible(false)}>
          <View style={{ minHeight: 400, justifyContent: 'space-between' }}>
             <View>
                 <Label variant="body" style={{lineHeight: 22, marginBottom: 16}}>This booking includes comprehensive insurance for theft, accidental damage, and third-party liability.</Label>
                 <Label variant="caption" bold style={{marginBottom: 4}}>Coverage Includes:</Label>
                 <Label variant="caption" style={{marginBottom: 16}}>• Theft protection (with lock used){"\n"}• Accidental damage coverage{"\n"}• Third-party property damage</Label>
             </View>
             <Button title="Close" variant="secondary" onPress={() => setInsuranceVisible(false)} />
          </View>
      </InfoModal>

      <InfoModal visible={isPolicyModalVisible} title="Cancellation Policy" onClose={() => setPolicyModalVisible(false)}>
          <Label variant="body" style={{lineHeight: 20}}>Lorem Ipsum text...</Label>
          <Button title="Close" variant="primary" onPress={() => setPolicyModalVisible(false)} style={{marginTop: 20}} />
      </InfoModal>

      <InfoModal visible={isCancelSheetVisible} title="Cancel Booking?" variant="bottom" onClose={() => setCancelSheetVisible(false)}>
          <View style={{ gap: 12 }}>
              <View style={styles.calcRow}><Label variant="body" secondary bold>Price</Label><Label variant="body" secondary>$136.00</Label></View>
              <View style={styles.calcRow}><Label variant="body" secondary bold>Cancellation charge</Label><Label variant="body" secondary>$29.35</Label></View>
              <View style={styles.calcRow}><Label variant="subheading" color={Colors.primary} bold>Return amount</Label><Label variant="subheading" color={Colors.primary} bold>$106.65</Label></View>
              <View style={styles.policyBox}><Label variant="caption" bold color={Colors.primary} style={{marginBottom:4}}>Cancellation Policy</Label><Label variant="caption" style={{lineHeight: 18, color: Colors.placeholderTextColor}}>Lorem Ipsum... <Label variant="caption" bold color={Colors.primary} style={{textDecorationLine: 'underline'}} onPress={() => setPolicyModalVisible(true)}>Read more</Label></Label></View>
              <Button title="Confirm" variant="secondary" onPress={handleConfirmCancel} style={{borderColor: Colors.primary, borderWidth: 1, marginTop: 10}} />
              <Button title="Do Not Cancel, Go Back" variant="primary" onPress={() => setCancelSheetVisible(false)} />
          </View>
      </InfoModal>

      <InfoModal visible={isFeaturesModalVisible} title="Your E-Bike's Features to Check" onClose={() => setFeaturesModalVisible(false)}>
          <View>
              <View style={styles.featureList}>
                  {FEATURES_LIST.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                          <Label variant="body" secondary style={{flex: 1, marginRight: 10}}>{feature}</Label>
                          <Checkbox checked={featureChecks[index]} onPress={() => toggleFeature(index)} />
                      </View>
                  ))}
              </View>
              <Button title="Raise Issue" variant="primary" disabled={!canRaiseIssue} onPress={() => { setFeaturesModalVisible(false); setRaiseIssueVisible(true); }} style={{ marginTop: 24, opacity: canRaiseIssue ? 1 : 0.5 }} />
          </View>
      </InfoModal>

      <InfoModal visible={isRaiseIssueVisible} title="Raise Issue" variant="bottom" showCloseButton={false} onClose={() => setRaiseIssueVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', height: 50, marginBottom: 8 }}>
                    <ImageUploader label="Take Photo of Issue" activeLabel="Photo Uploaded" icon="camera" imageUri={issueImage} onImageSelected={(uri) => setIssueImage(uri)} />
                </View>
                <View>
                    <Label style={{ marginBottom: 8, color: Colors.black }}>Describe the issue</Label>
                    <TextInput style={styles.issueInput} multiline placeholder="Type here..." value={issueDescription} onChangeText={setIssueDescription} />
                </View>
                <View style={{ gap: 12, marginTop: 10 }}>
                    <Button title={bookingPhase === "READY_FOR_PICKUP" ? "Raise Issue + Cancel Booking" : "Submit Report"} variant="secondary" onPress={handleSubmitIssue} />
                    <Button title="Ignore Issue, Go Back" variant="primary" onPress={() => setRaiseIssueVisible(false)} />
                </View>
            </View>
        </KeyboardAvoidingView>
      </InfoModal>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  cardWrapper: { marginBottom: 20 },
  detailsContainer: { gap: 12, marginBottom: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailText: { color: "#4B5563", flex: 1 },
  hyperlinkButton: { margin: 0, padding: 0, minHeight: 0, alignSelf: 'flex-start' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  infoBox: { flexDirection: 'row', backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 30, borderWidth: 1, borderColor: Colors.border },
  infoContent: { marginLeft: 12, flex: 1 },
  infoTitle: { marginBottom: 4, color: Colors.black },
  infoBody: { color: Colors.placeholderTextColor, lineHeight: 18 },
  actionSection: { marginTop: 'auto' },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 4 },
  checkboxLabel: { flex: 1, color: Colors.black },
  featureList: { gap: 16, paddingVertical: 10 },
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  debugBox: { marginTop: 40, padding: 16, backgroundColor: '#F3F4F6', borderRadius: 8, borderWidth:1, borderColor: '#ddd' },
  debugBtn: { width: 'auto', paddingHorizontal: 10, height: 30 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  policyBox: { backgroundColor: Colors.surface, padding: 12, borderRadius: 8, marginVertical: 10 },
  
  issueInput: {
    height: 120,
    backgroundColor: '#FDEEFF',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.black
  }
});