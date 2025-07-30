import { Router } from "express";
import { openAPIRoute } from "express-zod-openapi-autogen";

// db
import { databaseManager, minioManager } from "../app";
import { SearchQueries } from "../database/queries/search";
import { FullNGO } from "../models/db-models/ngo";
import { FullCaretaker } from "../models/db-models/caretaker";

// errors
import { NoQueryPassedError, NoResultsError } from "../utils/errors";

// zod schemas
import { PetResponseSchema } from "../models/zod-schemas/pet.zod";
import { NGOResponseSchema } from "../models/zod-schemas/ngo.zod";
import { CaretakerResponseSchema } from "../models/zod-schemas/caretaker.zod";
import {
  SearchPetResponseSchema,
  SearchNGOResponseSchema,
  SearchCaretakerResponseSchema,
  SearchQuerySchema,
} from "../models/zod-schemas/search.zod";

// translation
import { TranslationManager } from "../utils/translations-manager";

const router = Router();

/**
 * @route GET /search-animal
 * @description Search for animals/pets based on query and location
 * @query {string} q - Search query (required)
 * @query {string} location - Location filter (optional)
 * @header {AcceptLanguage Header}
 * @returns {
 * status: 200;
 * pets: Pet[];
 * }
 * @returns {
 * status: 404;
 * message: "No results found.";
 * }
 * @throws {NoQueryPassedError} if query parameter is missing
 */
router.get(
  "/search-animal",
  openAPIRoute(
    {
      tag: "Search",
      summary: "Search animals",
      description: "Search for animals/pets based on query and location.",
      query: SearchQuerySchema,
      response: SearchPetResponseSchema,
    },
    async (req, res, next) => {
      try {
        const query = req.query.q as string;
        const location = req.query.location as string;
        const language = res.locals.lang as string;
        let tm = TranslationManager.getInstance();
        tm.setLocale(language);

        if (!query) {
          throw NoQueryPassedError;
        }

        console.log(`Received query "${query}", location: "${location}".`);

        // search
        const petResults = await SearchQueries.searchPet(
          databaseManager,
          query,
          location,
          tm,
        );

        // Check if the results are empty
        if (petResults == undefined) {
          throw NoResultsError;
        } else {
          PetResponseSchema.parse(petResults);
          res.status(200).json({ pets: petResults });
        }
      } catch (err) {
        console.log(`Error occured in search-animal route: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /search-ngo
 * @description Search for NGOs based on query and location
 * @query {string} q - Search query (required)
 * @query {string} location - Location filter (optional)
 * @header {AcceptLanguage Header}
 * @returns {
 * status: 200;
 * ngos: FullNGO[];
 * }
 * @returns {
 * status: 404;
 * message: "No results found.";
 * }
 * @throws {NoQueryPassedError} if query parameter is missing
 */
router.get(
  "/search-ngo",
  openAPIRoute(
    {
      tag: "Search",
      summary: "Search NGOs",
      description: "Search for NGOs based on query and location.",
      query: SearchQuerySchema,
      response: SearchNGOResponseSchema,
    },
    async (req, res, next) => {
      try {
        const query = req.query.q as string;
        const location = req.query.location as string;
        const language = res.locals.lang as string;
        let tm = TranslationManager.getInstance();
        tm.setLocale(language);

        if (!query) {
          throw NoQueryPassedError;
        }

        console.log(`Received query "${query}", location: "${location}".`);

        // search
        const ngoResults: FullNGO[] | undefined = await SearchQueries.searchNGO(
          databaseManager,
          query,
          location,
          tm,
        );

        // Check if the results are empty
        if (ngoResults == undefined) {
          throw NoResultsError;
        } else {
          const response = { ngos: ngoResults };
          SearchNGOResponseSchema.parse(response);
          res.status(200).json(response);
        }
      } catch (err) {
        console.log(`Error occured in search-ngo route: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /search-caretaker
 * @description Search for caretakers based on query and location
 * @query {string} q - Search query (required)
 * @query {string} location - Location filter (optional)
 * @header {AcceptLanguage Header}
 * @returns {
 * status: 200;
 * caretakers: FullCaretaker[];
 * }
 * @returns {
 * status: 404;
 * message: "No results found.";
 * }
 * @throws {NoQueryPassedError} if query parameter is missing
 */
router.get(
  "/search-caretaker",
  openAPIRoute(
    {
      tag: "Search",
      summary: "Search caretakers",
      description: "Search for caretakers based on query and location.",
      query: SearchQuerySchema,
      response: SearchCaretakerResponseSchema,
    },
    async (req, res, next) => {
      try {
        const query = req.query.q as string;
        const location = req.query.location as string;
        const language = res.locals.lang as string;
        let tm = TranslationManager.getInstance();
        tm.setLocale(language);

        if (!query) {
          throw NoQueryPassedError;
        }

        console.log(`Received query "${query}", location: "${location}".`);

        // search
        const caretakerResults: FullCaretaker[] | undefined =
          await SearchQueries.searchCaretaker(
            databaseManager,
            query,
            location,
            tm,
          );

        // Check if the results are empty
        if (caretakerResults == undefined) {
          throw NoResultsError;
        } else {
          // update picture links
          for (let fullCaretaker of caretakerResults) {
            if (fullCaretaker.profilePictureLink != null) {
              fullCaretaker.profilePictureLink =
                await minioManager.getPublicURL(
                  fullCaretaker.profilePicturePath!,
                );
            }
          }

          CaretakerResponseSchema.parse(caretakerResults);
          res.status(200).json({ caretakers: caretakerResults });
        }
      } catch (err) {
        console.log(`Error occured in search-caretaker route: ${err}`);
        next(err);
      }
    },
  ),
);

export { router as searchRouter };
