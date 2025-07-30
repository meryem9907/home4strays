import { Router } from "express";
import { plainToInstance } from "class-transformer";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { z } from "zod";

// middlewares
import { authenticateToken } from "../middlewares/verifiy-token.middleware";
import { verifyLastNGOMember } from "../middlewares/verify-lastngomember.middleware";

// db
import { databaseManager, minioManager } from "../app";
import { NGOMemberQueries } from "../database/queries/ngomember";
import {
  NGOMember,
  NGOMemberAndUserWithHours,
} from "../models/db-models/ngomember";
import { NGOMemberHoursQueries } from "../database/queries/ngomemberhours";
import NGOMemberHours from "../models/db-models/ngomemberhours";
import { UserQueries } from "../database/queries/user";
import { User } from "../models/db-models/user";

// custom http errors
import {
  IdNotFoundError,
  NGOMemberNotFoundError,
  UserNotFoundError,
} from "../utils/errors";

// zod schemas
import {
  NGOMemberDELETENGORequestSchema,
  NGOMemberPOSTRequestSchema,
  NGOMemberPUTHoursRequestSchema,
  NGOMemberPUTNGORequestSchema,
  NGOMemberRequestSchema,
  NGOMembersRequestSchema,
  NGOMembersWithHoursResponseSchema,
  NGOMemberWithMemberHoursSchema,
} from "../models/zod-schemas/ngo-member.zod";
import { SingleMessageResponseSchema } from "../models/zod-schemas/shared.zod";

// translation
import { TranslationManager } from "../utils/translations-manager";

const router = Router();

/**
 * @route GET /ngo-member
 * @summary Get a specific NGO member with their working hours
 * @description Retrieves detailed information about a specific NGO member, including their weekly working hours.
 *              Requires `userId` (and optionally `ngoId`) as query parameters.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @queryParam {string} userId - ID of the NGO member
 * @queryParam {string} ngoId - ID of the NGO (optional, currently unused)
 * @returns {NGOMemberWithMemberHours} 200 - NGO member data with working hours
 * @throws {NGOMemberNotFoundError} if ngo member doesnt exist.
 */
router.get(
  "/ngo-member",
  authenticateToken,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "Get a specific NGO member with hours",
      description:
        "Fetches NGO member data (including working hours) using userId and ngoId.",
      response: NGOMemberWithMemberHoursSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const ngoId = req.query.ngoId as string; // not officially used
        const userId = req.query.userId as string;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        NGOMemberRequestSchema.parse({
          ngoId: req.query.ngoId,
          userId: req.query.userId,
        });

        // select from db
        const ngoMember =
          await UserQueries.selectNGOMemberWithHoursByNGOAndUserId(
            databaseManager,
            userId,
            tm,
          );
        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        // update picture link
        if (ngoMember.ngoMember.profilePictureLink != null) {
          ngoMember.ngoMember.profilePictureLink =
            await minioManager.getPublicURL(
              ngoMember.ngoMember.profilePicturePath!,
            );
        }

        const response = NGOMemberWithMemberHoursSchema.parse(ngoMember);

        res.status(200).json(response);
      } catch (err) {
        console.log(`Error occured in GET /ngo-member: ${err}.`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /ngo-members
 * @summary Get all NGO members with working hours
 * @description Fetches all NGO members belonging to a specific NGO, along with their working hours.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @queryParam {string} ngoId - ID of the NGO
 * @returns {NGOMemberWithMemberHours[]} 200 - List of NGO members with their working hours
 */
router.get(
  "/ngo-members",
  authenticateToken,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "List all NGO members with hours",
      description:
        "Returns all NGO members with working hours for a given ngoId.",
      response: NGOMembersWithHoursResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const ngoId = req.query.ngoId as string;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        NGOMembersRequestSchema.parse({ ngoId: ngoId });

        // select from db
        const ngoMembers: NGOMemberAndUserWithHours[] =
          await UserQueries.selectNGOMembersWithHoursByNGO(
            databaseManager,
            ngoId,
            tm,
          );

        // update picture link
        for (let ngoMember of ngoMembers) {
          if (ngoMember.ngoMember.profilePictureLink != null) {
            ngoMember.ngoMember.profilePictureLink =
              await minioManager.getPublicURL(
                ngoMember.ngoMember.profilePicturePath!,
              );
          }
        }

        // Sanitize profilePictureLink values before validation
        const sanitizedNgoMembers = ngoMembers.map((member: any) => ({
          ...member,
          ngoMember: {
            ...member.ngoMember,
            profilePictureLink:
              member.ngoMember?.profilePictureLink?.trim() === ""
                ? null
                : member.ngoMember?.profilePictureLink,
          },
        }));

        console.log(sanitizedNgoMembers);
        const response =
          NGOMembersWithHoursResponseSchema.parse(sanitizedNgoMembers);

        res.status(200).json(response);
      } catch (err) {
        console.error(`Error occured in GET /ngo-members:`, err);
        console.error(`Error details:`, {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          ngoId: req.query.ngoId,
        });
        next(err);
      }
    },
  ),
);

