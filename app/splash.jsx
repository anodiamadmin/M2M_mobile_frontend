import Label from "@components/Label";
import { Colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Image, StatusBar, View } from "react-native";

import { AuthContext } from "../context/AuthContext";

// 1. Updated Import: No longer using 'as styles'
import { splashStyles } from "../utils/styles";

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
    // 2. Updated Usage: Changed 'styles.container' to 'splashStyles.container'
    <View style={splashStyles.container}> 
      <StatusBar barStyle="light-content" />

      <Animated.View style={[splashStyles.contentContainer, { opacity: fadeAnim }]}>
        <View style={splashStyles.topSection}>
          <Label size={18} color={Colors.white} style={{ letterSpacing: 0.5 }}>
            Making Sydney E-bike Friendly
          </Label>
        </View>

        <View style={splashStyles.logoContainer}>
          <Image 
            source={require("../assets/images/SplashLogo.png")} 
            style={splashStyles.logo}
            resizeMode="contain"
            onLoad={onImageLoaded}
          />
        </View>

        <View style={splashStyles.footerContainer}>
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