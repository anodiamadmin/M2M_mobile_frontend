import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet } from 'react-native';
import { Colors } from "../theme/colors";
import Label from "./Label";

export default function VerifiedBadge({ 
    isVerified = false, 
    size = "small", 
    style 
}) {
    if (!isVerified) return null;

    const isSmall = size === "small";
    const iconSize = isSmall ? 18 : 24;
    
    // Deep Emerald Green
    const verifiedGreen = Colors.success; 

    const handlePress = () => {
        Alert.alert(
            "Verified Status",
            "This e-bike is tested and battle-hardened!",
            [{ text: "Awesome!", style: "default" }]
        );
    };

    return (
        <Pressable 
            onPress={handlePress}
            style={({ pressed }) => [
                styles.container, 
                { opacity: pressed ? 0.6 : 1 }, // Haptic-like visual feedback
                style
            ]}
        >
            <Ionicons 
                name="shield-checkmark-sharp" 
                size={iconSize} 
                color={verifiedGreen} 
            />
            <Label 
                variant="caption" 
                bold 
                style={[
                    styles.text, 
                    { color: verifiedGreen, fontSize: isSmall ? 8 : 10 }
                ]}
            >
                VERIFIED
            </Label>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
        padding: 4, // Increased hit slop for better touch experience
    },
    text: {
        marginTop: -1, 
        letterSpacing: 0.5,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});