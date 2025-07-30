/**
 * Router for serving enum values, species, and breed-related metadata.
 * Handles multilingual support and Zod schema validation.
 */

import { Router } from "express";
import { openAPIRoute } from "express-zod-openapi-autogen";

// db
import { BreedQueries } from "../database/queries/breed";
import { databaseManager } from "../app";
import {
  Behaviour,
  Employment,
  Experience,
  Gender,
  LocalityType,
  MaritalStatus,
  Residence,
  Tenure,
  Weekday,
} from "../models/enums";
import Breed from "../models/db-models/breed";
import SpeciesTranslation from "../models/db-models/speciestranslation";
import { z } from "zod";

// custom http errors
import { EnumDoesntExist, NoBreedsFound } from "../utils/errors";

// zod schemas
import {
  BreedResponseSchema,
  EnumResponseSchema,
  SpeciesResponseSchema,
} from "../models/zod-schemas/enums.zod";

// multilingual
import { TranslationManager } from "../utils/translations-manager";

const router = Router();

/**
 * @route GET /species
 * @description Retrieves a list of animal species, optionally translated based on user's language.
 * @header {AcceptLang Header}
 * @returns {
 * status: 200;
 * species: Array<species>} JSON array of species strings.
 * @throws {Error} On query or translation errors.
 */
router.get(
  "/species",
  openAPIRoute(
    {
      tag: "enums",
      summary: "Get all species",
      description: "Returns translated species names based on user's language.",
      response: SpeciesResponseSchema,
    },

    async (req, res, next) => {
      try {
        const language = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(language);

        if (language !== "en") {
          let species = (await BreedQueries.selectSpecies(
            databaseManager,
            tm,
          )) as SpeciesTranslation[];

          let speciesArr = species.map((row) => row.translatedSpecies);

          const response = SpeciesResponseSchema.parse(speciesArr);

          res.status(200).json(response);
        } else {
          let species = (await BreedQueries.selectSpecies(
            databaseManager,
            tm,
          )) as Breed[];

          let speciesArr = species.map((row) => row.species);

          const response = SpeciesResponseSchema.parse(speciesArr);

          res.status(200).json(response);
        }
      } catch (err) {
        console.log(`Error occured in GET /species route: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /breeds
 * @description Retrieves breeds based on the given species query parameter.
 * @header {AcceptLang Header}
 * @query {
 * species: string
 * }
 * @returns {
 * status: 200;
 * species: Array<breeds>} JSON array of breed strings.
 * @throws {Error} On database query or validation error.
 */
router.get(
  "/breeds",
  openAPIRoute(
    {
      tag: "enums",
      summary: "Get breeds by species",
      description: "Returns a list of breeds for a given species.",
      query: z.object({ species: z.string() }),
      response: BreedResponseSchema,
    },

    async (req, res, next) => {
      try {
        const species = req.query.species as string;
        const language = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(language);

        let breeds: Breed[] = await BreedQueries.selectBreedsBySpecies(
          databaseManager,
          species,
          tm,
        );
        if (breeds.length === 0) {
          throw NoBreedsFound;
        } else {
          let breedsArr = breeds.map((value) => value.breedName);

          const response = BreedResponseSchema.parse(breedsArr);

          res.status(200).json(response);
        }
      } catch (err) {
        console.log(`Error occured in GET /breeds route: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /enum
 * @description Returns a translated list of enum values for a specific type.
 * @query {
 * enum: string
 * } - Type of enum to fetch (e.g., "experience", "gender", "weekday", etc.)
 * * @returns {
 * status: 200;
 * enums: Array<enums>}JSON array of translated enum values.
 * @throws {EnumDoesntExist} If provided type is not supported.
 * @throws {Error} On translation or schema validation failure.
 */
router.get(
  "/enum",
  openAPIRoute(
    {
      tag: "enums",
      summary: "Get translated enum values",
      description: "Returns translated values for a specified enum type.",
      query: z.object({
        types: z.enum([
          "experience",
          "tenure",
          "maritalStatus",
          "localityType",
          "residence",
          "employment",
          "weekday",
          "gender",
          "behaviour",
        ]),
      }),
      response: EnumResponseSchema,
    },

    async (req, res, next) => {
      try {
        const language = res.locals.lang;
        const types = req.query.types;

        const tm = TranslationManager.getInstance();
        tm.setLocale(language);

        let enums!: any[];
        if (types == "experience") {
          enums = Object.values(Experience);
          enums = enums.map((value) => tm.getExperienceTranslation(value));
          const response = EnumResponseSchema.parse(enums);
          res.status(200).json(response);
        } else if (types == "tenure") {
          enums = Object.values(Tenure);
          enums = enums.map((value) => tm.getTenureTranslation(value));

          const response = EnumResponseSchema.parse(enums);
          res.status(200).json(response);
        } else if (types == "maritalStatus") {
          enums = Object.values(MaritalStatus);
          enums = enums.map((value) => tm.getMaritalStatusTranslation(value));
          const response = EnumResponseSchema.parse(enums);
          res.status(200).json(response);
        } else if (types == "localityType") {
          enums = Object.values(LocalityType);
          enums = enums.map((value) => tm.getLocalityTypeTranslation(value));
          const response = EnumResponseSchema.parse(enums);

          res.status(200).json(response);
        } else if (types == "residence") {
          enums = Object.values(Residence);
          enums = enums.map((value) => tm.getResidenceTranslation(value));
          const response = EnumResponseSchema.parse(enums);

          res.status(200).json(response);
        } else if (types == "employment") {
          enums = Object.values(Employment);
          enums = enums.map((value) => tm.getEmploymentTranslation(value));
          const response = EnumResponseSchema.parse(enums);

          res.status(200).json(response);
        } else if (types == "weekday") {
          enums = Object.values(Weekday);
          enums = enums.map((value) => tm.getWeekdayTranslation(value));
          const response = EnumResponseSchema.parse(enums);

          res.status(200).json(response);
        } else if (types == "gender") {
          enums = Object.values(Gender);
          enums = enums.map((value) => tm.getGenderTranslation(value));
          const response = EnumResponseSchema.parse(enums);

          res.status(200).json(response);
        } else if (types == "behaviour") {
          enums = Object.values(Behaviour);
          enums = enums.map((value) => tm.getBehaviourTranslation(value));
          const response = EnumResponseSchema.parse(enums);
          res.status(200).json(response);
        } else {
          throw EnumDoesntExist;
        }
      } catch (err) {
        console.log(`Error occured in get-enums route: ${err}`);
        next(err);
      }
    },
  ),
);

export { router as enumRouter };
