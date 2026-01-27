import { useContext, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenWrapper from "@components/ScreenWrapper";
import BrandLogo from "@components/BrandLogo";
import Label from "@components/Label";
import Button from "@components/Button";

import DatePicker from "@components/DatePicker";
import PriceRangeSlider from "@components/PriceRangeSlider";
import Dropdown from "@components/Dropdown";
import LocationSelector from "@components/LocationSelector";

import { AuthContext } from "../../../context/AuthContext";

const CATEGORY_OPTIONS = ["Road", "Mountain", "Hybrid", "Electric"];

export default function RenterBookingFilter() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // ---- STATE ----
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);

  // ---- ACTIONS ----
  const handleContinue = () => {
    if (!fromDate || !toDate || !category || !location) {
      Alert.alert(
        "Missing Details",
        "Please fill all fields before continuing"
      );
      return;
    }

    router.push("/my-rides/bike-details");
  };

  const handleMyBookings = () => {
    router.push("/my-rides/booked-bikes");
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BrandLogo />

        <Label size={24} bold style={styles.welcome}>
          Welcome {user?.name}
        </Label>

        <Label size={20} bold style={styles.heading}>
          Book an E-Bike
        </Label>

        {/* ---- DATE RANGE ---- */}
        <View style={styles.row}>
          <View style={styles.column} testID="start-date-picker">
            <DatePicker
              label="From"
              value={fromDate}
              onChange={setFromDate}
            />
          </View>

          <View style={styles.column} testID="end-date-picker">
            <DatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
            />
          </View>
        </View>

        {/* ---- PRICE RANGE ---- */}
        <Label style={styles.section}>Price range (per week)</Label>
        <PriceRangeSlider
          testID="price-slider"
          value={price}
          onValueChange={setPrice}
        />

        {/* ---- CATEGORY ---- */}
        <Label style={styles.section}>Category</Label>
        <Dropdown
          testID="category-dropdown"
          options={CATEGORY_OPTIONS}
          value={category}
          onSelect={setCategory}
        />

        {/* ---- LOCATION ---- */}
        <Label style={styles.section}>Pickup Location</Label>
        <LocationSelector
          testID="location-selector"
          value={location}
          onLocationSelected={setLocation}
        />

        {/* ---- ACTION BUTTONS ---- */}
        <Button
          testID="continue-button"
          title="Continue"
          variant="primary"
          onPress={handleContinue}
        />

        <Button
          testID="my-bookings-button"
          title="Visit My Bookings"
          variant="secondary"
          onPress={handleMyBookings}
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
    marginTop: 16,
  },
  heading: {
    marginVertical: 12,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
});
