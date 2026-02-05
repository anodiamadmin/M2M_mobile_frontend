import BrandLogo from "@/components/BrandLogo";
import Label from "@/components/Label";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
      <View style={styles.headerSpacing}><BrandLogo /></View>
      
      <View style={styles.centerContent}>
        <Label variant="heading" color={Colors.primary}>Info Screen</Label>
        <Label variant="caption" color={Colors.placeholderTextColor}>Coming Soon</Label>
      </View>

      <View style={styles.navContainer}>
        {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
            <TouchableOpacity key={item.id} onPress={() => { if (!isActive) router.push(item.path); }} activeOpacity={0.7} style={styles.navTouchable}>
                <Label size={isActive ? 16 : 15} bold={isActive} color={isActive ? Colors.success : Colors.primary} style={[!isActive && styles.navUnderline]}>
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
  headerSpacing: { marginTop: 10, marginBottom: 5, paddingHorizontal: 16 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  navContainer: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  navTouchable: { paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  navUnderline: { textDecorationLine: "underline" },
});