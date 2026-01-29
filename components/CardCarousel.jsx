import { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Card from "./Card";
import Label from "./Label";

// Dimensions matches Card.jsx style (280 width + 12 margin)
const CARD_WIDTH = 280;
const CARD_MARGIN = 12;
const TOTAL_ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

function CardCarousel({
  data = [],
  title,
  onBookPress,
  actionLabel = "Book Ride",
  testID,
  flatListProps // 👈 1. Accept this prop to allow parent control
}) {
  if (!data || data.length === 0) {
    return null;
  }

  // 2. Optimized renderItem
  const renderItem = useCallback(({ item }) => {
    return (
      <Card
        {...item} 
        variant="standard"
        buttonTitle={actionLabel}
        // ⚠️ Optimization: Pass the ID or Item to the parent handler later 
        // instead of creating an arrow function here if possible.
        // For now, this is okay provided 'Card' uses a smart memo check.
        onBookPress={() => onBookPress?.(item)}
      />
    );
  }, [onBookPress, actionLabel]);

  // 3. Exact Layout Calculation (Crucial for performance)
  const getItemLayout = useCallback((_, index) => ({
    length: TOTAL_ITEM_WIDTH,
    offset: TOTAL_ITEM_WIDTH * index,
    index,
  }), []);

  return (
    <View style={styles.container} testID={testID}>
      {title && <Label style={styles.title}>{title}</Label>}

      <FlatList
        data={data}
        horizontal
        // Ensure ID is a string to avoid warnings
        keyExtractor={(item) => String(item.id)} 
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        
        // 4. Spread parent optimizations first, then fallback to safe defaults
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true} 
        {...flatListProps} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    // 5. ⚠️ FIXED HEIGHT: Helping 'removeClippedSubviews' work correctly
    // Card height (approx 300) + Padding (10) + Title (approx 30)
    height: 380, 
  },
  title: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4, 
  },
  list: {
    paddingRight: 16, 
    paddingBottom: 10, 
  },
});

export default memo(CardCarousel);