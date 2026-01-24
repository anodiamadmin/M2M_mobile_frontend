import { useState } from "react";
import TextField from "./TextField";

export default function PasswordInput({ 
  value, 
  onChangeText, 
  error, 
  label = "Password",
  placeholder = "Enter Password",
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      placeholder={placeholder}
      // DYNAMIC LOGIC
      secureTextEntry={!isVisible}
      rightIcon={isVisible ? "eye-off" : "eye"} 
      onRightIconPress={() => setIsVisible(!isVisible)}
      autoCapitalize="none"
      {...props}
    />
  );
}