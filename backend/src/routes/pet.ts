import { authenticateToken } from "../middlewares/verifiy-token.middleware";
import express, { Router, Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { z } from "zod";
import { databaseManager } from "../app";
import { Pet } from "../models/db-models/pet";
import { PetFilters, PetQueries } from "../database/queries/pet";
import {
  IdNotFoundError,
  ValidationError,
  UserNotAuthorizedError,
  NGOMemberNotFoundError,
} from "../utils/errors";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { v4 as uuidv4 } from "uuid";
import { BreedQueries } from "../database/queries/breed";
import Breed from "../models/db-models/breed";
import { detectLanguage } from "../middlewares/detect-lang.middleware";
import { PetVaccinationQueries } from "../database/queries/petvaccination";
import { PetFearQueries } from "../database/queries/petfears";
import { PetDiseaseQueries } from "../database/queries/petdisease";
import { PetBookmarkQueries } from "../database/queries/petbookmark";
import PetDisease from "../models/db-models/petdisease";
import PetFears from "../models/db-models/petfears";
import PetVaccination from "../models/db-models/petvaccination";
import { verifyNGO } from "../middlewares/verifiy-ngo.middleware";
import { NGONotVerifiedError } from "../utils/errors";
import { SingleMessageResponseSchema } from "../models/zod-schemas/shared.zod";
import { TranslationManager } from "../utils/translations-manager";

const PetResponseSchema = z.object({
  data: z.array(z.any()),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    filtersApplied: z.any().optional(),
  }),
});

const SinglePetResponseSchema = z.object({
  data: z.any(),
});

const AvailableDataResponseSchema = z.object({
  data: z.array(z.string()),
});

const PetBookmarkResponseSchema = z.union([
  z.object({
    data: z.any().optional(),
    isBookmarked: z.boolean(),
  }),
  z.object({
    message: z.string(),
  }),
  z.object({
    error: z.string(),
  }),
]);

const PetBookmarksResponseSchema = z.union([
  z.object({
    data: z.array(z.any()),
  }),
  z.object({
    message: z.string(),
  }),
  z.object({
    error: z.string(),
  }),
]);

const PetCreateResponseSchema = z.union([
  z.object({
    message: z.string(),
    petId: z.string(),
  }),
  z.object({
    message: z.string(),
  }),
  z.object({
    error: z.string(),
  }),
]);

const PetDiseaseResponseSchema = z.union([
  z.object({
    message: z.string(),
  }),
  z.object({
    petDiseaseData: z.array(z.any()),
  }),
  z.object({
    error: z.string(),
  }),
]);

const PetVaccinationResponseSchema = z.union([
  z.object({
    message: z.string(),
  }),
  z.object({
    petVaccinationData: z.array(z.any()),
  }),
  z.object({
    error: z.string(),
  }),
]);

const PetFearResponseSchema = z.union([
  z.object({
    message: z.string(),
  }),
  z.object({
    petFeardata: z.array(z.any()),
  }),
  z.object({
    error: z.string(),
  }),
]);

const PetBookmarkCreateResponseSchema = z.union([
  z.object({
    message: z.string(),
    data: z.object({
      caretakerId: z.string(),
      petId: z.string(),
    }),
  }),
  z.object({
    message: z.string(),
  }),
  z.object({
    error: z.string(),
  }),
]);

export const router = Router();

