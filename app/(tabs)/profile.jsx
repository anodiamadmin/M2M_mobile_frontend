import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BrandLogo from "../../components/BrandLogo";
import Button from "../../components/Button";
import Label from "../../components/Label";
import ScreenWrapper from "../../components/ScreenWrapper";
import ImageUploader from "../../components/ImageUploader";

import { AuthContext } from "../../context/AuthContext";
import { Colors } from "../../theme/colors";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null);
  const [showUploader, setShowUploader] = useState(false);

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

  // 📷 Camera icon pressed
  const handleCameraPress = () => {
    // If no photo → open ImageUploader directly
    if (!profileImage) {
      setShowUploader(true);
      return;
    }

    // If photo exists → show options
    Alert.alert(
      "Profile picture",
      "",
      [
        {
          text: "See profile picture",
          onPress: () => {}, // optional fullscreen later
        },
        {
          text: "Change profile picture",
          onPress: () => setShowUploader(true), // ✅ ImageUploader will open camera
        },
        {
          text: "Remove profile picture",
          style: "destructive",
          onPress: () => setProfileImage(null),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <ScreenWrapper mode="scroll">
      {/* HEADER */}
      <View style={styles.header}>
        <BrandLogo />
        <Label variant="heading" secondary={false}>
          Welcome {user?.name?.split(" ")[0] || "User"}
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
              size={140}
              color={Colors.placeholderTextColor}
            />
          )}

          {/* 📷 Camera icon */}
          <TouchableOpacity
            style={styles.cameraButton}
            activeOpacity={0.85}
            onPress={handleCameraPress}
          >
            <Ionicons name="camera" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* ✅ ImageUploader controls camera */}
        {showUploader && (
          <ImageUploader
            label=""
            activeLabel=""
            icon="camera"
            imageUri={null}
            onImageSelected={(uri) => {
              setProfileImage(uri);
              setShowUploader(false);
            }}
          />
        )}
      </View>

      {/* USER INFO ,Bikes Rented will  be picked from databasewhwn the tables are ready*/}
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>
            Name:
          </Label>
          <Label secondary style={styles.valueText}>
            {user?.name || "—"}
          </Label>
        </View>

        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>
            Email:
          </Label>
          <Label
            secondary
            color={Colors.primary}
            style={[styles.valueText, styles.underline]}
          >
            {user?.email || "—"}
          </Label>
        </View>

        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>
            Bikes Rented:
          </Label>
          <Label secondary style={styles.valueText}>
            {user?.bikesRented ?? 0}
          </Label>
        </View>

        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>
            Joined micro2move on:
          </Label>
          <Label secondary style={styles.valueText}>
            {joinedDate}
          </Label>
        </View>
      </View>

      {/* LINKS */}
      <View style={styles.linksSection}>
        <View style={styles.linkRow}>
          <Ionicons name="people-outline" size={18} color={Colors.primary} />
          <Button title="Community Activity" variant="hyperlink" onPress={() => {}} 
            textSize={18}/>
        </View>

        <View style={styles.linkRow}>
          <Ionicons name="school-outline" size={18} color={Colors.primary} />
          <Button title="In-App Lessons" variant="hyperlink" onPress={() => {}} 
            textSize={18}/>
        </View>
      </View>

      {/* LOGOUT */}
      <View style={styles.logoutSection}>
        <View style={styles.linkRow}>
          <Ionicons name="log-out-outline" size={18} color={Colors.red} />
          <Button
            title="Logout"
            variant="hyperlink"
            onPress={handleLogout}
            textSize={18}
            textColor={Colors.red}
          />
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

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  valueText: {
    marginLeft: 6,
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
    gap: 8,
  },

  logoutSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
});
