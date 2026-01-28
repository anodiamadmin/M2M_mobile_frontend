import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import BrandLogo from "@components/BrandLogo";
import Button from "@components/Button";
import Label from "@components/Label";
import ScreenWrapper from "@components/ScreenWrapper";

import DateRangePicker from "@components/DateRangePicker";
import Dropdown from "@components/Dropdown";
import LocationSelector from "@components/LocationSelector";
import PriceRangeSlider from "@components/PriceRangeSlider";

import { AuthContext } from "../../../context/AuthContext";
import { Colors } from "../../../theme/colors";

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

    router.push("/my-rides/booking-bike-details");
  };

  const handleMyBookings = () => {
    router.push("/my-rides");
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BrandLogo />

        <Label variant='heading' color= {Colors.primary}>
          Welcome {user?.name}
        </Label>

        <Label variant='subheading' bold={false}>
          Book an E-Bike
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

        {/* ---- PRICE RANGE ---- */}
        <PriceRangeSlider
          testID="price-slider"
          value={price}
          onValueChange={setPrice}
        />

        {/* ---- CATEGORY ---- */}
        <Label style={styles.section}></Label>
        <Dropdown
          testID="category-dropdown"
          label="Category"
          options={CATEGORY_OPTIONS}
          value={category}
          onSelect={setCategory}
        />

        {/* ---- LOCATION ---- */}
        <Label style={styles.section}></Label>
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

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },  
  section: {
    marginTop: -6,
    marginBottom: -6,
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
