import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import ActionRow from "../../components/ActionRow";
import BrandLogo from "../../components/BrandLogo";
import Button from "../../components/Button";
import EmailInput from "../../components/EmailInput";
import Label from "../../components/Label";
import PasswordInput from "../../components/PasswordInput";
import ScreenWrapper from "../../components/ScreenWrapper";
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

      if (tabIntent) {
        const target = tabIntent === "RIDES" ? "/(tabs)/my-rides" : 
                       tabIntent === "BIKES" ? "/(tabs)/my-bikes" : "/(tabs)/profile";
        router.replace(target);
        setTabIntent(null);
      } else if (entryIntent) {
        const target = entryIntent === "RENT" ? "/(tabs)/my-rides/filter" : "/(tabs)/my-bikes/list";
        router.replace(target);
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
    <ScreenWrapper mode="scroll" statusBar="dark">
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" 
        keyboardDismissMode="on-drag"
      >
        
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

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  form: {
    marginBottom: 10,
  },
  signInButton: {
    marginTop: 20
  }
});