/**
 * Caretaker router that handles profile creation, update, retrieval, and deletion
 * for authenticated users acting as caretakers.
 */

import { Router, Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { openAPIRoute } from "express-zod-openapi-autogen";

// middlewares
import { authenticateToken } from "../middlewares/verifiy-token.middleware";

//db
import { databaseManager, minioManager } from "../app";
import { CaretakerQueries } from "../database/queries/caretaker";
import { CTHoursQueries } from "../database/queries/cthours";
import CTHours from "../models/db-models/cthours";
import { Caretaker, FullCaretaker } from "../models/db-models/caretaker";
import { UserQueries } from "../database/queries/user";
import { User } from "../models/db-models/user";

// zod schemas
import {
  CaretakerAlreadyExistsError,
  CaretakerNotFoundError,
  IdNotFoundError,
  UserNotAuthorizedError,
  UserNotFoundError,
} from "../utils/errors";
import {
  CaretakerStatusResponseSchema,
  CompleteCaretakerSchema,
  SingleCaretakerCreateRequestSchema,
  SingleCaretakerRequestSchema,
  SingleCaretakerUpdateRequestSchema,
} from "../models/zod-schemas/caretaker.zod";
import { SingleMessageResponseSchema } from "../models/zod-schemas/shared.zod";

// translation
import { TranslationManager } from "../utils/translations-manager";

export const router = Router();

/**
 * @route GET /caretaker-status
 * @description Checks whether the authenticated user is a caretaker, needs a caretaker profile,
 *              and whether they already have one.
 * @header {Authorization Header}
 * @returns {
 * status: 201;
 * id:string;
 * token:string;
 * }
 * @returns {
 * status: 200;
 * isCaretakerUser: boolean;
 * needsCaretakerProfile: boolean;
 * hasCaretakerProfile: boolean;
 * }
 * @throws {UserNotAuthorizedError} if user is not authenticated or user not found.
 */
router.get(
  "/caretaker-status",
  authenticateToken,
  openAPIRoute(
    {
      tag: "Caretaker",
      summary: "Get caretaker status",
      description: "Returns caretaker profile status and related flags.",
      response: CaretakerStatusResponseSchema,
    },
    async (req, res, next) => {
      try {
        if (!req.user) throw UserNotAuthorizedError;

        const lang = res.locals.lang || "en";
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        const userResult = await UserQueries.selectByIdSecurely(
          databaseManager,
          req.user.id,
        );

        if (userResult === undefined) {
          throw UserNotAuthorizedError;
        }

        const user = userResult;
        const hasCaretakerProfile = await CaretakerQueries.selectById(
          databaseManager,
          req.user.id,
          tm,
        );

        res.status(200).json({
          isCaretakerUser: !user.isNgoUser,
          needsCaretakerProfile: !user.isNgoUser && !hasCaretakerProfile,
          hasCaretakerProfile: !!hasCaretakerProfile,
        });
      } catch (err) {
        console.error("Error in /caretaker-status:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /caretaker/:caretakerId
 * @description Retrieves full caretaker data by caretaker ID.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @param {string} caretakerId - ID of the caretaker to retrieve.
 * @returns {
 * status: 200;
 * caretaker: FullCaretaker;
 * }
 * @throws {CaretakerNotFoundError} if no caretaker is found.
 */
router.get(
  "/caretaker/:caretakerId",
  authenticateToken,
  openAPIRoute(
    {
      tag: "Caretaker",
      summary: "Get caretaker by ID",
      description: "Retrieves full caretaker data by caretaker ID.",
      response: CompleteCaretakerSchema,
    },
    async (req, res, next) => {
      try {
        if (!req.user) throw UserNotAuthorizedError;
        const lang = res.locals.lang;
        const caretakerId = req.params.caretakerId;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        const caretaker: FullCaretaker | undefined =
          await CaretakerQueries.selectAllInfosById(
            databaseManager,
            caretakerId,
            tm,
          );

        if (!caretaker) {
          throw CaretakerNotFoundError;
        }

        // update picture link
        if (caretaker.profilePictureLink != null) {
          caretaker.profilePictureLink = await minioManager.getPublicURL(
            caretaker.profilePicturePath!,
          );
        }

        const response = CompleteCaretakerSchema.parse(caretaker);

        res.status(200).json(response);
      } catch (err) {
        console.error("Error in GET /caretaker", err);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /caretaker
 * @description Creates a new caretaker profile and working hours for the authenticated user.
 *              Prevents duplicate profile creation.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @body {
 * firstName: string;
 * lastName: string;
 * phoneNumber: string;
 * space: number;
 * experience: string;
 * tenure: string;
 * maritalStatus: string;
 * financialAssistance: boolean;
 * localityType: string;
 * garden: boolean;
 * floor: number;
 * residence: string;
 * streetName: string;
 * cityName: string;
 * zip: string;
 * country: string;
 * houseNumber: string;
 * employmentType: string;
 * previousAdoption: boolean;
 * numberKids: number;
 * birthdate: Date;
 * holidayCare: boolean;
 * adoptionWillingness: boolean;
 * firstName: string;
 * lastName: string;
 * phoneNumber: string;
 * ctHours: Array<CTHours>,
 * }
 * @returns {
 * status: 201;
 * message: "Caretaker created successfully."
 * }
 * @throws {CaretakerAlreadyExistsError} if caretaker profile already exists.
 * @throws {UserNotFoundError} if user doesnt exist.
 */
router.post(
  "/caretaker",
  authenticateToken,
  openAPIRoute(
    {
      tag: "Caretaker",
      summary: "Create a caretaker",
      description: "Creates a caretaker and associated CT hours.",
      body: SingleCaretakerCreateRequestSchema,
      response: SingleMessageResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lang = res.locals.lang;
        const userId = req.user!.id;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        SingleCaretakerRequestSchema.parse(req.body);

        // check if caretaker already exists
        if (await CaretakerQueries.selectById(databaseManager, userId, tm)) {
          throw CaretakerAlreadyExistsError;
        }

        // create caretaker data
        const caretakerData: Caretaker = plainToInstance(Caretaker, req.body);
        caretakerData.userId = userId!;
        const ctHoursRaw = req.body.ctHours || [];
        const ctHoursArray = Array.isArray(ctHoursRaw)
          ? ctHoursRaw
          : [ctHoursRaw];
        let ctHoursData: CTHours[] = plainToInstance(CTHours, ctHoursArray);

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

        // save caretaker to db
        await CaretakerQueries.insert(databaseManager, caretakerData, tm);
        await CTHoursQueries.insertCTHours(
          databaseManager,
          userId!,
          ctHoursData,
          tm,
        );

        // change user data if given
        await UserQueries.update(databaseManager, userData);

        res.status(201).json({ message: "Caretaker created successfully." });
      } catch (err) {
        console.log(`Error occured ${err}.`);
        next(err);
      }
    },
  ),
);

/**
 * @route PUT /caretaker
 * @description Updates an existing caretaker profile and their working hours.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @body {
 * firstName: string;
 * lastName: string;
 * phoneNumber: string;
 * space: number;
 * experience: string;
 * tenure: string;
 * maritalStatus: string;
 * financialAssistance: boolean;
 * localityType: string;
 * garden: boolean;
 * floor: number;
 * residence: string;
 * streetName: string;
 * cityName: string;
 * zip: string;
 * country: string;
 * houseNumber: string;
 * employmentType: string;
 * previousAdoption: boolean;
 * numberKids: number;
 * birthdate: Date;
 * holidayCare: boolean;
 * adoptionWillingness: boolean;
 * firstName: string;
 * lastName: string;
 * phoneNumber: string;
 * ctHours: Array<CTHours>,
 * }
 * @returns {
 * status: 200;
 * message: "Caretaker updated successfully."
 * }
 * @throws {CaretakerNotFoundError} if the user does not have a caretaker profile yet.
 * @throws {UserNotFoundError} if user doesnt exist.
 */
router.put(
  "/caretaker",
  authenticateToken,
  openAPIRoute(
    {
      tag: "Caretaker",
      summary: "Update caretaker",
      description: "Update caretaker data and CT hours.",
      body: SingleCaretakerUpdateRequestSchema,
      response: SingleMessageResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lang = res.locals.lang;
        const userId = req.user!.id;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        // test if caretaker exists
        const existingCaretaker = await CaretakerQueries.selectById(
          databaseManager,
          userId!,
          tm,
        );
        if (!existingCaretaker) {
          throw CaretakerNotFoundError;
        }

        SingleCaretakerRequestSchema.parse(req.body);

        // create data models for caretaker and cthours
        const caretakerData: Caretaker = plainToInstance(Caretaker, req.body);
        const ctHoursRaw = req.body.ctHours || [];
        const ctHoursArray = Array.isArray(ctHoursRaw)
          ? ctHoursRaw
          : [ctHoursRaw];
        const ctHoursData: CTHours[] = plainToInstance(CTHours, ctHoursArray);

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

        // update data
        await CaretakerQueries.updateCaretakerById(
          databaseManager,
          userId!,
          caretakerData,
          tm,
        );
        if (ctHoursData.length > 0) {
          await CTHoursQueries.updateCTHours(
            databaseManager,
            userId!,
            ctHoursData,
            tm,
          );
        }

        // change user data if given
        await UserQueries.update(databaseManager, userData);

        res.status(200).json({
          message: "Caretaker updated successfully.",
        });
      } catch (err) {
        console.log(`Error occurred: ${err}.`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /caretaker
 * @description Deletes a caretaker profile, associated working hours, and the user itself.
 *  * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @returns {
 * status: 200;
 * message: "Caretaker deleted successfully."
 * }
 * @throws {CaretakerNotFoundError} if caretaker profile does not exist.
 * @throws {IdNotFoundError} if user ID is missing.
 */
router.delete(
  "/caretaker",
  authenticateToken,
  openAPIRoute(
    {
      tag: "Caretaker",
      summary: "Delete caretaker",
      description: "Deletes caretaker profile and CT hours.",
      response: SingleMessageResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lang = res.locals.lang;
        const userId = req.user?.id;
        if (!userId) {
          throw IdNotFoundError;
        }
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        const caretaker: Caretaker | undefined =
          await CaretakerQueries.selectById(databaseManager, userId, tm);
        if (caretaker === undefined) {
          throw CaretakerNotFoundError;
        }

        // delete from db
        await CTHoursQueries.deleteCTHoursById(databaseManager, userId);
        await CaretakerQueries.deleteCaretakerById(databaseManager, userId);
        await UserQueries.deleteById(databaseManager, userId);

        res.status(200).json({ message: "Caretaker deleted successfully." });
      } catch (err) {
        console.log(`Error occured ${err}.`);
        next(err);
      }
    },
  ),
);

export { router as caretakerRouter };
