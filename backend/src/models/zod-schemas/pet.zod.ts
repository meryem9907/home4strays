import { z } from "zod";

/**
 * Schema defining the structure of a pet entity.
 * This schema enforces strict typing for pet-related data and includes
 * nullable/optional fields where appropriate. All date fields are coerced
 * to Date objects, and boolean fields may be null to indicate unknown status.
 */
const PetSchema = z.object({
  /**
   * Unique identifier for the pet. This field is required and must be a string.
   */
  id: z.string(),

  /**
   * The name of the pet. This field is required and must be a string.
   */
  name: z.string(),

  /**
   * The gender of the pet. This field is required and must be a string.
   */
  gender: z.string(),

  /**
   * The birthdate of the pet. This field is required and will be coerced to a Date object.
   */
  birthdate: z.coerce.date(),

  /**
   * Indicates whether the pet has been castrated. This field is optional and may be null
   * to indicate unknown status.
   */
  castration: z.boolean().optional().nullable(),

  /**
   * The weight of the pet in kilograms. This field is optional and may be null
   * to indicate unknown weight.
   */
  weight: z.number().optional().nullable(),

  /**
   * The breed of the pet. This field is optional and may be null
   * to indicate unknown breed.
   */
  breed: z.string().optional().nullable(),

  /**
   * URL to the pet's profile picture. This field is optional and may be null
   * if no picture is available.
   */
  profilePictureLink: z.string().optional().nullable(),

  /**
   * File path to the pet's profile picture. This field is optional and may be null
   * if no picture is available.
   */
  //profilePicturePath: z.string().optional().nullable(),

  /**
   * Date of the pet's last checkup. This field is optional and may be null
   * if no checkup record exists.
   */
  lastCheckup: z.coerce.date().optional().nullable(),

  /**
   * Description of the pet's eating behaviour. This field is optional and may be null
   * if no specific information is available.
   */
  eatingBehaviour: z.string().optional().nullable(),

  /**
   * General behavioural description of the pet. This field is optional and may be null
   * if no specific information is available.
   */
  behaviour: z.string().optional().nullable(),

  /**
   * Identifier for the care taker responsible for the pet. This field is optional and may be null
   * if no care taker is assigned.
   */
  careTakerId: z.string().optional().nullable(),

  /**
   * Identifier for the NGO member associated with the pet. This field is optional and may be null
   * if no NGO membership exists.
   */
  ngoMember: z.string().optional().nullable(),

  /**
   * Street name of the pet's address. This field is optional and may be null
   * if address information is incomplete.
   */
  streetName: z.string().optional().nullable(),

  /**
   * City name of the pet's address. This field is optional and may be null
   * if address information is incomplete.
   */
  cityName: z.string().optional().nullable(),

  /**
   * ZIP code of the pet's address. This field is optional and may be null
   * if address information is incomplete.
   */
  zip: z.string().optional().nullable(),

  /**
   * Country of the pet's address. This field is optional and may be null
   * if address information is incomplete.
   */
  country: z.string().optional().nullable(),

  /**
   * House number of the pet's address. This field is optional and may be null
   * if address information is incomplete.
   */
  houseNumber: z.string().optional().nullable(),

  /**
   * Type of locality required for the pet's housing. This field is optional and may be null
   * if no specific requirement exists.
   */
  localityTypeRequirement: z.string().optional().nullable(),

  /**
   * Indicates whether children are allowed with this pet. This field is optional and may be null
   * if no specific requirement exists.
   */
  kidsAllowed: z.boolean().optional().nullable(),

  /**
   * Additional requirements related to ZIP code for the pet's housing. This field is optional and may be null
   * if no specific requirement exists.
   */
  zipRequirement: z.string().optional().nullable(),

  /**
   * Experience requirements for the pet's care. This field is optional and may be null
   * if no specific requirement exists.
   */
  experienceRequirement: z.string().optional().nullable(),

  /**
   * Minimum space requirement for the pet's housing in square meters. This field is optional and may be null
   * if no specific requirement exists.
   */
  minimumSpaceRequirement: z.number().optional().nullable(),
});

// Parameter schemas
/**
 * Schema for pet ID parameters used in routes requiring a specific pet identifier.
 * This schema is used to validate and document the parameters for pet-related operations.
 */
