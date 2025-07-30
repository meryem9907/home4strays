import { z } from "zod";
const EditNGOInviteRequestSchema = z.object({
  email: z.string().email(),
});

type EditNGOInviteRequest = z.infer<typeof EditNGOInviteRequestSchema>;

const UseNGOInviteRequestSchema = z.object({
  invite: z.string().jwt(),
});

type UseNGOInviteRequest = z.infer<typeof UseNGOInviteRequestSchema>;

class InviteNGO {
  userId?: string;
  ngoId?: string;
  email?: string;
}

const NGOIdSchema = z.object({ ngoId: z.string().uuid() });
const NGOUserIdSchema = z.object({
  userId: z.string().uuid(),
  ngoId: z.string().uuid(),
});
type NGOId = z.infer<typeof NGOIdSchema>;

export {
  EditNGOInviteRequest,
  UseNGOInviteRequest,
  EditNGOInviteRequestSchema,
  UseNGOInviteRequestSchema,
  InviteNGO,
  NGOId,
  NGOIdSchema,
  NGOUserIdSchema,
};
