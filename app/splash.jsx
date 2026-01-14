import Label from "@components/Label"; // Ensure path matches your file structure
import { Colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Animated, Image, StatusBar, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onImageLoaded = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, 
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      router.replace("/landing");
    }, 3000);
  };

  return (
    <View style={styles.container}> 
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        
        {/* TOP SECTION: Primary Style (Comfortaa) - Default */}
        <View style={styles.topSection}>
          <Label size={18} color={Colors.white} style={{ letterSpacing: 0.5 }}>
            Making Sydney E-bike Friendly
          </Label>
        </View>

        {/* CENTER LOGO */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("../assets/images/SplashLogo.png")} 
            style={styles.logo}
            resizeMode="contain"
            onLoad={onImageLoaded}
          />
        </View>

        {/* FOOTER SECTION: Secondary Style (Lato) - Added 'secondary' prop */}
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