import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Label from "../components/Label";
import ScreenWrapper from "../components/ScreenWrapper";
import { AuthContext } from "../context/AuthContext";
import { EntryIntentContext } from "../context/EntryIntentContext";
import { Colors } from "../theme/colors";

export default function Landing() {
  const router = useRouter();
  const { authStatus } = useContext(AuthContext);
  const { setEntryIntent } = useContext(EntryIntentContext);

  const handleExplore = () => {
    router.replace("/(tabs)/explore");
  };

  const handleEntryAction = (intent) => {
    setEntryIntent(intent);

    if (authStatus === "AUTHENTICATED") {
      const target = intent === "RENT" ? "/(tabs)/my-rides/filter" : "/(tabs)/my-bikes/list";
      router.replace(target);
    } else {
      router.push("/(auth)/signin");
    }
  };

  return (
    <ScreenWrapper statusBar="dark">
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.circleBadge}>
            <Image 
              source={require("../assets/images/SplashLogo.png")} 
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Label size={14} color={Colors.white} style={styles.tagline}>
              Shining the light on{'\n'}micro-mobility
            </Label>
          </View>
        </View>

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
    justifyContent: "center",
  },
  heroSection: {
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  heroLogo: {
    width: 200, 
    height: 200,
    marginBottom: 0,
  },
  tagline: {
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.9,
    marginTop: -10,
  },
  actionContainer: {
    width: "100%", 
    paddingHorizontal: 24,
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  exploreButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});