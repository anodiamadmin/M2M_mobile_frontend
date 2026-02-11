import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";

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
              size={140}
              color={Colors.placeholderTextColor}
            />
          )}

          <View style={styles.cameraButton}>
            <ImageUploader
              icon="camera"
              variant="avatar"
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
          <Label secondary>{" "}{user?.name || "—"}</Label>
        </Label>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Email:
          </Label>
          <Label secondary color={Colors.primary} style={styles.underline}>
            {" "}{user?.email || "—"}
          </Label>
        </Label>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Bikes Rented:
          </Label>
          <Label secondary>{" "}{user?.bikesRented ?? 0}</Label>
        </Label>

        <Label>
          <Label bold secondary={false} color={Colors.success}>
            Joined micro2move on:
          </Label>
          <Label secondary>{" "}{joinedDate}</Label>
        </Label>
      </View>

      {/* LINKS */}
      <View style={styles.linksSection}>

        {/* Community Activity */}
        <TouchableOpacity
          style={styles.linkRow}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert("Coming Soon", "Community Activity is coming soon 🚀")
          }
        >
          <Ionicons
            name="people-outline"
            size={18}
            color={Colors.primary}
            style={styles.icon}
          />

          <Label
            size={18}
            bold
            secondary
            color={Colors.primary}
            style={styles.linkText}
          >
            Community Activity
          </Label>
        </TouchableOpacity>

        {/* In-App Lessons */}
        <TouchableOpacity
          style={styles.linkRow}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert("Coming Soon", "In-App Lessons are coming soon 📚")
          }
        >
          <Ionicons
            name="school-outline"
            size={18}
            color={Colors.primary}
            style={styles.icon}
          />

          <Label
            size={18}
            bold
            secondary
            color={Colors.primary}
            style={styles.linkText}
          >
            In-App Lessons
          </Label>
        </TouchableOpacity>

        {/* Logout (UNCHANGED) */}
        <TouchableOpacity
          style={styles.linkRow}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={Colors.red}
            style={styles.icon}
          />

          <Label
            size={18}
            bold
            secondary
            color={Colors.red}
            style={styles.linkText}
          >
            Logout
          </Label>
        </TouchableOpacity>

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
    bottom: 0,
    right: 0,
  },

  infoSection: {
    paddingHorizontal: 16,
    gap: 10,
  },

  underline: {
    textDecorationLine: "underline",
  },

  linksSection: {
    marginTop: 30,
    paddingHorizontal: 16,
    gap: 22,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
  },

  icon: {
    marginRight: 12,
    marginTop: 1,
  },

  linkText: {
    textDecorationLine: "underline",
    marginTop: -2,
  },
});
