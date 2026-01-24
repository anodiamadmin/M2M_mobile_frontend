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
  mode = "default" // 'default' | 'form'
}) {
  const insets = useSafeAreaInsets();

  // 1. The Safe Layout Container
  // Logic: We apply padding manually so the background color fills the WHOLE screen (including notch),
  // but the content stays inside the safe zone.
  const Container = ({ children }) => (
    <View style={[
      styles.container, 
      { 
        backgroundColor, 
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      },
      style
    ]}>
      {/* Expo Status Bar handles Web/iOS/Android logic automatically */}
      <StatusBar style={statusBar} />
      {children}
    </View>
  );

  // 2. Form Mode: Wraps in KeyboardAvoiding + Dismiss Logic
  if (mode === "form") {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor }}>
          <Container>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              {children}
            </KeyboardAvoidingView>
          </Container>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // 3. Default Mode (Just Safe Area)
  return <Container>{children}</Container>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});