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
  mode = "default"
}) {
  const insets = useSafeAreaInsets();

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
      <StatusBar style={statusBar} />
      {children}
    </View>
  );

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

  return <Container>{children}</Container>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});