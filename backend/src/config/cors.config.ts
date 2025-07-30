import { CorsOptions } from "cors";

/**
 * Configuration object for Cross-Origin Resource Sharing (CORS) settings
 * This configuration is specifically tailored for development environments
 * and should not be used in production due to security implications
 */
export const corsOptions: CorsOptions = {
  /**
   * Allow requests from any origin
   * This is convenient for development but should be restricted in production
   * to specific domains
   */
  origin: "*",

  /**
   * Specify which HTTP methods are allowed
   * Includes standard methods for creating, reading, updating, and deleting resources
   */
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],

  /**
   * Define which headers can be used in the request
   * Setting to "*" allows all headers but may pose security risks
   */
  allowedHeaders: "*",

  /**
   * Specify which headers are exposed to the client
   * Setting to "*" allows all headers but may expose sensitive information
   */
  exposedHeaders: "*",

  /**
   * Allow credentials (cookies, authorization headers) to be included in requests
   * This is essential for authenticated requests but requires secure configuration
   */
  credentials: true,

  /**
   * Set the maximum age of the preflight response in seconds
   * This value (86400 seconds = 1 day) helps reduce the number of preflight requests
   */
  maxAge: 86400,
};
