import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import BrandLogo from "../../../components/BrandLogo";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import CardCarousel from "../../../components/CardCarousel";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";

import DateRangePicker from "../../../components/DateRangePicker";
import { AuthContext } from "../../../context/AuthContext";
import { bikeService } from "../../../services/bikeService";
import { Colors } from "../../../theme/colors"; // ✅ Import Colors

export default function RenterBookedBikesList() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [allBookings, setAllBookings] = useState([]); 
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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

  const handleClearDates = useCallback(() => {
    setFromDate(null);
    setToDate(null);
  }, []);

  const handleBookNewBike = useCallback(() => {
    router.push("/(tabs)/my-rides/booking-filter");
  }, []);

  const handleBookingPress = useCallback((item) => {
    router.push({
      pathname: "/(tabs)/my-rides/booked-ride-details",
      params: { 
        id: item.id,
        status: (item.status || 'active').toLowerCase(),
        title: item.title,
        price: item.price
      },
    });
  }, []);

  const formatBookingForCard = (booking) => {
    let badge = booking.condition || booking.status || "";
    if (badge === "Available") badge = "Available Now";
    
    return {
      id: booking.id,
      title: booking.title,
      subtitle: booking.type ? `${booking.type} E-BIKE`.toUpperCase() : "E-BIKE",
      price: booking.price,
      image: booking.image,
      rating: booking.rating,
      badgeText: badge.toUpperCase(),
      storeName: booking.supplier?.name,
      originalData: booking 
    };
  };

  const activeRide = useMemo(() => {
    const ride = allBookings.find(b => b.status === "Active");
    return ride ? formatBookingForCard(ride) : null;
  }, [allBookings]);

  const carouselData = useMemo(() => {
    const rawList = filteredBookings.filter(b => b.id !== activeRide?.id);
    return rawList.map(formatBookingForCard);
  }, [filteredBookings, activeRide]);

  return (
    <ScreenWrapper>
      <View style={styles.mainContainer}>
        
        <View style={styles.headerContainer}>
           <BrandLogo />
        </View>

        <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
        >
            <Label variant="heading" style={styles.welcome}>
              Welcome {user?.name?.split(' ')[0]}
            </Label>

            {!loading && activeRide && (
                <View style={styles.highlightSection}>
                    <Card
                        {...activeRide}
                        variant="highlight"
                        buttonTitle="View Ride"
                        onBookPress={() => handleBookingPress(activeRide.originalData || activeRide)}
                    />
                </View>
            )}

            <View style={styles.listSection}>
                <View style={styles.sectionHeader}>
                    <Label variant="subheading" style={{ marginBottom: 4 }}>
                        Your Booked E-Bikes
                    </Label>

                    {(fromDate || toDate) && (
                        <Button 
                            title="Clear Filter"
                            variant="hyperlink"
                            textSize={14}
                            onPress={handleClearDates}
                            style={{ padding: 0 }} 
                        />
                    )}
                </View>

                <View style={styles.filterRow}>
                  <View style={styles.column} testID="start-date-picker">
                    <DateRangePicker
                      fromLabel="From"
                      toLabel="To"
                      fromDate={fromDate}
                      toDate={toDate}
                      onFromChange={setFromDate}
                      onToChange={setToDate}
                    />
                  </View>
                </View>

                {loading ? (
                   <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
                ) : carouselData.length > 0 ? (
                   <CardCarousel
                     testID="bookings-carousel"
                     data={carouselData}
                     actionLabel="View Booking"
                     onBookPress={(item) => handleBookingPress(item.originalData || item)}
                   />
                ) : (
                   <View style={styles.emptyState}>
                     <Label style={styles.emptyText}>
                       {activeRide && !fromDate ? "No upcoming bookings." : "No bookings found for these dates."}
                     </Label>
                     {(fromDate || toDate) && (
                         <Button
                            title="View All"
                            variant="hyperlink"
                            textSize={14}
                            onPress={handleClearDates}
                            style={{ marginTop: 10 }}
                         />
                     )}
                   </View>
                )}
            </View>
            
            <View style={{ height: 20 }} /> 
        </ScrollView>

        <View style={styles.fixedFooter}>
            <Button
              title="Book a New E-Bike"
              testID="book-new-bike-button"
              variant="primary"
              onPress={handleBookNewBike}
              style={{ marginBottom: 0 }}
            />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: Colors.white, // ✅ Uses Colors
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  welcome: {
    marginTop: 8,
    marginBottom: 20,
    color: Colors.black, // ✅ Uses Colors
  },
  fixedFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4, 
    backgroundColor: Colors.white, // ✅ Uses Colors
    borderTopWidth: 1,
    borderTopColor: Colors.border, // ✅ Uses Colors
  },
  highlightSection: {
    marginBottom: 24,
  },
  listSection: {
    marginBottom: 10,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8, 
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  emptyState: { 
    height: 120, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.surface, // ✅ Uses Colors
    borderRadius: 12,
    marginTop: 10,
  },
  emptyText: {
    color: Colors.placeholderTextColor, // ✅ Uses Colors
    fontSize: 14,
  }
});