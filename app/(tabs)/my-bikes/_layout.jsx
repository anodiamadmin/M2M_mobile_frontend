import { Stack } from "expo-router";

export default function MyBikesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="list" />
    </Stack>
  );
}
