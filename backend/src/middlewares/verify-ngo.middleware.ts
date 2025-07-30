import { Request, Response, NextFunction } from "express";
import { NGOQueries } from "../database/queries/ngo";
import { databaseManager } from "../app";
import {
  IdNotFoundError,
  NGONotFoundError,
  NGONotVerifiedError,
} from "../utils/errors";

/**
 * Middleware to verify if the authenticated user is associated with a verified NGO.
 * This middleware checks the user's NGO membership status and ensures the NGO is verified.
 * If the user is not found, the NGO is not found, or the NGO is not verified, an appropriate error is thrown.
 */
const verifyNGO = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /**
     * Extract the user ID from the request object. This ID is used to fetch the associated NGO.
     * The user ID is expected to be present in req.user.id if the user is authenticated.
     */
    const ngoMemberId: string | undefined = req.user?.id;

    /**
     * If the user ID is not present, throw an IdNotFoundError.
     * This indicates the user could not be authenticated or the ID is missing.
     */
    if (ngoMemberId) {
      /**
       * Fetch the NGO details associated with the user ID using the NGOQueries.
       * This query retrieves the NGO information based on the user's ID.
       */
      const ngo = await NGOQueries.selectNGOByUserId(
        databaseManager,
        ngoMemberId,
      );

      /**
       * Log the NGO details for debugging purposes. This is useful for development and troubleshooting.
       */
      console.log(ngo);

      /**
       * If the NGO is not found, throw an NGONotFoundError.
       * This indicates the user is not associated with any NGO or the NGO record is missing.
       */
      if (ngo != undefined) {
        /**
         * Attach the NGO verification status to the request object for use in subsequent route handlers.
         * This allows downstream middleware or route handlers to access the verification status.
         */
        req.ngo = { verified: ngo.verified };

        /**
         * If the NGO is verified, proceed to the next middleware or route handler.
         * If not verified, throw an NGONotVerifiedError to block access.
         * Handle both boolean false and numeric 0 (for databases that store booleans as integers)
         */
        if (req.ngo.verified && (req.ngo.verified as any) !== 0) {
          next();
        } else {
          throw NGONotVerifiedError;
        }
      } else {
        throw NGONotFoundError;
      }
    } else {
      /**
       * If the user ID is missing, throw an IdNotFoundError.
       * This indicates the user could not be authenticated or the ID is missing.
       */
      throw IdNotFoundError;
    }
  } catch (err) {
    /**
     * Log any errors that occur during the verification process.
     * This helps in debugging issues related to NGO verification.
     */
    console.log(`Error in verifyNGO middleware: ${err}`);

    /**
     * Pass the error to Express's error-handling middleware.
     * This allows the application to handle errors gracefully.
     */
    next(err);
  }
};

/**
 * Export the verifyNGO middleware for use in route definitions.
 */
export { verifyNGO };
