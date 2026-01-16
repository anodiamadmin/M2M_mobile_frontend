import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Button from "../../components/Button";
import Label from "../../components/Label";
import { Colors } from "../../theme/colors";

export default function Terms() {
  const router = useRouter();

  const handleOk = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header */}
        <View style={styles.logoHeader}>
           <Image 
             source={require("../../assets/images/LogoLightNoNameNoBg.png")} 
             style={styles.headerLogo}
             resizeMode="contain"
           />
           <Label size={20} bold color={Colors.primary}>
             micro2move
           </Label>
        </View>

        {/* Title */}
        <Label size={24} bold style={styles.pageTitle}>
          Terms & Conditions
        </Label>

        {/* Main Content Text */}
        <Label 
          size={14} 
          secondary 
          color="#444" 
          style={styles.textContent}
        >
          Welcome to Micro2Move! Please read these Terms and Conditions carefully before using our services. By accessing or using the service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
          {"\n\n"}
          Our service allows you to connect with a community of safe biking enthusiasts, providing resources, tutorials, and e-bike sharing opportunities. We are committed to promoting safe biking practices in Sydney.
          {"\n\n"}
          You are responsible for complying with all local laws regarding biking and ensuring your safety while using our service. We are not liable for any injuries or damages sustained while using the service. For more information on our privacy policy and user respon...{" "}
          
          {/* THE FIX: Use Button, but strip container styles and push it down */}
          <Button 
            title="Read more" 
            variant="hyperlink" 
            onPress={() => console.log("Read More Clicked")}
            textSize={14}
            style={styles.inlineButton} // <--- Applies the alignment tweak
          />
        </Label>

        <Button 
          title="OK" 
          variant="primary" 
          onPress={handleOk} 
          style={{ marginTop: 30 }}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLogo: {
    width: 60, 
    height: 60,
  },
  pageTitle: {
    marginBottom: 20,
    color: "#4A5D4F", 
  },
  textContent: {
    lineHeight: 22, 
    textAlign: "justify", 
  },
  // THE TWEAK
  inlineButton: {
    // 1. Remove the "Box" feel
    height: undefined,
    minHeight: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    
    // 2. Push it down to align with text baseline
    // You might need to adjust '4' to '3' or '5' depending on your exact font
    transform: [{ translateY: 1.5 }], 
    
    // 3. Ensure it flows inline
    marginBottom: -4, 
  }
});





// import Button from "@components/Button";
// import Label from "@components/Label";
// import { Colors } from "@theme/colors";
// import { useRouter } from "expo-router";
// import { Image, ScrollView, StyleSheet, View } from "react-native";

// export default function Terms() {
//   const router = useRouter();

//   const handleOk = () => {
//     router.back(); 
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
        
//         {/* Header */}
//         <View style={styles.logoHeader}>
//            <Image 
//              source={require("../../assets/images/LogoLightNoNameNoBg.png")} 
//              style={styles.headerLogo}
//              resizeMode="contain"
//            />
//            <Label size={20} bold color={Colors.primary}>
//              micro2move
//            </Label>
//         </View>

//         {/* Title */}
//         <Label size={24} bold style={styles.pageTitle}>
//           Terms & Conditions
//         </Label>

//         {/* Main Content Text */}
//         <Label 
//           size={14} 
//           secondary 
//           color="#444" 
//           style={styles.textContent}
//         >
//           Welcome to Micro2Move! Please read these Terms and Conditions carefully before using our services. By accessing or using the service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
//           {"\n\n"}
//           Our service allows you to connect with a community of safe biking enthusiasts, providing resources, tutorials, and e-bike sharing opportunities. We are committed to promoting safe biking practices in Sydney.
//           {"\n\n"}
//           You are responsible for complying with all local laws regarding biking and ensuring your safety while using our service. We are not liable for any injuries or damages sustained while using the service. For more information on our privacy policy and user respon...{" "}
          
//           <Button 
//             title="Read more" 
//             variant="hyperlink" 
//             onPress={() => console.log("Read More Clicked")}
//             textSize={14}
//           />
//         </Label>

//         <Button 
//           title="OK" 
//           variant="primary" 
//           onPress={handleOk} 
//           style={{ marginTop: 30 }}
//         />

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     paddingTop: 40,
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//   },
//   logoHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   headerLogo: {
//     width: 60, 
//     height: 60,
//   },
//   pageTitle: {
//     marginBottom: 20,
//     color: "#4A5D4F", 
//   },
//   textContent: {
//     lineHeight: 22, 
//     textAlign: "justify", 
//   },
// });