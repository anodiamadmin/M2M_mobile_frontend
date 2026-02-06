import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';

// Initialize the API Key safely
const API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// ✅ 1. THE BRAIN (Moved from Screen to Service)
export const SYDNEY_CONTEXT = `
  You are the expert AI assistant for "Micro2Move" in Sydney, Australia.
  
  YOUR KNOWLEDGE BASE:
  - **Circular Quay Hub**: 20 Bikes, Fast Charging (Location: -33.861, 151.211)
  - **Barangaroo Reserve**: 15 Bikes, Standard Charging (Location: -33.863, 151.201)
  - **Central Station Point**: 30 Bikes, 24/7 Access (Location: -33.884, 151.206)
  
  RULES:
  - Keep answers concise.
  - Tone: Friendly, Australian, Eco-conscious.
`;

/**
 * Sends a message to the AI service with context.
 * @param {string} text - The user's current message.
 * @param {Array} history - The chat history in Gemini format.
 * @returns {Promise<string>} - The AI's text response.
 */
export const sendMessageToAI = async (text, history = []) => {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key in configuration.");
  }

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};