import { z } from "zod";

/**
 * Schema defining the structure and validation rules for a user registration request.
 * This schema ensures that all required fields are present and meet specific criteria.
 */
const RegisterSchema = z.object({
  /**
   * The user's email address. Must be a valid email format.
   * @example "user@example.com"
   */
  email: z.string().email({ message: "Invalid email address" }),

  /**
   * The user's password. Must meet the following criteria:
   * - Minimum length of 8 characters
   * - Contains at least one uppercase letter
   * - Contains at least one numeric digit
   * - Contains at least one special character
   */
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),

  /**
   * The user's first name. Optional field.
   */
  firstName: z.string().optional(),

  /**
   * The user's last name. Optional field.
   */
  lastName: z.string().optional(),

  /**
   * Indicates whether the user has administrative privileges.
   * Default value is false.
   */
  isAdmin: z.boolean().default(false),

  /**
   * Indicates whether the user is associated with a non-governmental organization (NGO).
   * Default value is false.
   */
  isNgoUser: z.boolean().default(false),
});

/**
 * Schema defining the structure and validation rules for a user login request.
 * This schema ensures that all required fields are present and meet specific criteria.
 */
const LoginSchema = z.object({
  /**
   * The user's email address. Must be a valid email format.
   * @example "user@example.com"
   */
  email: z.string().email({ message: "Invalid email address" }),

  /**
   * The user's password. This field is required for authentication.
   */
  password: z.string().min(1, { message: "Password is required" }),
});

/**
 * Schema defining the structure of a successful authentication response.
 * This schema ensures that the response contains valid identifiers and tokens.
 */
const AuthSuccessResponseSchema = z.object({
  /**
   * Unique identifier for the user. Must be a valid UUID format.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: z.string().uuid(),

  /**
   * JSON Web Token (JWT) used for authentication. Must be a valid JWT format.
   */
  token: z.string().jwt(),
});

/**
 * Schema defining the structure of a validation error response.
 * This schema ensures that error responses follow a consistent format.
 */
const ValidationErrorResponseSchema = z.object({
  /**
   * Status indicator for the response. Must be "Validation failed".
   */
  status: z.literal("Validation failed"),

  /**
   * Object containing error details. Keys represent field names, and values
   * contain error messages for each validation failure.
   */
  errors: z.record(z.unknown()),
});

/**
 * Type representing the structure of a registration request based on RegisterSchema.
 */
type RegisterRequest = z.infer<typeof RegisterSchema>;

/**
 * Type representing the structure of a login request based on LoginSchema.
 */
type LoginRequest = z.infer<typeof LoginSchema>;

/**
 * Type representing the structure of a successful authentication response
 * based on AuthSuccessResponseSchema.
 */
type AuthSuccessResponse = z.infer<typeof AuthSuccessResponseSchema>;

export {
  RegisterSchema,
  LoginSchema,
  AuthSuccessResponseSchema,
  RegisterRequest,
  LoginRequest,
  AuthSuccessResponse,
  ValidationErrorResponseSchema,
};
