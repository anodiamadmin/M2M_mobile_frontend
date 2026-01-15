import * as SecureStore from 'expo-secure-store';
import apiClient from './apiClient'; // Ensure filename matches (apiClient.js vs apiClients.js)

export const authService = {
  // LOGIN
  async login(email, password) {
    // Backend expects: { email, password }
    const response = await apiClient.post('/auth/signin', { email, password });
    
    if (response.data.access_token) {
      await SecureStore.setItemAsync('user_token', response.data.access_token);
    }
    return response.data;
  },

  // SIGN UP
  async register(name, email, password, dob) {
    // 1. Convert Frontend Date (DD/MM/YYYY) -> Backend Date (YYYY-MM-DD)
    let formattedDob = dob;
    if (dob.includes('/')) {
        const [day, month, year] = dob.split('/');
        formattedDob = `${year}-${month}-${day}`;
    }

    // 2. Map Frontend Names to Backend Schema
    const payload = {
      full_name: name,
      email: email,
      password: password,
      date_of_birth: formattedDob 
    };

    const response = await apiClient.post('/auth/signup', payload);
    return response.data;
  },

  // LOGOUT (Updated)
  async logout() {
    try {
      // 1. Attempt to remove token from Backend DB
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors here (e.g., if user is already offline, we still want to log them out locally)
      console.log("Backend logout failed:", error);
    } finally {
      // 2. ALWAYS remove token from Phone Storage
      await SecureStore.deleteItemAsync('user_token');
    }
  }
};