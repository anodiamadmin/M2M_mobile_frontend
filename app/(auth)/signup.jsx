import Button from "@components/Button";
import Label from "@components/Label";
import TextField from "@components/TextField";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

export default function SignUp() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSignUp = () => {
    // TODO: Add Registration Logic
    router.replace("/(tabs)/my-rides");
  };

  const navigateToTnC = () => {
    router.push("terms&conditions");
  }

  const navigateToSignIn = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={styles.content}>

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

          <Label size={28} bold style={styles.pageTitle}>
            Create Account
          </Label>

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
            />

            <TextField
              label="Create Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter Password"
            />
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              onPress={() => setAgreed(!agreed)} 
              style={styles.checkbox}
              activeOpacity={0.8}
            >
              {agreed && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
            </TouchableOpacity>
            
            <View style={styles.termsTextContainer}>
              <Label size={14} secondary color="#666">
                I accept the{" "}
              </Label>
              <Button 
                title="Terms & Conditions"
                variant="hyperlink"
                onPress={navigateToTnC}
                textSize={14}
                style={styles.linkButton}
              />
            </View>
          </View>

          <View style={styles.uploadRow}>
            
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
              <Label size={12} secondary style={styles.uploadLabel}>
                Upload Government ID
              </Label>
              <View style={styles.iconCircle}>
                <Ionicons name="add" size={24} color={Colors.white} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
              <Label size={12} secondary style={styles.uploadLabel}>
                Take Selfie Holding same ID
              </Label>
              <Ionicons name="camera" size={32} color="#A020F0" />
            </TouchableOpacity>
            
          </View>

          <Button 
            title="Continue" 
            variant="primary" 
            onPress={handleSignUp} 
            style={{ marginTop: 10 }}
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
              style={styles.linkButton} 
            />
          </View>

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
    marginBottom: 5,
  },
  headerLogo: {
    width: 60, 
    height: 60,
  },
  pageTitle: {
    marginBottom: 20,
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
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6FA", 
  },
  termsTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 15,
  },
  uploadBox: {
    flex: 1, 
    height: 90,
    backgroundColor: "#E6E6FA", 
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  uploadLabel: {
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 16,
    color: "#666",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#A020F0", 
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  linkButton: {
    width: "auto",      
    height: "auto",     
    paddingHorizontal: 5, 
    marginVertical: 0,   
  }
});