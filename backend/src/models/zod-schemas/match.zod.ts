import { z } from "zod";
import {
  CompleteCaretakerSchema,
  CompleteCaretakersSchema,
} from "./caretaker.zod";
import { PetSchema } from "./pet.zod";

/**
 * Schema defining the structure of a request to match a pet.
 * This schema is used to validate the input when initiating a pet matching request.
 * It requires a valid UUID for the pet ID to ensure proper identification.
 */
const MatchPetRequestSchema = z.object({ petId: z.string().uuid() });

/**
 * Schema defining the structure of a request to revoke a pet match.
 * This schema is used to validate the input when revoking a previously matched pet.
 * It requires a valid UUID for the pet ID to ensure proper identification.
 * Note: The schema name contains a typo ("RequesttSchema") which should be corrected to "RequestSchema".
 */
const MatchRevokeRequesttSchema = z.object({ petId: z.string().uuid() });

/**
 * Schema defining the structure of a response when a pet is matched.
 * This schema represents the numeric response indicating the result of the match operation.
 * The numeric value is typically a status code indicating success or failure.
 */
const MatchPetResponseSchema = z.number();

/**
 * Schema defining the structure of a response containing a list of matched pets.
 * This schema is used to return an array of pet data that have been successfully matched.
 * Each item in the array conforms to the PetSchema definition.
 */
const MatchedPetsResponseSchema = z.array(PetSchema);

/**
 * Schema defining the structure of a response containing a list of matched caretakers.
 * This schema is used to return an array of caretaker data that have been successfully matched.
 * Each item in the array conforms to the CompleteCaretakersSchema definition.
 */
const MatchedCaretakersResponseSchema = CompleteCaretakersSchema;

export {
  MatchPetRequestSchema,
  MatchPetResponseSchema,
  MatchRevokeRequesttSchema,
  MatchedPetsResponseSchema,
  MatchedCaretakersResponseSchema,
  CompleteCaretakerSchema,
};
