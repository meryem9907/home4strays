import { z } from "zod";
/**
 * Schema representing the working hours of a caretaker
 * @property {string} startTime - Start time of the working hours in ISO 8601 format
 * @property {string} endTime - End time of the working hours in ISO 8601 format
 * @property {string} weekday - Day of the week the hours apply to (e.g., Monday)
 */
const CTHoursSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  weekday: z.string(),
});

/**
 * Schema representing core caretaker information
 * @property {number} space - Available living space in square meters
 * @property {string} experience - Level of experience (e.g., "Beginner", "Intermediate")
 * @property {string} tenure - Length of time in current residence (e.g., "5+ years")
 * @property {string} maritalStatus - Marital status (e.g., "Single", "Married")
 * @property {boolean} financialAssistance - Indicates if financial assistance is available
 * @property {string} localityType - Type of area (e.g., "Urban", "Suburban")
 * @property {boolean} garden - Indicates if a garden is available
 * @property {number} floor - Floor number of residence
 * @property {string} residence - Type of residence (e.g., "Apartment", "House")
 * @property {string} streetName - Street name of residence
 * @property {string} cityName - City name of residence
 * @property {string} zip - ZIP code of residence
 * @property {string} country - Country of residence
 * @property {string} houseNumber - House number of residence
 * @property {string} employmentType - Employment status (e.g., "Full-time", "Part-time")
 * @property {boolean} previousAdoption - Indicates if the caretaker has previous adoption experience
 * @property {number} numberKids - Number of children the caretaker is willing to care for
 * @property {Date} birthdate - Date of birth (coerced to Date type)
 * @property {boolean} holidayCare - Indicates if holiday care is available
 * @property {boolean} adoptionWillingness - Indicates if the caretaker is willing to adopt
 */
const CaretakerSchema = z.object({
  space: z.number(),
  experience: z.string(),
  tenure: z.string(),
  maritalStatus: z.string(),
  financialAssistance: z.boolean(),
  localityType: z.string(),
  garden: z.boolean(),
  floor: z.number(),
  residence: z.string(),
  streetName: z.string(),
  cityName: z.string(),
  zip: z.string(),
  country: z.string(),
  houseNumber: z.string(),
  employmentType: z.string(),

  previousAdoption: z.boolean(),
  numberKids: z.number(),
  birthdate: z.coerce.date(),
  holidayCare: z.boolean(),
  adoptionWillingness: z.boolean(),
});

/**
 * Schema representing a complete caretaker profile including user data
 * @property {number} space - Available living space in square meters
 * @property {string} experience - Level of experience (e.g., "Beginner", "Intermediate")
 * @property {string} tenure - Length of time in current residence (e.g., "5+ years")
 * @property {string} maritalStatus - Marital status (e.g., "Single", "Married")
 * @property {boolean} financialAssistance - Indicates if financial assistance is available
 * @property {string} localityType - Type of area (e.g., "Urban", "Suburban")
 * @property {boolean} garden - Indicates if a garden is available
 * @property {number} floor - Floor number of residence
 * @property {string} residence - Type of residence (e.g., "Apartment", "House")
 * @property {string} streetName - Street name of residence
 * @property {string} cityName - City name of residence
 * @property {string} zip - ZIP code of residence
 * @property {string} country - Country of residence
 * @property {string} houseNumber - House number of residence
 * @property {string} employmentType - Employment status (e.g., "Full-time", "Part-time")
 * @property {boolean} previousAdoption - Indicates if the caretaker has previous adoption experience
 * @property {number} numberKids - Number of children the caretaker is willing to care for
 * @property {Date} birthdate - Date of birth (coerced to Date type)
 * @property {boolean} holidayCare - Indicates if holiday care is available
 * @property {boolean} adoptionWillingness - Indicates if the caretaker is willing to adopt
 * @property {string} firstName - User's first name (optional)
 * @property {string} lastName - User's last name (optional)
 * @property {string} email - User's email address (optional, must be valid email format)
 * @property {string} password - User's password (optional)
 * @property {string} profilePictureLink - URL to profile picture (optional, must be valid URL)
 * @property {string} profilePicturePath - Local path to profile picture (optional)
 * @property {string} phoneNumber - User's phone number (optional)
 * @property {boolean} isAdmin - Indicates if the user has admin privileges (default false)
 * @property {boolean} isNgoUser - Indicates if the user is associated with an NGO (default false)
 * @property {CTHoursSchema[]} ctHours - Array of working hours configurations
 */
