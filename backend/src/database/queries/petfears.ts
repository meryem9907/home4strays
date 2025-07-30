import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import PetFears from "../../models/db-models/petfears";
import { convertKeysToCamelCase } from "../../utils/formatter";

/**
 * Class containing database query operations for managing pet fears data
 * This class provides static methods to interact with the pet_fears table
 * in the database, handling data transformation and type mapping
 */
class PetFearQueries {
  /**
   * Retrieves all pet fears records from the database
   *
   * @param db - Database connection manager instance
   * @returns Promise resolving to an array of PetFears objects
   *
   * @description
   * This method executes a SELECT query on the pet_fears table to retrieve
   * all records. The results undergo two transformation steps:
   * 1. Key case conversion from snake_case to camelCase using convertKeysToCamelCase
   * 2. Type mapping to PetFears class instances using class-transformer
   *
   * The query returns pet_id, fear, and info fields which are mapped to
   * the PetFears class properties
   */
  static async select(db: DatabaseManager): Promise<PetFears[]> {
    // Execute database query to retrieve all pet fear records
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT pet_id, fear, info FROM pet_fears;
        `)
      ).rows,
    ) as Record<string, any>[]; // Type assertion to allow class-transformer mapping

    // Map raw database records to PetFears class instances
    return plainToInstance(PetFears, result);
  }

  static async selectByPetId(
    db: DatabaseManager,
    petId: string,
  ): Promise<PetFears[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
    SELECT pet_id, fear, info, medications FROM pet_fears WHERE pet_id = $1;
    `,
          [petId],
        )
      ).rows,
    ) as Record<string, any>[];

    return plainToInstance(PetFears, result);
  }

  /** Inserts multiple pet fear records */
  static async insertPetFears(
    db: DatabaseManager,
    petFears: PetFears[],
  ): Promise<void> {
    for (const petFear of petFears) {
      await db.executeQuery(
        `
      INSERT INTO pet_fears (
        pet_id, fear, info, medications
      ) VALUES (
        $1, $2, $3, $4
      );
      `,
        [petFear.petId, petFear.fear, petFear.info, petFear.medications],
      );
    }
  }

  /** Deletes a pet fear record by pet_id and fear */
  static async deleteByPetIdAndFear(
    db: DatabaseManager,
    petId: string,
    fear: string,
  ): Promise<void> {
    await db.executeQuery(
      `
    DELETE FROM pet_fears
    WHERE pet_id = $1 AND fear = $2;
    `,
      [petId, fear],
    );
  }

  /** Updates an existing pet fear record */
  static async updatePetFear(
    db: DatabaseManager,
    petId: string,
    fear: string,
    info?: string,
    medications?: string,
  ): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (info) {
      updates.push(`info = $${paramIndex++}`);
      params.push(info);
    }
    if (medications) {
      updates.push(`medications = $${paramIndex++}`);
      params.push(medications);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    params.push(petId, fear);

    await db.executeQuery(
      `
      UPDATE pet_fears
      SET ${updates.join(", ")}
      WHERE pet_id = $${paramIndex++} AND fear = $${paramIndex};
      `,
      params,
    );
  }
}

export { PetFearQueries };
