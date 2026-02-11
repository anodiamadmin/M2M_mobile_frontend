import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function ImageUploader({
  label,
  activeLabel,
  icon,
  imageUri,
  onImageSelected,
  aspect = [1, 1],
  variant = "default"   // ✅ NEW PROP (default safe)
}) {
  
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required", 
          "We need camera access to capture your ID. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() } 
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images", 
        allowsEditing: true,
        aspect: aspect,
        quality: 0.5,
      });

      if (!result.canceled) {
        onImageSelected(result.assets[0].uri);
      }

    } catch (error) {
      console.log("CAMERA ERROR:", error);
      Alert.alert("Camera Error", error.message || "Could not open camera.");
    }
  };

  const displayText = imageUri ? (activeLabel || label) : label;
  const isAvatar = variant === "avatar";

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        imageUri && styles.active,
        isAvatar && styles.avatarContainer   // ✅ only applied for profile
      ]} 
      activeOpacity={0.7}
      onPress={takePhoto}
    >
      {imageUri && !isAvatar ? (
        <Image source={{ uri: imageUri }} style={styles.thumb} />
      ) : (
        <Ionicons 
          name={icon} 
          size={isAvatar ? 18 : 20} 
          color={isAvatar ? Colors.white : Colors.primary} 
          style={!isAvatar && styles.icon} 
        />
      )}
      
      {!isAvatar && (
        <Label 
          size={11} 
          secondary 
          color={imageUri ? Colors.primary : "#555"} 
          style={styles.label}
          numberOfLines={1}
        >
          {imageUri ? `${displayText} ✓` : displayText}
        </Label>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    height: 50, 
    backgroundColor: Colors.inputBackground, 
    borderRadius: 25, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border, 
    overflow: 'hidden',
  },

  // ✅ ONLY used when variant="avatar"
  avatarContainer: {
    flex: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    borderWidth: 0,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  active: {
    backgroundColor: Colors.activeBackground, 
    borderColor: Colors.primary,
  },

  icon: {
    marginRight: 6,
  },

  label: {
    textAlign: 'center',
    flexShrink: 1,
  },

  thumb: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
});
