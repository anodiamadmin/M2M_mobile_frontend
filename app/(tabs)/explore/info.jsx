import BrandLogo from "@/components/BrandLogo";
import Label from "@/components/Label";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function InfoScreen() {
  const router = useRouter();

  const navItems = [
    { id: "maps", label: "Maps", path: "/(tabs)/explore" },
    { id: "info", label: "Info", path: "/explore/info" },
    { id: "community", label: "Community Update", path: "/explore/community-updates" },
    { id: "ask-ai", label: "Ask AI", path: "/explore/ask-ai" },
  ];

  const activeTab = "info";

  return (
    <ScreenWrapper backgroundColor={Colors.white} edges={["top"]}>
      {/* Header */}
      <View style={styles.headerSpacing}>
        <BrandLogo />
      </View>

      {/* Info Cards */}
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Label variant="subheading" bold>
            E-bike Sharing
          </Label>
          <Label variant="caption" color={Colors.placeholderTextColor}>
            Micro2Move connects local bike owners with riders, so anyone can earn
            from their e-bike or try one without owning.
          </Label>
        </View>

        <View style={styles.card}>
          <Label variant="subheading" bold>
            Smart city mobility map
          </Label>
          <Label variant="caption" color={Colors.placeholderTextColor}>
            A city-focused mobility map shows riders where they can charge, ride
            and store e-bikes, including current and future bike-friendly
            infrastructure.
          </Label>
        </View>

        <View style={styles.card}>
          <Label variant="subheading" bold>
            City-shaping, planning-led mission
          </Label>
          <Label variant="caption" color={Colors.placeholderTextColor}>
            Micro2Move aims to close Sydney’s mobility gap and improve access to
            sustainable transport.
          </Label>
        </View>
      </View>

      {/* 🔒 Navigation – unchanged from your original code */}
      <View style={styles.navContainer}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (!isActive) router.push(item.path);
              }}
              activeOpacity={0.7}
              style={styles.navTouchable}
            >
              <Label
                size={isActive ? 16 : 15}
                bold={isActive}
                color={isActive ? Colors.success : Colors.primary}
                style={[!isActive && styles.navUnderline]}
              >
                {item.label}
              </Label>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerSpacing: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },

  /* ✅ Color updated to use design system */
  card: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },

  /* ⬇️ Navigation styles preserved */
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },

  navTouchable: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  navUnderline: {
    textDecorationLine: "underline",
  },
});
