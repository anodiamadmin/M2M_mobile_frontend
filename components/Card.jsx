import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Label from "./Label";
import VerifiedBadge from "./VerifiedBadge";
import { Colors } from "../theme/colors";

export default function Card({
  title,
  subtitle,
  meta,
  location,
  image,
  status,
  isVerified,
  variant = "default",
  onPress,
  testID,
}) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      testID={testID}
      onPress={onPress}
      style={[
        styles.card,
        variant === "highlight" && styles.highlightCard,
      ]}
    >
      {image?.uri ? <Image source={image} style={styles.image} /> : null}

      <View style={styles.content}>
        <View style={styles.header}>
          <Label style={styles.title}>{title}</Label>

          {isVerified &&
            (typeof VerifiedBadge === "string" ? (
              <Text>{VerifiedBadge}</Text>
            ) : (
              <VerifiedBadge />
            ))}
        </View>

        {subtitle && <Label style={styles.subtitle}>{subtitle}</Label>}
        {meta && <Label style={styles.meta}>{meta}</Label>}
        {location && <Label style={styles.location}>{location}</Label>}

        {status && (
          <View
            style={[
              styles.statusPill,
              status === "Cheapest" && styles.cheapestPill,
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
  },
  highlightCard: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  image: {
    width: "100%",
    height: 140,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontWeight: "600",
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.tabInactive,
  },
  location: {
    marginTop: 2,
    fontSize: 12,
  },
  statusPill: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  cheapestPill: {
    backgroundColor: Colors.success || Colors.primary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.white,
  },
});
