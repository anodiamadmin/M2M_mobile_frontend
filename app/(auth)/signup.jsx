import { View } from "react-native";
import TextField from "@components/TextField";
import Button from "@components/Button";
import Label from "@components/Label";

export default function SignUp() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Label size={24} bold>
        Sign Up
      </Label>

      <TextField label="Full Name" />
      <TextField label="Date of Birth" />
      <TextField label="Email" />
      <TextField label="Create Password" secureTextEntry />

      <Button title="Continue" onPress={() => {}} />

      <Label size={14} style={{ marginTop: 16 }}>
        Already have an account? Sign In
      </Label>
    </View>
  );
}
