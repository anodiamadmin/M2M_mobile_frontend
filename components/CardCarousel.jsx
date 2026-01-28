import { View, StyleSheet, FlatList } from "react-native";
import Card from "./Card";
import Label from "./Label";

export default function CardCarousel({
  data = [],
  title,
  cardVariant = "default",
  onItemPress,
}) {
  // ✅ Required for test: render nothing
  if (!data || data.length === 0) {
    return null;
  }

  const renderItem = ({ item }) => (
    <Card
      title={item.title}
      variant={cardVariant}
      onPress={() => onItemPress?.(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Optional Section Title */}
      {title && <Label style={styles.title}>{title}</Label>}

      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    paddingVertical: 4,
    gap: 12,
  },
});
