export const isValidEmail = (email) => {
  // Checks for format: text @ text . text
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isAtLeast16 = (dob) => {
  // Expects DD/MM/YYYY
  if (!dob.includes('/')) return false;

  const parts = dob.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
  const year = parseInt(parts[2], 10);
  
  const birthDate = new Date(year, month, day);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't happened yet this year
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 16;
};