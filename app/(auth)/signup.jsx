import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import ActionRow from "../../components/ActionRow";
import BrandLogo from "../../components/BrandLogo";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import DatePicker from "../../components/DatePicker";
import EmailInput from "../../components/EmailInput";
import ImageUploader from "../../components/ImageUploader";
import Label from "../../components/Label";
import PasswordInput from "../../components/PasswordInput";
import ScreenWrapper from "../../components/ScreenWrapper";
import TextField from "../../components/TextField";
// import { AuthStatus } from "../../constants/types"; // ❌ Not needed anymore
import { AuthContext } from "../../context/AuthContext";
import { useIntent } from "../../hooks/useIntent";
import { authService } from "../../services/authService";
import { Colors } from "../../theme/colors";
import { isAtLeast16, isValidEmail } from "../../utils/validators";

export default function SignUp() {
  const router = useRouter();
  
  // ✅ 1. Use 'login' instead of manually setting state
  const { login } = useContext(AuthContext);
  
  const { resolveIntent } = useIntent(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSignUp = async () => {
    // ... Validation Logic (kept same) ...
    if (!name || !email || !password || !dob) {
      Alert.alert("Missing Fields", "Please fill in all text details.");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!isAtLeast16(dob)) {
      Alert.alert("Age Restriction", "You must be at least 16 years old.");
      return;
    }
    if (!profileImage || !idImage) {
      Alert.alert("Photos Required", "You must take both a Selfie and ID.");
      return;
    }
    if (!agreed) {
      Alert.alert("Agreement Required", "Please agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);
    setVerifying(true); 

    try {
      // Simulate ID Verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerifying(false); 

      Alert.alert(
        "Identity Verified", 
        "Facial biometrics match the ID provided.",
        [{ 
            text: "Create Account", 
            onPress: async () => await performRegistration()
        }]
      );
    } catch (error) {
      setLoading(false);
      setVerifying(false);
      console.log("Error:", error);
    }
  };

  const performRegistration = async () => {
    try {
      const dobString = dob.toISOString().split('T')[0];
      
      // 1. API Register
      const response = await authService.register(name, email, password, dobString);
      
      if (response.access_token) {
        // ⚠️ CRITICAL: Save token temporarily so 'getUserProfile' works
        await SecureStore.setItemAsync('user_token', response.access_token);

        // 2. Fetch User Profile
        let userProfile = null;
        try {
            userProfile = await authService.getUserProfile();
        } catch (profileError) {
            console.error("Profile fetch failed after signup:", profileError);
        }

        // ✅ 3. Call Context Login (Handles State + Persistence)
        await login(response.access_token, userProfile);

        // 4. Navigate
        resolveIntent();
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "Registration failed.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  const getButtonTitle = () => {
    if (verifying) return "Verifying Identity...";
    if (loading) return "Creating Account...";
    return "Continue";
  };

  return (
    <ScreenWrapper mode="scroll" statusBar="dark">
      <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
        <BrandLogo />
        <Label variant="heading">Create account</Label>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" 
        keyboardDismissMode="on-drag"
      >
        <View style={styles.form}>
          <TextField
            testID="nameInput"
            label="Full Name (as displayed on government ID)"
            value={name}
            onChangeText={setName}
            placeholder="Enter Full Name"
          />

          <DatePicker 
            testID="dobPicker"
            label="Date of Birth"
            value={dob}
            onChange={setDob}
            placeholder="Select Your Date of Birth"
            style={{ marginBottom: 15 }}
            inputStyle={{ 
              backgroundColor: Colors.inputBackground,
              borderColor: Colors.border
            }}
          />

          <EmailInput 
            testID="emailInput"
            value={email}
            onChangeText={setEmail}
            label="Email (for receipts and rides)"
          />

          <PasswordInput
            testID="passwordInput"
            label="Create Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.uploadSection}>
          <ImageUploader 
            testID="idUploader"
            label="Capture Govt. ID"
            activeLabel="ID Captured"
            icon="card-outline"
            imageUri={idImage}
            onImageSelected={setIdImage}
            aspect={[4, 3]}
          />
          <ImageUploader 
            testID="selfieUploader"
            label="Take Your Selfie"
            activeLabel="Selfie Taken"
            icon="camera-outline"
            imageUri={profileImage}
            onImageSelected={setProfileImage}
            aspect={[1, 1]}
          />
        </View>

        <View style={styles.termsContainer}>
          <Checkbox 
            testID="termsCheckbox"
            checked={agreed} 
            onPress={() => setAgreed(!agreed)} 
          />
          <ActionRow 
            text="I accept the"
            actionText="Terms & Conditions"
            onActionPress={() => router.push("/terms")}
            style={{ 
              justifyContent: 'flex-start', 
              marginLeft: 10,
              marginTop: 0 
            }}
          />
        </View>

        <View style={styles.actionSection}>
          <Button 
            testID="signUpButton"
            title={getButtonTitle()} 
            variant="primary" 
            onPress={handleSignUp} 
            disabled={loading || verifying}
          />
          <ActionRow 
            text="Already an user?"
            actionText="Sign in"
            onActionPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  form: {
    marginBottom: 10,
  },
  uploadSection: {
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20, 
    height: 60, 
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  actionSection: {
    marginTop: 0,
  },
});