import { Request, Response, NextFunction } from "express";
import { NGOMemberNotFoundError, NoNGOAdminError } from "../utils/errors";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { databaseManager } from "../app";

/**
 * Middleware to verify if a user is an admin of an NGO.
 * This middleware performs the following actions:
 * 1. Retrieves the NGO member record associated with the authenticated user
 * 2. Validates the user's membership status
 * 3. Grants access to admin-only routes if the user is verified as an admin
 *
 * @param {Request} req - Express request object containing user authentication data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function for middleware chaining
 *
 * @throws {NGOMemberNotFoundError} When the user is not found in the NGO members table
 * @throws {NoNGOAdminError} When the user is not verified as an admin for their NGO
 *
 * @returns {void} Calls next() if verification is successful
 */
const verifyNGOAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Retrieve NGO member record using the authenticated user's ID
    // This query is guaranteed to return a record due to prior authentication checks
    const ngoMember = await NGOMemberQueries.selectNGOMemberById(
      databaseManager,
      req.user!.id as string,
    );
    if (!ngoMember || !ngoMember.ngoId) {
      throw NGOMemberNotFoundError;
    }

    if (req.user) {
      req.user = {
        id: req.user.id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        ngoId: ngoMember.ngoId,
      };
    }

    // Check if the user has admin privileges for their NGO
    // If not, throw the NoNGOAdminError to block access to admin routes
    if (ngoMember && ngoMember.isAdmin) {
      next();
    } else {
      throw NoNGOAdminError;
    }
  } catch (err) {
    console.log(`Error in verifyNGOAdmin Middleware: ${err}.`);
    next(err);
  }
};

export { verifyNGOAdmin };
