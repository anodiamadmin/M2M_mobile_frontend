import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ActionRow from "../../components/ActionRow";
import BrandLogo from "../../components/BrandLogo";
import Button from "../../components/Button";
import Label from "../../components/Label";
import ScreenWrapper from "../../components/ScreenWrapper";

import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";

import { AuthContext } from "../../context/AuthContext";
import { EntryIntentContext } from "../../context/EntryIntentContext";
import { TabIntentContext } from "../../context/TabIntentContext";
import { authService } from "../../services/authService";

export default function SignIn() {
  const router = useRouter();
  
  const { setAuthStatus } = useContext(AuthContext);
  const { entryIntent, setEntryIntent } = useContext(EntryIntentContext);
  const { tabIntent, setTabIntent } = useContext(TabIntentContext);

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
      await authService.login(email, password);
      setAuthStatus("AUTHENTICATED");

      // Redirect Logic
      if (tabIntent) {
        if (tabIntent === "RIDES") router.replace("/(tabs)/my-rides");
        else if (tabIntent === "BIKES") router.replace("/(tabs)/my-bikes");
        else if (tabIntent === "PROFILE") router.replace("/(tabs)/profile");
        setTabIntent(null);
      } else if (entryIntent) {
        if (entryIntent === "RENT") router.replace("/(tabs)/my-rides/filter");
        else if (entryIntent === "LIST") router.replace("/(tabs)/my-bikes/list");
        setEntryIntent(null);
      } else {
        router.replace("/(tabs)/explore"); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Invalid email or password";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper mode="form" statusBar="dark">
      <View style={styles.content}>
        
        <View style={styles.header}>
          <BrandLogo style={styles.logo} />
          <Label variant="heading">Sign in to continue</Label>
        </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20, 
  },
  header: {
    marginBottom: 30,
  },
  logo: {
    marginBottom: 20,
  },
  form: {
    marginBottom: 10,
  },
  signInButton: {
    marginTop: 20
  }
});