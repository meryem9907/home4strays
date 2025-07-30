import dotenv from "dotenv";

/**
 * Initializes the Dotenv configuration to load environment variables from .env file.
 * This is a standard practice to manage configuration in development environments.
 *
 * @remarks
 * - This should be called once at the start of the application.
 * - Environment variables are loaded into `process.env`.
 */
dotenv.config();

/**
 * Retrieves a value from the environment variables.
 *
 * This function provides a typed and safe way to access environment variables.
 * If the specified key is not found, it returns the provided default value.
 *
 * @param key - The name of the environment variable to retrieve.
 * @param default_value - Optional default value to return if the key is not found.
 * @returns The value of the environment variable or the default value if not found.
 *
 * @example
 * const PORT = getSecret("PORT", "3000");
 *
 * @remarks
 * - The function is designed to be used with Starlight documentation.
 * - It ensures type safety by returning a string value.
 * - Always prefer using this function over direct `process.env` access for better maintainability.
 */
export function getSecret(key: string, default_value: string = "") {
  return process.env[`${key}`] || default_value;
}
