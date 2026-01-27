import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import DatePicker from "./DatePicker";

export default function DateRangePicker({
  fromLabel = "From",
  toLabel = "To",
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  minDate = new Date(),
}) {
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");

  useEffect(() => {
    // Reset To date if From becomes invalid
    if (fromDate && toDate && fromDate >= toDate) {
      onToChange(null);
    }
  }, [fromDate]);

  const handleFromChange = (date) => {
    setFromError("");
    setToError("");
    onFromChange(date);
  };

  const handleToChange = (date) => {
    if (!fromDate) {
      setToError("Select From date first");
      return;
    }

    if (date <= fromDate) {
      setToError("To date must be after From date");
      return;
    }

    setToError("");
    onToChange(date);
  };

  const minToDate = fromDate
    ? new Date(fromDate.getTime() + 24 * 60 * 60 * 1000)
    : minDate;

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <DatePicker
          label={fromLabel}
          value={fromDate}
          minDate={minDate}
          onChange={handleFromChange}
          error={fromError}
        />
      </View>

      <View style={styles.column}>
        <DatePicker
          label={toLabel}
          value={toDate}
          minDate={minToDate}
          onChange={handleToChange}
          error={toError}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
});
