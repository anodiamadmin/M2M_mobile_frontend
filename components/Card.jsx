import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import Button from "./Button";
import Label from "./Label";
import VerifiedBadge from "./VerifiedBadge"; // ✅ Component integration

// ✅ STRICT COLOR MAPPING for Status Badges
const getBadgeColor = (text) => {
  if (!text) return Colors.primary;
  const t = text.toLowerCase();
  
  if (t.includes("mint") || t.includes("active")) return Colors.success; 
  if (t.includes("excellent")) return Colors.secondary; 
  if (t.includes("like new")) return Colors.secondary; 
  if (t.includes("upcoming")) return Colors.primary; 
  
  return Colors.primary;
};

function Card({
  title,
  subtitle,   
  price,
  image,
  badgeText,
  rating,
  storeName,
  isVerified, // ✅ Passed from MOCK_BIKES data via screen
  onBookPress,
  buttonTitle = "Book Ride",
  variant = "standard",
  testID,
}) {
  const badgeColor = getBadgeColor(badgeText);
  const isHighlight = variant === "highlight";

  return (
    <View 
      testID={testID} 
      style={[
        styles.card, 
        isHighlight ? styles.cardHighlight : styles.cardStandard
      ]}
    >
      {/* --- IMAGE SECTION --- */}
      <View style={[
          styles.imageContainer, 
          { height: isHighlight ? 180 : 150 } 
        ]}>
        <View style={styles.imageBackground}>
            {image && (
                <Image source={image} style={styles.image} resizeMode="cover" />
            )}
        </View>
        
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>

      {/* --- CONTENT SECTION --- */}
      <View style={[styles.content, isHighlight && styles.contentHighlight]}>
        
        {/* Title & Rating */}
        <View style={styles.headerRow}>
            <Label style={[styles.title, isHighlight && styles.titleHighlight]} numberOfLines={1}>
                {title}
            </Label>
            {rating && (
                <View style={styles.ratingTag}>
                    <Ionicons name="star" size={12} color={Colors.primary} /> 
                    <Label style={styles.ratingText}>{rating}</Label>
                </View>
            )}
        </View>

        {/* Category Label */}
        <Label style={styles.subtitle} numberOfLines={1}>{subtitle}</Label>

        {/* ✅ UPDATED STORE ROW: Integrated VerifiedBadge */}
        {storeName && (
          <View style={styles.storeRow}>
            <View style={styles.storeInfo}>
                <Ionicons name="business" size={14} color={Colors.placeholderTextColor} />
                <Label style={styles.storeText} numberOfLines={1}>
                  {storeName}
                </Label>
            </View>
            
            {/* Logic is inside VerifiedBadge: it returns null if isVerified is false */}
            <VerifiedBadge 
                isVerified={isVerified} 
                type="supplier" 
                size="small" 
                showText={true} 
                style={styles.badgeOverride}
            />
          </View>
        )}

        {/* Footer: Price & Action */}
        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.priceText, { fontSize: isHighlight ? 24 : 20 }]}>
              ${price} <Text style={styles.perWeekText}>/week</Text>
            </Text>
          </View>
          
          <Button 
            title={buttonTitle}
            onPress={onBookPress}
            textSize={13} 
            variant="primary" 
            style={isHighlight ? styles.customButtonHighlight : styles.customButton} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.black,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  cardStandard: {
    width: 280, 
    marginRight: 12,
    marginBottom: 16,
  },
  cardHighlight: {
    width: "100%", 
    marginBottom: 24,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: "100%",
    position: 'relative',
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2C2C2C",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 14,
  },
  contentHighlight: {
    padding: 16, 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    flex: 1,
    marginRight: 8,
  },
  titleHighlight: {
    fontSize: 20, 
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.placeholderTextColor,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes Badge to the right
    marginBottom: 16, 
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allows store name to take available space
  },
  storeText: {
    fontSize: 12,
    color: Colors.placeholderTextColor,
    marginLeft: 6,
    marginRight: 8,
  },
  badgeOverride: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  perWeekText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.placeholderTextColor,
  },
  customButton: {
    width: 'auto',          
    height: 38,             
    paddingHorizontal: 20,  
    marginVertical: 0,
  },
  customButtonHighlight: {
    width: 'auto',
    height: 44, 
    paddingHorizontal: 24,
    marginVertical: 0,
  }
});

export default memo(Card);