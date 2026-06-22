export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must contain at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least 1 lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least 1 number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least 1 special character";
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value.trim()) return `${fieldName} is required`;
  return "";
};

export const validateMatch = (value1, value2, errorMessage) => {
  if (value1 !== value2) return errorMessage;
  return "";
};
