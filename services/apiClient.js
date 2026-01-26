import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ngrok URL for https local dev
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error attaching token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;