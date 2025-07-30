import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";

import { convertKeysToCamelCase } from "../../utils/formatter";
import InterestedPet from "../../models/db-models/interestedpet";

/**
 * Manages database operations for caretaker-pet interest relationships
 * Provides methods to select, insert, update, and revoke interest entries
 */
class InterestedPetQueries {
  /**
   * Retrieves all caretaker-pet interest entries from the database
   * @param db - Database connection manager
   * @returns Promise resolving to an array of InterestedPet objects
   *
   * This method executes a SQL query to fetch all records from the interested_pet table,
   * converts the result keys to camel case for consistency with TypeScript models,
   * and maps the database rows to InterestedPet instances using class-transformer
   */
  static async select(db: DatabaseManager): Promise<InterestedPet[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT user_id, pet_id, score, interested FROM interested_pet;`,
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(InterestedPet, result);
  }

  /**
   * Inserts a new pet of interest relationship into the database
   * @param db - Database connection manager
   * @param ip - InterestedPet object containing the relationship data
   * @returns Promise resolving to void
   *
   * This method executes an SQL INSERT statement to add a new record to the interested_pet table.
   * It uses parameterized queries to prevent SQL injection and ensures data integrity.
   */
  static async insert(db: DatabaseManager, ip: InterestedPet): Promise<void> {
    await db.executeQuery(
      `INSERT INTO interested_pet(user_id, pet_id, score) VALUES($1, $2, $3);`,
      [ip.userId, ip.petId, ip.score],
    );
  }

  /**
   * Revokes a caretaker-pet interest relationship by setting interested flag to false
   * @param db - Database connection manager
   * @param caretakerId - User ID of the caretaker
   * @param petId - Pet ID of the pet
   * @returns Promise resolving to void
   *
   * This method updates the interested_pet record to mark the relationship as revoked.
   * It sets the interested flag to false and resets the score to 0 for the specified user-pet pair.
   */
  static async revokeMatch(
    db: DatabaseManager,
    caretakerId: string,
    petId: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE interested_pet SET interested=$3, score=0 WHERE user_id = $1 AND pet_id = $2;`,
      [caretakerId, petId, false],
    );
  }

  /**
   * Updates the score for an existing caretaker-pet interest relationship
   * @param db - Database connection manager
   * @param ip - InterestedPet object containing the updated score
   * @returns Promise resolving to void
   *
   * This method executes an SQL UPDATE statement to modify the score value in the interested_pet table.
   * It ensures the update is applied to the correct user-pet pair by using parameterized queries.
   */
  static async setScore(db: DatabaseManager, ip: InterestedPet): Promise<void> {
    await db.executeQuery(
      `UPDATE interested_pet SET score = $3 WHERE user_id = $1 AND pet_id = $2;`,
      [ip.userId, ip.petId, ip.score],
    );
  }
}

export { InterestedPetQueries };
