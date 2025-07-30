import { z } from "zod";
import { NGOMemberHoursSchema } from "./ngo-member.zod";
/**
 * Represents a user entity with core authentication and profile information.
 * This schema defines the structure of a user in the system, including optional fields
 * for flexibility while maintaining type safety through Zod validation.
 */
const UserSchema = z.object({
  /**
   * Unique identifier for the user, generated as a UUID.
   * This field is optional for new users but becomes required upon creation.
   * Used for unambiguous identification across the system.
   */
  id: z.string().uuid().optional(),
  /**
   * User's first name.
   * This field is optional but recommended for personalization.
   * Used in display names and communication with the user.
   */
  firstName: z.string().optional(),
  /**
   * User's last name.
   * This field is optional but recommended for personalization.
   * Used in display names and communication with the user.
   */
  lastName: z.string().optional(),
  /**
   * User's email address.
   * Must be a valid email format and is optional for new users.
   * Used for authentication, notifications, and account recovery.
   */
  email: z.string().email().optional(),
  /**
   * User's password.
   * This field is optional but must be securely hashed and stored in production.
   * Never transmitted in plain text; always hashed using industry-standard algorithms.
   */
  password: z.string().optional(),
  /**
   * URL to the user's profile picture.
   * Must be a valid URL if provided. Can be null if no picture is available.
   * Used for visual representation in user interfaces.
   */
  profilePictureLink: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      try {
        new URL(val);
        return val;
      } catch {
        return null;
      }
    }),
  /**
   * Local file path to the user's profile picture.
   * This field is optional and used for internal storage references.
   * Used when storing profile pictures in local file systems.
   */
  profilePicturePath: z.string().optional().nullable(),
  /**
   * User's phone number.
   * This field is optional and may contain international formatting.
   * Used for contact purposes and verification processes.
   */
  phoneNumber: z.string().optional().nullable(),
  /**
   * Boolean indicating if the user has administrative privileges.
   * Defaults to false for regular users.
   * Used to determine access to administrative features and data.
   */
  isAdmin: z.boolean().default(false),
  /**
   * Boolean indicating if the user is associated with an NGO.
   * Defaults to false for non-NGO users.
   * Used to determine eligibility for NGO-specific features and data.
   */
  isNgoUser: z.boolean().default(false),
});

/**
 * Represents the request schema for retrieving or updating a user's profile picture.
 * This schema is used to validate incoming requests related to user profile picture operations.
 * The schema is intentionally empty to indicate that no specific payload is required for this request.
 * It serves as a placeholder for potential future fields that may be added in subsequent versions.
 */
const UserProfilePictureRequest = z.object({});

/**
 * Response schema for user profile picture updates.
 * Contains a success message and the updated profile picture URL.
 */
const UserProfilePictureResponse = z.object({
  /**
   * Success message indicating the profile picture update was processed.
   * Used to inform the client of successful operation.
   */
  message: z.string(),
  /**
   * Updated URL to the user's profile picture.
   * This field is guaranteed to be a valid URL when provided.
   * Used to display the new profile picture to the user.
   */
  profilePictureLink: z.string().transform((val) => {
    if (!val || val.trim() === "") return "";
    try {
      new URL(val);
      return val;
    } catch {
      return "";
    }
  }),
});

/**
 * Represents a user entity with sensitive information removed.
 * This schema is used for public-facing user data where password fields should be excluded.
 */
const PublicUserSchema = UserSchema.omit({ password: true });

/**
 * Schema for querying multiple public user records.
 * This schema defines the structure of a response containing an array of public user data.
 */
const PublicUserQueryResultSchema = z.array(PublicUserSchema);

/**
 * Type alias for the inferred type of UserSchema.
 * This provides type safety for user data in the application.
 */
type UserSchemaType = z.infer<typeof UserSchema>;

/**
 * Type alias for the inferred type of PublicUserSchema.
 * This provides type safety for public user data in the application.
 */
type PublicUser = z.infer<typeof PublicUserSchema>;

/**
 * Schema for querying multiple user records.
 * This schema defines the structure of a response containing an array of user data.
 */
const UserQueryResultSchema = z.array(UserSchema);

/**
 * Schema for representing a successful user operation response.
 * This schema is used when returning user data without sensitive information.
 */
const UserSuccessResponseSchema = PublicUserSchema;

/**
 * Type alias for the inferred type of UserSchema.
 * This provides type safety for user data in the application.
 */
type UserResponse = z.infer<typeof UserSchema>;

/**
 * Type alias for the inferred type of UserQueryResultSchema.
 * This provides type safety for user query results in the application.
 */
type UserQueryResult = z.infer<typeof UserQueryResultSchema>;

/**
 * Type alias for the inferred type of UserSuccessResponseSchema.
 * This provides type safety for successful user operation responses.
 */
type UserSuccessResponse = z.infer<typeof UserSuccessResponseSchema>;

/**
 * Type alias for the inferred type of PublicUserQueryResultSchema.
 * This provides type safety for public user query results in the application.
 */
type PublicUserQueryResult = z.infer<typeof PublicUserQueryResultSchema>;

export {
  UserSchema,
  PublicUserSchema,
  PublicUserQueryResultSchema,
  UserSchemaType,
  PublicUser,
  UserQueryResultSchema,
  UserSuccessResponseSchema,
  UserResponse,
  UserQueryResult,
  UserSuccessResponse,
  PublicUserQueryResult,
  UserProfilePictureResponse,
  UserProfilePictureRequest,
};
