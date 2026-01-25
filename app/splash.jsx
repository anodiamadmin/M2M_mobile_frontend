import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

// Components
import Label from "../components/Label";
import ScreenWrapper from "../components/ScreenWrapper";

// Theme & Logic
import { AuthStatus } from "../constants/types";
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../theme/colors";

// 1. TELL NATIVE SPLASH TO WAIT
// This keeps the native launch image visible until we explicitly hide it.
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();
  const { authStatus } = useContext(AuthContext);
  const [isAppReady, setIsAppReady] = useState(false);

  // 2. THE HANDOFF
  // This runs when the Image component has finished decoding the bitmap.
  const onImageLoaded = async () => {
    try {
      // The image is ready. Hide the native splash.
      // The user now sees this React screen, which looks identical.
      await SplashScreen.hideAsync();
      
      // Start a small timer to show the "Tagline" and "Footer" 
      // before navigating (optional, but looks nice).
      setTimeout(() => {
        setIsAppReady(true);
      }, 2000); 
    } catch (e) {
      console.warn(e);
      setIsAppReady(true); // Fallback
    }
  };

  useEffect(() => {
    if (!isAppReady) return;
    
    // 3. AUTH LOGIC
    if (authStatus === AuthStatus.UNKNOWN) return;

    if (authStatus === AuthStatus.AUTHENTICATED) {
      router.replace("/(tabs)/explore");
    } else {
      router.replace("/landing");
    }
  }, [authStatus, isAppReady]); 

  return (
    <ScreenWrapper backgroundColor={Colors.black} statusBar="light">
      <View style={styles.contentContainer}>
        
        {/* Top Tagline */}
        <View style={styles.topSection}>
          <Label size={18} color={Colors.white} style={{ letterSpacing: 0.5 }}>
            Making Sydney E-bike Friendly
          </Label>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("../assets/images/SplashLogo.png")} 
            style={styles.logo}
            resizeMode="contain"
            // This triggers the handoff
            onLoad={onImageLoaded} 
          />
        </View>

        {/* Footer Text */}
        <View style={styles.footerContainer}>
          <Label style={{ textAlign: 'center' }}>
            <Label size={24} bold secondary color={Colors.secondary}>Affordable</Label>
            <Label size={24} bold secondary color={Colors.primary}> Reliable</Label>
            <Label size={24} bold secondary color={Colors.white}> Safe</Label>
          </Label>
        </View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 100,
  },
  topSection: {
    marginTop: 40,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%", 
  },
  logo: {
    // Responsive sizing logic we discussed
    width: "85%",        
    aspectRatio: 1,      
    maxHeight: 450,      
  },
  footerContainer: {
    marginBottom: 40,
  },
});