/**
 * @route GET /pets
 * @summary Get pets with filters
 * @description Retrieves a paginated list of pets with optional filtering by various criteria such as gender, species, location, NGO, etc.
 * @header {AcceptLanguage Header}
 * @queryParam {number} limit - Number of pets to return (default: 9)
 * @queryParam {number} offset - Number of pets to skip (default: 0)
 * @queryParam {string} gender - Filter by gender (Male/Female/Diverse)
 * @queryParam {string|string[]} country - Filter by country(ies)
 * @queryParam {string} city - Filter by city
 * @queryParam {string} zip - Filter by ZIP code
 * @queryParam {string|string[]} ngoName - Filter by NGO name(s)
 * @queryParam {string|string[]} species - Filter by species
 * @queryParam {string|string[]} breeds - Filter by breed(s)
 * @queryParam {string|string[]} characteristics - Filter by characteristics
 * @queryParam {string|string[]} health - Filter by health status
 * @queryParam {number} minAgeYears - Minimum age in years
 * @queryParam {number} maxAgeYears - Maximum age in years
 * @queryParam {number} minWeight - Minimum weight
 * @queryParam {number} maxWeight - Maximum weight
 * @queryParam {boolean} kidsAllowed - Filter by kid-friendly pets
 * @returns {PetResponseSchema} 200 - Paginated list of pets with metadata
 */
