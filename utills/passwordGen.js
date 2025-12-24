import { randomInt } from 'node:crypto';

// Server restart hone tak duplicates track karega
const usedPasswords = new Set();

/**
 * Generates a unique 8-character alphanumeric + special char password
 * @returns {string}
 */
export const generateUniquePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const passwordLength = 8;
  
  let password;
  let isUnique = false;

  // Total combinations are 70^8, which is massive (~576 trillion)
  while (!isUnique) {
    let generated = '';
    for (let i = 0; i < passwordLength; i++) {
      // Har position ke liye random character pick karna
      const randomIndex = randomInt(0, chars.length);
      generated += chars[randomIndex];
    }
    
    password = generated;

    // Duplicate check
    if (!usedPasswords.has(password)) {
      usedPasswords.add(password);
      isUnique = true;
    }
  }

  return password;
};