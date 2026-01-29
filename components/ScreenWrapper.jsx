import { StatusBar } from "expo-status-bar";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";

export default function ScreenWrapper({ 
  children, 
  style, 
  backgroundColor = Colors.white, 
  statusBar = "dark",  
  mode = "default",
  // ✅ Default to all edges keeps existing Auth screens safe
  edges = ["top", "bottom", "left", "right"] 
}) {
  const insets = useSafeAreaInsets();

  const screenPadding = {
    backgroundColor,
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
    paddingRight: edges.includes("right") ? insets.right : 0,
  };

  const content = (
    <View style={[styles.container, screenPadding, style]}>
      <StatusBar style={statusBar} />
      {mode === "form" ? (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {children}
        </KeyboardAvoidingView>
      ) : (
        children
      )}
    </View>
  );

  if (mode === "form") {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor }}>
          {content}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});