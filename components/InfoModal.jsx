import { View, StyleSheet, Modal } from "react-native";
import Label from "./Label";
import Button from "./Button";

export default function InfoModal({
  title,
  children,
  onClose,
  visible = true,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && <Label>{title}</Label>}

          <View style={styles.content}>
            {children}
          </View>

          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  content: {
    marginVertical: 12,
  },
});
