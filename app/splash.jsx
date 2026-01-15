import Label from "@components/Label";
import { Colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Image, StatusBar, StyleSheet, View } from "react-native";

// 1. Import AuthContext
import { AuthContext } from "../context/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  // 2. Get the auth status
  const { authStatus } = useContext(AuthContext);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [animationFinished, setAnimationFinished] = useState(false);

  const onImageLoaded = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800, 
      useNativeDriver: true,
    }).start();

    // 3. Wait 3 seconds, then mark animation as done
    setTimeout(() => {
      setAnimationFinished(true);
    }, 3000);
  };

  // 4. "Traffic Controller" Effect
  useEffect(() => {
    // Only proceed if the minimum 3-second wait is over
    if (!animationFinished) return;

    // If Auth is still checking (rare, but possible), wait for it
    if (authStatus === "UNKNOWN") return;

    // Decision Time:
    if (authStatus === "AUTHENTICATED") {
      router.replace("/(tabs)/explore");
    } else {
      router.replace("/landing");
    }
  }, [authStatus, animationFinished]); 

  return (
    <View style={styles.container}> 
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
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
          />
        </View>

        <View style={styles.footerContainer}>
          <Label style={{ textAlign: 'center' }}>
            <Label size={24} bold secondary color={Colors.secondary}>Affordable</Label>
            <Label size={24} bold secondary color={Colors.primary}> Reliable</Label>
            <Label size={24} bold secondary color={Colors.white}> Safe</Label>
          </Label>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black, 
  },
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