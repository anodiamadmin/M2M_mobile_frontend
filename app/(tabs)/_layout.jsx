import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="my-rides" />
      <Tabs.Screen name="my-bikes" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
