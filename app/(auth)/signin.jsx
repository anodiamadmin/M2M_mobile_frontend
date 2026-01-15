import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
// 1. Import Safe Area Hook
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../../components/Button";
import Label from "../../components/Label";
import TextField from "../../components/TextField";
import { Colors } from "../../theme/colors";

// Import Contexts
import { AuthContext } from "../../context/AuthContext";
import { EntryIntentContext } from "../../context/EntryIntentContext";
import { TabIntentContext } from "../../context/TabIntentContext";

export default function SignIn() {
  const router = useRouter();
  // 2. Get Insets
  const insets = useSafeAreaInsets();
  
  const { setAuthStatus } = useContext(AuthContext);
  const { entryIntent, setEntryIntent } = useContext(EntryIntentContext);
  const { tabIntent, setTabIntent } = useContext(TabIntentContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // TODO: Add backend logic here
    
    setAuthStatus("AUTHENTICATED");

    // PRIORITY 1: Tab Intents
    if (tabIntent) {
      if (tabIntent === "RIDES") router.replace("/(tabs)/my-rides");
      else if (tabIntent === "BIKES") router.replace("/(tabs)/my-bikes");
      else if (tabIntent === "PROFILE") router.replace("/(tabs)/profile");
      setTabIntent(null);
      return;
    }

    // PRIORITY 2: Entry Intents
    if (entryIntent) {
      if (entryIntent === "RENT") router.replace("/(tabs)/my-rides/filter");
      else if (entryIntent === "LIST") router.replace("/(tabs)/my-bikes/list");
      setEntryIntent(null);
      return;
    }

    // DEFAULT FALLBACK
    router.replace("/(tabs)/explore"); 
  };

  const navigateToSignUp = () => {
    router.push("/(auth)/signup");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[
        styles.container,
        // 3. Apply Dynamic Padding for status bar safety
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined} 
          style={{ flex: 1 }}
        >
          <View style={styles.content}>
          
            <View style={styles.headerSection}>
              <View style={styles.logoHeader}>
                 <Image 
                   source={require("../../assets/images/LogoLightNoNameNoBg.png")} 
                   style={styles.headerLogo}
                   resizeMode="contain"
                 />
                 <Label size={20} bold color={Colors.primary}>
                   micro2move
                 </Label>
              </View>

              <Label size={24} bold style={styles.pageTitle}>
                Sign in to continue
              </Label>
            </View>

            <View style={styles.form}>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email"
                testID="emailTextInput"
                keyboardType="email-address"
              />

              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter Password"
                testID="passwordTextInput"
              />

              <Button 
                title="Sign In" 
                variant="primary" 
                onPress={handleSignIn} 
                testID="SignInButton"
                style={{ marginTop: 20 }}
              />
            </View>

            <View style={styles.footer}>
              <Label size={14} secondary color="#666">
                Don’t have an account?{" "}
              </Label>
              
              <Button 
                title="Sign Up"
                variant="hyperlink"
                onPress={navigateToSignUp}
                textSize={14}
                style={{ marginVertical: 0 }} 
              />
            </View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    // FIXED: Removed justifyContent: 'center' so content stays at the top
    // Optional: Add a little extra top spacing if the status bar feels too close
    paddingTop: 20, 
  },
  headerSection: {
    marginBottom: 5,
  },
  logoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  pageTitle: {
    fontFamily: "Comfortaa-Bold",
    color: "#333",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});