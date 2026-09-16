export const validateUserName = (userName) => {

  const value = userName.trim();


  if (!value) {
    return "Username is required";
  }


  if (value.length < 2 || value.length > 50) {
    return "Username must be between 2 and 50 characters";
  }


  return "";
};

export const validateEmail = (email) => {

  const value = email.trim();


  if (!value) {
    return "Email is required";
  }


  if (value.length > 254) {
    return "Email address is too long";
  }


  // Same general validation approach as backend
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (!emailRegex.test(value)) {
    return "Please enter a valid email address";
  }


  return "";
};

export const validatePassword = (password) => {

  const errors = [];


  if (!password) {
    return ["Password is required"];
  }


  if (password.length < 8) {
    errors.push(
      "Password must be at least 8 characters"
    );
  }


  if (password.length > 100) {
    errors.push(
      "Password must not exceed 100 characters"
    );
  }


  if (!/[A-Z]/.test(password)) {
    errors.push(
      "Password must contain at least one uppercase letter"
    );
  }


  if (!/[a-z]/.test(password)) {
    errors.push(
      "Password must contain at least one lowercase letter"
    );
  }


  if (!/\d/.test(password)) {
    errors.push(
      "Password must contain at least one number"
    );
  }


  if (!/[@$!%*?&]/.test(password)) {
    errors.push(
      "Password must contain at least one special character"
    );
  }


  return errors;
};


export const validateConfirmPassword = (
  password,
  confirmPassword
) => {

  if (!confirmPassword) {
    return "Please confirm your password";
  }


  if (password !== confirmPassword) {
    return "Passwords do not match";
  }


  return "";
};