import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert // 1. Import Alert
  ,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../../components/Button";
import Label from "../../components/Label";
import TextField from "../../components/TextField";
import { Colors } from "../../theme/colors";

// Import Services
import { authService } from "../../services/authService"; // 2. Import Service

// Import Contexts
import { AuthContext } from "../../context/AuthContext";
import { EntryIntentContext } from "../../context/EntryIntentContext";
import { TabIntentContext } from "../../context/TabIntentContext";

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { setAuthStatus } = useContext(AuthContext);
  const { entryIntent, setEntryIntent } = useContext(EntryIntentContext);
  const { tabIntent, setTabIntent } = useContext(TabIntentContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 3. Add Loading State

  const handleSignIn = async () => {
    // Basic Validation
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // 4. Call Backend
      // authService.login() handles the API call AND saves the token to SecureStore automatically
      await authService.login(email, password);
      
      // 5. Update Global State
      setAuthStatus("AUTHENTICATED");

      // 6. Handle Redirects (Your existing logic)
      // PRIORITY 1: Tab Intents
      if (tabIntent) {
        if (tabIntent === "RIDES") router.replace("/(tabs)/my-rides");
        else if (tabIntent === "BIKES") router.replace("/(tabs)/my-bikes");
        else if (tabIntent === "PROFILE") router.replace("/(tabs)/profile");
        setTabIntent(null);
      } 
      // PRIORITY 2: Entry Intents
      else if (entryIntent) {
        if (entryIntent === "RENT") router.replace("/(tabs)/my-rides/filter");
        else if (entryIntent === "LIST") router.replace("/(tabs)/my-bikes/list");
        setEntryIntent(null);
      } 
      // DEFAULT FALLBACK
      else {
        router.replace("/(tabs)/explore"); 
      }

    } catch (error) {
      console.log("Login Error:", error);
      const errorMessage = error.response?.data?.detail || "Invalid email or password";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push("/(auth)/signup");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[
        styles.container,
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
                autoCapitalize="none" // Important for email input
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
                title={loading ? "Signing In..." : "Sign In"} // Update button text
                variant="primary" 
                onPress={handleSignIn} 
                testID="SignInButton"
                disabled={loading} // Disable button while loading
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