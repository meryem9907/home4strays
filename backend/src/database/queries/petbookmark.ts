import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import PetBookmark from "../../models/db-models/petbookmark";
import { convertKeysToCamelCase } from "../../utils/formatter";

/**
 * Manages database queries related to pet bookmarks.
 * Provides static methods to interact with the pet_bookmark table.
 */
class PetBookmarkQueries {
  /**
   * Retrieves all pet bookmarks from the database.
   * Executes a SELECT query on the pet_bookmark table,
   * converts the result keys to camel case for compatibility with the PetBookmark class,
   * and maps the data to instances of the PetBookmark class.
   *
   * @param db - DatabaseManager instance used to execute the query.
   * @returns A promise that resolves to an array of PetBookmark objects.
   */
  static async select(db: DatabaseManager): Promise<PetBookmark[]> {
    // Execute SQL query to fetch all pet bookmarks
    // This query selects caretaker_id and pet_id from the pet_bookmark table
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT caretaker_id, pet_id FROM pet_bookmark;
        `)
      ).rows,
    ) as Record<string, any>[];

    return plainToInstance(PetBookmark, result);
  }

  /** selects bookmark for specific user and pet */
  static async selectByUserAndPet(
    db: DatabaseManager,
    userId: string,
    petId: string,
  ): Promise<PetBookmark | null> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT caretaker_id, pet_id FROM pet_bookmark
          WHERE caretaker_id = $1 AND pet_id = $2;
        `,
          [userId, petId],
        )
      ).rows,
    ) as Record<string, any>[];

    if (result.length === 0) return null;
    return plainToInstance(PetBookmark, result[0]);
  }

  /** selects all bookmarks for a specific user */
  static async selectByUserId(
    db: DatabaseManager,
    userId: string,
  ): Promise<PetBookmark[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT caretaker_id, pet_id FROM pet_bookmark
          WHERE caretaker_id = $1;
        `,
          [userId],
        )
      ).rows,
    ) as Record<string, any>[];

    // Map raw database records to PetBookmark class instances
    // This ensures proper type safety and data structure alignment
    return plainToInstance(PetBookmark, result);
  }

  /** inserts petBookmark */
  static async insertPetBookmark(
    db: DatabaseManager,
    petBookmarkData: PetBookmark,
  ): Promise<void> {
    try {
      await db.executeQuery(
        `
        INSERT INTO pet_bookmark (caretaker_id, pet_id)
        VALUES ($1, $2);
      `,
        [petBookmarkData.caretakerId, petBookmarkData.petId],
      );
    } catch (error) {
      throw error;
    }
  }

  /** deletes specific user's bookmark for a pet */
  static async deleteByUserAndPet(
    db: DatabaseManager,
    userId: string,
    petId: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM pet_bookmark
      WHERE caretaker_id = $1 AND pet_id = $2;
    `,
      [userId, petId],
    );
  }

  /** deletes all petBookmarks for a given petId */
  static async deleteByPetId(
    db: DatabaseManager,
    petId: string,
  ): Promise<void> {
    await db.executeQuery(
      `
    DELETE FROM pet_bookmark
    WHERE pet_id = $1;
  `,
      [petId],
    );
  }
}

export { PetBookmarkQueries };
