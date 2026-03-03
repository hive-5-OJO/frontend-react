export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(phone);
};