/**
 * @route POST /ngo-member/hours-and-user-data
 * @summary Submit NGO member hours and changed user data
 * @description Creates or replaces working hours for the authenticated NGO member and changes user data.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @body {
 *  firstName: string;
 *  lastName: string;
 *  phoneNumber: string;
 *  hours: Array<NGOMemberHours>;
 * }
 * @returns {
 * status: 200;
 * message: "User data changed and NGOMember Hours created successfully."
 * }
 * @throws {NGOMemberNotFoundError} if ngo member doesnt exist.
 * @throws {UserNotFoundError} if user doesnt exist.
 */
router.post(
  "/ngo-member/hours-and-user-data",
  authenticateToken,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "Submit NGO member hours and changed data.",
      description:
        "Creates or replaces working hours for the authenticated user and changes user data.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const userId = req.user!.id;
        const ngoMemberHoursRaw = req.body.hours || [];
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        NGOMemberPOSTRequestSchema.parse(req.body);

        // create ngo-member hours data
        const ngoMemberHoursArray = Array.isArray(ngoMemberHoursRaw)
          ? ngoMemberHoursRaw
          : [ngoMemberHoursRaw];
        const ngoMemberHoursData: NGOMemberHours[] = plainToInstance(
          NGOMemberHours,
          ngoMemberHoursArray,
        );

        // create user data
        const user: User | undefined = await UserQueries.selectByIdSecurely(
          databaseManager,
          userId,
        );
        if (!user) {
          UserNotFoundError;
        }
        let userData: User = plainToInstance(User, req.body);
        userData.id = userId;
        // replace empty not null fields with old data
        if (!userData.firstName) {
          userData.firstName = user?.firstName;
        }
        if (!userData.lastName) {
          userData.lastName = user?.lastName;
        }

        // select ngo member
        const ngoMember: NGOMember | undefined =
          await NGOMemberQueries.selectNGOMemberById(databaseManager, userId);
        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        // Insert new hours
        await NGOMemberHoursQueries.insertNGOMemberHours(
          databaseManager,
          ngoMember.userId,
          ngoMemberHoursData,
          tm,
        );

        // change user data if given
        await UserQueries.update(databaseManager, userData);

        res.status(201).json({
          message:
            "User data changed and NGOMember Hours created successfully.",
        });
      } catch (err) {
        console.log(
          `Error occured in POST /ngo-member/hours-and-user-data: ${err}.`,
        );
        next(err);
      }
    },
  ),
);

/**
 * @route PUT /ngo-member/hours-and-user-data
 * @summary Update NGO member hours and user data
 * @description Updates user data and the existing working hours of the authenticated NGO member.
 *              Existing entries are deleted and replaced with new ones.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @body {
 *  firstName: string;
 *  lastName: string;
 *  phoneNumber: string;
 *  hours: Array<NGOMemberHours>
 * }
 * @returns {
 * status: 200;
 * message: "User data and NGOMember Hours changed successfully."
 * }
 * @throws {NGOMemberNotFoundError} if ngo member doesnt exist.
 * @throws {UserNotFoundError} if user doesnt exist.
 */
router.put(
  "/ngo-member/hours-and-user-data",
  authenticateToken,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "Update NGO member hours and changed user data",
      description:
        "Updates the working hours of the authenticated NGO member and user data.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        const userId = req.user!.id;
        const ngoMemberHoursRaw = req.body.hours || [];

        NGOMemberPUTHoursRequestSchema.parse(req.body);

        // create ngo-member hours data
        const ngoMemberHoursArray = Array.isArray(ngoMemberHoursRaw)
          ? ngoMemberHoursRaw
          : [ngoMemberHoursRaw];
        const ngoMemberHoursData: NGOMemberHours[] = plainToInstance(
          NGOMemberHours,
          ngoMemberHoursArray,
        );

        // create user data
        const user: User | undefined = await UserQueries.selectByIdSecurely(
          databaseManager,
          userId,
        );
        if (!user) {
          UserNotFoundError;
        }
        let userData: User = plainToInstance(User, req.body);
        userData.id = userId;
        // replace empty not null fields with old data
        if (!userData.firstName) {
          userData.firstName = user?.firstName;
        }
        if (!userData.lastName) {
          userData.lastName = user?.lastName;
        }

        // select ngo member
        const ngoMember: NGOMember | undefined =
          await NGOMemberQueries.selectNGOMemberById(databaseManager, userId);
        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        // before inserting new hours delete old data
        if (ngoMemberHoursData.length > 0) {
          for (const ngoHour of ngoMemberHoursData) {
            await NGOMemberHoursQueries.deleteAllNGOMemberHours(
              databaseManager,
              userId,
            );
          }
          await NGOMemberHoursQueries.insertNGOMemberHours(
            databaseManager,
            userId,
            ngoMemberHoursData,
            tm,
          );
        }

        // change user data if given
        await UserQueries.update(databaseManager, userData);

        res.status(200).json({
          message: "User data and NGOMember Hours changed successfully.",
        });
      } catch (err) {
        console.log(
          `Error occured in PUT /ngo-member/hours-and-user-data ${err}.`,
        );
        next(err);
      }
    },
  ),
);

