import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenWrapper from "../../../components/ScreenWrapper";
import BrandLogo from "../../../components/BrandLogo";
import Label from "../../../components/Label";
import DatePicker from "../../../components/DatePicker";
import CardCarousel from "../../../components/CardCarousel";
import Button from "../../../components/Button";

import { AuthContext } from "../../../context/AuthContext";

// --- MOCKED BOOKING DATA (used by tests) ---
const BOOKINGS = [
  {
    id: "1",
    title: "Sam's E-Bike",
  },
  {
    id: "2",
    title: "Bruna A1 Cargo",
  },
];

export default function RenterBookedBikesList() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleBookNewBike = () => {
    router.push("booking-filter");
  };

  const handleBookingPress = (item) => {
    router.push({
      pathname: "booked-ride-details",
      params: { id: item.id },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BrandLogo />

        {/* Welcome Header */}
        <Label style={styles.welcome}>
          Welcome {user?.name}
        </Label>

        <Label style={styles.heading}>
          Your Bookings
        </Label>

        {/* Date Filters */}
        <View style={styles.filters}>
          <DatePicker label="From" testID="from-date-picker" />
          <DatePicker label="To" testID="to-date-picker" />
        </View>

        {/* Bookings Carousel */}
        <CardCarousel
          testID="bookings-carousel"
          title="Your Booked Bikes"
          data={BOOKINGS}
          onItemPress={handleBookingPress}
        />

        {/* CTA */}
        <Button
          title="Book a Bike"
          testID="book-new-bike-button"
          variant="primary"
          onPress={handleBookNewBike}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
