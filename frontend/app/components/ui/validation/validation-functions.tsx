/**
 * Validates email format for new user registration.
 *
 * Performs comprehensive email validation including format checking
 * and existence validation (planned feature).
 *
 * Validation Rules:
 * - Email is required (not empty)
 * - Must match standard email format regex pattern
 * - Future: Check if email already exists in system
 *
 * @param {string} email - Email address to validate
 * @returns {string} Empty string if valid, error message if invalid
 *
 * @example
 * ```typescript
 * const error = validateNewEmail("user@example.com");
 * if (error) {
 *   console.log("Validation failed:", error);
 * } else {
 *   console.log("Email is valid");
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In a form component
 * const [emailError, setEmailError] = useState("");
 *
 * const handleEmailChange = (email: string) => {
 *   const error = validateNewEmail(email);
 *   setEmailError(error);
 * };
 * ```
 */
export function validateNewEmail(email: string) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return "Email is required.";
  }
  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }
  // TODO: Check if email already exists
  return "";
}

/**
 * Validates email format for existing user authentication.
 *
 * Simpler validation for login scenarios where we only need
 * format validation, not existence checking.
 *
 * Validation Rules:
 * - Email is required (not empty)
 * - Must match standard email format regex pattern
 * - Future: Check if email exists in system
 *
 * @param {string} email - Email address to validate
 * @returns {string} Empty string if valid, error message if invalid
 *
 * @example
 * ```typescript
 * const error = validateEmail("user@example.com");
 * if (error) {
 *   showLoginError(error);
 * } else {
 *   attemptLogin(email, password);
 * }
 * ```
 */
export function validateEmail(email: string) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return "Email is required.";
  }
  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }
  // TODO: Check if email is known
  return "";
}

/**
 * Validates password strength for new user registration.
 *
 * Implements comprehensive password security requirements to ensure
 * user accounts are protected with strong passwords.
 *
 * Password Requirements:
 * - Minimum 8 characters length
 * - At least one digit (0-9)
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 *
 * @param {string} password - Password to validate
 * @returns {string} Empty string if valid, error message if invalid
 *
 * @example
 * ```typescript
 * const error = validateNewPassword("MyPassword123");
 * if (error) {
 *   setPasswordError(error);
 * } else {
 *   // Password meets all requirements
 *   proceedWithRegistration();
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Real-time password validation in form
 * const handlePasswordChange = (password: string) => {
 *   const error = validateNewPassword(password);
 *   setPasswordStrength(error ? "weak" : "strong");
 *   setPasswordError(error);
 * };
 * ```
 */
export function validateNewPassword(password: string) {
  const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!password) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!passwordPattern.test(password)) {
    return "Password must include at least one number, one lowercase letter, and one uppercase letter.";
  }
  return "";
}

/**
 * Validates password for existing user authentication.
 *
 * Simple validation for login scenarios where we only need
 * to ensure a password was provided.
 *
 * @param {string} password - Password to validate
 * @returns {string} Empty string if valid, error message if invalid
 *
 * @todo Implement full password validation logic
 *
 * @example
 * ```typescript
 * const error = validatePassword(enteredPassword);
 * if (error) {
 *   showLoginError(error);
 * } else {
 *   attemptLogin(email, password);
 * }
 * ```
 */
export function validatePassword(password: string) {
  if (!password) {
    return "Password is required.";
  }
  // TODO: Implement password validation
  return "";
}

/**
 * Validates that a required field has been filled.
 *
 * Generic validation function for any required form field
 * to ensure users provide necessary information.
 *
 * @param {string} date - Field value to validate (named 'date' but works for any string)
 * @returns {string} Empty string if valid, error message if invalid
 *
 * @example
 * ```typescript
 * const nameError = validateRequired(firstName);
 * const dobError = validateRequired(dateOfBirth);
 * const cityError = validateRequired(city);
 *
 * if (nameError || dobError || cityError) {
 *   // Show validation errors
 *   return;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In form validation
 * const errors = {};
 * if (validateRequired(name)) errors.name = validateRequired(name);
 * if (validateRequired(email)) errors.email = validateRequired(email);
 * ```
 */
export function validateRequired(date: string) {
  if (!date) {
    return "This field is required.";
  }
  return "";
}