/**
 * @route PUT /ngo-member/ngo-id
 * @summary Update user's NGO association
 * @description Updates the NGO ID that the authenticated user is associated with.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @body
 * {
 * ngoId: string;
 * isAdmin: boolean;
 * }
 * @returns {
 * status: 200;
 * message: "NGOMembers NGO updated successfully."
 * }
 * @throws {NGOMemberNotFoundError} if ngo member doesnt exist.
 */
router.put(
  "/ngo-member/ngo-id",
  authenticateToken,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "Update user's NGO association",
      description:
        "Changes the NGO that the authenticated user is associated with.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const userId = req.user!.id;

        NGOMemberPUTNGORequestSchema.parse(req.body); // expect ngoId and isAdmin fields

        // create ngo member data
        const ngoMemberData: NGOMember = plainToInstance(NGOMember, req.body);
        ngoMemberData.userId = userId;
        const ngoMember: NGOMember | undefined =
          await NGOMemberQueries.selectNGOMemberById(databaseManager, userId);
        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        // updates NGO Id of NGO-Member
        await NGOMemberQueries.updateNGOAssociationMemberById(
          databaseManager,
          userId,
          ngoMemberData,
        );

        res.status(200).json({
          message: "NGOMembers NGO updated successfully.",
        });
      } catch (err) {
        console.log(`Error occured in PUT /ngo-member/ngo-id ${err}.`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /ngo-member/hours
 * @summary Remove NGO Member's Hours
 * @description Deletes all hour records associated with the authenticated NGO member.
 * @header {Authorization Header}
 * @returns {
 *   status: 200,
 *   message: "NGOMember Hours deleted successfully."
 * }
 * @throws {IdNotFoundError} If the user ID is missing or the NGO member does not exist.
 * @throws {NGOMemberNotFoundError} if ngo member doesnt exist.
 */
router.delete(
  "/ngo-member/hours",
  authenticateToken,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "Remove NGO Members Hours",
      description: "Deletes a ngo members hours",
      response: SingleMessageResponseSchema,
    },

    async (req, res, next) => {
      try {
        const userId = req.user!.id;

        const ngoMember: NGOMember | undefined =
          await NGOMemberQueries.selectNGOMemberById(databaseManager, userId);

        // check if NGO Member exists
        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        await NGOMemberHoursQueries.deleteAllNGOMemberHours(
          databaseManager,
          userId,
        );

        res
          .status(200)
          .json({ message: "NGOMember Hours deleted successfully." });
      } catch (err) {
        console.log(`Error occured DELETE /ngo-member/hours: ${err}.`);
      }
    },
  ),
);

/**
 * @route DELETE /ngo-member
 * @summary Deletes ngo member as a user.
 * @description Removes the authenticated user’s NGO membership, all associated working hours and user profile.
 * @header {Authorization Header}
 * @returns {
 * status: 200;
 * message: "NGOMember deleted successfully."
 * }
 * @throws {NGOMemberNotFoundError} if ngo member doesnt exist.
 * @throws {UserNotFoundError} if user doesnt exist.
 */
router.delete(
  "/ngo-member",
  authenticateToken,
  verifyLastNGOMember,
  openAPIRoute(
    {
      tag: "ngo-member",
      summary: "Deletes ngo member as a user.",
      description:
        "Removes the authenticated user’s NGO membership, all associated working hours and user profile.",
      response: SingleMessageResponseSchema,
    },

    async (req, res, next) => {
      try {
        const userId = req.user!.id;

        // select ngo member
        const ngoMember: NGOMember | undefined =
          await NGOMemberQueries.selectNGOMemberById(databaseManager, userId);
        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        // delete ngo member
        await NGOMemberHoursQueries.deleteAllNGOMemberHours(
          databaseManager,
          ngoMember.userId,
        );
        await NGOMemberQueries.deleteNGOMemberByUserId(databaseManager, userId);
        await UserQueries.deleteById(databaseManager, userId);

        res.status(200).json({ message: "NGOMember deleted successfully." });
      } catch (err) {
        console.log(`Error occured in DELETE /ngo-member: ${err}.`);
      }
    },
  ),
);

export { router as ngoMemberRouter };
