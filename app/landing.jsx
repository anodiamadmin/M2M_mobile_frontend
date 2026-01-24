import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";

// Components
import Button from "../components/Button";
import Label from "../components/Label";
import ScreenWrapper from "../components/ScreenWrapper";

// Theme & Logic
import { AuthContext } from "../context/AuthContext";
import { EntryIntentContext } from "../context/EntryIntentContext";
import { Colors } from "../theme/colors";

export default function Landing() {
  const router = useRouter();
  
  // Note: No need for useSafeAreaInsets() here anymore!
  
  const { authStatus } = useContext(AuthContext);
  const { setEntryIntent } = useContext(EntryIntentContext);

  const handleExplore = () => {
    router.replace("/(tabs)/explore");
  };

  const handleEntryAction = (intent) => {
    setEntryIntent(intent);

    if (authStatus === "AUTHENTICATED") {
      if (intent === "RENT") {
        router.replace("/(tabs)/my-rides/filter"); 
      } else if (intent === "LIST") {
        router.replace("/(tabs)/my-bikes/list"); 
      }
    } else {
      router.push("/(auth)/signin");
    }
  };

  return (
    <ScreenWrapper statusBar="dark">
      <View style={styles.container}>
        
        {/* Top Badge Section */}
        <View style={styles.topSection}>
          <View style={styles.circleBadge}>
            <Image 
              source={require("../assets/images/SplashLogo.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Label size={14} color={Colors.white} style={styles.tagline}>
              Shining the light on{'\n'}micro-mobility
            </Label>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button 
            title="Rent a Bike" 
            variant="primary"
            onPress={() => handleEntryAction("RENT")}
            style={styles.buttonSpacing}
          />

          <Button 
            title="List a Bike" 
            variant="primary"
            onPress={() => handleEntryAction("LIST")}
            style={styles.buttonSpacing}
          />

          <Button 
            title="Explore" 
            variant="hyperlink"
            onPress={handleExplore}
            style={styles.exploreButton} 
          />
        </View>
        
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Note: Padding removed; ScreenWrapper handles safe area padding
  },
  topSection: {
    marginBottom: 60,
    alignItems: "center",
  },
  circleBadge: {
    width: 280,
    height: 280,
    borderRadius: 140, 
    backgroundColor: Colors.black, 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 150,
    transform: [{ scale: 1.8 }],
    marginBottom: 10,
  },
  tagline: {
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.9,
  },
  actionContainer: {
    width: "100%", 
    paddingHorizontal: 24, 
    alignItems: "center", 
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  exploreButton: {
    marginTop: 10,
  },
});