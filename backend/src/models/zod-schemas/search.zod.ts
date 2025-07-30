import { z } from "zod";

// Search query parameters schema
const SearchQuerySchema = z.object({
  q: z.string().min(1, "Query parameter is required"),
  location: z.string().optional(),
});

// Search response schemas
const SearchPetResponseSchema = z.object({
  pets: z.array(z.any()), // You can replace z.any() with your actual Pet schema
});

const SearchNGOResponseSchema = z.object({
  ngos: z.array(z.any()), // You can replace z.any() with your actual NGO schema
});

const SearchCaretakerResponseSchema = z.object({
  caretakers: z.array(z.any()), // You can replace z.any() with your actual Caretaker schema
});

// Error response schema
const SearchErrorResponseSchema = z.object({
  message: z.string(),
});

// No results response schema
const NoResultsResponseSchema = z.object({
  message: z.literal("No results found."),
});

export {
  SearchQuerySchema,
  SearchPetResponseSchema,
  SearchNGOResponseSchema,
  SearchCaretakerResponseSchema,
  SearchErrorResponseSchema,
  NoResultsResponseSchema,
};
