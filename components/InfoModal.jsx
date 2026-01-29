import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";
import Button from "./Button";
import Label from "./Label";

export default function InfoModal({
  title,
  children,
  onClose,
  visible = false,
}) {
  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="fade" 
      onRequestClose={onClose}
    >
      {/* Pressing the overlay also closes the modal */}
      <Pressable style={styles.overlay} onPress={onClose}>
        
        {/* Pressable here stops the click from bubbling up to the overlay */}
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {title && (
            <Label variant="subheading" bold style={styles.title}>
              {title}
            </Label>
          )}

          <View style={styles.content}>
            {children}
          </View>

          <Button 
            title="Close" 
            variant="primary" 
            onPress={onClose} 
            style={styles.closeButton}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)", // Darker overlay for better focus
  },
  container: {
    width: "85%",
    backgroundColor: Colors.white,
    borderRadius: 20, // Match your card border radius
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.black,
  },
  content: {
    marginVertical: 16,
  },
  closeButton: {
    marginTop: 8,
    width: '100%',
  },
});