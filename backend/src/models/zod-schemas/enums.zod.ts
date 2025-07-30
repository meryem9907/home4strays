import { z } from "zod";

/**
 * Schema representing a list of species names, ensuring at least one valid species is provided.
 * This schema is used to validate arrays of species identifiers in API responses.
 * The minimum length requirement ensures the response contains at least one species entry.
 */
const SpeciesResponseSchema = z.array(z.string().min(1));

/**
 * Schema representing a list of breed names, ensuring at least one valid breed is provided.
 * This schema is used to validate arrays of breed identifiers in API responses.
 * The minimum length requirement ensures the response contains at least one breed entry.
 */
const BreedResponseSchema = z.array(z.string().min(1));

/**
 * Schema representing a list of enum values, ensuring at least one valid enum entry is provided.
 * This schema is used to validate arrays of enum identifiers in API responses.
 * The minimum length requirement ensures the response contains at least one enum value.
 */
const EnumResponseSchema = z.array(z.string().min(1));

export { SpeciesResponseSchema, BreedResponseSchema, EnumResponseSchema };
