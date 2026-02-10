import BrandLogo from "@/components/BrandLogo";
import Label from "@/components/Label";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function CommunityUpdatesScreen() {
  const router = useRouter();

  const navItems = [
    { id: "maps", label: "Maps", path: "/(tabs)/explore" },
    { id: "info", label: "Info", path: "/explore/info" },
    { id: "community", label: "Community Updates", path: "/explore/community-updates" },
    { id: "ask-ai", label: "Ask AI", path: "/explore/ask-ai" },
  ];

  const activeTab = "community";

  return (
    <ScreenWrapper backgroundColor={Colors.white} edges={["top"]}>
      {/* Header */}
      <View style={styles.headerSpacing}>
        <BrandLogo />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Label variant="heading">Community Updates</Label>
      </View>

      {/* Updates */}
      <View style={styles.contentContainer}>
        <View style={[styles.updatePill, styles.purple]}>
          <Label>
            New bike lane added Oxford Street West
          </Label>
        </View>

        <View style={[styles.updatePill, styles.blue]}>
          <Label>
            Construction on Main Avenue causing detours. Expect delays.
          </Label>
        </View>

        <View style={[styles.updatePill, styles.grey]}>
          <Label>
            Bike lane on Moore Park Rd reopened after maintenance.
          </Label>
        </View>
      </View>

      {/* 🔒 Navigation – unchanged */}
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
    marginBottom: 5,
    paddingHorizontal: 16,
  },

  titleContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 14,
  },

  updatePill: {
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  /* ✅ Colors from Colors.js */
  purple: {
    backgroundColor: Colors.accent,
  },

  blue: {
    backgroundColor: Colors.activeBackground,
  },

  grey: {
    backgroundColor: Colors.surface,
  },

  /* ⬇️ navigation styles preserved */
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
