import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import BrandLogo from "../../../components/BrandLogo";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Label from "../../../components/Label";
import ScreenWrapper from "../../../components/ScreenWrapper";
import ScrollHint from "../../../components/ScrollHint"; // ✅ Imported modular component
import { bikeService } from "../../../services/bikeService";
import { Colors } from "../../../theme/colors";

export default function RenterBikeDetails() {
  const router = useRouter();
  const { from, to, category, location, maxPrice } = useLocalSearchParams();

  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false); // ✅ Added scroll state

  // 1. Fetch Data from Service
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const data = await bikeService.getAvailableBikes();
        setBikes(data);
      } catch (error) {
        console.error("Failed to load bikes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  // 2. Filter & Sort Logic
  const sortedBikes = useMemo(() => {
    const filtered = bikes.filter(bike => {
      if (location) {
        const bikeLoc = bike.supplier?.location?.toLowerCase() || "";
        if (!bikeLoc.includes(location.toLowerCase())) return false;
      }
      if (category && bike.type?.toLowerCase() !== category.toLowerCase()) return false;
      if (maxPrice && bike.price > parseFloat(maxPrice)) return false;
      return true;
    });
    return [...filtered].sort((a, b) => a.price - b.price);
  }, [bikes, location, category, maxPrice]);

  const highlightBike = sortedBikes.length > 0 ? sortedBikes[0] : null;
  const similarBikes = sortedBikes.length > 1 ? sortedBikes.slice(1) : [];

  const handleBookPress = (bike) => {
    router.push({
      pathname: "/(tabs)/my-rides/booking-confirmation",
      params: { 
        bikeId: bike.id,
        from, 
        to, 
        price: bike.price 
      },
    });
  };

  // ✅ 3. Detect Scroll in FlatList
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 30 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  return (
    // ✅ Apply surgical override for Tab Navigation
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.headerSpacing}>
            <BrandLogo />
        </View>

        <View style={styles.titleContainer}>
            <Label variant="heading" style={styles.headerText}>
                Top Picks for You
            </Label>
            {location && (
                <Label variant="caption" style={styles.subHeader}>
                    in {location}
                </Label>
            )}
        </View>

        {loading ? (
             <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={similarBikes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                onScroll={handleScroll} // ✅ Listen for scroll
                scrollEventThrottle={16}
                
                ListHeaderComponent={
                    highlightBike ? (
                    <View style={styles.highlightWrapper}>
                        <Card
                            variant="highlight"
                            title={highlightBike.title}
                            type={highlightBike.type} 
                            price={highlightBike.price}
                            image={highlightBike.image}
                            rating={highlightBike.rating}
                            badgeText={highlightBike.status?.toUpperCase()}
                            storeName={highlightBike.supplier?.name}
                            buttonTitle="Book This E-Bike"
                            onBookPress={() => handleBookPress(highlightBike)}
                        />
                        
                        {similarBikes.length > 0 && (
                            <Label variant="subheading" style={styles.similarTitle}>Similar E-Bikes</Label>
                        )}
                    </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No bikes found matching your criteria.</Text>
                            <Button 
                                title="Adjust Filters" 
                                variant="secondary" 
                                onPress={() => router.back()} 
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    )
                }

                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <Card
                            variant="standard"
                            title={item.title}
                            type={item.type}
                            price={item.price}
                            image={item.image}
                            rating={item.rating}
                            badgeText={item.status?.toUpperCase()}
                            storeName={item.supplier?.name}
                            buttonTitle="Book"
                            onBookPress={() => handleBookPress(item)}
                        />
                    </View>
                )}
              />

              {/* ✅ Show Hint only if there is "Similar" content and user hasn't scrolled yet */}
              <ScrollHint visible={!hasScrolled && similarBikes.length > 0} />
            </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSpacing: {
    marginTop: 10,
    marginBottom: 5,
  },
  titleContainer: {
    marginBottom: 16,
  },
  headerText: {
    color: Colors.black,
  },
  subHeader: {
    color: Colors.placeholderTextColor,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 80, // ✅ Extra padding for ScrollHint and TabBar clearance
  },
  highlightWrapper: {
    marginBottom: 24,
  },
  similarTitle: {
    marginTop: 10,
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 16,
    alignItems: 'center', 
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.placeholderTextColor,
    textAlign: 'center',
  }
});