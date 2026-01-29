import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
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
  onBookPress,
  onSupplierPress, // ✅ New prop for modal trigger
  buttonTitle,     // ✅ Now optional
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
      <View style={[styles.imageContainer, { height: isHighlight ? 180 : 150 }]}>
        <View style={styles.imageBackground}>
            {image && <Image source={image} style={styles.image} resizeMode="cover" />}
        </View>
        
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={[styles.content, isHighlight && styles.contentHighlight]}>
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

        <Label style={styles.subtitle} numberOfLines={1}>{subtitle}</Label>

        {/* Store Row: Now Pressable for the "About Supplier" modal */}
        {storeName && (
          <View style={styles.storeRow}>
            <Pressable 
              onPress={onSupplierPress} 
              style={({ pressed }) => [styles.storeInfo, { opacity: pressed ? 0.7 : 1 }]}
            >
                <Ionicons name="business" size={14} color={Colors.placeholderTextColor} />
                <Label style={styles.storeText} numberOfLines={1}>
                  {storeName}
                </Label>
            </Pressable>
            
            <VerifiedBadge 
                isVerified={isVerified} 
                size="small" 
                style={styles.badgeOverride}
            />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.priceText, { fontSize: isHighlight ? 24 : 20 }]}>
              ${price} <Text style={styles.perWeekText}>/week</Text>
            </Text>
          </View>
          
          {/* ✅ FIXED: Only renders if buttonTitle is provided */}
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
  badge: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  content: { padding: 14 },
  contentHighlight: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: "700", color: Colors.white, flex: 1, marginRight: 8 },
  titleHighlight: { fontSize: 20 },
  ratingTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  ratingText: { color: Colors.white, fontSize: 12, fontWeight: '700', marginLeft: 4 },
  subtitle: { fontSize: 11, color: Colors.placeholderTextColor, textTransform: 'uppercase', fontWeight: '600', marginBottom: 8 },
  storeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  storeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  storeText: { fontSize: 12, color: Colors.placeholderTextColor, marginLeft: 6, marginRight: 8 },
  badgeOverride: { paddingVertical: 2, paddingHorizontal: 6 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontWeight: '700', color: Colors.primary },
  perWeekText: { fontSize: 12, fontWeight: '400', color: Colors.placeholderTextColor },
  customButton: { width: 'auto', height: 38, paddingHorizontal: 20 },
  customButtonHighlight: { width: 'auto', height: 44, paddingHorizontal: 24 }
});

export default memo(Card);