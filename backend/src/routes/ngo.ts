import express, { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { z } from "zod";
// db
import { DatabaseManager } from "../database/db";
import { NGOQueries, NGOFilters } from "../database/queries/ngo";
import { NGO } from "../models/db-models/ngo";
import { NGOHoursQueries } from "../database/queries/ngohours";
import { NGOMemberQueries } from "../database/queries/ngomember";
import NGOHours from "../models/db-models/ngohours";

// middlewares
import { authenticateToken } from "../middlewares/verifiy-token.middleware";
import { verifyNGO } from "../middlewares/verify-ngo.middleware";
import { verifyNGOAdmin } from "../middlewares/verify-admin.middleware";
import { detectLanguage } from "../middlewares/detect-lang.middleware";

// errors
import { NGONotFoundError } from "../utils/errors";

// zod schemas
import {
  NGOGetResponseSchema,
  NGOUpdateRequestSchema,
  NGOUpdateResponseSchema,
  NGODeleteResponseSchema,
  NGOParamsSchema,
} from "../models/zod-schemas/ngo.zod";

// translation
import { TranslationManager } from "../utils/translations-manager";

const router = express.Router();
const db = DatabaseManager.getInstance();

const NGOResponseSchema = z.object({
  data: z.array(z.any()),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    filtersApplied: z.any().optional(),
  }),
});

const AvailableDataResponseSchema = z.object({
  data: z.array(z.string()),
});

/**
 * @route GET /ngos
 * @summary Get NGOs with filters
 * @description Retrieves a paginated list of NGOs with optional filtering by various criteria such as name, country, verification status, member count, etc.
 * @header {AcceptLanguage Header}
 * @queryParam {number} limit - Number of NGOs to return (default: 9)
 * @queryParam {number} offset - Number of NGOs to skip (default: 0)
 * @queryParam {string|string[]} ngoName - Filter by NGO name(s)
 * @queryParam {string|string[]} country - Filter by country
 * @queryParam {string} city - Filter by city
 * @queryParam {string} verified - Filter by verification status (All/verified/not verified)
 * @queryParam {string|string[]} members - Filter by member count (Any/less than 15/15 to 30/more than 30)
 * @returns {NGOResponseSchema} 200 - Paginated list of NGOs with metadata
 */
