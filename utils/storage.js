import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys
 * Keep these centralized to avoid typos across the app
 */
const STORAGE_KEYS = {
  AUTH_TOKEN: "AUTH_TOKEN",
  USER_PROFILE: "USER_PROFILE",
};

/**
 * Save auth token
 */
export async function saveAuthToken(token) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error("Error saving auth token", error);
  }
}

/**
 * Get auth token
 */
export async function getAuthToken() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error("Error getting auth token", error);
    return null;
  }
}

/**
 * Remove auth token (logout)
 */
export async function removeAuthToken() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error("Error removing auth token", error);
  }
}

/**
 * Save user profile (optional / future use)
 */
export async function saveUserProfile(profile) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error("Error saving user profile", error);
  }
}

/**
 * Get user profile
 */
export async function getUserProfile() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user profile", error);
    return null;
  }
}

/**
 * Clear all stored app data
 * Use carefully (logout / account deletion)
 */
export async function clearAllStorage() {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing storage", error);
  }
}
