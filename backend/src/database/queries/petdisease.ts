import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import PetDisease from "../../models/db-models/petdisease";
import { convertKeysToCamelCase } from "../../utils/formatter";

/**
 * Provides query operations for managing pet disease data in the database
 * This class encapsulates database operations related to pet disease records
 * All methods are static and can be called without instantiating the class
 */
class PetDiseaseQueries {
  /**
   * Selects all pet disease records from the database
   * Executes a SQL query to retrieve all pet disease entries
   * Converts database results to camelCase keys and instantiates PetDisease objects
   *
   * @param db - DatabaseManager instance for executing database operations
   * @returns Promise resolving to an array of PetDisease instances
   */
  static async select(db: DatabaseManager): Promise<PetDisease[]> {
    // Execute SQL query to fetch all pet disease records
    // The query selects pet_id, disease, info, and medications columns
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT pet_id, disease, info, medications FROM pet_disease;
        `)
      ).rows,
    ) as Record<string, any>[]; // Explicit cast to Record<string, any>[] is required
    // to ensure class-transformer can properly instantiate PetDisease objects

    // Convert raw database results to PetDisease class instances
    // This uses class-transformer's plainToInstance method to map
    // the database rows to the PetDisease class structure
    return plainToInstance(PetDisease, result);
  }

  static async selectByPetId(
    db: DatabaseManager,
    petId: string,
  ): Promise<PetDisease[]> {
    const result = await db.executeQuery(
      `
    SELECT pet_id, disease, info, medications FROM pet_disease WHERE pet_id = $1;
    `,
      [petId],
    );

    const camelCaseResult = convertKeysToCamelCase(result.rows) as Record<
      string,
      any
    >[];
    return plainToInstance(PetDisease, camelCaseResult);
  }

  /** Inserts multiple pet disease records */
  static async insertPetDisease(
    db: DatabaseManager,
    petDiseases: PetDisease[],
  ): Promise<void> {
    for (const petDisease of petDiseases) {
      await db.executeQuery(
        `
      INSERT INTO pet_disease (
        pet_id, disease, info, medications
      ) VALUES (
        $1, $2, $3, $4
      );
      `,
        [
          petDisease.petId,
          petDisease.disease,
          petDisease.info,
          petDisease.medications,
        ],
      );
    }
  }

  /** Updates an existing pet disease record */
  static async updatePetDisease(
    db: DatabaseManager,
    petId: string,
    disease: string,
    info?: string,
    medications?: string,
    lang?: string,
  ): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (info !== undefined) {
      updates.push(`info = $${paramIndex++}`);
      params.push(info);
    }
    if (medications !== undefined) {
      updates.push(`medications = $${paramIndex++}`);
      params.push(medications);
    }
    if (lang !== undefined) {
      updates.push(`language = $${paramIndex++}`);
      params.push(lang);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    // petId und disease für WHERE-Klausel
    params.push(petId, disease);

    await db.executeQuery(
      `
      UPDATE pet_disease
      SET ${updates.join(", ")}
      WHERE pet_id = $${paramIndex++} AND disease = $${paramIndex};
      `,
      params,
    );
  }

  /** Deletes a pet disease record by ID */
  static async deletePetDiseaseById(
    db: DatabaseManager,
    id: string,
  ): Promise<void> {
    await db.executeQuery(
      `
    DELETE FROM pet_disease
    WHERE pet_id = $1;
    `,
      [id],
    );
  }
}

export { PetDiseaseQueries };
