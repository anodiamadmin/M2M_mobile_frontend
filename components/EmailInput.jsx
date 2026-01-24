import TextField from "./TextField";

export default function EmailInput({ 
  value, 
  onChangeText, 
  error, 
  label = "Email",
  ...props 
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      placeholder="Enter Email"
      // LOCKING IN CORRECT SETTINGS
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      {...props}
    />
  );
}
