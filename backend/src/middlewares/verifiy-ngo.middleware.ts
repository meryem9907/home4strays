import { Request, Response, NextFunction } from "express";
import { NGOQueries } from "../database/queries/ngo";
import { databaseManager } from "../app";
import {
  ForbiddenAccessError,
  IdNotFoundError,
  NGONotFoundError,
} from "../utils/errors";

/**
 * Middleware to verify if the authenticated user is associated with a verified NGO.
 * This middleware checks the user's NGO association and ensures the NGO is verified.
 * If the NGO is not verified, it throws a ForbiddenAccessError.
 * If the user is not associated with any NGO, it throws an NGONotFoundError.
 * If the user ID is missing, it throws an IdNotFoundError.
 *
 * @param {Request} req - Express request object containing user authentication context
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @throws {ForbiddenAccessError} If the associated NGO is not verified
 * @throws {NGONotFoundError} If no NGO is found for the user
 * @throws {IdNotFoundError} If the user ID is missing from the authentication context
 */
const verifyNGO = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract user ID from authentication context
    const ngoMemberId: string | undefined = req.user?.id;

    // Check if user ID exists in authentication context
    if (ngoMemberId) {
      // Retrieve NGO details associated with the user ID
      const ngo = await NGOQueries.selectNGOByUserId(
        databaseManager,
        ngoMemberId,
      );

      // If NGO exists, set verification status on request object
      if (ngo != null) {
        req.ngo = { verified: ngo.verified };

        // If NGO is not verified, throw ForbiddenAccessError
        // Handle both boolean false and numeric 0 (for databases that store booleans as integers)
        if (!ngo.verified || (ngo.verified as any) === 0) {
          throw ForbiddenAccessError;
        }

        // Proceed to next middleware if verification is successful
        next();
      } else {
        // Throw error if no NGO is found for the user
        throw NGONotFoundError;
      }
    } else {
      // Throw error if user ID is missing from authentication context
      throw IdNotFoundError;
    }
  } catch (err) {
    // Log error and pass to error-handling middleware
    console.log(`Error in verifyNGO middleware: ${err}`);
    next(err);
  }
};

export { verifyNGO };
