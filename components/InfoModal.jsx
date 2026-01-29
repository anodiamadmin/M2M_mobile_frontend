import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function InfoModal({ 
  visible, 
  onClose, 
  title, 
  children,
  variant = "center", // "center" | "bottom"
  showCloseButton = true
}) {
  const isBottom = variant === "bottom";

  return (
    <Modal
      animationType={isBottom ? "slide" : "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* 1. Outer Pressable: The "Backdrop" */}
      {/* Tapping here fires 'onClose' because it is the bottom-most layer */}
      <Pressable 
        style={[
          styles.overlay, 
          isBottom ? styles.overlayBottom : styles.overlayCenter
        ]}
        onPress={onClose}
      >
        {/* 2. Inner Pressable: The "Container" */}
        {/* Tapping here does NOTHING, but it 'catches' the tap so it doesn't hit the backdrop. */}
        {/* Your buttons/icons inside this are 'above' this layer, so they will still work! */}
        <Pressable 
          style={[
            styles.container, 
            isBottom ? styles.containerBottom : styles.containerCenter
          ]}
          onPress={() => {}} 
        >
          
          {/* Header */}
          <View style={styles.header}>
            <Label variant="subheading" style={styles.title}>{title}</Label>
            
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.black} />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayCenter: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlayBottom: {
    justifyContent: "flex-end", 
  },
  
  container: {
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  containerCenter: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerBottom: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40, 
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  content: {
    // Content flows naturally
  }
});