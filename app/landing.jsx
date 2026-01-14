import { View, Text } from "react-native";
import { useContext } from "react";
import { EntryIntentContext } from "@context/EntryIntentContext";
import Button from "@components/Button";

export default function Landing() {
  const { setEntryIntent } = useContext(EntryIntentContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Shining the light on micro-mobility</Text>

      <Button title="Rent a Bike" onPress={() => setEntryIntent("RENT")} />
      <Button title="List a Bike" onPress={() => setEntryIntent("LIST")} />
    </View>
  );
}
