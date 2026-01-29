import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ActionRow from "../../components/ActionRow";
import BrandLogo from "../../components/BrandLogo";
import Button from "../../components/Button";
import EmailInput from "../../components/EmailInput";
import Label from "../../components/Label";
import PasswordInput from "../../components/PasswordInput";
import ScreenWrapper from "../../components/ScreenWrapper";
import { AuthStatus } from "../../constants/types";
import { AuthContext } from "../../context/AuthContext";
import { useIntent } from "../../hooks/useIntent";
import { authService } from "../../services/authService";

export default function SignIn() {
  const router = useRouter();
  
  // ✅ 1. Get 'setUser' from context
  const { setAuthStatus, setUser } = useContext(AuthContext);
  
  const { resolveIntent } = useIntent();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      // 1. Perform Login
      const response = await authService.login(email, password);
      
      if (response.access_token) {
        // (Redundant but safe: ensure token is saved before profile fetch)
        await SecureStore.setItemAsync('user_token', response.access_token);
        
        // ✅ 2. Fetch User Profile immediately using the new token
        try {
          const userProfile = await authService.getUserProfile();
          setUser(userProfile); // Update Context State
        } catch (profileError) {
          console.error("Profile fetch failed:", profileError);
          // We don't block login here, but user data might be empty until reload
        }

        // 3. Update Auth Status & Redirect
        setAuthStatus(AuthStatus.AUTHENTICATED);
        resolveIntent();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Invalid email or password";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper mode="default" statusBar="dark">
      <View style={styles.container}>
        <BrandLogo />
        <Label variant="heading">Sign in to continue</Label>

        <View style={styles.form}>
          <EmailInput 
            value={email} 
            onChangeText={setEmail} 
            testID="emailTextInput"
          />
          <PasswordInput 
            value={password} 
            onChangeText={setPassword} 
            testID="passwordTextInput"
          />
          
          <Button 
            title={loading ? "Signing In..." : "Sign In"} 
            variant="primary" 
            onPress={handleSignIn} 
            disabled={loading}
            style={styles.signInButton}
            testID="SignInButton"
          />
        </View>

        <ActionRow 
          text="Don’t have an account?"
          actionText="Sign Up"
          onActionPress={() => router.push("/(auth)/signup")} 
        />
        
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20, 
  },
  form: {
    marginBottom: 20,
  },
  signInButton: {
    marginTop: 20
  }
});