const CompleteCaretakerSchema = z.object({
  // ct data
  space: z.number(),
  experience: z.string(),
  tenure: z.string(),
  maritalStatus: z.string(),
  financialAssistance: z.boolean(),
  localityType: z.string(),
  garden: z.boolean(),
  floor: z.number(),
  residence: z.string(),
  streetName: z.string(),
  cityName: z.string(),
  zip: z.string(),
  country: z.string(),
  houseNumber: z.string(),
  employmentType: z.string(),
  previousAdoption: z.boolean(),
  numberKids: z.number(),
  birthdate: z.coerce.date(),
  holidayCare: z.boolean(),
  adoptionWillingness: z.boolean(),
  //user data
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
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
  profilePicturePath: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  isAdmin: z.boolean().default(false).optional(),
  isNgoUser: z.boolean().default(false).optional(),
  // hours
  ctHours: z.array(CTHoursSchema),
});

/**
 * Schema representing the structure of a single caretaker response.
 * This schema is used to validate the format of the response body
 * when retrieving information about a single caretaker resource.
 * It ensures consistency in data representation across API endpoints.
 */
const SingleCaretakerResponseSchema = CaretakerSchema;
/**
 * Schema defining the structure of a request payload for caretaker operations.
 * This schema enforces data validation for request bodies when creating
 * or updating caretaker records. It ensures all required fields are present
 * and follow the expected data types and format specifications.
 */
const SingleCaretakerRequestSchema = CaretakerSchema;

/**
 * Schema representing a caretaker response for list operations
 * @property {CompleteCaretakerSchema[]} data - Array of complete caretaker profiles
 */
const CaretakerResponseSchema = z.array(CompleteCaretakerSchema);

/**
 * Represents a schema for an array of caretaker request data.
 * This schema is used to validate incoming requests that require caretaker information.
 * Each item in the array conforms to the CaretakerSchema definition.
 * @see CaretakerSchema
 */
const CaretakerRequestSchema = z.array(CaretakerSchema);

/**
 * Represents a schema for an array of complete caretaker data.
 * This schema is used to validate and structure complete caretaker information,
 * including all available fields defined in the CompleteCaretakerSchema.
 * @see CompleteCaretakerSchema
 */
const CompleteCaretakersSchema = z.array(CompleteCaretakerSchema);

/**
 * Represents a schema for a caretaker status response object.
 * This schema defines the structure of a response that indicates the user's caretaker status
 * and related profile information. Each field serves a specific purpose:
 * - `isCaretakerUser`: Indicates whether the user has been authenticated as a caretaker.
 * - `needsCaretakerProfile`: Indicates whether a caretaker profile is required for the user.
 * - `hasCaretakerProfile`: Indicates whether the user has an existing caretaker profile.
 */
const CaretakerStatusResponseSchema = z.object({
  isCaretakerUser: z.boolean(),
  needsCaretakerProfile: z.boolean(),
  hasCaretakerProfile: z.boolean(),
});

/**
 * Schema representing a caretaker create request for single entity operations
 * @property {CTHoursSchema[]} ctHours - Optional array of working hours configurations
 */
const SingleCaretakerCreateRequestSchema = SingleCaretakerRequestSchema.extend({
  ctHours: z.array(CTHoursSchema).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional().nullable(),
});

/**
 * Schema representing a caretaker update request for single entity operations
 * @property {CTHoursSchema[]} ctHours - Optional array of working hours configurations
 */
const SingleCaretakerUpdateRequestSchema = SingleCaretakerRequestSchema.extend({
  ctHours: z.array(CTHoursSchema).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional().nullable(),
});

/**
 * Schema representing a caretaker delete response
 * @property {string} message - Confirmation message for deletion
 */
const SingleCaretakerDeleteResponseSchema = z.object({
  message: z.string(),
});

export {
  SingleCaretakerResponseSchema,
  SingleCaretakerRequestSchema,
  CaretakerRequestSchema,
  CaretakerResponseSchema,
  CompleteCaretakerSchema,
  CaretakerSchema,
  CompleteCaretakersSchema,
  CaretakerStatusResponseSchema,
  SingleCaretakerCreateRequestSchema,
  SingleCaretakerUpdateRequestSchema,
  SingleCaretakerDeleteResponseSchema,
};
