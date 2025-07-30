import { Router } from "express";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { z } from "zod";

// db
import {
  EditNGOInviteRequestSchema,
  UseNGOInviteRequestSchema,
} from "../models/db-models/invite";
import { InviteQueries } from "../database/queries/invite";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { databaseManager } from "../app";
import { NGOMember } from "../models/db-models/ngomember";

// middlewares
import { verifyNGOAdmin } from "../middlewares/verify-admin.middleware";
import { authenticateToken } from "../middlewares/verifiy-token.middleware";

// services
import { getSecret } from "../utils/secret-manager";
import { MailQueue, sendMail } from "../utils/email-manager";
import { InviteEmail } from "../utils/email-templates/invitation-email";

// errors
import {
  ValidationError,
  InvalidTokenError,
  AlreadyInNGOError,
} from "../utils/errors";

// zod schemas
import { GetInvitesResponseSchema } from "../models/zod-schemas/invite";
import { SingleMessageResponseSchema } from "../models/zod-schemas/shared.zod";

export const router = Router();

/**
 * @route PUT /ngo/invite
 * @summary Create and send NGO invite
 * @description Creates an invite for a user to join the NGO and sends an email with a signup link.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @body {email: string} Email of the user to invite
 * @throws {ValidationError} If the request body is invalid
 * @throws {AlreadyInNGOError} If the user is already part of an NGO
 * @returns {
 * status: 201,
 * message: "Invite successfully created and email sent."
 * }
 */
router.put(
  "/ngo/invite",
  authenticateToken,
  verifyNGOAdmin,
  openAPIRoute(
    {
      tag: "invite",
      summary: "Create and send NGO invite",
      description: "Invites a user to join the NGO and sends an email.",
      body: EditNGOInviteRequestSchema,
      response: SingleMessageResponseSchema,
    },
    async (req, res) => {
      const lang = res.locals.lang;

      const result = EditNGOInviteRequestSchema.safeParse(req.body);
      if (!result.success) throw ValidationError;

      const { email } = result.data;
      const user = await NGOMemberQueries.getUserAndNGOMember(
        databaseManager,
        email,
      );
      if (user.ngoMember.ngoId) throw AlreadyInNGOError;

      const invite = uuidv4();
      await InviteQueries.createInvite(
        databaseManager,
        req.user!.id,
        req.user!.ngoId!,
        invite,
        email,
      );

      const signedInvite = jwt.sign({ invite }, getSecret("TOKEN_SECRET"));
      const inviteLink = `${getSecret("PUBLIC_URL", "https://home4strays.org")}/${lang}/signup?invite=${signedInvite}`;
      const invitationMail = await new InviteEmail(inviteLink, lang).getEmail();

      await sendMail({
        from: '"Home4Strays 🐶" <home4strays@obco.pro>',
        to: email,
        subject: "Home4Strays NGO Verification",
        html: invitationMail,
      });

      res
        .status(201)
        .json({ message: "Invite successfully created and email sent." });
    },
  ),
);

/**
 * @route GET /ngo/invite-details
 * @summary Get invite details
 * @description Retrieves email and NGO info from invite token without consuming the invite.
 * @query {string} invite - JWT invite token
 * @returns {object} 200 OK - Invite details including email
 * @throws {ValidationError} If invite token is invalid
 * @throws {InvalidTokenError} If the JWT token is invalid
 */
router.get(
  "/ngo/invite-details",
  openAPIRoute(
    {
      tag: "invite",
      summary: "Get invite details",
      description: "Returns invite details from token without consuming it.",
      query: UseNGOInviteRequestSchema,
      response: z.object({
        email: z.string().email(),
        ngoId: z.string().uuid(),
      }),
    },
    async (req, res) => {
      const result = UseNGOInviteRequestSchema.safeParse(req.query);
      if (!result.success) throw ValidationError;

      let invitePayload;
      try {
        invitePayload = jwt.verify(
          result.data.invite,
          getSecret("TOKEN_SECRET"),
        ) as { invite: string };
      } catch {
        throw InvalidTokenError;
      }

      const inviteResult = await InviteQueries.getInvite(
        databaseManager,
        invitePayload.invite,
      );
      if (!inviteResult?.[0]?.ngoId || !inviteResult?.[0]?.email)
        throw ValidationError;

      res.status(200).json({
        email: inviteResult[0].email,
        ngoId: inviteResult[0].ngoId,
      });
    },
  ),
);