router.get(
  "/pets",
  detectLanguage,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get pets with filters",
      description:
        "Retrieves a paginated list of pets with optional filtering by various criteria.",
      response: PetResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lang = res.locals.lang;
        const limit = parseInt(req.query.limit as string) || 9;
        const offset = parseInt(req.query.offset as string) || 0;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        const filters: PetFilters = {};

        //String filters
        if (
          typeof req.query.gender === "string" &&
          req.query.gender.toLowerCase() !== "all"
        ) {
          filters.gender = req.query.gender;
        }
        if (req.query.country) {
          filters.country = Array.isArray(req.query.country)
            ? (req.query.country as string[])
            : [req.query.country as string];
        }
        if (typeof req.query.city === "string") {
          filters.city = req.query.city;
        }
        if (typeof req.query.zip === "string") {
          filters.zip = req.query.zip;
        }
        if (req.query.ngoName) {
          filters.ngoName = Array.isArray(req.query.ngoName)
            ? (req.query.ngoName as string[])
            : [req.query.ngoName as string];
        }

        //Array filters (species, breeds)
        if (req.query.species) {
          filters.species = Array.isArray(req.query.species)
            ? (req.query.species as string[])
            : [req.query.species as string];
        }
        if (req.query.breeds) {
          filters.breeds = Array.isArray(req.query.breeds)
            ? (req.query.breeds as string[])
            : [req.query.breeds as string];
        }

        if (req.query.characteristics) {
          filters.characteristics = Array.isArray(req.query.characteristics)
            ? (req.query.characteristics as string[])
            : [req.query.characteristics as string];
        }

        if (req.query.health) {
          filters.health = Array.isArray(req.query.health)
            ? (req.query.health as string[])
            : [req.query.health as string];
        }

        //Numeric filters
        if (req.query.minAgeYears) {
          filters.minAgeYears = parseInt(req.query.minAgeYears as string);
        }
        if (req.query.maxAgeYears) {
          filters.maxAgeYears = parseInt(req.query.maxAgeYears as string);
        }
        if (req.query.minWeight) {
          filters.minWeight = parseFloat(req.query.minWeight as string);
        }
        if (req.query.maxWeight) {
          filters.maxWeight = parseFloat(req.query.maxWeight as string);
        }

        //Boolean filters
        if (req.query.kidsAllowed !== undefined) {
          filters.kidsAllowed = req.query.kidsAllowed === "true";
        }

        //console.log("filters", JSON.stringify(filters, null, 2));

        const result = await PetQueries.selectPetsWithFilters(
          databaseManager,
          filters,
          limit,
          offset,
          tm,
        );

        res.status(200).json({
          data: result.pets,
          meta: {
            total: result.total,
            limit,
            offset,
            filtersApplied:
              Object.keys(filters).length > 0 ? filters : undefined,
          },
        });
      } catch (err) {
        console.error(`Error fetching pets:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /available-breeds
 * @summary Get available pet breeds
 * @description Retrieves a list of all available pet breeds in the system.
 * @returns {AvailableDataResponseSchema} 200 - List of available breeds
 */
router.get(
  "/available-breeds",
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get available pet breeds",
      description:
        "Retrieves a list of all available pet breeds in the system.",
      response: AvailableDataResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await PetQueries.selectAvailableBreeds(databaseManager);
        res.status(200).json({ data: result });
      } catch (err) {
        console.error(`Error fetching available breeds:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /available-characteristics
 * @summary Get available pet characteristics
 * @description Retrieves a list of all available pet characteristics in the system.
 * @returns {AvailableDataResponseSchema} 200 - List of available characteristics
 */
router.get(
  "/available-characteristics",
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get available pet characteristics",
      description:
        "Retrieves a list of all available pet characteristics in the system.",
      response: AvailableDataResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result =
          await PetQueries.selectAvailableCharacteristics(databaseManager);
        res.status(200).json({ data: result });
      } catch (err) {
        console.error(`Error fetching available characteristics:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /available-ngos
 * @summary Get available NGOs
 * @description Retrieves a list of all NGOs that have pets in the system.
 * @returns {AvailableDataResponseSchema} 200 - List of available NGOs
 */
router.get(
  "/available-ngos",
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get available NGOs",
      description: "Retrieves a list of all NGOs that have pets in the system.",
      response: AvailableDataResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await PetQueries.selectAvailableNGOs(databaseManager);
        res.status(200).json({ data: result });
      } catch (err) {
        console.error(`Error fetching available NGOs:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /available-countries
 * @summary Get available countries
 * @description Retrieves a list of all countries where pets are located.
 * @returns {AvailableDataResponseSchema} 200 - List of available countries
 */
router.get(
  "/available-countries",
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get available countries",
      description: "Retrieves a list of all countries where pets are located.",
      response: AvailableDataResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result =
          await PetQueries.selectAvailableCountries(databaseManager);
        res.status(200).json({ data: result });
      } catch (err) {
        console.error(`Error fetching available countries:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /pet/:id
 * @summary Get pet by ID
 * @description Retrieves detailed information about a specific pet by its ID.
 * @header {AcceptLanguage Header}
 * @pathParam {string} id - Pet ID
 * @returns {SinglePetResponseSchema} 200 - Pet details
 * @throws {IdNotFoundError} if pet with given ID doesn't exist
 */
router.get(
  "/pet/:id",
  detectLanguage,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get pet by ID",
      description:
        "Retrieves detailed information about a specific pet by its ID.",
      response: SinglePetResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        const petId = req.params?.id;

        console.log(`[DEBUG] Backend GET /pet/:id called with ID: ${petId}`);
        console.log(`[DEBUG] Language: ${lang}`);

        const pet = await PetQueries.selectPetById(databaseManager, petId, tm);

        console.log(
          `[DEBUG] Database query result: ${pet ? "Found" : "Not found"}`,
        );
        if (pet) {
          console.log(`[DEBUG] Pet data keys: ${Object.keys(pet)}`);
        }

        if (!pet) {
          console.log(`[DEBUG] Throwing IdNotFoundError for pet ID: ${petId}`);
          throw IdNotFoundError;
        }
        res.status(200).json({ data: pet });
      } catch (err) {
        console.log(`[DEBUG] Error in GET /pet/:id: ${err}`);
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /pet
 * @summary Create a new pet
 * @description Creates a new pet with associated diseases, fears, and vaccinations. Requires NGO member authentication and verification.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @body {Pet} Pet data including breed information, diseases, fears, and vaccinations
 * @returns {PetCreateResponseSchema} 201 - Pet created successfully with pet ID
 * @throws {NGONotVerifiedError} if NGO is not verified
 * @throws {ValidationError} if species or breed doesn't exist
 */
router.post(
  "/pet",
  authenticateToken,
  verifyNGO,
  detectLanguage,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Create a new pet",
      description:
        "Creates a new pet with associated diseases, fears, and vaccinations. Requires NGO member authentication.",
      response: PetCreateResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const userId = req.user?.id;
        const breedName = req.body.breedName;
        const species = req.body.species;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        if (!req.ngo?.verified) {
          throw NGONotVerifiedError;
        }

        if (!species || !breedName) {
          res.status(400).json({
            message: "Both 'species' and 'breed' are required.",
          });
          return;
        }

        // check if species exists
        const speciesList = await BreedQueries.selectSpecies(
          databaseManager,
          tm,
        );
        const speciesExists = speciesList.some(
          (s: any) => s.species === species,
        );

        if (!speciesExists) {
          res.status(400).json({
            message: `The species '${species}' does not exist.`,
          });
          return;
        }

        // check if breed exists
        const breedList = await BreedQueries.selectBreedsBySpecies(
          databaseManager,
          species,
          tm,
        );

        const breedExists = breedList.some((b) => b.breedName === breedName);
        if (!breedExists) {
          res.status(404).json({
            message: `The breed '${breedName}' does not exist for species '${species}'.`,
          });
          return;
        }

        const petData: Pet = plainToInstance(Pet, req.body);
        petData.id = uuidv4();
        petData.breed = breedName;
        petData.ngoMemberId = userId;

        const petDiseaseRaw = req.body.petDisease || [];
        const petDiseaseArray = Array.isArray(petDiseaseRaw)
          ? petDiseaseRaw
          : [petDiseaseRaw];
        const petDiseaseData: PetDisease[] = plainToInstance(
          PetDisease,
          petDiseaseArray,
        );
        // Assign petId to each disease record
        petDiseaseData.forEach((disease) => {
          disease.petId = petData.id;
        });

        const petFearsRaw = req.body.petFears || [];
        const petFearsArray = Array.isArray(petFearsRaw)
          ? petFearsRaw
          : [petFearsRaw];

        const petFearsData: PetFears[] = plainToInstance(
          PetFears,
          petFearsArray,
        );
        // Assign petId to each fear record
        petFearsData.forEach((fear) => {
          fear.petId = petData.id;
        });

        const petVaccinationRaw = req.body.petVaccination || [];
        const petVaccinationArray = Array.isArray(petVaccinationRaw)
          ? petVaccinationRaw
          : [petVaccinationRaw];

        const petVaccinationData: PetVaccination[] = plainToInstance(
          PetVaccination,
          petVaccinationArray,
        );
        // Assign petId to each vaccination record
        petVaccinationData.forEach((vaccination) => {
          vaccination.petId = petData.id;
        });

        await PetQueries.insert(databaseManager, petData, tm);

        await PetDiseaseQueries.insertPetDisease(
          databaseManager,
          petDiseaseData,
        );

        await PetFearQueries.insertPetFears(databaseManager, petFearsData);

        await PetVaccinationQueries.insertPetVaccinations(
          databaseManager,
          petVaccinationData,
        );

        res.status(201).json({
          message: "Pet created successfully.",
          petId: petData.id,
        });
      } catch (err) {
        console.error(`Error occurred: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route PUT /pet/:id
 * @summary Update pet by ID
 * @description Updates an existing pet. Only the NGO member who created the pet can update it.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @pathParam {string} id - Pet ID
 * @body {Pet} Updated pet data
 * @returns {SingleMessageResponseSchema} 200 - Pet updated successfully
 * @throws {IdNotFoundError} if pet doesn't exist
 * @throws {NGONotVerifiedError} if NGO is not verified
 * @throws {403} if user is not the creator of the pet
 */
router.put(
  "/pet/:id",
  authenticateToken,
  verifyNGO,
  detectLanguage,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Update pet by ID",
      description:
        "Updates an existing pet. Only the NGO member who created the pet can update it.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        const lang = res.locals.lang;
        const petId = req.params.id;
        const userId = req.user?.id;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        if (!petId) {
          throw IdNotFoundError;
        }

        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        if (!req.ngo?.verified) {
          throw NGONotVerifiedError;
        }

        const pet = await PetQueries.selectPetById(databaseManager, petId, tm);

        if (!pet) {
          throw IdNotFoundError;
        }

        if (pet.ngoMemberId !== userId) {
          res.status(403).json({
            message: "You can only update pets created by your NGO.",
          });
          return;
        }

        const updatedPetData = req.body;
        updatedPetData.ngoMemberId = pet.ngoMemberId;
        await PetQueries.updateById(databaseManager, petId, updatedPetData);
        res.status(200).json({ message: "Pet updated successfully." });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /pet/:id
 * @summary Delete pet by ID
 * @description Deletes an existing pet. Only the NGO member who created the pet can delete it.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @pathParam {string} id - Pet ID
 * @returns {SingleMessageResponseSchema} 200 - Pet deleted successfully
 * @throws {IdNotFoundError} if pet doesn't exist
 * @throws {NGONotVerifiedError} if NGO is not verified
 * @throws {403} if user is not the creator of the pet
 */
router.delete(
  "/pet/:id",
  authenticateToken,
  verifyNGO,
  detectLanguage,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Delete pet by ID",
      description:
        "Deletes an existing pet. Only the NGO member who created the pet can delete it.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        const lang = res.locals.lang;
        const petId = req.params.id;
        const userId = req.user?.id;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        if (!req.ngo?.verified) {
          throw NGONotVerifiedError;
        }

        const pet = await PetQueries.selectByIdSecurely(
          databaseManager,
          petId,
          tm,
        );

        if (!pet) {
          throw IdNotFoundError;
        }

        if (pet.ngoMemberId !== userId) {
          res.status(403).json({
            message: "You can only delete pets created by your NGO.",
          });
          return;
        }

        await PetQueries.deleteById(databaseManager, petId);
        res.status(200).json({ message: "Pet deleted successfully." });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /petbookmark/:petId
 * @summary Get user's bookmark for a specific pet
 * @description Retrieves the bookmark status for a specific pet for the authenticated user.
 * @header {Authorization Header}
 * @pathParam {string} petId - Pet ID
 * @returns {PetBookmarkResponseSchema} 200 - Bookmark data and status
 * @throws {IdNotFoundError} if pet ID is missing
 */
router.get(
  "/petbookmark/:petId",
  authenticateToken,
  openAPIRoute(
    {
      tag: "pet-bookmark",
      summary: "Get user's bookmark for a specific pet",
      description:
        "Retrieves the bookmark status for a specific pet for the authenticated user.",
      response: PetBookmarkResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.petId;
        const userId = req.user?.id;

        if (!petId) {
          throw IdNotFoundError;
        }

        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        const petBookmarkData = await PetBookmarkQueries.selectByUserAndPet(
          databaseManager,
          userId,
          petId,
        );

        res.status(200).json({
          data: petBookmarkData,
          isBookmarked: !!petBookmarkData,
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /petbookmarks
 * @summary Get all bookmarks for authenticated user
 * @description Retrieves all pet bookmarks for the authenticated user.
 * @header {Authorization Header}
 * @returns {PetBookmarksResponseSchema} 200 - List of user's pet bookmarks
 */
router.get(
  "/petbookmarks",
  authenticateToken,
  openAPIRoute(
    {
      tag: "pet-bookmark",
      summary: "Get all bookmarks for authenticated user",
      description: "Retrieves all pet bookmarks for the authenticated user.",
      response: PetBookmarksResponseSchema,
    },
    async (req, res, next) => {
      try {
        const userId = req.user?.id;

        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        const userBookmarks = await PetBookmarkQueries.selectByUserId(
          databaseManager,
          userId,
        );

        res.status(200).json({
          data: userBookmarks,
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /petbookmark/:petId
 * @summary Remove user's bookmark for a specific pet
 * @description Removes the bookmark for a specific pet for the authenticated user.
 * @header {Authorization Header}
 * @pathParam {string} petId - Pet ID
 * @returns {SingleMessageResponseSchema} 200 - Bookmark removed successfully
 * @throws {IdNotFoundError} if pet ID is missing
 */
router.delete(
  "/petbookmark/:petId",
  authenticateToken,
  openAPIRoute(
    {
      tag: "pet-bookmark",
      summary: "Remove user's bookmark for a specific pet",
      description:
        "Removes the bookmark for a specific pet for the authenticated user.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.petId;
        const userId = req.user?.id;

        if (!petId) {
          throw IdNotFoundError;
        }

        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        await PetBookmarkQueries.deleteByUserAndPet(
          databaseManager,
          userId,
          petId,
        );
        res.status(200).json({ message: "Bookmark removed successfully." });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /petbookmark/:petId
 * @summary Add bookmark for authenticated user
 * @description Creates a new bookmark for a specific pet for the authenticated user.
 * @header {Authorization Header}
 * @pathParam {string} petId - Pet ID
 * @returns {PetBookmarkCreateResponseSchema} 201 - Bookmark added successfully
 * @throws {IdNotFoundError} if pet ID is missing
 */
router.post(
  "/petbookmark/:petId",
  authenticateToken,
  openAPIRoute(
    {
      tag: "pet-bookmark",
      summary: "Add bookmark for authenticated user",
      description:
        "Creates a new bookmark for a specific pet for the authenticated user.",
      response: PetBookmarkCreateResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const petId = req.params.petId;
        const userId = req.user?.id;

        if (!petId) {
          throw IdNotFoundError;
        }

        if (!userId) {
          res.status(401).json({
            message: "User authentication required.",
          });
          return;
        }

        const petBookmarkData = {
          caretakerId: userId,
          petId: petId,
        };

        await PetBookmarkQueries.insertPetBookmark(
          databaseManager,
          petBookmarkData,
        );

        res.status(201).json({
          message: "Bookmark added successfully.",
          data: petBookmarkData,
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /petdisease
 * @summary Create pet disease record
 * @description Creates a new disease record for a pet.
 * @header {AcceptLanguage Header}
 * @body {PetDisease} Pet disease data
 * @returns {SingleMessageResponseSchema} 200 - Pet disease data inserted
 * @throws {ValidationError} if pet disease data is invalid
 */
router.post(
  "/petdisease",
  openAPIRoute(
    {
      tag: "pet-disease",
      summary: "Create pet disease record",
      description: "Creates a new disease record for a pet.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const petDiseaseData = req.body;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        if (!petDiseaseData) {
          throw ValidationError;
        }

        await PetDiseaseQueries.insertPetDisease(
          databaseManager,
          petDiseaseData,
        );

        res.status(200).json({
          message: "PetDiseaseData inserted",
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /petdisease/:id
 * @summary Get pet diseases by pet ID
 * @description Retrieves all disease records for a specific pet.
 * @pathParam {string} id - Pet ID
 * @returns {PetDiseaseResponseSchema} 200 - List of pet diseases
 * @throws {IdNotFoundError} if pet ID is missing
 */
router.get(
  "/petdisease/:id",
  openAPIRoute(
    {
      tag: "pet-disease",
      summary: "Get pet diseases by pet ID",
      description: "Retrieves all disease records for a specific pet.",
      response: PetDiseaseResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;

        if (!petId) {
          throw IdNotFoundError;
        }

        const petDiseaseData = await PetDiseaseQueries.selectByPetId(
          databaseManager,
          petId,
        );
        res.status(200).json({
          petDiseaseData: petDiseaseData,
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /petdisease/:id
 * @summary Delete pet diseases by pet ID
 * @description Deletes all disease records for a specific pet.
 * @pathParam {string} id - Pet ID
 * @returns {SingleMessageResponseSchema} 200 - Pet disease data deleted successfully
 * @throws {IdNotFoundError} if pet ID is missing
 * @throws {ValidationError} if pet disease doesn't exist
 */
router.delete(
  "/petdisease/:id",
  openAPIRoute(
    {
      tag: "pet-disease",
      summary: "Delete pet diseases by pet ID",
      description: "Deletes all disease records for a specific pet.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;

        const petDisease = PetDiseaseQueries.selectByPetId(
          databaseManager,
          petId,
        );

        if (!petId) {
          throw IdNotFoundError;
        }

        if (!petDisease) {
          throw ValidationError;
        }

        await PetDiseaseQueries.deletePetDiseaseById(databaseManager, petId);
        res
          .status(200)
          .json({ message: "PetDiseaseData deleted successfully." });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /petvaccination
 * @summary Create pet vaccination record
 * @description Creates a new vaccination record for a pet.
 * @header {AcceptLanguage Header}
 * @body {PetVaccination} Pet vaccination data
 * @returns {SingleMessageResponseSchema} 200 - Pet vaccination data inserted
 * @throws {ValidationError} if pet vaccination data is invalid
 */
router.post(
  "/petvaccination",
  openAPIRoute(
    {
      tag: "pet-vaccination",
      summary: "Create pet vaccination record",
      description: "Creates a new vaccination record for a pet.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const petVaccinationData = req.body;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        if (!petVaccinationData) {
          throw ValidationError;
        }

        await PetVaccinationQueries.insertPetVaccinations(
          databaseManager,
          petVaccinationData,
        );

        res.status(200).json({
          message: "PetVaccinationData inserted",
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /petvaccination/:id
 * @summary Get pet vaccinations by pet ID
 * @description Retrieves all vaccination records for a specific pet.
 * @pathParam {string} id - Pet ID
 * @returns {PetVaccinationResponseSchema} 200 - List of pet vaccinations
 * @throws {IdNotFoundError} if pet ID is missing
 */
router.get(
  "/petvaccination/:id",
  openAPIRoute(
    {
      tag: "pet-vaccination",
      summary: "Get pet vaccinations by pet ID",
      description: "Retrieves all vaccination records for a specific pet.",
      response: PetVaccinationResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;

        if (!petId) {
          throw IdNotFoundError;
        }

        const petVaccinationData = await PetVaccinationQueries.selectByPetId(
          databaseManager,
          petId,
        );
        res.status(200).json({
          petVaccinationData: petVaccinationData,
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /petvaccination/:id
 * @summary Delete pet vaccinations by pet ID
 * @description Deletes all vaccination records for a specific pet.
 * @pathParam {string} id - Pet ID
 * @returns {SingleMessageResponseSchema} 200 - Pet vaccination data deleted successfully
 * @throws {IdNotFoundError} if pet ID is missing
 * @throws {ValidationError} if pet vaccination doesn't exist
 */
router.delete(
  "/petvaccination/:id",
  openAPIRoute(
    {
      tag: "pet-vaccination",
      summary: "Delete pet vaccinations by pet ID",
      description: "Deletes all vaccination records for a specific pet.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;

        const petVaccination = PetVaccinationQueries.selectByPetId(
          databaseManager,
          petId,
        );

        if (!petId) {
          throw IdNotFoundError;
        }

        if (!petVaccination) {
          throw ValidationError;
        }

        await PetVaccinationQueries.deletePetVaccinationById(
          databaseManager,
          petId,
        );
        res.status(200).json({ message: "PetFearData deleted successfully." });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /petfear
 * @summary Create pet fear record
 * @description Creates a new fear record for a pet.
 * @header {AcceptLanguage Header}
 * @body {PetFears} Pet fear data
 * @returns {SingleMessageResponseSchema} 200 - Pet fear data inserted
 * @throws {ValidationError} if pet fear data is invalid
 */
router.post(
  "/petfear",
  openAPIRoute(
    {
      tag: "pet-fear",
      summary: "Create pet fear record",
      description: "Creates a new fear record for a pet.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const petFearsData = req.body;

        if (!petFearsData) {
          throw ValidationError;
        }

        await PetFearQueries.insertPetFears(databaseManager, petFearsData);

        res.status(200).json({
          message: "PetFearData inserted",
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /petfear/:id
 * @summary Get pet fears by pet ID
 * @description Retrieves all fear records for a specific pet.
 * @pathParam {string} id - Pet ID
 * @returns {PetFearResponseSchema} 200 - List of pet fears
 * @throws {IdNotFoundError} if pet ID is missing
 */
router.get(
  "/petfear/:id",
  openAPIRoute(
    {
      tag: "pet-fear",
      summary: "Get pet fears by pet ID",
      description: "Retrieves all fear records for a specific pet.",
      response: PetFearResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;

        if (!petId) {
          throw IdNotFoundError;
        }

        const petFearData = await PetFearQueries.selectByPetId(
          databaseManager,
          petId,
        );
        res.status(200).json({
          petFeardata: petFearData,
        });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /petfear/:id
 * @summary Delete pet fear by pet ID and fear type
 * @description Deletes a specific fear record for a pet.
 * @pathParam {string} id - Pet ID
 * @body {object} Body containing fear type to delete
 * @returns {SingleMessageResponseSchema} 200 - Pet fear data deleted successfully
 * @throws {IdNotFoundError} if pet ID is missing
 * @throws {ValidationError} if pet fear doesn't exist
 */
router.delete(
  "/petfear/:id",
  openAPIRoute(
    {
      tag: "pet-fear",
      summary: "Delete pet fear by pet ID and fear type",
      description: "Deletes a specific fear record for a pet.",
      response: SingleMessageResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;

        const petFears = PetFearQueries.selectByPetId(databaseManager, petId);

        if (!petId) {
          throw IdNotFoundError;
        }

        if (!petFears) {
          throw ValidationError;
        }

        await PetFearQueries.deleteByPetIdAndFear(
          databaseManager,
          petId,
          req.body.fear,
        );
        res.status(200).json({ message: "PetFearData deleted successfully." });
      } catch (err) {
        console.log(`Error occured.${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /my-pets
 * @summary Get pets for current user's NGO
 * @description Retrieves all pets uploaded by the current user's NGO.
 * @header {Authorization Header}
 * @header {AcceptLanguage Header}
 * @returns {PetResponseSchema} 200 - List of pets from user's NGO
 * @throws {UserNotAuthorizedError} if user is not authenticated
 * @throws {NGOMemberNotFoundError} if user is not an NGO member
 */
router.get(
  "/my-pets",
  authenticateToken,
  detectLanguage,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get pets for current user's NGO",
      description: "Retrieves all pets uploaded by the current user's NGO.",
      response: PetResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user?.id;
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        if (!userId) {
          throw UserNotAuthorizedError;
        }

        // Get user's NGO membership
        const ngoMember = await NGOMemberQueries.selectNGOMemberById(
          databaseManager,
          userId,
        );

        if (!ngoMember) {
          throw NGOMemberNotFoundError;
        }

        // Get NGO name for filtering
        const ngoQuery = `SELECT name FROM ngo WHERE id = $1`;
        const ngoResult = await databaseManager.executeQuery(ngoQuery, [
          ngoMember.ngoId,
        ]);

        if (ngoResult.rows.length === 0) {
          throw NGOMemberNotFoundError;
        }

        const ngoName = ngoResult.rows[0].name;

        // Use existing filter functionality to get pets by NGO name
        const filters: PetFilters = {
          ngoName: [ngoName],
        };

        const result = await PetQueries.selectPetsWithFilters(
          databaseManager,
          filters,
          1000, // Large limit to get all pets
          0,
          tm,
        );

        res.status(200).json({
          data: result.pets,
          meta: {
            total: result.total,
            limit: 1000,
            offset: 0,
            filtersApplied: filters,
          },
        });
      } catch (err) {
        console.error(`Error fetching user's NGO pets:`, err);
        next(err);
      }
    },
  ),
);

export { router as petRouter };
