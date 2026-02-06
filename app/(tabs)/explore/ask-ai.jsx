import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

// Custom Components
import BrandLogo from "@/components/BrandLogo";
import Label from "@/components/Label";
import ScreenWrapper from "@/components/ScreenWrapper";
import TextField from "@/components/TextField"; // ✅ Imported your component
import { Colors } from "@/theme/colors";

// Logic & Data
import { sendMessageToAI, SYDNEY_CONTEXT } from "@/services/AIService";

export default function AskAIScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);

  // State
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); 
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      text: "G'day! I'm your Micro2Move guide for Sydney. Ask me about stations, routes, or bike safety.",
      sender: 'ai'
    }
  ]);

  const navItems = [
    { id: "maps", label: "Maps", path: "/(tabs)/explore" },
    { id: "info", label: "Info", path: "/explore/info" },
    { id: "community", label: "Community Update", path: "/explore/community-updates" },
    { id: "ask-ai", label: "Ask AI", path: "/explore/ask-ai" },
  ];
  const activeTab = "ask-ai";

  // Manual Keyboard Listener (For Android Fix)
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height); 
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const userText = inputText;
    setInputText(""); 
    
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, sender: 'user' }]);
    setIsLoading(true);

    try {
      const historyPayload = [
        { role: "user", parts: [{ text: SYDNEY_CONTEXT }] },
        { role: "model", parts: [{ text: "Understood." }] },
        ...chatHistory
      ];

      const aiResponseText = await sendMessageToAI(userText, historyPayload);

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' }]);
      setChatHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: aiResponseText }] }
      ]);

    } catch (error) {
      Alert.alert("Connection Error", "Could not reach the AI service.");
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "I'm having trouble connecting. Please try again.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, keyboardHeight]); 

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
             <View style={styles.botIcon}>
                 <Ionicons name="sparkles" size={14} color={Colors.white} />
             </View>
        )}
        <Label color={isUser ? Colors.white : Colors.black} style={{ lineHeight: 20 }}>
          {item.text}
        </Label>
      </View>
    );
  };

  return (
    <ScreenWrapper backgroundColor={Colors.white} edges={["top"]}>
      
      <View style={styles.headerSpacing}>
        <BrandLogo />
      </View>
      
      {/* Main Content Area - Padded by Keyboard Height */}
      <View style={[styles.chatContainerWrapper, { paddingBottom: keyboardHeight }]}>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Area */}
          <View style={styles.inputWrapper}>
             
             {/* ✅ Using Your TextField Component Here */}
             <TextField
                placeholder="Ask AI..."
                value={inputText}
                onChangeText={setInputText}
                // Override default container style to fit row
                style={{ marginBottom: 0, flex: 1 }} 
                // Custom look for Chat (White bg, Border)
                inputStyle={{ 
                    height: 50, 
                    borderRadius: 25, 
                    backgroundColor: Colors.white, 
                    borderColor: Colors.primary, 
                    borderWidth: 1 
                }}
             />

             <TouchableOpacity 
                style={[styles.sendButton, { opacity: isLoading || !inputText ? 0.5 : 1 }]} 
                onPress={handleSend}
                disabled={isLoading || !inputText}
             >
                {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                    <Ionicons name="send" size={20} color={Colors.white} />
                )}
             </TouchableOpacity>
          </View>
      </View>

      {/* Hide Nav Bar when Keyboard is Open */}
      {keyboardHeight === 0 && (
        <View style={styles.navContainer}>
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                <TouchableOpacity 
                    key={item.id} 
                    onPress={() => { if (!isActive) router.push(item.path); }} 
                    activeOpacity={0.7} 
                    style={styles.navTouchable}
                >
                    <Label 
                        size={isActive ? 16 : 15} 
                        bold={isActive} 
                        color={isActive ? Colors.success : Colors.primary} 
                        style={[!isActive && styles.navUnderline]}
                    >
                    {item.label}
                    </Label>
                </TouchableOpacity>
                );
            })}
        </View>
      )}

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerSpacing: { marginTop: 10, marginBottom: 5, paddingHorizontal: 16 },
  
  chatContainerWrapper: { flex: 1 }, 
  chatListContent: { padding: 16, paddingBottom: 20 },

  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: Colors.inputBackground, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border, marginLeft: 10 },
  botIcon: { position: 'absolute', top: -10, left: -10, backgroundColor: Colors.success, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex: 1 },

  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    paddingHorizontal: 16, 
    backgroundColor: Colors.white, 
    borderTopWidth: 1, 
    borderTopColor: Colors.border,
    gap: 10 
  },
  sendButton: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  navContainer: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  navTouchable: { paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  navUnderline: { textDecorationLine: "underline" },
});