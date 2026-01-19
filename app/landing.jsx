import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../components/Button";
import Label from "../components/Label";
import { AuthContext } from "../context/AuthContext";
import { EntryIntentContext } from "../context/EntryIntentContext";
import { Colors } from "../theme/colors";
import { landingStyles } from "../utils/styles";

export default function Landing() {
  const router = useRouter();
  
  const insets = useSafeAreaInsets();
  
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
   <View style={[
      landingStyles.container, 
      { paddingTop: insets.top, paddingBottom: insets.bottom }
    ]}>
      <StatusBar barStyle="dark-content" />

      <View style={landingStyles.topSection}>
        <View style={landingStyles.circleBadge}>
          <Image 
            source={require("../assets/images/SplashLogo.png")} 
            style={landingStyles.logo}
            resizeMode="contain"
          />
          <Label size={14} color={Colors.white} style={landingStyles.tagline}>
            Shining the light on{'\n'}micro-mobility
          </Label>
        </View>
      </View>

      <View style={landingStyles.actionContainer}>
        
        <Button 
          title="Rent a Bike" 
          variant="primary"
          onPress={() => handleEntryAction("RENT")}
          style={landingStyles.buttonSpacing}
        />

        <Button 
          title="List a Bike" 
          variant="primary"
          onPress={() => handleEntryAction("LIST")}
          style={landingStyles.buttonSpacing}
        />

        <Button 
          title="Explore" 
          variant="hyperlink"
          onPress={handleExplore}
          style={landingStyles.exploreButton} 
        />

      </View>
    </View>
  );
}

