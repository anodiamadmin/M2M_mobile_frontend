// Not ready for production, will be modified later

import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Label from "../components/Label";
import ScreenWrapper from "../components/ScreenWrapper";
import { AuthStatus } from "../constants/types";
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../theme/colors";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

export default function SplashScreenComponent() {
  const router = useRouter();
  const { authStatus } = useContext(AuthContext);
  const [isAppReady, setIsAppReady] = useState(false);
  
  const onImageLoaded = async () => {
    try {
      await SplashScreen.hideAsync();
      setTimeout(() => {
        setIsAppReady(true);
      }, 2000); 
    } catch (e) {
      console.warn(e);
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    if (!isAppReady) return;
    if (authStatus === AuthStatus.UNKNOWN) return;

    if (authStatus === AuthStatus.AUTHENTICATED) {
      router.replace("/(tabs)/explore");
    } else {
      router.replace("/landing");
    }
  }, [authStatus, isAppReady]); 

  return (
    <ScreenWrapper backgroundColor={Colors.black} statusBar="light" translucent={true}>
      <View style={styles.contentContainer}>
        
        {/* --- Top Section --- */}
        <View style={styles.topSection}>
          <Label size={18} color={Colors.white} style={{ letterSpacing: 0.5 }}>
            Making Sydney E-bike Friendly
          </Label>
        </View>

        {/* --- Logo Container --- */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("../assets/images/SplashLogo.png")} 
            style={styles.logo}
            resizeMode="contain"
            onLoad={onImageLoaded}
            testID="splash-image"
          />
        </View>

        {/* --- Footer --- */}
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
    position: 'relative',
    // ❌ DELETED: justifyContent: "center" (This was causing the shake)
    // ❌ DELETED: alignItems: "center"
  },
  topSection: {
    position: 'absolute',
    top: '15%', 
    width: '100%', // Ensure text centers horizontally
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    // ✅ NEW: Absolute Position pins it to the screen edges.
    // It will NOT move even if the view shrinks.
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    
    // Now we center the image *inside* this pinned overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, 
  },
  logo: {
    width: width * 0.85, 
    height: width * 0.85, 
    maxHeight: 450,
    maxWidth: 450,      
  },
  footerContainer: {
    position: 'absolute',
    bottom: '15%',
    width: '100%', // Ensure text centers horizontally
    alignItems: 'center',
    zIndex: 2,
  },
});