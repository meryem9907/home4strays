/**
 * Authentication router for registering and logging in users.
 * Provides JWT-based authentication with secure password hashing (Argon2).
 */

import { Router } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// db
import { databaseManager } from "../app";
import { User } from "../models/db-models/user";
import { UserQueries } from "../database/queries/user";
// env variables
import { getSecret } from "../utils/secret-manager";
// zod schemas
import {
  RegisterSchema,
  LoginSchema,
  AuthSuccessResponseSchema,
  AuthSuccessResponse,
} from "../models/zod-schemas/auth.zod";
// custom http errors
import {
  InvalidPWError,
  UserAlreadyExistsError,
  UserNotAuthorizedError,
  RegistrationError,
  ValidationError,
} from "../utils/errors";
import { z } from "zod";
import { openAPIRoute } from "express-zod-openapi-autogen";

const router = Router();

/**
 * Verifies a user by email or ID.
 *
 * @param {string} [email] - Email address of the user.
 * @param {string} [id] - UUID of the user.
 * @returns {Promise<User | undefined>} - Returns the user if found, otherwise undefined.
 */
const verifyUser = async (email?: string, id?: string) => {
  let user: User | undefined;

  if (!id && email) {
    // Select user by email address from the database
    user = await UserQueries.selectByEmailUnsecure(databaseManager, email);
  } else if (id) {
    // Select user by UUID from the database
    user = await UserQueries.selectByIdUnsecure(databaseManager, id);
  }
  if (user != undefined) {
    console.log(`Found user: ${JSON.stringify(user.email)}`);
    return user;
  } else {
    return undefined;
  }
};

/**
 * Generates a JWT access token for the given user.
 *
 * @param {string} id - UUID of the user.
 * @param {string} email - Email address of the user.
 * @param {boolean} isAdmin - Whether the user is an admin.
 * @returns {string} - JWT token.
 */
const generateAccessToken = (id: string, email: string, isAdmin: boolean) => {
  // Using HMAC SHA256 algorithm for token signing. Consider switching to RSA SHA256 for enhanced security if needed.
  return jwt.sign(
    { id: id, email: email, isAdmin: isAdmin },
    getSecret("TOKEN_SECRET"),
  );
};

/**
 * @route POST /register
 * @summary Register a new user.
 * @description Validates input, hashes password with Argon2, stores user, and returns a JWT token.
 * @body {
 * email: string;
 * password:string;
 * firstName:string;
 * lastName:string;
 * isAdmin:boolean;
 * isNGOUser:boolean
 * }.
 * @returns {
 * status: 201;
 * id:string;
 * token:string;
 * }
 * @throws {ValidationError} If input fails schema validation.
 * @throws {UserAlreadyExistsError} If user already exists.
 * @throws {RegistrationError} If user creation fails for unexpected reasons.
 */
router.post(
  "/register",
  openAPIRoute(
    {
      tag: "auth",
      summary: "Registers the user",
      description:
        "Registers the user and sends a verification Email. Returns also a token",
      body: RegisterSchema,
      response: AuthSuccessResponseSchema,
    },

    async (req, res, next) => {
      try {
        // Validate request body against schema
        const result = RegisterSchema.safeParse(req.body);
        if (!result.success) {
          throw ValidationError;
        }
        const { email, password, firstName, lastName, isAdmin, isNgoUser } =
          result.data;

        // Check if user already exists by email
        if (await verifyUser(email)) {
          throw UserAlreadyExistsError;
        }
        // Hash password using Argon2 algorithm
        const hashedPassword = await argon2.hash(password);

        // Create new user object with UUID
        const userId = uuidv4();
        const user: User = {
          id: userId,
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          isAdmin: isAdmin || false,
          isNgoUser: isNgoUser || false,
        };
        // Insert new user into database
        await UserQueries.insert(databaseManager, user);

        // Verify user exists in database
        const newUser: User | undefined = await verifyUser(email);

        if (newUser) {
          console.log(
            `Stored new user ${JSON.stringify(newUser.email)} in db.`,
          );

          // Generate JWT token for authenticated user
          const token = generateAccessToken(userId, email, isAdmin);

          // Validate and format response
          const successResponse: AuthSuccessResponse = {
            id: userId,
            token: token,
          };
          const response = AuthSuccessResponseSchema.parse(successResponse);
          res.status(201).json(response);
        } else {
          throw RegistrationError;
        }
      } catch (err) {
        console.log(`Error occured in /register route ${err}.`);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /login
 * @summary Log in an existing user.
 * @description Verifies credentials, returns JWT token on success.
 * @body {
 * email: string;
 * password:string;
 * }.
 * @returns {
 * status: 200;
 * id:string;
 * token:string;
 * }
 * @throws {ValidationError} If input fails schema validation.
 * @throws {InvalidPWError} If password does not match.
 * @throws {UserNotAuthorizedError} If user does not exist or lacks required fields.
 */
router.post(
  "/login",
  openAPIRoute(
    {
      tag: "auth",
      summary: "Logs in the user",
      description: "Authenticates the user and returns a JWT token on success.",
      body: LoginSchema,
      response: AuthSuccessResponseSchema,
    },

    async (req, res, next) => {
      try {
        // Validate request body against schema
        const result = LoginSchema.safeParse(req.body);
        if (!result.success) {
          throw ValidationError;
        }
        const { email, password } = req.body;

        // Find user by email
        const user = await verifyUser(email);

        if (user && user.password && user.id && user.isAdmin != undefined) {
          const isAdmin = user.isAdmin;
          const userId = user.id;

          // Verify password against stored hash
          const passwordMatch = await argon2.verify(user.password, password);

          if (passwordMatch == true) {
            const token = generateAccessToken(userId, email, isAdmin);

            // Validate and format response
            const successResponse: AuthSuccessResponse = {
              id: userId,
              token: token,
            };
            const response = AuthSuccessResponseSchema.parse(successResponse);
            res.status(200).json(response);
          } else {
            throw InvalidPWError;
          }
        } else {
          throw UserNotAuthorizedError;
        }
      } catch (err) {
        console.log(`Error occured in /login route ${err}.`);
        next(err);
      }
    },
  ),
);

export { router as authRouter };
