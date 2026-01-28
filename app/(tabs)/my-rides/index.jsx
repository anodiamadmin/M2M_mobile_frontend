import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import ScreenWrapper from "../../../components/ScreenWrapper";
import BrandLogo from "../../../components/BrandLogo";
import Label from "../../../components/Label";
import CardCarousel from "../../../components/CardCarousel";
import Button from "../../../components/Button";

import { AuthContext } from "../../../context/AuthContext";
import DateRangePicker from "@components/DateRangePicker";



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

  // ---- STATE ----
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const handleBookNewBike = () => {
    router.push("/my-rides/booking-filter");
  };

  const handleBookingPress = (item) => {
    router.push({
      pathname: "/my-rides/booking-bike-details",
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

        {/* ---- DATE RANGE ---- */}
        <View style={styles.row}>
          <View style={styles.column} testID="start-date-picker">
            {/* ---- DATE RANGE ---- */}
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

        {/* Bookings Carousel */}
        <CardCarousel
          testID="bookings-carousel"
          title="Your Booked Bikes"
          data={BOOKINGS}
          onItemPress={handleBookingPress}
        />

        {/* CTA */}
        <Button
          title="Book a New E-Bike"
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10
  },
  column: {
    flex: 1,
  },
});
