import { ScrollView } from "react-native";
import Label from "@components/Label";
import Button from "@components/Button";

export default function Terms() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Label size={20} bold>
        Terms & Conditions
      </Label>

      <Label size={14} style={{ marginVertical: 16 }}>
        {/* Placeholder text */}
        These are the terms and conditions of Micro2Move...
      </Label>

      <Button title="OK" onPress={() => {}} />
    </ScrollView>
  );
}
