import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import BrandLogo from "../../components/BrandLogo";
import Button from "../../components/Button";
import Label from "../../components/Label";
import ScreenWrapper from "../../components/ScreenWrapper";
import { Colors } from "../../theme/colors";

export default function Terms() {
  const router = useRouter();

  return (
    <ScreenWrapper mode="scroll" statusBar="dark">
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BrandLogo style={{ marginBottom: 10 }} />
          <Label variant="heading">Terms & Conditions</Label>
        </View>

        <View style={styles.body}>
          <Label 
            size={14} 
            color={Colors.secondary}
            style={styles.text}
            variant="body"
          >
            Welcome to Micro2Move! Please read these Terms and Conditions carefully before using our services. By accessing or using the service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
            {"\n\n"}
            Our service allows you to connect with a community of safe biking enthusiasts, providing resources, tutorials, and e-bike sharing opportunities. We are committed to promoting safe biking practices in Sydney.
            {"\n\n"}
            You are responsible for complying with all local laws regarding biking and ensuring your safety while using our service. We are not liable for any injuries or damages sustained while using the service. For more information on our privacy policy and user respon...{" "}
            
            <Label 
              size={14} 
              bold
              variant= "body"
              color={Colors.primary} 
              onPress={() => console.log("Read More Clicked")}
              style={{ textDecorationLine: 'underline' }}
            >
              Read more
            </Label>
          </Label>
        </View>

        <Button 
          title="Ok" 
          variant="primary" 
          onPress={() => router.back()} 
          style={{ marginTop: 20 }}
        />

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20, 
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'flex-start', 
  },
  body: {
    marginBottom: 20,
  },
  text: {
    lineHeight: 22,
    textAlign: 'justify',
  },
});