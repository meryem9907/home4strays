import { z } from "zod";
import { NGORequestSchema, NGOSchema } from "./ngo.zod";

/**
 * Constants defining acceptable file types for image and document uploads.
 * These types are used to validate file uploads in the system.
 */
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Schema for registering a new NGO.
 * This schema is an alias for NGORequestSchema and represents the structure
 * required for NGO registration requests.
 */
const NGORegisterSchema = NGORequestSchema;

/**
 * Schema defining the structure of an uploaded logo file.
 * This schema validates the properties of a file upload for NGO logos,
 * ensuring it meets the required format and type constraints.
 */
const LogoSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine((type) => ACCEPTED_IMAGE_TYPES.includes(type), {
    message: "Only .jpg, .png, and .webp formats are supported.",
  }),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number(),
});

/**
 * Schema defining the structure of an uploaded document file.
 * This schema validates the properties of a file upload for NGO documents,
 * ensuring it meets the required format and type constraints.
 */
const DocumentSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z
    .string()
    .refine((type) => ACCEPTED_DOCUMENT_TYPES.includes(type), {
      message:
        "Only .pdf, .vnd.ms-excel, .vnd.openxmlformats-officedocument.wordprocessingml.document formats are supported.",
    }),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number(),
});

/**
 * Schema for the response when an NGO verification request is processed.
 * This schema defines the structure of the response containing the NGO ID,
 * verification document link, optional logo picture link, and verification status.
 */
const VerificationRequestResponseSchema = z.object({
  ngoId: z.string(),
  verificationDocumentLink: z.string(),
  logoPictureLink: z.string().optional(),
  status: z.string(),
});

/**
 * Schema for the response containing a list of unverified NGOs.
 * This schema defines an array of NGO objects that have not yet been verified.
 */
const UnverifiedNGOsResponseSchema = z.array(NGOSchema);

/**
 * Schema for updating the verification status of an NGO.
 * This schema defines the structure of the request containing the NGO's name and country.
 */
const UpdateNGOVerificationStatusRequestSchema = z.object({
  name: z.string(),
  country: z.string(),
});

/**
 * Schema for the response when a verification request is completed.
 * This schema defines the structure of the response containing the verification status.
 */
const VerificationRequestCompleteResponseSchema = z.object({
  status: z.string(),
});

/**
 * Schema for the response when an NGO request is rejected.
 * This schema defines the structure of the response containing the rejection status.
 */
const RejectNGOResponseSchema = z.object({
  status: z.string(),
});

/**
 * Schema for the response when an NGO is verified.
 * This schema defines the structure of the response containing the verification status.
 */
const VerifyNGOResponseSchema = z.object({
  status: z.string(),
});

/**
 * Type derived from VerificationRequestResponseSchema.
 * Represents the structure of a verification request response.
 */
type VerificationRequestResponse = z.infer<
  typeof VerificationRequestResponseSchema
>;

/**
 * Type derived from UnverifiedNGOsResponseSchema.
 * Represents the structure of a list of unverified NGOs.
 */
type UnverifiedNGOsResponse = z.infer<typeof UnverifiedNGOsResponseSchema>;
type LogoSchemaType = z.infer<typeof LogoSchema>;

export {
  NGORegisterSchema,
  LogoSchema,
  LogoSchemaType,
  DocumentSchema,
  VerificationRequestResponseSchema,
  UnverifiedNGOsResponseSchema,
  UpdateNGOVerificationStatusRequestSchema,
  VerificationRequestResponse,
  UnverifiedNGOsResponse,
  VerificationRequestCompleteResponseSchema,
  RejectNGOResponseSchema,
  VerifyNGOResponseSchema,
};