const PetIdParamsSchema = z.object({
  id: z.string().describe("The ID of the pet"),
});

/**
 * Schema for pet ID parameters used in routes requiring a specific pet identifier.
 * This schema is used to validate and document the parameters for pet-related operations.
 */
const PetIdOnlyParamsSchema = z.object({
  petId: z.string().describe("The ID of the pet"),
});

/**
 * Schema for pet picture parameters used in routes requiring both pet and picture identification.
 * This schema is used to validate and document the parameters for pet picture operations.
 */
const PetPictureParamsSchema = z.object({
  petId: z.string().describe("The ID of the pet"),
  pictureLink: z
    .string()
    .describe("The picture link/URL to identify the specific picture"),
});

/**
 * Schema for NGO logo parameters used in routes requiring an NGO identifier.
 * This schema is used to validate and document the parameters for NGO logo operations.
 * Note: This schema was added to address a missing parameter definition in the original code.
 */
const NGOLogoParamsSchema = z.object({
  ngoId: z.string().describe("The ID of the NGO"),
});

// Response schemas
/**
 * Response schema for pet picture upload operations.
 * This schema defines the structure of the response when uploading a pet picture.
 * It includes a message and an array of picture links.
 */
const PetPicturesUploadResponseSchema = z.object({
  message: z.string(),
  pictureLinks: z.array(z.string().url()),
});

/**
 * Response schema for pet picture deletion operations.
 * This schema defines the structure of the response when deleting a pet picture.
 * It includes a message indicating the success of the operation.
 */
const PetPictureDeleteResponseSchema = z.object({
  message: z.string(),
});

/**
 * Response schema for retrieving a specific pet picture.
 * This schema defines the structure of the response when fetching a single pet picture.
 * It includes the URL of the picture.
 */
const PetPictureGetResponseSchema = z.object({
  pictureLink: z.string().url(),
});

/**
 * Response schema for retrieving multiple pet pictures.
 * This schema defines the structure of the response when fetching multiple pet pictures.
 * It includes an array of picture URLs.
 */
const PetPicturesGetResponseSchema = z.object({
  pictureLinks: z.array(z.string().url()),
});

/**
 * Response schema for user profile picture upload operations.
 * This schema defines the structure of the response when uploading a user profile picture.
 * It includes a message and the URL of the uploaded profile picture.
 */
const UserProfilePictureUploadResponseSchema = z.object({
  message: z.string(),
  profilePictureLink: z.string().url(),
});

/**
 * Response schema for user profile picture deletion operations.
 * This schema defines the structure of the response when deleting a user profile picture.
 * It includes a message indicating the success of the operation.
 */
const UserProfilePictureDeleteResponseSchema = z.object({
  message: z.string(),
});

/**
 * Response schema for NGO logo upload operations.
 * This schema defines the structure of the response when uploading an NGO logo.
 * It includes a message and the URL of the uploaded logo.
 */
const NGOLogoUploadResponseSchema = z.object({
  message: z.string(),
  logoPictureLink: z.string().url(),
});

/**
 * Response schema for NGO logo deletion operations.
 * This schema defines the structure of the response when deleting an NGO logo.
 * It includes a message indicating the success of the operation.
 */
const NGOLogoDeleteResponseSchema = z.object({
  message: z.string(),
});

/**
 * Generic message response schema used for simple operations.
 * This schema defines the structure of responses that only require a message field.
 * It is commonly used for operations that do not return specific data.
 */
const MessageResponseSchema = z.object({
  message: z.string(),
});

const PetResponseSchema = z.array(PetSchema);

export {
  PetSchema,
  PetResponseSchema,
  PetIdParamsSchema,
  PetIdOnlyParamsSchema,
  PetPictureParamsSchema,
  NGOLogoParamsSchema,
  PetPicturesUploadResponseSchema,
  PetPictureDeleteResponseSchema,
  PetPictureGetResponseSchema,
  PetPicturesGetResponseSchema,
  UserProfilePictureUploadResponseSchema,
  UserProfilePictureDeleteResponseSchema,
  NGOLogoUploadResponseSchema,
  NGOLogoDeleteResponseSchema,
  MessageResponseSchema,
};
