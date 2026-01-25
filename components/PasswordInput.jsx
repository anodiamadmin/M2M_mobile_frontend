import TextField from "./TextField";

export default function PasswordInput({ 
  value, 
  onChangeText, 
  error, 
  label = "Password",
  placeholder = "Enter Password",
  ...props
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      placeholder={placeholder}
      secureTextEntry={true}
      autoCapitalize="none"
      {...props}
    />
  );
}