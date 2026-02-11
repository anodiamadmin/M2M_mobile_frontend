import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import BrandLogo from "../../../components/BrandLogo";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import CardCarousel from "../../../components/CardCarousel";
import DateRangePicker from "../../../components/DateRangePicker";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";

import { AuthContext } from "../../../context/AuthContext";
import { bikeService } from "../../../services/bikeService";
import { Colors } from "../../../theme/colors";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function RenterBookedBikesList() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [allBookings, setAllBookings] = useState([]); 
  const [filteredBookings, setFilteredBookings] = useState([]);
  
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await bikeService.getMyBookings();
        setAllBookings(data);
        setFilteredBookings(data); 
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    if (allBookings.length === 0) return;

    if (!fromDate && !toDate) {
      setFilteredBookings(allBookings);
      return;
    }
    const filterStart = fromDate ? new Date(fromDate).setHours(0,0,0,0) : null;
    const filterEnd = toDate ? new Date(toDate).setHours(23,59,59,999) : null;

    const results = allBookings.filter((booking) => {
      const bookingStart = new Date(booking.startDate).getTime();
      const bookingEnd = new Date(booking.endDate).getTime();
      if (filterStart && !filterEnd) return bookingEnd >= filterStart;
      if (!filterStart && filterEnd) return bookingStart <= filterEnd;
      return (bookingStart <= filterEnd) && (bookingEnd >= filterStart);
    });
    setFilteredBookings(results);
  }, [fromDate, toDate, allBookings]);

  // 3. Helper Functions
  const handleBookingPress = useCallback((item) => {
    router.push({
      pathname: "/(tabs)/my-rides/current-booking",
      params: { bikeId: item.id },
    });
  }, []);

  const formatBookingForCard = useCallback((booking) => {
    let badge = booking.condition || booking.status || "";
    if (badge === "Available") badge = "Available Now";
    
    const start = formatDate(booking.startDate);
    const end = formatDate(booking.endDate);

    return {
      id: booking.id,
      title: booking.title,
      subtitle: booking.type ? `${booking.type} E-BIKE`.toUpperCase() : "E-BIKE",
      price: booking.price,
      image: booking.image,
      rating: booking.rating,
      badgeText: badge.toUpperCase(),
      storeName: booking.supplier?.name,
      isVerified: booking.isVerified,
      location: booking.supplier?.location || "Sydney, AU",
      dateRange: `${start} to ${end}`,
      originalData: booking 
    };
  }, []);

  const activeRide = useMemo(() => {
    const ride = allBookings.find(b => b.status === "Active");
    return ride ? formatBookingForCard(ride) : null;
  }, [allBookings, formatBookingForCard]);

  const carouselData = useMemo(() => {
    const rawList = filteredBookings.filter(b => b.id !== activeRide?.id);
    return rawList.map(formatBookingForCard);
  }, [filteredBookings, activeRide, formatBookingForCard]);


  // --- MAIN RENDER ---
  const firstName = user?.name ? user.name.split(' ')[0] : "Rider";

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
           <BrandLogo />
        </View>

        {loading ? (
             <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color={Colors.primary} />
             </View>
        ) : (
             <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={(e) => {
                   if (e.nativeEvent.contentOffset.y > 30 && !hasScrolled) setHasScrolled(true);
                }}
                scrollEventThrottle={16}
             >
                  <Label variant="heading" style={styles.welcome}>
                    Welcome {firstName}
                  </Label>

                  {/* EMPTY STATE */}
                  {allBookings.length === 0 ? (
                    <View style={styles.zeroStateContainer}>
                      <View style={styles.zeroStateIconCircle}>
                        <Ionicons name="bicycle" size={60} color={Colors.primary} />
                      </View>
                      <Label variant="heading" style={styles.zeroStateTitle}>No Rides Yet</Label>
                      <Label variant="body" style={styles.zeroStateText}>
                        You haven't booked any e-bikes. Start your journey by finding the perfect ride near you.
                      </Label>
                      <Button
                        title="Find an E-Bike"
                        variant="primary"
                        onPress={() => router.push("/(tabs)/my-rides/booking-filter")}
                        style={styles.zeroStateButton}
                      />
                    </View>
                  ) : (
                    // DASHBOARD STATE
                    <View>
                        {/* HIGHLIGHT SECTION (Active Ride) */}
                        {activeRide && (
                            <View style={styles.highlightSection}>
                                <Card
                                    {...activeRide}
                                    variant="highlight"
                                    buttonTitle="Manage Ride"
                                    onBookPress={() => handleBookingPress(activeRide.originalData || activeRide)}
                                />
                            </View>
                        )}

                        {/* LIST SECTION (History) */}
                        <View style={styles.listSection}>
                            <View style={styles.sectionHeader}>
                                <Label variant="subheading" style={{ marginBottom: 4 }}>Your Booking History</Label>
                                {(fromDate || toDate) && (
                                    <Button 
                                        title="Clear Filter"
                                        variant="hyperlink"
                                        textSize={14}
                                        onPress={() => { setFromDate(null); setToDate(null); }}
                                        style={{ padding: 0 }} 
                                    />
                                )}
                            </View>

                            <View style={styles.filterRow}>
                                <View style={styles.column}>
                                    <DateRangePicker
                                        fromDate={fromDate}
                                        toDate={toDate}
                                        onFromChange={setFromDate}
                                        onToChange={setToDate}
                                    />
                                </View>
                            </View>

                            {carouselData.length > 0 ? (
                                <CardCarousel
                                    data={carouselData}
                                    actionLabel="View Booking"
                                    onBookPress={(item) => handleBookingPress(item.originalData || item)}
                                    flatListProps={{
                                        initialNumToRender: 2,
                                        maxToRenderPerBatch: 2,
                                        windowSize: 3,
                                        removeClippedSubviews: true,
                                    }}
                                />
                            ) : (
                                <View style={styles.filterEmptyState}>
                                    <Label style={styles.emptyText}>No bookings found for these dates.</Label>
                                </View>
                            )}
                        </View>
                        
                        <Button
                            title="Book a New E-Bike"
                            variant="primary"
                            onPress={() => router.push("/(tabs)/my-rides/booking-filter")}
                            style={styles.actionButton}
                        />
                        <View style={{ height: 40 }} />
                    </View>
                  )}
             </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.white },
  headerContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 5 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, flexGrow: 1 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { marginTop: 8, marginBottom: 20, color: Colors.black },
  
  zeroStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  zeroStateIconCircle: { 
      width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.surface, 
      alignItems: 'center', justifyContent: 'center', marginBottom: 20 
  },
  zeroStateTitle: { marginBottom: 10, textAlign: 'center' },
  zeroStateText: { textAlign: 'center', color: Colors.placeholderTextColor, paddingHorizontal: 40, marginBottom: 30, lineHeight: 22 },
  zeroStateButton: { width: '80%' },

  highlightSection: { marginBottom: 24 },
  listSection: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  filterRow: { flexDirection: "row", gap: 12, marginTop: 10, marginBottom: 10 },
  column: { flex: 1 },
  filterEmptyState: { height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12 },
  emptyText: { color: Colors.placeholderTextColor, fontSize: 14 },
  actionButton: { marginTop: 10, marginBottom: 10 }
});