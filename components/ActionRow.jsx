import { StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";
import Button from "./Button";
import Label from "./Label";

export default function ActionRow({ 
  text, 
  actionText, 
  onActionPress, 
  style,
  size = 14 // <--- Default is 14, but you can override it now
}) {
  return (
    <View style={[styles.container, style]}>
      {/* 1. The Helper Text */}
      <Label variant="body" size={size} color={Colors.tabInactive}>
        {text}{" "}
      </Label>
      
      {/* 2. The Action Link */}
      <Button 
        title={actionText}
        variant="hyperlink"
        onPress={onActionPress}
        textSize={size} // <--- Passing the size down
        style={{ marginVertical: 0, paddingHorizontal: 0 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 15 
  },
});