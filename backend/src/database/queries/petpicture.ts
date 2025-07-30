import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import PetPicture from "../../models/db-models/petpicture";
import { convertKeysToCamelCase } from "../../utils/formatter";

/**
 * Manages database operations for pet pictures
 * Provides methods to interact with the pet_picture table
 */
class PetPictureQueries {
  /**
   * Inserts a new pet picture into the database
   * @param db - Database connection manager
   * @param petPicture - PetPicture object containing picture data
   * @throws Error if database operation fails
   */
  static async insert(
    db: DatabaseManager,
    petPicture: PetPicture,
  ): Promise<void> {
    await db.executeQuery(
      `INSERT INTO pet_picture (pet_id, picture_link, picture_path)
       VALUES ($1, $2, $3);`,
      [petPicture.petId, petPicture.pictureLink, petPicture.picturePath],
    );
  }

  /**
   * Retrieves all pet pictures associated with a specific pet ID
   * @param db - Database connection manager
   * @param petId - Identifier for the pet
   * @returns Array of PetPicture objects
   * @throws Error if database operation fails
   */
  static async selectByPetId(
    db: DatabaseManager,
    petId: string,
  ): Promise<PetPicture[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT pet_id, picture_link, picture_path FROM pet_picture WHERE pet_id = $1;`,
          [petId],
        )
      ).rows,
    ) as Record<string, any>[];

    return plainToInstance(PetPicture, result);
  }

  /**
   * Retrieves a pet picture by its picture link and pet ID
   * @param db - Database connection manager
   * @param petId - Identifier for the pet
   * @param pictureLink - Unique identifier for the picture
   * @returns PetPicture object if found, null otherwise
   * @throws Error if database operation fails
   */
  static async selectByPictureLink(
    db: DatabaseManager,
    petId: string,
    pictureLink: string,
  ): Promise<PetPicture> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT pet_id, picture_link, picture_path
          FROM pet_picture
          WHERE picture_link = $1 AND pet_id = $2;`,
          [pictureLink, petId],
        )
      ).rows[0],
    ) as Record<string, any>;
    return plainToInstance(PetPicture, result);
  }

  /**
   * Updates an existing pet picture in the database
   * @param db - Database connection manager
   * @param petPicture - Partial PetPicture object containing updated data
   * @throws Error if database operation fails
   * @note Uses COALESCE to preserve existing values when fields are not provided
   */
  static async update(
    db: DatabaseManager,
    petPicture: Partial<PetPicture> & { petId: string },
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE pet_picture
       SET picture_link = COALESCE($2, picture_link),
           picture_path = COALESCE($3, picture_path)
       WHERE pet_id = $1;`,
      [petPicture.petId, petPicture.pictureLink, petPicture.picturePath],
    );
  }

  /**
   * Deletes a pet picture by its picture path
   * @param db - Database connection manager
   * @param picturePath - Unique identifier for the picture path
   * @throws Error if database operation fails
   */
  static async deleteByPicturePath(
    db: DatabaseManager,
    picturePath: string,
  ): Promise<void> {
    await db.executeQuery(`DELETE FROM pet_picture WHERE picture_path = $1;`, [
      picturePath,
    ]);
  }
}

export { PetPictureQueries };
