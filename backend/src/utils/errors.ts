import createError from "http-errors";

/**
 * Custom error class for migration-related errors.
 * Extends the built-in Error class to include a specific error name.
 */
class MigrationError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "MigrationError";
  }
}

/**
 * Interface representing an error object with optional status, message, syscall, and code properties.
 * Used for error handling throughout the application.
 */
interface Error {
  status?: number;
  message?: string;
  syscall?: string;
  code?: string;
}

/**
 * Custom HTTP error for invalid password scenarios.
 * Thrown when a user provides an incorrect password.
 */
export const InvalidPWError = createError(403, "Invalid password.");

/**
 * Custom HTTP error for unauthorized user access.
 * Thrown when a user is not registered or lacks proper authentication.
 */
export const UserNotAuthorizedError = createError(401, "User not registered.");

/**
 * Custom HTTP error for database storage failures during user registration.
 * Thrown when an error occurs while storing user data in the database.
 */
export const RegistrationError = createError(500, "Error storing user in db.");

/**
 * Custom HTTP error for duplicate user registration.
 * Thrown when a user attempts to register with an existing email or username.
 */
export const UserAlreadyExistsError = createError(400, "User already exists.");

/**
 * Custom HTTP error for missing ID parameters.
 * Thrown when an ID is required but not provided in the request.
 */
export const IdNotFoundError = createError(404, "Id was not provided.");

/**
 * Custom HTTP error for data validation failures.
 * Thrown when input data does not meet the required format or constraints.
 */
export const ValidationError = createError(400, "Data not in needed Format");

/**
 * Custom HTTP error for invalid token scenarios.
 * Thrown when an invalid or expired token is provided.
 */
export const InvalidTokenError = createError(403, "Invalid token provided.");

/**
 * Custom HTTP error for missing query parameters.
 * Thrown when a query is required but not provided in the request.
 */
export const NoQueryPassedError = createError(400, "No query passed.");

/**
 * Custom HTTP error for missing authentication token.
 * Thrown when a token is required but not provided in the request.
 */
export const NoTokenError = createError(401, "No token provided.");

/**
 * Custom HTTP error for users already associated with an NGO.
 * Thrown when a user attempts to join an NGO they are already part of.
 */
export const AlreadyInNGOError = createError(400, "User is already in a NGO.");

/**
 * Custom HTTP error for unauthorized NGO admin access.
 * Thrown when a user attempts to access NGO admin routes without proper permissions.
 */
export const NoNGOAdminError = createError(
  403,
  "You are not a NGO admin user.",
);

/**
 * Custom HTTP error for missing token scenarios.
 * Thrown when a token is required but not provided in the request.
 */
export const noTokenError = createError(401, "No token provided.");

/**
 * Custom HTTP error for failed NGO member deletion.
 * Thrown when an attempt to delete an NGO member fails during rejection.
 */
export const ErrorDeletingNGOMember = createError(
  400,
  "NGO Member wasn't deleted while rejecting the NGO.",
);

/**
 * Custom HTTP error for missing caretaker data.
 * Thrown when a caretaker cannot be found in the database.
 */
export const CaretakerNotFoundError = createError(404, "CareTaker not found.");

/**
 * Custom HTTP error for missing pet data.
 * Thrown when a pet cannot be found in the database.
 */
export const PetNotFoundError = createError(400, "Pet not found.");

/**
 * Custom HTTP error for missing required match data fields.
 * Thrown when specific fields are missing during a match process.
 * Required fields: pet.zipRequirement, pet.experienceRequirement, pet.minimumSpaceRequirement,
 * pet.kidsAllowed, pet.streetName, caretaker.zip, caretaker.experience, caretaker.space,
 * caretaker.numberKids.
 */
export const MissingMatchingDataError = createError(
  400,
  `Match data is missing. Please check if you provided these:
  pet.zipRequirement, pet.experienceRequirement, pet.minimumSpaceRequirement, pet.kidsAllowed,
  pet.streetName, caretaker.zip, caretaker.experience, caretaker.space, caretaker.numberKids.`,
);

/**
 * Custom HTTP error for empty caretaker hours data.
 * Thrown when caretaker hours are created but contain empty fields.
 */
export const EmptyCaretakerHours = createError(
  404,
  "Caretaker Hours were created but included empty fields.",
);

