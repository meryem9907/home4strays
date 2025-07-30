import { Router } from "express";
import { plainToInstance } from "class-transformer";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { z } from "zod";

// db
import { CaretakerQueries } from "../database/queries/caretaker";
import { databaseManager, minioManager } from "../app";
import { PetQueries } from "../database/queries/pet";
import { InterestedPetQueries } from "../database/queries/interestedpet";
import { Pet } from "../models/db-models/pet";
import { Caretaker, FullCaretaker } from "../models/db-models/caretaker";
import InterestedPet from "../models/db-models/interestedpet";

// middlewares
import { authenticateToken } from "../middlewares/verifiy-token.middleware";
import { verifyNGO } from "../middlewares/verifiy-ngo.middleware";

// services
import { calculateMatchScore } from "../utils/match.service";
import { TranslationManager } from "../utils/translations-manager";

// errors
import { CaretakerNotFoundError, NGONotVerifiedError } from "../utils/errors";

// zod schemas
import {
  MatchedCaretakersResponseSchema,
  MatchedPetsResponseSchema,
  MatchPetRequestSchema,
  MatchPetResponseSchema,
  MatchRevokeRequesttSchema,
} from "../models/zod-schemas/match.zod";

const router = Router();

/**
 * @route POST /match-pet
 * @summary Match a pet to a caretaker
 * @description Creates a match between the authenticated caretaker and a specified pet, and returns a compatibility score.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @body {MatchPetRequestSchema} petId - ID of the pet to be matched
 * @returns {MatchPetResponseSchema} 200 OK - Match score and related metadata
 * @throws {ValidationError} If request body is invalid
 * @throws {CaretakerNotFoundError} If the authenticated user is not a valid caretaker
 */
router.post(
  "/match-pet",
  authenticateToken,
  openAPIRoute(
    {
      tag: "match",
      summary: "Match a pet to a caretaker",
      description:
        "Creates a match between a caretaker and a pet, returning a match score.",
      body: MatchPetRequestSchema,
      response: MatchPetResponseSchema,
    },

    async (req, res, next) => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        const caretakerId = req.user!.id;
        const { petId } = MatchPetRequestSchema.parse(req.body);

        const ip: InterestedPet = { userId: caretakerId, petId: petId };
        const pet = await PetQueries.selectByIdSecurely(
          databaseManager,
          petId,
          tm,
        );
        const caretaker = await CaretakerQueries.selectById(
          databaseManager,
          caretakerId,
          tm,
        );
        if (caretaker) {
          await InterestedPetQueries.insert(databaseManager, ip);
          const score = await calculateMatchScore(pet, caretaker, tm);

          const response = MatchPetResponseSchema.parse(score);
          res.status(200).json(response);
        } else {
          throw CaretakerNotFoundError;
        }
      } catch (err) {
        console.log("Error occured in get match-pets route:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /revoke-match
 * @summary Revoke a pet match
 * @description Removes the existing match between the authenticated caretaker and a specific pet.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @body {MatchRevokeRequesttSchema} petId - ID of the pet whose match is to be revoked
 * @returns {Object} 200 OK - Status message confirming the revocation
 * @throws {ValidationError} If request body is invalid
 */
router.post(
  "/revoke-match",
  authenticateToken,
  openAPIRoute(
    {
      tag: "match",
      summary: "Revoke a pet match",
      description: "Revokes an existing match between a caretaker and a pet.",
      body: MatchRevokeRequesttSchema,
      response: z.object({
        status: z.string(),
      }),
    },

    async (req, res, next) => {
      try {
        const caretakerId = req.user!.id;
        const { petId } = MatchRevokeRequesttSchema.parse(req.body);

        await InterestedPetQueries.revokeMatch(
          databaseManager,
          caretakerId,
          petId,
        );

        res.status(200).json({ status: "Pet match revoked to caretaker." });
      } catch (err) {
        console.log("Error occured in get revoke-match route:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /matched-pets
 * @summary Get matched pets for caretaker
 * @description Retrieves all pets currently matched to the authenticated caretaker.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @returns {MatchedPetsResponseSchema} 200 OK - List of matched pets
 * @throws {ValidationError} If response validation fails
 */
router.get(
  "/matched-pets",
  authenticateToken,
  openAPIRoute(
    {
      tag: "match",
      summary: "Get matched pets for caretaker",
      description: "Retrieves all pets matched to the authenticated caretaker.",
      response: MatchedPetsResponseSchema,
    },

    async (req, res, next) => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        const caretakerId = req.user!.id;
        let matchedPets: Pet[] = await PetQueries.selectMatchedPetsByCaretaker(
          databaseManager,
          caretakerId,
          tm,
        );
        matchedPets = plainToInstance(Pet, matchedPets); // TODO: should return all info
        const response = MatchedPetsResponseSchema.parse(matchedPets);
        res.status(200).json(response);
      } catch (err) {
        console.log("Error occured in get matched-pets route:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /matched-caretakers
 * @summary Get matched caretakers for a pet
 * @description Returns all caretakers matched to a specific pet. NGO verification is required.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @body {Object} petId - ID of the pet whose matches are being queried
 * @returns {MatchedCaretakersResponseSchema} 200 OK - List of full caretaker profiles including user and working hours
 * @throws {NGONotVerifiedError} If the requesting NGO is not verified
 * @throws {ValidationError} If response validation fails
 */
router.get(
  "/matched-caretakers",
  authenticateToken,
  verifyNGO,
  openAPIRoute(
    {
      tag: "match",
      summary: "Get matched caretakers for a pet",
      description:
        "Retrieves all caretakers matched to a specific pet. Requires NGO verification.",
      body: z.object({
        petId: z.string(),
      }),
      response: MatchedCaretakersResponseSchema,
    },
    async (req, res, next) => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        // ngo verfikation
        if (req.ngo?.verified == false) {
          throw NGONotVerifiedError;
        }
        const { petId } = req.body;
        const matchedCaretakers: Caretaker[] =
          await CaretakerQueries.selectMatchedCaretakersByPet(
            databaseManager,
            petId,
            tm,
          );
        const fullCaretakers: FullCaretaker[] =
          await CaretakerQueries.selectAllInfosByCaretakerList(
            databaseManager,
            matchedCaretakers,
            tm,
          );

        // update picture links
        for (let fullCaretaker of fullCaretakers) {
          if (fullCaretaker.profilePictureLink != null) {
            fullCaretaker.profilePictureLink = await minioManager.getPublicURL(
              fullCaretaker.profilePicturePath!,
            );
          }
        }

        const response = MatchedCaretakersResponseSchema.parse(fullCaretakers); // returns all info including user and cthours
        res.status(200).json(response);
      } catch (err) {
        console.log("Error occured in get matched-caretakers route:", err);
        next(err);
      }
    },
  ),
);

export { router as matchRouter };
