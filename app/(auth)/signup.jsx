import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Button from "../../components/Button"; // Check path consistency (usually ../../components)
import Label from "../../components/Label";
import TextField from "../../components/TextField";
import { Colors } from "../../theme/colors";
// 1. Import Safe Area Hook
import * as SecureStore from 'expo-secure-store';
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import Services
import { authService } from "../../services/authService";

// Import Contexts
import { AuthContext } from "../../context/AuthContext";
import { EntryIntentContext } from "../../context/EntryIntentContext";
import { TabIntentContext } from "../../context/TabIntentContext";

export default function SignUp() {
  const router = useRouter();
  // 2. Get Insets
  const insets = useSafeAreaInsets();

  const { setAuthStatus } = useContext(AuthContext);
  const { entryIntent, setEntryIntent } = useContext(EntryIntentContext);
  const { tabIntent, setTabIntent } = useContext(TabIntentContext);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // DEBUG: Test connection before doing anything else
    // try {
    //   console.log("Testing Health Check...");
    //   // Note: We use the raw axios instance or fetch to bypass any token logic
    //   const healthCheck = await fetch('http://192.168.X.X:8000/health'); 
    //   const status = await healthCheck.json();
    //   console.log("Health Check Passed:", status);
    //   Alert.alert("Connection Success", JSON.stringify(status));
    // } catch (err) {
    //   console.log("Health Check Failed:", err);
    //   Alert.alert("Connection Failed", err.message);
    // }
    // 1. Basic Validation
    if (!name || !email || !password || !dob) {
      Alert.alert("Missing Fields", "Please fill in all details.");
      return;
    }
    if (!agreed) {
      Alert.alert("Terms Required", "Please agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      // 2. Call the Backend API
      const response = await authService.register(name, email, password, dob);

      // 3. Success! Save Token & Update Context
      if (response.access_token) {
        await SecureStore.setItemAsync('user_token', response.access_token);
        setAuthStatus("AUTHENTICATED");

        // 4. Redirect based on Intent
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
      }
    } catch (error) {
      // 5. Handle Errors
      console.log("Signup Error:", error);
      const errorMessage = error.response?.data?.detail || "Something went wrong. Please try again.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToTnC = () => {
    router.push("terms&conditions");
  }

  const navigateToSignIn = () => {
    router.back(); 
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[
        styles.container,
        // 3. Apply Dynamic Padding
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined} 
          style={{ flex: 1 }}
        >
          <View style={styles.content}>

            {/* Header Section */}
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
                Sign up
              </Label>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <TextField
                label="Full Name (as displayed on government ID)"
                value={name}
                onChangeText={setName}
                placeholder="Enter Full Name"
              />

              <TextField
                label="Date of Birth"
                value={dob}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
              />

              <TextField
                label="Email (for receipts and rides)"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextField
                label="Create Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter Password"
              />
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                onPress={() => setAgreed(!agreed)} 
                style={styles.checkbox}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
              </TouchableOpacity>
              
              <View style={styles.inlineTextContainer}>
                <Label size={13} secondary color="#666">
                  I accept the{" "}
                </Label>
                <Button 
                  title="Terms & Conditions"
                  variant="hyperlink"
                  onPress={navigateToTnC}
                  textSize={13}
                  style={{ marginVertical: 0 }} 
                />
              </View>
            </View>

            {/* Upload Section */}
            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadPill} activeOpacity={0.6}>
                 <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} style={styles.pillIcon} />
                <Label size={11} secondary color="#555" style={styles.pillLabel}>
                  Upload Government ID
                </Label>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadPill} activeOpacity={0.6}>
                 <Ionicons name="camera-outline" size={20} color={Colors.primary} style={styles.pillIcon} />
                <Label size={11} secondary color="#555" style={styles.pillLabel}>
                  Take Selfie Holding Same Government ID
                </Label>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <Button 
                title={loading ? "Creating Account..." : "Continue"} 
                variant="primary" 
                onPress={handleSignUp} 
                disabled={loading}
              />

              <View style={styles.footer}>
                <Label size={14} secondary color="#666">
                  Already an user?{" "}
                </Label>
                <Button 
                  title="Sign in"
                  variant="hyperlink" 
                  onPress={navigateToSignIn}
                  textSize={14}
                  style={{ marginVertical: 0 }}
                />
              </View>
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
    marginBottom: 30, 
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
  },
  form: {
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6FA", 
  },
  inlineTextContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  uploadSection: {
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20, 
  },
  uploadPill: {
    flex: 1, 
    minHeight: 48, 
    height: 'auto', 
    paddingVertical: 8, 
    backgroundColor: "#F0F0F8", 
    borderRadius: 24, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E8E8F0"
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    textAlign: 'center',
    flexShrink: 1, 
  },
  actionSection: {
    marginTop: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});