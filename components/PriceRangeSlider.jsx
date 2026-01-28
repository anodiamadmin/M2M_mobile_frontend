import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import Label from "./Label";
import { Colors } from "../theme/colors";

export default function PriceRangeSlider({
  min = 30,
  max = 500,
  value,
  step = 1,
  onValueChange,
  testID,
}) {
  return (
    <View
      style={styles.container}
      testID={testID}
      onValueChange={onValueChange}
    >
      {/* Header */}
      <View style={styles.header}>
        <Label variant="label">Price range (per week)</Label>
      </View>

      {/* Slider */}
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value ?? min}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.tabInactive}
        thumbTintColor={Colors.primary}
        onValueChange={onValueChange}
      />

      {/* Min / Max Labels */}
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
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
