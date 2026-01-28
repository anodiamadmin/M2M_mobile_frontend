import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import ScreenWrapper from "../../../components/ScreenWrapper";
import Label from "../../../components/Label";
import Button from "../../../components/Button";
import Card from "../../../components/Card";

export default function RenterBikeDetails() {
  const router = useRouter();
  const { start, end, loc } = useLocalSearchParams();

  // --- Mocked Data (driven by test expectations) ---
  const highlightBike = {
    id: "1",
    title: "Sam's E-Bike",
    price: 136,
    isVerified: true,
    isCheapest: true,
  };

  const similarBikes = [
    {
      id: "2",
      title: "Urban Rider",
      price: 120,
      isVerified: false,
    },
    {
      id: "3",
      title: "Cargo Plus",
      price: 150,
      isVerified: true,
    },
  ];

  const handleBookNow = () => {
    router.push({
      pathname: "/my-rides/booking-confirmation",
      params: {
        start,
        end,
        loc,
      },
    });
  };

  const handleSimilarPress = (bike) => {
    router.push({
      pathname: "/my-rides/booking-confirmation",
      params: { id: bike.id },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <Label style={styles.header}>
          Top Pick for You
        </Label>
        <Label style={styles.subHeader}>
          {loc}
        </Label>

        {/* Highlight Bike Card */}
        <View style={styles.highlightWrapper}>
          <Card
            testID="highlight-bike-card"
            title={highlightBike.title}
            price={highlightBike.price}
            isVerified={highlightBike.isVerified}
            variant="highlightBikeCard"
            onPress={() => {}}
          />

          {highlightBike.isCheapest && (
            <Label style={styles.cheapestTag}>Cheapest</Label>
          )}
        </View>

        {/* Book CTA */}
        <Button
          title="Book This E-Bike"
          testID="book-now-button"
          variant="primary"
          onPress={handleBookNow}
        />

        {/* Similar Bikes */}
        <Label style={styles.similarTitle}>
          Similar E-Bikes
        </Label>

        <FlatList
          testID="similar-bikes-list"
          data={similarBikes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              testID="similar-bike-card"
              title={item.title}
              price={item.price}
              isVerified={item.isVerified}
              variant="default"
              onPress={() => handleSimilarPress(item)}
            />
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  highlightWrapper: {
    marginBottom: 16,
  },
  cheapestTag: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#EDE3FF",
    color: "#6C2AE8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  similarTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
  },
});
