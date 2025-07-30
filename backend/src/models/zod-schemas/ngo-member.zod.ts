import { z } from "zod";

/**
 * Schema defining the structure of an NGO member with core attributes.
 * This schema represents a member's association with an NGO, including their user ID,
 * NGO ID, and administrative privileges.
 */
const NGOMemberSchema = z.object({
  /**
   * Unique identifier for the user associated with this NGO member.
   * This is a string representing the user ID in the system.
   */
  userId: z.string(),
  ngoId: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

/**
 * Schema defining the structure of NGO member hours with time and weekday information.
 * This schema represents the working hours of an NGO member, including start and end times
 * and the specific weekday these hours apply to.
 */
const NGOMemberHoursSchema = z.object({
  /**
   * Start time of the working hours in string format (e.g., "09:00").
   * This field should represent the time in a standardized format.
   */
  startTime: z.string(),
  /**
   * End time of the working hours in string format (e.g., "17:00").
   * This field should represent the time in a standardized format.
   */
  endTime: z.string(),
  /**
   * Weekday for which these hours are applicable (e.g., "Monday").
   * This field should represent the day of the week in a standardized format.
   */
  weekday: z.string(),
});

/**
 * Schema representing a NGO member with associated user details
 * This schema defines the structure of a NGO member including user information
 * @property {string} userId - Unique identifier for the user associated with this NGO member
 * @property {string} ngoId - Optional identifier for the NGO this member belongs to
 * @property {boolean} isAdmin - Indicates if the member has administrative privileges (default: false)
 * @property {string} firstName - Optional first name of the member
 * @property {string} lastName - Optional last name of the member
 * @property {string} email - Optional email address with validation for proper email format
 * @property {string} profilePictureLink - Optional URL to the member's profile picture (nullable)
 * @property {string} phoneNumber - Optional phone number (nullable)
 * @property {boolean} isNgoUser - Indicates if the user is associated with an NGO (default: false)
 */
const NGOMemberWithUserSchema = z.object({
  userId: z.string(),
  ngoId: z.string().optional(),
  isAdmin: z.boolean().default(false),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
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
  phoneNumber: z.string().optional().nullable(),
  isNgoUser: z.boolean().default(false),
  userIsAdmin: z.boolean().optional(),
  memberIsAdmin: z.boolean().optional(),
});

/**
 * Schema representing a NGO member with additional member hours information
 * This schema extends the basic NGO member schema to include working hours data
 * @property {NGOMemberWithUserSchema} ngoMember - Reference to the base NGO member information
 * @property {Array<MemberHours>} ngoMemberHours - Optional array of working hours entries
 * @typedef {Object} MemberHours
 * @property {string} startTime - Start time of the working hour (in ISO 8601 format)
 * @property {string} endTime - End time of the working hour (in ISO 8601 format)
 * @property {string} weekday - Day of the week for the working hour (e.g., "Monday")
 */
const NGOMemberWithMemberHoursSchema = z.object({
  ngoMember: NGOMemberWithUserSchema,
  ngoMemberHours: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
        weekday: z.string(),
      }),
    )
    .optional(),
});

/**
 * Schema representing a standard NGO member response
 * This schema is used for API responses containing NGO member data
 * @property {NGOMemberWithUserSchema} [data] - The core NGO member information
 * @property {NGOMemberWithMemberHoursSchema} [extendedData] - Additional member hours information if available
 */
const NGOMemberResponseSchema = NGOMemberSchema;

/**
 * Schema defining the structure of a request for an NGO member.
 * This schema is identical to the NGOMemberSchema and is used when receiving
 * member data from the client (e.g., for creation or update operations).
 */
const NGOMemberRequestSchema = NGOMemberSchema;

/**
 * Schema defining the structure of a response containing multiple NGO members with their hours.
 * This schema is an array of NGOMemberWithMemberHoursSchema objects, used when returning
 * a list of members along with their associated hours data.
 */
const NGOMembersWithHoursResponseSchema = z.array(
  NGOMemberWithMemberHoursSchema,
);

/**
 * Schema defining the structure of a request to retrieve members associated with an NGO.
 * This schema includes the NGO ID used to filter members, typically for GET operations.
 */
const NGOMembersRequestSchema = z.object({ ngoId: z.string() });

/**
 * Schema defining the structure of a request to create an NGO member with their hours.
 * This schema includes an array of NGOMemberHoursSchema objects representing the member's working hours.
 */
const NGOMemberPOSTRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional().nullable(),
  hours: z.array(NGOMemberHoursSchema),
});

/**
 * Schema defining the structure of a request to update an NGO member's hours.
 * This schema includes an array of NGOMemberHoursSchema objects representing the updated working hours.
 */
const NGOMemberPUTHoursRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional().nullable(),
  hours: z.array(NGOMemberHoursSchema),
});
const NGOMemberPUTNGORequestSchema = z.object({
  isAdmin: z.boolean().default(false),
  ngoId: z.string(),
});

/**
 * Schema defining the structure of a request to delete an NGO member's association with an NGO.
 * This schema includes the NGO ID used to remove the member from the NGO.
 */
const NGOMemberDELETENGORequestSchema = z.object({ ngoId: z.string() });
type NGOMemberWithMemberHours = z.infer<typeof NGOMemberWithMemberHoursSchema>;

export {
  NGOMemberResponseSchema,
  NGOMemberRequestSchema,
  NGOMembersWithHoursResponseSchema,
  NGOMembersRequestSchema,
  NGOMemberPOSTRequestSchema,
  NGOMemberPUTHoursRequestSchema,
  NGOMemberPUTNGORequestSchema,
  NGOMemberDELETENGORequestSchema,
  NGOMemberHoursSchema,
  NGOMemberSchema,
  NGOMemberWithMemberHours,
  NGOMemberWithMemberHoursSchema,
};
