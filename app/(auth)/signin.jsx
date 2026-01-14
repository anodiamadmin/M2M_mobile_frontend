import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Button from "../../components/Button";
import Label from "../../components/Label";
import TextField from "../../components/TextField";
import { Colors } from "../../theme/colors";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // TODO: Add backend logic
    router.replace("/(tabs)/my-rides"); 
  };

  const navigateToSignUp = () => {
    router.push("/(auth)/signup");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
        
        {/* 1. Logo Section (Top Left) */}
        <View style={styles.logoHeader}>
           <Image 
             source={require("../../assets/images/LogoLightNoNameNoBg.png")} 
             style={styles.headerLogo}
             resizeMode="contain"
           />
           <Label size={20} bold color={Colors.primary} style={{marginLeft: 0}}>
             micro2move
           </Label>
        </View>

        {/* 2. Main Title */}
        <Label size={28} style={styles.pageTitle}>
          Sign in to continue
        </Label>

        {/* 3. Form Fields */}
        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            testID="emailTextInput"
          />

          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter Password"
            testID="passwordTextInput"
          />

          {/* Sign In Button (Primary) */}
          <Button 
            title="Sign In" 
            variant="primary" 
            onPress={handleSignIn} 
            testID="SignInButton"
            style={{ marginTop: 20 }}
          />
        </View>

        {/* 4. Footer Link using Button Component (Tertiary) */}
        <View style={styles.footer}>
          <Label size={14} secondary color="#666">
            Don’t have an account?{" "}
          </Label>
          
          <Button 
            title="Sign Up"
            variant="hyperlink"
            onPress={navigateToSignUp}
            textSize={14}
            style={styles.linkButton} 
          />
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  headerLogo: {
    width: 60, 
    height: 60
  },
  pageTitle: {
    marginBottom: 30,
    fontFamily: "Comfortaa-Regular",
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
  linkButton: {
    width: "auto",
    height: "auto",
    paddingHorizontal: 5,
    marginVertical: 0,
  }
});