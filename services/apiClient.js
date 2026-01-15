import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// SPECIAL IP FOR ANDROID EMULATOR
// If testing on a real device, use your PC's IP (e.g., http://192.168.1.5:8000)
const BASE_URL = 'https://c3e26c36be30.ngrok-free.app';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to requests if we have one
apiClient.interceptors.request.use(
  async (config) => {
    console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`); // <--- ADD THIS
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