/**
 * @route GET /ngo/invite
 * @summary Get all NGO invites
 * @description Retrieves a list of all pending invites for the authenticated user's NGO.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @returns {GetInvitesResponseSchema} 200 OK - List of pending invites
 * @throws {ValidationError} If invite data cannot be validated
 */
router.get(
  "/ngo/invite",
  authenticateToken,
  verifyNGOAdmin,
  openAPIRoute(
    {
      tag: "invite",
      summary: "Get all NGO invites",
      description: "Returns a list of all pending invites for an NGO.",
      response: GetInvitesResponseSchema,
    },
    async (req, res) => {
      const invites = await InviteQueries.getInvites(
        databaseManager,
        req.user!.ngoId!,
      );
      const validation = GetInvitesResponseSchema.safeParse(invites);
      if (!validation.success) throw ValidationError;
      res.status(200).send(validation.data);
    },
  ),
);

/**
 * @route DELETE /ngo/invite
 * @summary Delete NGO invite
 * @description Deletes a pending invite associated with a given email from the NGO.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @body {EditNGOInviteRequestSchema} email - Email address of the invite to delete
 * @returns 200 OK - Invite deleted successfully
 * @throws {ValidationError} If the request body is invalid
 */
router.delete(
  "/ngo/invite",
  authenticateToken,
  verifyNGOAdmin,
  openAPIRoute(
    {
      tag: "invite",
      summary: "Delete NGO invite",
      description: "Deletes an existing invite by email.",
      body: EditNGOInviteRequestSchema,
      response: SingleMessageResponseSchema,
    },
    async (req, res) => {
      const result = EditNGOInviteRequestSchema.safeParse(req.body);
      if (!result.success) throw ValidationError;

      await InviteQueries.deleteInvite(
        databaseManager,
        req.user!.ngoId,
        result.data.email,
      );
      res.status(200).json({ message: "Invite deleted successfully." });
    },
  ),
);

/**
 * @route POST /ngo/invite
 * @summary Use NGO invite
 * @description Accepts a token-based invite and registers the authenticated user as a member of the NGO.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @query {UseNGOInviteRequestSchema} invite - Signed JWT token from the invite link
 * @returns 201 Created - User added to NGO successfully.
 * @throws {ValidationError} If the invite or user data is invalid
 * @throws {InvalidTokenError} If the JWT token is invalid
 * @throws {AlreadyInNGOError} If the user is already part of an NGO
 */
router.post(
  "/ngo/invite",
  authenticateToken,
  openAPIRoute(
    {
      tag: "invite",
      summary: "Use NGO invite",
      description: "Uses a token-based invite to join an NGO.",
      query: UseNGOInviteRequestSchema,
      response: SingleMessageResponseSchema,
    },
    async (req, res) => {
      const result = UseNGOInviteRequestSchema.safeParse(req.query);
      if (!result.success) throw ValidationError;

      let invitePayload;
      try {
        invitePayload = jwt.verify(
          result.data.invite,
          getSecret("TOKEN_SECRET"),
        ) as { invite: string };
      } catch {
        throw InvalidTokenError;
      }

      const inviteResult = await InviteQueries.getInvite(
        databaseManager,
        invitePayload.invite,
      );
      if (!inviteResult?.[0]?.ngoId || !inviteResult?.[0]?.email)
        throw ValidationError;

      const user = await NGOMemberQueries.getUserAndNGOMember(
        databaseManager,
        inviteResult[0].email!,
      );
      console.log("wuhuuhuhu", user);

      if (user.ngoMember.ngoId) {
        throw AlreadyInNGOError;
      }

      if (!user.ngoMember.email || !user.ngoMember.id) {
        throw ValidationError;
      }

      const ngoMember: NGOMember = {
        userId: user.ngoMember.id!, // Now guaranteed to exist
        ngoId: inviteResult[0].ngoId,
        isAdmin: false,
      };

      await NGOMemberQueries.insert(databaseManager, ngoMember);
      await InviteQueries.deleteInvite(
        databaseManager,
        inviteResult[0].ngoId,
        inviteResult[0].email,
      );

      res.status(201).json({ message: "User added to NGO successfully." });
    },
  ),
);

export { router as inviteRouter };
