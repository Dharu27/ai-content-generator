export const handleAuthError = (error) => {
  if (!error) return "Something went wrong. Please try again later.";
  
  const message = typeof error === 'string' ? error.toLowerCase() : (error.message?.toLowerCase() || "");
  
  if (message.includes("network") || message.includes("internet") || message.includes("fetch") || message.includes("failed to fetch")) {
    return "Unable to connect. Please check your internet connection.";
  }
  
  if (message.includes("timeout")) {
    return "Request timeout. Please try again.";
  }

  if (message.includes("invalid email or password") || message.includes("credentials") || message.includes("wrong password")) {
    return "Invalid email or password.";
  }

  if (message.includes("already exists") || message.includes("taken") || message.includes("duplicate")) {
    return "An account already exists with this email.";
  }

  if (message.includes("not found")) {
    return "Account not found.";
  }
  
  if (message.includes("unauthorized") || message.includes("forbidden")) {
    return "Unauthorized access.";
  }

  return "Something went wrong. Please try again later.";
};
