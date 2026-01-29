import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Fonts } from "../theme/fonts";
import Button from "./Button";
import Label from "./Label";
import VerifiedBadge from "./VerifiedBadge";

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
  isVerified,
  location,
  dateRange,
  onBookPress,
  onSupplierPress, 
  buttonTitle,     
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
      {/* Image Section */}
      <View style={[styles.imageContainer, { height: isHighlight ? 180 : 140 }]}>
        <View style={styles.imageBackground}>
            {image && <Image source={image} style={styles.image} resizeMode="cover" />}
        </View>
        
        {/* Status Badge (Top Left) */}
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}

        {/* Verified Badge (Top Right) */}
        <View style={styles.verifiedBadgeContainer}>
            <VerifiedBadge 
                isVerified={isVerified} 
                size="small" 
            />
        </View>
      </View>

      {/* Content Section */}
      <View style={[styles.content, isHighlight && styles.contentHighlight]}>
        
        {/* 1. Header (Title + Star) */}
        <View style={styles.headerRow}>
            {/* ✅ Switched to secondaryBold (Lato-Bold) */}
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

        {/* 2. Meta Container (Type, Location, Date, Store) */}
        <View style={styles.metaContainer}>
            
            {/* A. Bike Type */}
            <View style={styles.iconRow}>
                <Ionicons name="bicycle" size={14} color={Colors.placeholderTextColor} />
                <Label style={styles.subtitle} numberOfLines={1}>{subtitle}</Label>
            </View>

            {/* B. Location */}
            {location && (
              <View style={styles.iconRow}>
                <Ionicons name="location-sharp" size={14} color={Colors.placeholderTextColor} />
                <Label style={styles.metaText} numberOfLines={1}>{location}</Label>
              </View>
            )}

            {/* C. Date Range */}
            {dateRange && (
              <View style={styles.iconRow}>
                <Ionicons name="calendar-clear-outline" size={14} color={Colors.placeholderTextColor} />
                <Label style={styles.metaText} numberOfLines={1}>{dateRange}</Label>
              </View>
            )}

            {/* D. Store Name */}
            {storeName && (
              <View style={styles.storeRow}>
                  <Ionicons name="business" size={14} color={Colors.placeholderTextColor} />
                  <Label style={styles.storeText} numberOfLines={1}>
                    {storeName}
                  </Label>
              </View>
            )}
        </View>

        {/* 3. Footer */}
        <View style={styles.footerRow}>
          <View>
            {/* ✅ Switched to secondaryBold (Lato-Bold) */}
            <Text style={[styles.priceText, { fontSize: isHighlight ? 24 : 20 }]}>
              ${price} <Text style={styles.perWeekText}>/week</Text>
            </Text>
          </View>
          
          {buttonTitle ? (
            <Button 
              title={buttonTitle}
              onPress={onBookPress}
              textSize={13} 
              variant="primary" 
              style={isHighlight ? styles.customButtonHighlight : styles.customButton} 
            />
          ) : null}
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
  cardStandard: { width: 280, marginRight: 12, marginBottom: 16 },
  cardHighlight: { width: "100%", marginBottom: 24, borderColor: Colors.border },
  
  imageContainer: { width: "100%", position: 'relative' },
  imageBackground: { width: "100%", height: "100%", backgroundColor: "#2C2C2C" },
  image: { width: "100%", height: "100%" },
  
  // Status Badge
  badge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, zIndex: 10 },
  badgeText: { 
    color: Colors.white, 
    fontSize: 10, 
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    textTransform: 'uppercase' 
  },
  
  // Verified Badge
  verifiedBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },

  content: { padding: 14 },
  contentHighlight: { padding: 16 },
  
  // Header Row
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  
  title: { 
    fontSize: 18, 
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    color: Colors.white, 
    flex: 1, 
    marginRight: 8 
  },
  titleHighlight: { fontSize: 20 },
  
  ratingTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  
  ratingText: { 
    color: Colors.white, 
    fontSize: 12, 
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    marginLeft: 4 
  },
  
  metaContainer: {
    gap: 6, 
    marginBottom: 16,
    marginTop: 4,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16, 
  },
  
  subtitle: { 
    fontSize: 10, 
    color: Colors.placeholderTextColor, 
    textTransform: 'uppercase', 
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    marginLeft: 6, 
    letterSpacing: 0.5 
  },
  
  metaText: {
    fontSize: 10,
    color: Colors.placeholderTextColor,
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    marginLeft: 6,
    letterSpacing: 0.5
  },

  storeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 16, 
  },
  
  storeText: { 
    fontSize: 10, 
    color: Colors.placeholderTextColor, 
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    letterSpacing: 0.5,     
    marginLeft: 6 
  },
  
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  priceText: { 
    fontFamily: Fonts.secondaryBold, // ✅ Lato-Bold
    color: Colors.primary 
  },
  perWeekText: { 
    fontSize: 12, 
    fontFamily: Fonts.secondary, // ✅ Lato-Regular
    color: Colors.placeholderTextColor 
  },
  
  customButton: { width: 'auto', height: 38, paddingHorizontal: 20 },
  customButtonHighlight: { width: 'auto', height: 44, paddingHorizontal: 24 }
});

export default memo(Card);