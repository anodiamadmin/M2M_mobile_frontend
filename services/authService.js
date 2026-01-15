import * as SecureStore from 'expo-secure-store';
import apiClient from './apiClient';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/signin', { email, password });
    
    if (response.data.access_token) {
      await SecureStore.setItemAsync('user_token', response.data.access_token);
    }
    return response.data;
  },

  async register(name, email, password, dob) {
    let formattedDob = dob;
    if (dob.includes('/')) {
        const [day, month, year] = dob.split('/');
        formattedDob = `${year}-${month}-${day}`;
    }

    const payload = {
      full_name: name,
      email: email,
      password: password,
      date_of_birth: formattedDob 
    };

    const response = await apiClient.post('/auth/signup', payload);
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.log("Backend logout failed:", error);
    } finally {
      await SecureStore.deleteItemAsync('user_token');
    }
  }
};