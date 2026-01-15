import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store'; // 1. Import SecureStore
import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import Label from "../../components/Label";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService"; // 2. Import authService
import { Colors } from "../../theme/colors";

export default function Profile() {
  const router = useRouter();
  const { setAuthStatus } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      // 3. Optional: Tell Backend to destroy the session
      // (If you haven't added logout to authService yet, this might fail, 
      // so we wrap it in try/catch to ensure the frontend logout still happens)
      if (authService.logout) {
        await authService.logout();
      }
    } catch (error) {
      console.log("Backend logout failed (non-critical):", error);
    }

    // 4. CRITICAL: Delete the token from the phone
    await SecureStore.deleteItemAsync('user_token');

    // 5. Reset UI State
    setAuthStatus("UNAUTHENTICATED");

    // 6. Redirect
    router.replace("/landing");
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Label size={24} bold>
          Profile
        </Label>

        <Button
          title="Logout"
          variant="primary"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
          iconLeft={
            <Ionicons
              name="power-outline"
              size={18}
              color={Colors.white}
              style={{ marginRight: 6 }}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#E53935",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 20,
    width: 160, 
  },
  logoutText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Lato-Bold",
  },
});