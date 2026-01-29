import { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Card from "./Card";
import Label from "./Label";

const CARD_WIDTH = 280;
const CARD_MARGIN = 12;
const TOTAL_ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

function CardCarousel({
  data = [],
  title,
  onBookPress,
  actionLabel = "Book Ride",
  testID
}) {
  if (!data || data.length === 0) {
    return null;
  }

  const renderItem = useCallback(({ item }) => {
    // ✅ No logic here. It assumes 'item' is already formatted correctly.
    return (
      <Card
        {...item} // Spreads title, subtitle, badgeText, image, price, etc.
        variant="standard"
        buttonTitle={actionLabel}
        onBookPress={() => onBookPress?.(item)}
      />
    );
  }, [onBookPress, actionLabel]);

  const getItemLayout = useCallback((data, index) => ({
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={true} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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