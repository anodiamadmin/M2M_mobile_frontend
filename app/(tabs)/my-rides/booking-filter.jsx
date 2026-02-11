import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import BrandLogo from "../../../components/BrandLogo";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ScrollHint from "../../../components/ScrollHint";

import DateRangePicker from "../../../components/DateRangePicker";
import Dropdown from "../../../components/Dropdown";
import LocationSelector from "../../../components/LocationSelector";
import PriceRangeSlider from "../../../components/PriceRangeSlider";

import { AuthContext } from "../../../context/AuthContext";
import { BikeType } from "../../../services/mockBikeData";
import { Colors } from "../../../theme/colors";

const CATEGORY_OPTIONS = Object.values(BikeType);

export default function RenterBookingFilter() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [price, setPrice] = useState(100);
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleContinue = () => {
    if (!fromDate || !toDate || !category || !location) {
      Alert.alert("Missing Details", "Please fill all fields before continuing");
      return;
    }

    router.push({
      pathname: "/(tabs)/my-rides/booking-bike-details",
      params: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        category,
        location,
        maxPrice: price
      }
    });
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 20 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  // ✅ Safety: Handle null user
  const firstName = user?.name ? user.name.split(' ')[0] : "Rider";

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <BrandLogo />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.welcomeSection}>
            <Label variant="heading" secondary style={styles.welcome}>
              Welcome {firstName}
            </Label>
            <Label variant="body" secondary color={Colors.placeholderTextColor}>
              Set your preferences to find the perfect ride.
            </Label>
          </View>

          <View style={styles.filterSection}>
            <DateRangePicker
              fromLabel="From"
              toLabel="To"
              fromDate={fromDate}
              toDate={toDate}
              onFromChange={setFromDate}
              onToChange={setToDate}
            />

            <PriceRangeSlider
              value={price}
              onValueChange={setPrice}
            />

            <Dropdown
              label="Category"
              options={CATEGORY_OPTIONS}
              value={category}
              onSelect={setCategory}
            />

            <LocationSelector
              value={location}
              onLocationSelected={setLocation}
            />
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Continue"
              variant="primary"
              onPress={handleContinue}
            />

            <Button
              title="Visit My Bookings"
              variant="secondary"
              onPress={() => router.push("/(tabs)/my-rides")}
            />
          </View>
        </ScrollView>

        <ScrollHint visible={!hasScrolled} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 5 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  welcomeSection: { marginTop: 10, marginBottom: 20 },
  welcome: { marginBottom: 4 },
  filterSection: { gap: 20 },
  actionButtons: { marginTop: 30, gap: 12 }
});