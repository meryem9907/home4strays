import { Router } from "express";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { z } from "zod";

// db
import { databaseManager, minioManager } from "../app";
import { UserQueries } from "../database/queries/user";
import { User } from "../models/db-models/user";
import { NGOMemberQueries } from "../database/queries/ngomember";
// middlewares
import { authenticateToken } from "../middlewares/verifiy-token.middleware";

// errors
import {
  IdNotFoundError,
  UserNotAuthorizedError,
  UserNotFoundError,
} from "../utils/errors";

// zod schemas
import {
  PublicUserSchema,
  UserSuccessResponseSchema,
} from "../models/zod-schemas/user.zod";
import { SingleMessageResponseSchema } from "../models/zod-schemas/shared.zod";
export const router = Router();

router.get(
  "/me",
  authenticateToken,
  openAPIRoute(
    {
      tag: "user",
      summary: "Get current user",
      description: "Returns data for the currently authenticated user.",
      response: UserSuccessResponseSchema,
    },
    async (req, res, next) => {
      try {
        const userId = req.user?.id;
        if (userId === undefined) {
          throw IdNotFoundError;
        }
        // Get user data from database
        const userResult: User | undefined =
          await UserQueries.selectByIdSecurely(databaseManager, userId);
        if (userResult === undefined) {
          throw UserNotFoundError;
        }

        console.log(`Found user: ${JSON.stringify(userResult.email)}`);
        // update picture links
        if (userResult.profilePictureLink != null) {
          userResult.profilePictureLink = await minioManager.getPublicURL(
            userResult.profilePicturePath!,
          );
        }
        const validatedResult = UserSuccessResponseSchema.parse(userResult);

        // Return the validated result
        res.status(200).json(validatedResult);
      } catch (err) {
        console.log(`Error fetching user: ${err}`);
        next(err);
      }
    },
  ),
);

router.get(
  "/ngo-status",
  authenticateToken,
  openAPIRoute(
    {
      tag: "user",
      summary: "Check NGO status",
      description:
        "Returns whether the user is an NGO member and profile state.",
      response: z.object({
        isNgoUser: z.boolean(),
        needsNgoProfile: z.boolean(),
        hasNgoMembership: z.boolean(),
        ngoId: z.string().optional(),
        isNgoAdmin: z.boolean().optional(),
      }),
    },

    async (req, res, next) => {
      try {
        if (!req.user) throw UserNotAuthorizedError;

        const userResult = await UserQueries.selectByIdSecurely(
          databaseManager,
          req.user.id,
        );

        if (userResult === undefined) {
          throw UserNotAuthorizedError;
        }

        const user = userResult;
        const hasNgoMembership = await NGOMemberQueries.existsByUserId(
          databaseManager,
          req.user.id,
        );

        let ngoId = undefined;
        let isNgoAdmin = false;

        if (hasNgoMembership) {
          const ngoMember = await NGOMemberQueries.selectNGOMemberById(
            databaseManager,
            req.user.id,
          );
          if (ngoMember) {
            ngoId = ngoMember.ngoId;
            isNgoAdmin = ngoMember.isAdmin;
          }
        }

        res.status(200).json({
          isNgoUser: user.isNgoUser || false,
          needsNgoProfile: user.isNgoUser && !hasNgoMembership,
          hasNgoMembership,
          ngoId,
          isNgoAdmin,
        });
      } catch (err) {
        console.error("Error in /ngo-status:", err);
        next(err);
      }
    },
  ),
);

router.put(
  "/user/basic-info",
  authenticateToken,
  openAPIRoute(
    {
      tag: "user",
      summary: "Update user basic information",
      description: "Updates the user's firstName, lastName, and phoneNumber.",
      body: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional().nullable(),
      }),
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        if (!req.user) throw UserNotAuthorizedError;

        const userId = req.user.id;
        const { firstName, lastName, phoneNumber } = req.body;

        const existingUser = await UserQueries.selectByIdSecurely(
          databaseManager,
          userId,
        );

        if (!existingUser) {
          throw UserNotFoundError;
        }

        const updatedUser: User = {
          ...existingUser,
          id: userId,
          firstName: firstName || existingUser.firstName,
          lastName: lastName || existingUser.lastName,
          phoneNumber:
            phoneNumber !== undefined
              ? phoneNumber || undefined
              : existingUser.phoneNumber,
        };

        await UserQueries.update(databaseManager, updatedUser);

        res.status(200).json({
          message: "User basic information updated successfully.",
        });
      } catch (err) {
        console.error("Error in /user/basic-info:", err);
        next(err);
      }
    },
  ),
);

export { router as userRouter };
