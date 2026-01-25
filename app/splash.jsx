import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Label from "../components/Label";
import ScreenWrapper from "../components/ScreenWrapper";
import { AuthStatus } from "../constants/types";
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../theme/colors";

SplashScreen.preventAutoHideAsync();

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
    <ScreenWrapper backgroundColor={Colors.black} statusBar="light">
      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <Label size={18} color={Colors.white} style={{ letterSpacing: 0.5 }}>
            Making Sydney E-bike Friendly
          </Label>
        </View>

        <View style={styles.logoContainer}>
          <Image 
            source={require("../assets/images/SplashLogo.png")} 
            style={styles.logo}
            resizeMode="contain"
            onLoad={onImageLoaded}
            testID="splash-image"
          />
        </View>

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
    width: "85%",        
    aspectRatio: 1,      
    maxHeight: 450,      
  },
  footerContainer: {
    marginBottom: 40,
  },
});