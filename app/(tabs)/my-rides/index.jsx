import Button from "@components/Button";
import Label from "@components/Label";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function MyRides() {
  
  const router = useRouter();
  const handleMBookingFilter = () => {
    router.push("/my-rides/booking-filter");
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Label variant= 'heading' secondary bold={false}>
        Your Bookings
      </Label>
      <Button style={{ marginTop: 16 }} title= "Book a New E-Bike" variant="primary" onPress= {handleMBookingFilter}/>
    </View>
  );
}
