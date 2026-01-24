export const isValidEmail = (email) => {
  if (!email) return false;
  // We trim whitespace just in case the user copy-pasted with spaces
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isAtLeast16 = (dob) => {
  if (!dob) return false;

  // 1. Ensure we are working with a Date object
  const birthDate = new Date(dob);
  const today = new Date();

  // 2. Calculate the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  // 3. Adjust if the birthday hasn't happened yet this year
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 16;
};