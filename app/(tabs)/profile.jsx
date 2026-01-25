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
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    await logout();
    router.replace("/landing");
  };

  return (
    <ScreenWrapper mode="scroll">
      <View style={styles.centerContent}>
        <Label size={24} bold style={{ marginBottom: 20 }}>
          Profile
        </Label>

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
    backgroundColor: Colors.red,
    width: 160, 
    borderColor: Colors.red,
  },
});