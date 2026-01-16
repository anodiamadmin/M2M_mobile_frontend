import { Colors } from "@theme/colors";
import { StyleSheet } from "react-native";

// Export the object directly (Standard Practice)
export const splashStyles = StyleSheet.create({
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