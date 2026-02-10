import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
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

  const handleCameraPress = () => {
    if (!profileImage) {
      setShowUploader(true);
      return;
    }
    Alert.alert("Profile picture", "", [
      { text: "See profile picture", onPress: () => {} },
      { text: "Change profile picture", onPress: () => setShowUploader(true) },
      { text: "Remove profile picture", style: "destructive", onPress: () => setProfileImage(null) },
      { text: "Cancel", style: "cancel" },
    ]);
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
            <Ionicons name="person-circle-outline" size={140} color={Colors.placeholderTextColor} />
          )}
          <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85} onPress={handleCameraPress}>
            <Ionicons name="camera" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
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

      {/* USER INFO */}
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>Name:</Label>
          <Label secondary style={styles.valueText}>{user?.name || "—"}</Label>
        </View>
        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>Email:</Label>
          <Label secondary color={Colors.primary} style={[styles.valueText, styles.underline]}>{user?.email || "—"}</Label>
        </View>
        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>Bikes Rented:</Label>
          <Label secondary style={styles.valueText}>{user?.bikesRented ?? 0}</Label>
        </View>
        <View style={styles.row}>
          <Label bold secondary={false} color={Colors.success}>Joined micro2move on:</Label>
          <Label secondary style={styles.valueText}>{joinedDate}</Label>
        </View>
      </View>

      {/* LINKS - Replaced Button with simple TouchableOpacity + Label */}
      <View style={styles.linksSection}>
        
        {/* Link 1 */}
        <TouchableOpacity 
            style={styles.linkRow} 
            activeOpacity={0.7}
            onPress={() => {}} // Add your navigation logic here
        >
          <Ionicons name="people-outline" size={18} color={Colors.primary} />
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

        {/* Link 2 */}
        <TouchableOpacity 
            style={styles.linkRow} 
            activeOpacity={0.7}
            onPress={() => {}}
        >
          <Ionicons name="school-outline" size={18} color={Colors.primary} />
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
      </View>

      {/* LOGOUT */}
      <View style={styles.logoutSection}>
        <TouchableOpacity 
            style={styles.linkRow} 
            activeOpacity={0.7}
            onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.red} />
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
  header: { paddingHorizontal: 16, paddingTop: 20 },
  avatarSection: { alignItems: "center", marginVertical: 24 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 140, height: 140, borderRadius: 70 },
  cameraButton: { position: "absolute", bottom: 6, right: 6, width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", elevation: 5 },
  infoSection: { paddingHorizontal: 16, gap: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  valueText: { marginLeft: 6 },
  underline: { textDecorationLine: "underline" },
  linksSection: { marginTop: 20, paddingHorizontal: 16, gap: 12 },
  
  // ✅ Simplified Link Row: No more fighting with Button styles
  linkRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10, // slightly increased gap for better breathing room
    paddingVertical: 4 // Increases hit slop area slightly
  },
  
  linkText: {
    textDecorationLine: "underline",
  },

  logoutSection: { marginTop: 10, paddingHorizontal: 16 },
});