/**
 * Custom HTTP error for invalid language format.
 * Thrown when a language is provided in an invalid format (not english, german, or turkish).
 */
export const wrongFormattedLanguageError = createError(
  400,
  "Please provide as a language english, german or turkish.",
);

/**
 * Custom HTTP error for invalid enum values.
 * Thrown when an enum value is requested that does not exist in the database.
 */
export const EnumDoesntExist = createError(
  400,
  "The requested enum doesnt exist in our db.",
);

/**
 * Custom HTTP error for forbidden access attempts.
 * Thrown when a user tries to access a route without the required privileges.
 */
export const ForbiddenAccessError = createError(
  403,
  "Tried accessing route without privileges.",
);

/**
 * Custom HTTP error for missing NGO data.
 * Thrown when an NGO cannot be found in the database.
 */
export const NGONotFoundError = createError(404, "NGO not found.");

/**
 * Custom HTTP error for missing NGO members data.
 * Thrown when NGO members cannot be found in the database.
 */
export const NGOMembersNotFoundError = createError(
  404,
  "NGO Members not found.",
);

export const LastNGOMemberError = createError(
  409,
  "Last NGO Member cannot be deleted",
);

/**
 * Custom HTTP error for missing NGO member data.
 * Thrown when a specific NGO member cannot be found in the database.
 */
export const NGOMemberNotFoundError = createError(404, "NGO Member not found.");

/**
 * Custom HTTP error for missing file uploads.
 * Thrown when a file is required but not provided in the request.
 */
export const NoFileError = createError(400, "No file");

/**
 * Custom HTTP error for exceeding maximum pet pictures.
 * Thrown when a user attempts to upload more than 10 pictures for a pet.
 */
export const MaxPetPicturesReachedError = createError(
  400,
  "Maximum number of 10 pictures reached for this pet.",
);

/**
 * Custom HTTP error for missing picture data.
 * Thrown when a specific picture cannot be found in the database.
 */
export const PictureNotFoundError = createError(404, "Picture not Found");

/**
 * Custom HTTP error for unverified NGO access.
 * Thrown when a non-verified NGO attempts to access caretaker-related routes.
 */
export const NGONotVerifiedError = createError(
  403,
  "Not verified NGO tried accessing caretaker routes.",
);

/**
 * Custom HTTP error for file deletion failures.
 * Thrown when an error occurs while attempting to delete a file.
 */
export const DeletingFileError = createError(400, "Error deleting file.");

/**
 * Custom HTTP error for missing DB model context.
 * Thrown when a database model is required but not provided.
 */
export const WrongModelPassedError = createError(500, "No DB-Model passed.");

/**
 * Custom HTTP error for duplicate caretaker registration.
 * Thrown when a caretaker attempts to register with an existing email or username.
 */
export const CaretakerAlreadyExistsError = createError(
  400,
  "Caretaker already exists.",
);

/**
 * Custom HTTP error for missing user data.
 * Thrown when a user cannot be found in the database.
 */
export const UserNotFoundError = createError(404, "User not found.");

/**
 * Represents an error that occurs when no results are found in a search or query operation.
 * This error is typically used to indicate that the requested resource or data could not be located.
 */
export const NoResultsError = createError(404, "No results found.");

/**
 * Custom HTTP error for missing profile picture data.
 * Thrown when a profile picture cannot be found in the database.
 */
export const OldProfilePictureNotFoundError = createError(
  404,
  "Profile Picture not found. Maybe not saved at all.",
);

/**
 * Custom HTTP error for missing logo data.
 * Thrown when a logo cannot be found in the database.
 */
export const LogoNotFoundError = createError(404, "Logo not found.");

/**
 * Custom HTTP error for database insert failures.
 * Thrown when an insert operation into the database fails.
 */
export const DBInsertError = createError(500, "Inserting in DB failed.");

/**
 * Custom HTTP error for database update failures.
 * Thrown when an update operation on the database fails.
 */
export const DBUpdateError = createError(500, "Updating in DB failed.");

/**
 * Custom HTTP error for missing breed data.
 * Thrown when no breeds are found for a specific species.
 */
export const NoBreedsFound = createError(400, "No breeds found for species.");
export const NoPendingVerifications = createError(
  404,
  "No pending verifications found.",
);

export { MigrationError, Error };
