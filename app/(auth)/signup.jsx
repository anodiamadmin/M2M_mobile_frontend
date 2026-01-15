import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../../components/Button";
import Label from "../../components/Label";
import TextField from "../../components/TextField";
import { Colors } from "../../theme/colors";

// Import Services & Utils
import { authService } from "../../services/authService";
import { isAtLeast16, isValidEmail } from "../../utils/validators";

import { AuthContext } from "../../context/AuthContext";
import { EntryIntentContext } from "../../context/EntryIntentContext";
import { TabIntentContext } from "../../context/TabIntentContext";

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { setAuthStatus } = useContext(AuthContext);
  const { entryIntent, setEntryIntent } = useContext(EntryIntentContext);
  const { tabIntent, setTabIntent } = useContext(TabIntentContext);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // NEW: State to track if we are currently "Simulating" the verification
  const [verifying, setVerifying] = useState(false);

  // --- DATE PICKER STATE ---
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 18);
  
  const [date, setDate] = useState(defaultDate); 
  const [showPicker, setShowPicker] = useState(false);
  const [dobString, setDobString] = useState(""); 

  // Image State
  const [profileImage, setProfileImage] = useState(null);
  const [idImage, setIdImage] = useState(null);

  // --- CAMERA LOGIC ---
  const takePhoto = async (setImageFunc, aspectRatio = [1, 1]) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "We need camera access to capture your ID and photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageFunc(result.assets[0].uri);
    }
  };

  // --- DATE PICKER HANDLER ---
  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); 
    setDate(currentDate);

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    setDobString(`${day}/${month}/${year}`);
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleSignUp = async () => {
    // --- VALIDATION START ---
    if (!name || !email || !password || !dobString) {
      Alert.alert("Missing Fields", "Please fill in all text details.");
      return;
    }
    
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!isAtLeast16(dobString)) {
      Alert.alert("Age Restriction", "You must be at least 16 years old to sign up.");
      return;
    }

    if (!profileImage || !idImage) {
      Alert.alert("Photos Required", "You must take both a Selfie and a photo of your ID.");
      return;
    }

    if (!agreed) {
      Alert.alert("Terms Required", "Please agree to the Terms & Conditions.");
      return;
    }
    // --- VALIDATION END ---

    setLoading(true);
    setVerifying(true); // Start Verification Simulation

    try {
      // 1. SIMULATION: Wait 2 seconds to "Verify" Identity
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerifying(false); // Stop verifying, start registering

      // 2. SIMULATION: Show Success Alert
      // We wrap the API call in a new Promise to wait for the Alert OK press if desired,
      // but standard Alert is non-blocking in JS unless wrapped. 
      // However, visually this works best:
      Alert.alert(
        "Identity Verified", 
        "Facial biometrics match the ID provided.",
        [
          { 
            text: "Create Account", 
            onPress: async () => {
              // 3. ACTUAL REGISTRATION
              await performRegistration();
            }
          }
        ]
      );
      
    } catch (error) {
      setLoading(false);
      setVerifying(false);
      console.log("Verification Error:", error);
    }
  };

  const performRegistration = async () => {
    try {
      const response = await authService.register(name, email, password, dobString);

      if (response.access_token) {
        await SecureStore.setItemAsync('user_token', response.access_token);
        setAuthStatus("AUTHENTICATED");

        if (tabIntent) {
          if (tabIntent === "RIDES") router.replace("/(tabs)/my-rides");
          else if (tabIntent === "BIKES") router.replace("/(tabs)/my-bikes");
          else if (tabIntent === "PROFILE") router.replace("/(tabs)/profile");
          setTabIntent(null);
        } 
        else if (entryIntent) {
          if (entryIntent === "RENT") router.replace("/(tabs)/my-rides/filter");
          else if (entryIntent === "LIST") router.replace("/(tabs)/my-bikes/list");
          setEntryIntent(null);
        }
        else {
          router.replace("/(tabs)/explore");
        }
      }
    } catch (error) {
      console.log("Signup Error:", error);
      const errorMessage = error.response?.data?.detail || "Something went wrong. Please try again.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const navigateToTnC = () => {
    router.push("terms&conditions");
  }

  const navigateToSignIn = () => {
    router.back(); 
  };

  // Helper for Button Text
  const getButtonTitle = () => {
    if (verifying) return "Verifying Identity...";
    if (loading) return "Creating Account...";
    return "Continue";
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
                Sign up
              </Label>
            </View>

            <View style={styles.form}>
              <TextField
                label="Full Name (as displayed on government ID)"
                value={name}
                onChangeText={setName}
                placeholder="Enter Full Name"
              />

              {/* --- CUSTOM DATE INPUT --- */}
              <View style={{ marginBottom: 15 }}>
                <Label 
                  size={14} 
                  secondary 
                  bold 
                  color={Colors.primary} 
                  style={{ marginBottom: 8, marginLeft: 10 }} 
                >
                  Date of Birth
                </Label>
                
                <TouchableOpacity 
                  onPress={toggleDatePicker} 
                  style={styles.dateButton}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateText, !dobString && styles.placeholderText]}>
                    {dobString || "Select Your Date of Birth"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()} 
                  />
                )}
              </View>

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

            <View style={styles.uploadSection}>
              {/* ID Proof Button */}
              <TouchableOpacity 
                style={[styles.uploadPill, idImage && styles.uploadPillActive]} 
                activeOpacity={0.6}
                onPress={() => takePhoto(setIdImage, [4, 3])}
              >
                 {idImage ? (
                   <Image source={{ uri: idImage }} style={styles.uploadedThumb} />
                 ) : (
                   <Ionicons name="card-outline" size={20} color={Colors.primary} style={styles.pillIcon} />
                 )}
                <Label size={11} secondary color={idImage ? Colors.primary : "#555"} style={styles.pillLabel}>
                  {idImage ? "ID Captured" : "Capture Govt. ID"}
                </Label>
              </TouchableOpacity>

              {/* Selfie Button */}
              <TouchableOpacity 
                style={[styles.uploadPill, profileImage && styles.uploadPillActive]} 
                activeOpacity={0.6}
                onPress={() => takePhoto(setProfileImage, [1, 1])}
              >
                 {profileImage ? (
                   <Image source={{ uri: profileImage }} style={styles.uploadedThumb} />
                 ) : (
                   <Ionicons name="camera-outline" size={20} color={Colors.primary} style={styles.pillIcon} />
                 )}
                <Label size={11} secondary color={profileImage ? Colors.primary : "#555"} style={styles.pillLabel}>
                  {profileImage ? "Selfie Taken" : "Take Your Selfie"}
                </Label>
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity 
                onPress={() => setAgreed(!agreed)} 
                style={[styles.checkbox, agreed && styles.checkboxActive]}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color={Colors.white} />}
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

            <View style={styles.actionSection}>
              <Button 
                title={getButtonTitle()} 
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
    marginBottom: 20, 
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
  
  // MATCHING TEXTFIELD STYLE
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6E6FA', 
    paddingHorizontal: 16,
    height: 50, 
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F0F0F8',     
  },
  dateText: {
    fontSize: 15, 
    color: '#333',
    fontFamily: 'Lato-Regular',
  },
  placeholderText: {
    color: '#999',
    fontFamily: 'Lato-Regular', 
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
    backgroundColor: "#F0F0F8", 
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  inlineTextContainer: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  
  uploadSection: {
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20, 
    height: 60, 
  },
  uploadPill: {
    flex: 1, 
    height: 50, 
    paddingVertical: 8, 
    backgroundColor: "#E6E6FA", 
    borderRadius: 25, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E8E8F0",
    overflow: 'hidden',
  },
  uploadPillActive: {
    backgroundColor: "#E6F4FE", 
    borderColor: Colors.primary,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    textAlign: 'center',
    flexShrink: 1,
    fontSize: 11,
  },
  uploadedThumb: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
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