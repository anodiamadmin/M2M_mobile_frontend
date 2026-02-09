import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import Label from "../../components/Label";
import ScreenWrapper from "../../components/ScreenWrapper";
import ImageUploader from "../../components/ImageUploader";

import { AuthContext } from "../../context/AuthContext";
import { Colors } from "../../theme/colors";

export default function Profile() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null);

  const handleLogout = async () => {
    await logout();
    router.replace("/landing");
  };

  return (
    <ScreenWrapper mode="scroll">
      {/* Header */}
      <View style={styles.header}>
        <Label variant="brand">micro2move</Label>
        <Label size={28} color={Colors.textSecondary}>
          Welcome John
        </Label>
      </View>

      {/* Profile Image */}
      <View style={styles.imageRow}>
        <ImageUploader
          label="Profile Photo"
          activeLabel="Edit Photo"
          icon="camera-outline"
          imageUri={profileImage}
          onImageSelected={setProfileImage}
        />
      </View>

      {/* User Info */}
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Label bold color={Colors.success}>Name:</Label>
          <Label> John Doe</Label>
        </View>

        <View style={styles.row}>
          <Label bold color={Colors.success}>Email:</Label>
          <Label color={Colors.primary} style={styles.underline}>
            {" "}john@micro2move.com
          </Label>
        </View>

        <View style={styles.row}>
          <Label bold color={Colors.success}>Bikes Listed:</Label>
          <Label> 5</Label>
        </View>

        <View style={styles.row}>
          <Label bold color={Colors.success}>Joined micro2move on:</Label>
        </View>
        <Label>21 Jan, 2026</Label>
      </View>

      {/* Links */}
      <View style={styles.linksSection}>
        <Button
          title="Community Activity"
          variant="hyperlink"
          onPress={() => {}}
        />

        <Button
          title="In-App Lessons"
          variant="hyperlink"
          onPress={() => {}}
        />
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          variant="hyperlink"
          onPress={handleLogout}
          textSize={18}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 8,
  },

  imageRow: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },

  infoSection: {
    paddingHorizontal: 16,
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  underline: {
    textDecorationLine: "underline",
  },

  linksSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 8,
  },

  logoutSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
});
