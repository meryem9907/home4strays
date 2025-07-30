import { z } from "zod";

/**
 * Represents the operating hours of an NGO for a specific weekday.
 * This schema defines the time range and day of the week when the NGO is operational.
 */
const NGOHoursSchema = z.object({
  /**
   * The start time of the NGO's operating hours in ISO 8601 format.
   * Example: "09:00"
   */
  startTime: z.string(),

  /**
   * The end time of the NGO's operating hours in ISO 8601 format.
   * Example: "17:00"
   */
  endTime: z.string(),

  /**
   * The weekday when the NGO is operational.
   * Must be a valid day of the week (e.g., "Monday", "Tuesday").
   */
  weekday: z.string(),
});

/**
 * Represents the comprehensive data structure for an NGO entity.
 * This schema defines all the attributes and validation rules for an NGO's detailed information.
 */
const NGOSchema = z.object({
  /**
   * The official name of the NGO.
   * This field is required and must be a non-empty string.
   */
  name: z.string(),

  /**
   * The email address of the NGO.
   * This field is optional but must follow a valid email format if provided.
   * null or undefined values are allowed for this field.
   */
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .nullable(),

  /**
   * The country where the NGO is registered or operates.
   * This field is required and must be a non-empty string.
   */
  country: z.string(),

  /**
   * The phone number of the NGO.
   * This field is optional and may contain null or undefined values.
   * No specific format validation is applied to this field.
   */
  phoneNumber: z.string().optional().nullable(),

  /**
   * The number of members in the NGO.
   * This field is optional and may contain null or undefined values.
   * No specific format validation is applied to this field.
   */
  memberCount: z.number().optional().nullable(),

  /**
   * The official website URLs of the NGO.
   * This field is an array of optional strings, where each string represents a URL.
   * null or undefined values are allowed for this field.
   */
  website: z
    .array(z.union([z.string(), z.null()]).optional())
    .optional()
    .nullable(),

  /**
   * The mission statement or purpose of the NGO.
   * This field is optional and may contain null or undefined values.
   * No specific format validation is applied to this field.
   */
  mission: z.string().optional().nullable(),

  logoPictureLink: z.string().optional().nullable(),

  /**
   * An array of operating hours for the NGO.
   * Each item in the array follows the NGOHoursSchema structure.
   * null or undefined values are allowed for this field.
   */
  ngoHours: z.array(NGOHoursSchema).optional(),
});

/**
 * Represents the data structure for an NGO request payload.
 * This schema defines the attributes and validation rules for creating or updating an NGO.
 */
const NGORequestSchema = z.object({
  /**
   * The official name of the NGO.
   * This field is required and must be a non-empty string.
   */
  name: z.string(),

  /**
   * The email address of the NGO.
   * This field is optional but must follow a valid email format if provided.
   */
  email: z.string().email({ message: "Invalid email address" }).optional(),

  /**
   * The country where the NGO is registered or operates.
   * This field is required and must be a non-empty string.
   */
  country: z.string(),

  /**
   * The phone number of the NGO.
   * This field is optional and may contain null or undefined values.
   * No specific format validation is applied to this field.
   */
  phoneNumber: z.string().optional(),

  /**
   * The number of members in the NGO.
   * This field is optional and may contain null or undefined values.
   * No specific format validation is applied to this field.
   */
  memberCount: z.string().optional(),

  /**
   * The official website URLs of the NGO.
   * This field is an array of optional strings, where each string represents a URL.
   * null or undefined values are allowed for this field.
   */
  website: z.array(z.union([z.string(), z.null()]).optional()).optional(),

  /**
   * The mission statement or purpose of the NGO.
   * This field is optional and may contain null or undefined values.
   * No specific format validation is applied to this field.
   */
  mission: z.string().optional(),
});

/**
 * Represents the data structure for an array of NGO responses.
 * This schema defines the format for returning multiple NGO records in a single response.
 */
const NGOResponseSchema = z.array(NGOSchema);

// Missing schemas for OpenAPI routes
const NGOParamsSchema = z.object({
  ngoId: z.string().describe("The ID of the NGO"),
});

const NGOGetResponseSchema = z.object({
  ngo: NGOSchema,
  hours: z.array(NGOHoursSchema),
});

const NGOUpdateSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .nullable(),
  phoneNumber: z.string().optional().nullable(),
  memberCount: z.number().optional().nullable(),
  website: z
    .array(z.union([z.string(), z.null()]).optional())
    .optional()
    .nullable(),
  mission: z.string().optional().nullable(),
  ngoHours: z.array(NGOHoursSchema).optional(),
});

const NGOUpdateRequestSchema = z.object({
  ngo: NGOUpdateSchema,
});

const NGOUpdateResponseSchema = z.object({
  message: z.string(),
});

const NGODeleteResponseSchema = z.object({
  message: z.string(),
});

// New schemas for paginated NGO endpoint
const NGOPaginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .default("9")
    .transform((val) => parseInt(val, 10)),
  offset: z
    .string()
    .optional()
    .default("0")
    .transform((val) => parseInt(val, 10)),
  searchQuery: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  verified: z
    .enum(["All", "verified", "not verified"])
    .optional()
    .default("All"),
  minMembers: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxMembers: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  ngoName: z.string().optional(),
});

const NGOPaginationMetaSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  filtersApplied: z.object({
    searchQuery: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    verified: z.string().optional(),
    minMembers: z.number().optional(),
    maxMembers: z.number().optional(),
    ngoName: z.string().optional(),
  }),
});

const NGOPaginationResponseSchema = z.object({
  data: z.array(NGOSchema),
  meta: NGOPaginationMetaSchema,
});

export {
  NGOSchema,
  NGOResponseSchema,
  NGORequestSchema,
  NGOHoursSchema,
  NGOParamsSchema,
  NGOGetResponseSchema,
  NGOUpdateSchema,
  NGOUpdateRequestSchema,
  NGOUpdateResponseSchema,
  NGODeleteResponseSchema,
  NGOPaginationQuerySchema,
  NGOPaginationMetaSchema,
  NGOPaginationResponseSchema,
};
