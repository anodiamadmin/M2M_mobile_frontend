import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import Label from "../../components/Label";
import ScreenWrapper from "../../components/ScreenWrapper";
import { AuthContext } from "../../context/AuthContext";
import { Colors } from "../../theme/colors";

export default function Profile() {
  const router = useRouter();
  
  // Destructure the new 'logout' function
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    // The Context changes authStatus -> "UNAUTHENTICATED"
    // The Root Layout (app/_layout.jsx) should observe this and redirect, 
    // but explicit replace ensures it happens instantly.
    router.replace("/landing");
  };

  return (
    <ScreenWrapper mode="scroll">
      <View style={styles.centerContent}>
        <Label size={24} bold style={{ marginBottom: 20 }}>
          Profile
        </Label>

        {/* Note: Your Button component doesn't technically support iconLeft yet 
            based on previous code, but I'll keep the logic simple here. */}
        <Button
          title="Logout"
          variant="primary"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  logoutButton: {
    backgroundColor: Colors.red, // Red for danger action
    width: 160, 
    borderColor: Colors.red, // Ensure border matches if variant logic adds one
  },
});