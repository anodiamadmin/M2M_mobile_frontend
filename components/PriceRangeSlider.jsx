import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import Label from "./Label";
import { Colors } from "../theme/colors";

export default function PriceRangeSlider({
  min = 0,
  max = 500,
  value = min,
  step = 1,
  onValueChange,
  testID,
}) {
  return (
    <View style={styles.container} testID={testID} onValueChange={onValueChange}>
      <View style={styles.header}>
        <Label variant="label">Price range (per week)</Label>
        <Label color={Colors.primary} style={styles.value}>
          ${value}
        </Label>
      </View>

      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.tabInactive}
        thumbTintColor={Colors.primary}
        onValueChange={onValueChange}
      />

      <View style={styles.labels}>
        <Label secondary>${min}</Label>
        <Label secondary>${max}</Label>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  value: {
    fontWeight: "600",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 4,
  },
});

