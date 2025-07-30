import { z } from "zod";

const SingleMessageResponseSchema = z.object({
  message: z.string(),
});

export { SingleMessageResponseSchema };
