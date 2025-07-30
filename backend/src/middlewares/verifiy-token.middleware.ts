import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getSecret } from "../utils/secret-manager";
import { InvalidTokenError, NoTokenError } from "../utils/errors";

/**
 * Middleware for JWT-based token authentication
 * Validates the presence and integrity of a JSON Web Token
 * in the Authorization header of incoming requests
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @throws {NoTokenError} If no token is provided in the Authorization header
 * @throws {InvalidTokenError} If the token is invalid or cannot be verified
 */
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract Authorization header containing the JWT
    const authHeader = req.headers["authorization"];

    // Parse token from Authorization header (e.g., "Bearer <token>")
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      // Log absence of token and throw NoTokenError
      console.log("No token provided.");
      throw NoTokenError;
    }

    // Retrieve secret key for JWT verification
    const secret = getSecret("TOKEN_SECRET");

    // Validate secret key existence
    if (!secret) {
      // Log secret key error and throw generic error
      throw new Error("TOKEN_SECRET is not defined");
    }

    // Verify JWT token using secret key
    jwt.verify(token, secret, (err: any, user: any) => {
      // Handle verification errors
      if (err) {
        // Log verification error and throw InvalidTokenError
        console.log(`Error occurred while authenticating token: ${err}.`);
        throw InvalidTokenError;
      }

      // Attach user information to request object
      req.user = {
        email: user.email,
        id: user.id,
        isAdmin: user.isAdmin,
      };

      // Proceed to next middleware or route handler
      next();
    });
  } catch (err) {
    // Log unexpected errors during token authentication
    console.log(`Error occured in authenticate token middleware ${err}.`);
    next(err);
  }
};

export { authenticateToken };
