import { z } from "zod";
/**
 * Schema defining the structure of a GET /invites response.
 * This schema enforces strict validation for the array of invite records.
 * Each invite object contains a user ID, NGO ID, and email address.
 */
const GetInvitesResponseSchema = z.array(
  z.object({
    /**
     * Unique identifier for the user associated with the invite.
     * Must be a valid UUID format as per RFC 4122.
     */
    userId: z.string().uuid(),
    /**
     * Unique identifier for the NGO organization associated with the invite.
     * Must be a valid UUID format as per RFC 4122.
     */
    ngoId: z.string().uuid(),
    /**
     * Email address associated with the invite.
     * Must be a valid email format as per RFC 5322.
     */
    email: z.string().email(),
  }),
);

export { GetInvitesResponseSchema };
