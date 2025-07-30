import { Router } from "express";
import { openAPIRoute } from "express-zod-openapi-autogen";

// db
import { databaseManager } from "../app";
import { NGOQueries } from "../database/queries/ngo";
import { PetQueries } from "../database/queries/pet";
import { FullNGO } from "../models/db-models/ngo";
import { Pet } from "../models/db-models/pet";

// zod schemas
import { PetResponseSchema } from "../models/zod-schemas/pet.zod";
import { NGOResponseSchema } from "../models/zod-schemas/ngo.zod";

// translation
import { TranslationManager } from "../utils/translations-manager";
import { PetNotFoundError } from "../utils/errors";

const router = Router();

/**
 * @route GET /all-animals
 * @summary Get all animals
 * @description Retrieves all pet profiles stored in the database. This is a public endpoint and supports localization.
 * @returns {PetResponseSchema} 200 OK - Array of animal (pet) profiles
 * @throws {ValidationError} If response schema validation fails
 * @throws {PetNotFoundError} If no pets are found
 */
router.get(
  "/all-animals",
  openAPIRoute(
    {
      tag: "profiles",
      summary: "Get all animals",
      description: "Retrieves all animal profiles (pets) from the database.",
      response: PetResponseSchema,
    },
    async (req, res, next) => {
      try {
        const language = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(language);

        const animals: Pet[] | undefined = await PetQueries.selectSecurely(
          databaseManager,
          tm,
        );

        if (!animals) {
          throw PetNotFoundError;
        }

        const response = PetResponseSchema.parse(animals);
        res.status(200).json(response);
      } catch (err) {
        console.log(`Error occured fetching all animals: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /all-ngos
 * @summary Get all NGOs
 * @description Retrieves all NGO profiles including their opening hours. This is a public endpoint and supports localization.
 * @returns {NGOResponseSchema} 200 OK - Array of NGO profiles with working hours
 * @throws {ValidationError} If response schema validation fails
 */
router.get(
  "/all-ngos",
  openAPIRoute(
    {
      tag: "profiles",
      summary: "Get all NGOs",
      description: "Retrieves all NGO profiles from the database.",
      response: NGOResponseSchema,
    },

    async (req, res, next) => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        const ngosWithHours: FullNGO[] | undefined =
          await NGOQueries.selectAllNGOsWithHours(databaseManager, tm);
        res.status(200).json(ngosWithHours);
      } catch (err) {
        console.log(`Error occured fetching all ngos: ${err}`);
        next(err);
      }
    },
  ),
);

export { router as profilesRouter };
