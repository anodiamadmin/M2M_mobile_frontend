import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import Label from "../components/Label";
import { EntryIntentContext } from "../context/EntryIntentContext";
import { Colors } from "../theme/colors";

export default function Landing() {
  const router = useRouter();
  const { setEntryIntent } = useContext(EntryIntentContext);

  const handleRent = () => {
    setEntryIntent("RENT");
    router.push("/(auth)/signin");
  };

  const handleList = () => {
    setEntryIntent("LIST");
    router.push("/(auth)/signin");
  };

  const handleExplore = () => {
    router.replace("/(tabs)/explore");
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
          <Label 
            size={14} 
            color={Colors.white} 
            style={styles.tagline}
          >
            Shining the light on{'\n'}micro-mobility
          </Label>
        </View>
      </View>

      <View style={styles.actionContainer}>
        
        <Button 
          title="Rent a Bike" 
          variant="primary"
          onPress={handleRent}
          style={styles.buttonSpacing}
        />

        <Button 
          title="List a Bike" 
          variant="primary"
          onPress={handleList}
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
    paddingHorizontal: 40, 
    alignItems: "center", 
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  exploreButton: {
    marginTop: 10,
  },
});