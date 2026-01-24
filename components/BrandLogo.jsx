import { Image, StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function BrandLogo({ 
  variant = "dark", // 'dark' (Purple text) | 'light' (White text)
  showText = true,
  style 
}) {
  const textColor = variant === "light" ? Colors.white : Colors.primary;

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require("../assets/images/LogoLightNoNameNoBg.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      {showText && (
        <Label 
          size={20} 
          bold 
          color={textColor} 
          style={styles.text}
        >
          micro2move
        </Label>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 0,
  },
  text: {
    marginTop: -2, 
  }
});