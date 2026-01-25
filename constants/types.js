/**
 * Authentication Status of the current user.
 * @readonly
 * @enum {string}
 */
export const AuthStatus = Object.freeze({
  UNKNOWN: "UNKNOWN",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
});

/**
 * User's intent when entering from the Landing Page.
 * @readonly
 * @enum {string}
 */
export const EntryIntent = Object.freeze({
  RENT: "RENT",
  LIST: "LIST",
});

/**
 * Which specific tab/screen the user wants to jump to after login.
 * @readonly
 * @enum {string}
 */
export const TabIntent = Object.freeze({
  RIDES: "RIDES",
  BIKES: "BIKES",
  PROFILE: "PROFILE",
});