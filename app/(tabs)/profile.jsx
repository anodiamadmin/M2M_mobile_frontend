import { View, StyleSheet } from "react-native";
import { useContext } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Label from "../../components/Label";
import Button from "../../components/Button";
import { Colors } from "../../theme/colors";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { setAuthStatus } = useContext(AuthContext);

  const handleLogout = () => {
    // Reset auth state
    setAuthStatus("UNAUTHENTICATED");

    // Redirect to Landing
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
    width: 160, // reduced width
  },
  logoutText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Lato-Bold",
  },
});
