import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Label from "../components/Label";
import { AuthContext } from "../context/AuthContext";
import { EntryIntentContext } from "../context/EntryIntentContext";
import { Colors } from "../theme/colors";

export default function Landing() {
  const router = useRouter();
  
  // 2. Access Auth and Intent Contexts
  const { authStatus } = useContext(AuthContext);
  const { setEntryIntent } = useContext(EntryIntentContext);

  // Explore: Always goes to Explore tab
  const handleExplore = () => {
    router.replace("/(tabs)/explore");
  };

  // Logic for Rent/List buttons
  const handleEntryAction = (intent) => {
    // Set the intent ("RENT" or "LIST")
    setEntryIntent(intent);

    // Check Auth Status immediately
    if (authStatus === "AUTHENTICATED") {
      // User is already logged in? Skip auth and go to the deep link
      if (intent === "RENT") {
        router.replace("/(tabs)/my-rides/filter"); 
      } else if (intent === "LIST") {
        router.replace("/(tabs)/my-bikes/list"); 
      }
    } else {
      // User is NOT logged in? Send to Sign In
      router.push("/(auth)/signin");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

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

      <View style={styles.actionContainer}>
        
        {/* Pass "RENT" intent */}
        <Button 
          title="Rent a Bike" 
          variant="primary"
          onPress={() => handleEntryAction("RENT")}
          style={styles.buttonSpacing}
        />

        {/* Pass "LIST" intent */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
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