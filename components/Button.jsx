import { Pressable, Text } from "react-native";

export default function Button({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ padding: 12 }}>
      <Text>{title}</Text>
    </Pressable>
  );
}
