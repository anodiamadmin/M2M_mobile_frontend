import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import Label from "../../components/Label";
import { AuthContext } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { Colors } from "../../theme/colors";

export default function Profile() {
  const router = useRouter();
  const { setAuthStatus } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      if (authService.logout) {
        await authService.logout();
      }
    } catch (error) {
      console.log("Backend logout failed (non-critical):", error);
    }

    await SecureStore.deleteItemAsync('user_token');

    setAuthStatus("UNAUTHENTICATED");

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