router.get(
  "/ngos",
  detectLanguage,
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Get NGOs with filters",
      description:
        "Retrieves a paginated list of NGOs with optional filtering by various criteria.",
      response: NGOResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        // Parse query parameters
        const limit = parseInt(req.query.limit as string) || 9;
        const offset = parseInt(req.query.offset as string) || 0;

        // Build filters object
        const filters: NGOFilters = {};

        // NGO Name filter
        if (req.query.ngoName) {
          filters.ngoName = Array.isArray(req.query.ngoName)
            ? (req.query.ngoName as string[])
            : [req.query.ngoName as string];
        }

        // Country filter
        if (req.query.country) {
          filters.country = Array.isArray(req.query.country)
            ? (req.query.country as string[])
            : [req.query.country as string];
        }

        // City filter
        if (req.query.city) {
          filters.city = req.query.city as string;
        }

        // Verified status filter
        if (req.query.verified) {
          filters.verified = req.query.verified as
            | "All"
            | "verified"
            | "not verified";
        }

        // Members filter
        if (req.query.members) {
          filters.members = Array.isArray(req.query.members)
            ? (req.query.members as (
                | "Any"
                | "less than 15"
                | "15 to 30"
                | "more than 30"
              )[])
            : [
                req.query.members as
                  | "Any"
                  | "less than 15"
                  | "15 to 30"
                  | "more than 30",
              ];
        }

        const result = await NGOQueries.selectNGOsWithFilters(
          db,
          filters,
          limit,
          offset,
          tm,
        );

        res.status(200).json({
          data: result.ngos,
          meta: {
            total: result.total,
            limit,
            offset,
            filtersApplied:
              Object.keys(filters).length > 0 ? filters : undefined,
          },
        });
      } catch (err) {
        console.error(`Error fetching NGOs:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /available-ngo-names
 * @summary Get available NGO names
 * @description Retrieves a list of all available NGO names in the system.
 * @returns {AvailableDataResponseSchema} 200 - List of available NGO names
 */
router.get(
  "/available-ngo-names",
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Get available NGO names",
      description: "Retrieves a list of all available NGO names in the system.",
      response: AvailableDataResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(`[DEBUG] Backend GET /available-ngo-names called`);
        const result = await NGOQueries.selectAvailableNGONames(db);
        console.log(`[DEBUG] NGO names query result:`, result);
        console.log(`[DEBUG] NGO names result length:`, result?.length || 0);
        res.status(200).json({ data: result });
      } catch (err) {
        console.error(`[DEBUG] Error fetching available NGO names:`, err);
        console.error(`Error fetching available NGO names:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /available-ngo-countries
 * @summary Get available NGO countries
 * @description Retrieves a list of all available countries where NGOs are located.
 * @returns {AvailableDataResponseSchema} 200 - List of available countries
 */
router.get(
  "/available-ngo-countries",
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Get available NGO countries",
      description:
        "Retrieves a list of all available countries where NGOs are located.",
      response: AvailableDataResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(`[DEBUG] Backend GET /available-ngo-countries called`);
        const result = await NGOQueries.selectAvailableCountries(db);
        console.log(`[DEBUG] NGO countries query result:`, result);
        console.log(
          `[DEBUG] NGO countries result length:`,
          result?.length || 0,
        );
        res.status(200).json({ data: result });
      } catch (err) {
        console.error(`[DEBUG] Error fetching available NGO countries:`, err);
        console.error(`Error fetching available NGO countries:`, err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /ngo/:ngoId
 * @summary Get NGO by ID
 * @description Retrieves public NGO information along with its opening hours using the provided NGO ID.
 * @param {NGOParamsSchema} ngoId - The unique ID of the NGO to retrieve
 * @returns {NGOGetResponseSchema} 200 OK - NGO data and associated hours
 * @throws {NGONotFoundError} If no NGO with the given ID exists
 */
router.get(
  "/ngo/:ngoId",
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Get NGO by ID",
      description:
        "Retrieves NGO information and hours by NGO ID (public endpoint)",
      params: NGOParamsSchema,
      response: NGOGetResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const ngoId = req.params.ngoId as string;
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        const ngo: NGO | undefined = await NGOQueries.selectById(db, ngoId);
        const ngoHours: NGOHours[] = await NGOHoursQueries.selectById(
          db,
          ngoId,
          tm,
        );
        if (!ngo) {
          throw NGONotFoundError;
        }
        res.status(200).json({ ngo: ngo, hours: ngoHours });
      } catch (error) {
        next(error);
      }
    },
  ),
);

/**
 * @route PUT /ngo/:ngoId
 * @summary Update NGO
 * @description Updates the NGO's profile and operating hours. Requires the user to be authenticated and an NGO admin.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @param {NGOParamsSchema} ngoId - The ID of the NGO to update
 * @body {NGOUpdateRequestSchema} ngo - Updated NGO and hours data
 * @returns {NGOUpdateResponseSchema} 200 OK - Confirmation message after successful update
 * @throws {NGONotFoundError} If the specified NGO does not exist
 * @throws {ValidationError} If request body is invalid
 */
router.put(
  "/ngo/:ngoId",
  authenticateToken,
  verifyNGO,
  verifyNGOAdmin,
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Update NGO",
      description:
        "Updates NGO information and hours (protected endpoint - requires NGO admin)",
      params: NGOParamsSchema,
      body: NGOUpdateRequestSchema,
      response: NGOUpdateResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const lang = res.locals.lang;
        const ngoId = req.params.ngoId;

        let ngoHours: NGOHours[] = [];
        if (req.body.ngo.ngoHours && Array.isArray(req.body.ngo.ngoHours)) {
          ngoHours = req.body.ngo.ngoHours.map((hour: any) => ({
            startTime: hour.startTime || hour.start || "",
            endTime: hour.endTime || hour.end || "",
            weekday: hour.weekday || "",
          }));
        }

        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);
        const ngo: NGO | undefined = await NGOQueries.selectById(db, ngoId);
        if (!ngo || !ngo.id) {
          throw NGONotFoundError;
        }
        const ngoData = plainToInstance(NGO, req.body.ngo);
        ngoData.id = ngo.id;
        await NGOQueries.updateOnId(db, ngoData);

        await NGOHoursQueries.deleteById(db, ngo.id);
        if (ngoHours && ngoHours.length > 0) {
          await NGOHoursQueries.insert(db, ngo.id, ngoHours, tm);
        }
        res.status(200).json({ message: "NGO updated successfully." });
      } catch (error) {
        next(error);
      }
    },
  ),
);

/**
 * @route DELETE /ngo/:ngoId
 * @summary Delete NGO
 * @description Deletes an NGO and all related records (e.g. members and hours). Requires NGO admin permissions.
 * @header {Authorization} Authorization - Bearer token for authentication
 * @param {NGOParamsSchema} ngoId - ID of the NGO to be deleted
 * @returns {NGODeleteResponseSchema} 200 OK - Confirmation message of successful deletion
 * @throws {NGONotFoundError} If the specified NGO does not exist
 */
router.delete(
  "/ngo/:ngoId",
  authenticateToken,
  verifyNGO,
  verifyNGOAdmin,
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Delete NGO",
      description:
        "Deletes NGO and all associated data (protected endpoint - requires NGO admin)",
      params: NGOParamsSchema,
      response: NGODeleteResponseSchema,
    },
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const ngoAdminId = req.user!.id as string;
        const ngoId = req.params.ngoId as string;
        // delete all members belonging to ngo
        await NGOMemberQueries.deleteNGOMemberById(db, ngoAdminId, ngoId);
        await NGOHoursQueries.deleteById(db, ngoId);
        await NGOQueries.deleteById(db, ngoId);
        res.status(200).json({ message: "NGO deleted successfully" });
      } catch (error) {
        next(error);
      }
    },
  ),
);

export { router as ngoRouter };
