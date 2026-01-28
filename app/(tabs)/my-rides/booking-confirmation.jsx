import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Checkbox from "expo-checkbox";

import ScreenWrapper from "../../../components/ScreenWrapper";
import Label from "../../../components/Label";
import VerifiedBadge from "../../../components/VerifiedBadge";
import Button from "../../../components/Button";

export default function RenterBookingConfirmation() {
  const router = useRouter();
  const { title, price, start, end } = useLocalSearchParams();

  const [insuranceAccepted, setInsuranceAccepted] = useState(false);

  const handleBook = () => {
    if (!insuranceAccepted) {
      Alert.alert(
        "Insurance Required",
        "You must purchase mandatory insurance to continue."
      );
      return;
    }

    Alert.alert(
      "Booking Confirmed!",
      "Your bike has been successfully booked.",
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/my-rides"),
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Bike Info */}
        <Label style={styles.title}>{title}</Label>

        <View style={styles.row}>
          <Label style={styles.price}>${price}</Label>
          {typeof VerifiedBadge === "string" ? (
            <Text>{VerifiedBadge}</Text>
          ) : (
            <VerifiedBadge />
          )}
        </View>

        <Label style={styles.date}>Start: {start}</Label>
        <Label style={styles.date}>End: {end}</Label>

        {/* Owner Profile */}
        <Pressable
          onPress={() => router.push("owner-profile-modal")}
        >
          <Label style={styles.link}>View Owner's Profile</Label>
        </Pressable>

        {/* Insurance Section */}
        <View style={styles.insuranceBox}>
          <Label style={styles.insuranceTitle}>
            Insurance Requirements
          </Label>

          <Label style={styles.insuranceText}>
            Insurance protects you from accidental damage, theft, or
            third-party liability during your rental.
            <Text
              style={styles.learnMore}
              onPress={() => router.push("insurance-info-modal")}
            >
              {" "}Learn more
            </Text>
          </Label>

          <View style={styles.checkboxRow}>
            <Checkbox
              value={insuranceAccepted}
              onValueChange={setInsuranceAccepted}
            />
            <Label style={styles.checkboxText}>
              Purchase mandatory insurance
            </Label>
          </View>
        </View>

        {/* Book Button */}
        <Button
          title="Book"
          testID="book-button"
          style={styles.bookButton}
          onPress={handleBook}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    marginTop: 10,
    marginBottom: 16,
    color: "#7C2AE8",
    fontWeight: "600",
  },
  insuranceBox: {
    backgroundColor: "#F6E9FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  insuranceTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  insuranceText: {
    fontSize: 13,
    lineHeight: 18,
  },
  learnMore: {
    color: "#7C2AE8",
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
  },
  bookButton: {
    marginTop: 12,
  },
});