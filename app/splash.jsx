import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

// Components
import Label from "../components/Label";
import ScreenWrapper from "../components/ScreenWrapper";

// Theme & Logic
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../theme/colors";

export default function SplashScreen() {
  const router = useRouter();
  const { authStatus } = useContext(AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [animationFinished, setAnimationFinished] = useState(false);

  const onImageLoaded = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800, 
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setAnimationFinished(true);
    }, 3000);
  };

  useEffect(() => {
    if (!animationFinished) return;
    if (authStatus === "UNKNOWN") return;

    if (authStatus === "AUTHENTICATED") {
      router.replace("/(tabs)/explore");
    } else {
      router.replace("/landing");
    }
  }, [authStatus, animationFinished]); 

  return (
    <ScreenWrapper backgroundColor={Colors.black} statusBar="light">
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        
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

      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // Note: 'container' style removed; ScreenWrapper handles flex:1 and bg color
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
  },
  logo: {
    width: 250,
    height: 250,
    transform: [{ scale: 1.8 }],
  },
  footerContainer: {
    marginBottom: 40,
  },
});