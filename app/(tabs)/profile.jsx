import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import BrandLogo from "../../components/BrandLogo";
import ImageUploader from "../../components/ImageUploader";
import Label from "../../components/Label";
import ScreenWrapper from "../../components/ScreenWrapper";

import { AuthContext } from "../../context/AuthContext";
import { Colors } from "../../theme/colors";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null);

  const handleLogout = async () => {
    await logout();
    router.replace("/landing");
  };

  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <ScreenWrapper mode="scroll">
      
      {/* HEADER */}
      <View style={styles.header}>
        <BrandLogo />
        <Label variant="heading" secondary={false}>
          Welcome {user?.name?.split(" ")[0] || "Rider"}
        </Label>
      </View>

      {/* AVATAR */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={150}
              color={Colors.placeholderTextColor}
            />
          )}

          {/* Camera button (ImageUploader controls camera) */}
          <View style={styles.cameraButton}>
            <ImageUploader
              label=""
              activeLabel=""
              icon="camera"
              imageUri={null}
              onImageSelected={(uri) => setProfileImage(uri)}
            />
          </View>
        </View>
      </View>

      {/* USER INFO */}
      <View style={styles.infoSection}>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Name:
          </Label>
          <Label secondary>
            {" "}{user?.name || "—"}
          </Label>
        </Label>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Email:
          </Label>
          <Label
            secondary
            color={Colors.primary}
            style={styles.underline}
          >
            {" "}{user?.email || "—"}
          </Label>
        </Label>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Bikes Rented:
          </Label>
          <Label secondary>
            {" "}{user?.bikesRented ?? 0}
          </Label>
        </Label>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Joined micro2move on:
          </Label>
          <Label secondary>
            {" "}{joinedDate}
          </Label>
        </Label>

      </View>

      {/* LINKS */}
      <View style={styles.linksSection}>
        <View style={styles.linkRow}>
          <Ionicons name="people-outline" size={18} color={Colors.primary} />
          <Label
            size={16}
            bold
            secondary
            color={Colors.primary}
            style={styles.linkText}
          >
            Community Activity
          </Label>
        </View>

        <View style={styles.linkRow}>
          <Ionicons name="school-outline" size={18} color={Colors.primary} />
          <Label
            size={16}
            bold
            secondary
            color={Colors.primary}
            style={styles.linkText}
          >
            In-App Lessons
          </Label>
        </View>
      </View>

      {/* LOGOUT */}
      <View style={styles.logoutSection}>
        <View style={styles.linkRow}>
          <Ionicons name="log-out-outline" size={18} color={Colors.red} />
          <Label
            size={16}
            bold
            secondary
            color={Colors.red}
            style={styles.linkText}
            onPress={handleLogout}
          >
            Logout
          </Label>
        </View>
      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  avatarSection: {
    alignItems: "center",
    marginVertical: 24,
  },

  avatarWrapper: {
    position: "relative",
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  cameraButton: { 
    position: "absolute",
    bottom: 6, 
    right: 6, 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: Colors.primary, 
    alignItems: "center", 
    justifyContent: "center", 
    elevation: 5,
    
  },


  infoSection: {
    paddingHorizontal: 16,  
    gap: 10,
  },

  underline: {
    textDecorationLine: "underline",
  },

  linksSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },

  linkText: {
    textDecorationLine: "underline",
  },

  logoutSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
});
