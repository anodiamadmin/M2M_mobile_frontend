import { View } from "react-native";
import { useState } from "react";
import TextField from "@components/TextField";
import Button from "@components/Button";
import Label from "@components/Label";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Label size={24} bold>
        Sign In
      </Label>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        testID="emailTextInput"
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="passwordTextInput"
      />

      <Button title="Continue" testID="SignInButton" onPress={() => {}} />

      <Label size={14} style={{ marginTop: 16 }}>
        Don’t have an account? Sign Up
      </Label>
    </View>
  );
}
