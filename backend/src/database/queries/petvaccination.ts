import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import PetVaccination from "../../models/db-models/petvaccination";
import { convertKeysToCamelCase } from "../../utils/formatter";

/**
 * Manages database queries for pet vaccination records
 * Provides methods to retrieve vaccination data from the database
 */
class PetVaccinationQueries {
  /**
   * Retrieves all pet vaccination records from the database
   *
   * @param db - Database connection manager
   * @returns Promise resolving to an array of PetVaccination objects
   *
   * This method executes a SELECT query on the pet_vaccination table,
   * converts the result keys to camelCase format, and maps the data
   * to PetVaccination class instances using class-transformer
   */
  static async select(db: DatabaseManager): Promise<PetVaccination[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT pet_id, vaccine, date FROM pet_vaccination;`,
        )
      ).rows,
    ) as Record<string, any>[]; // Explicitly cast to Record<string, any>[]
    return plainToInstance(PetVaccination, result);
  }

  /**
   * Retrieves vaccination records for a specific pet by ID
   *
   * @param db - Database connection manager
   * @param id - Pet ID to filter vaccinations by
   * @returns Promise resolving to an array of PetVaccination objects
   *
   * This method executes a SELECT query with a WHERE clause filtering
   * by pet_id, converts the result keys to camelCase format, and maps
   * the data to PetVaccination class instances using class-transformer
   * The query uses parameterized SQL to prevent SQL injection
   */
  static async selectById(
    db: DatabaseManager,
    id: string,
  ): Promise<PetVaccination[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT pet_id, vaccine, date FROM pet_vaccination WHERE pet_id = $1;`,
          [id],
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(PetVaccination, result);
  }

  static async selectByPetId(
    db: DatabaseManager,
    petId: string,
  ): Promise<PetVaccination[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
    SELECT pet_id, vaccine, date FROM pet_vaccination WHERE pet_id = $1;
    `,
          [petId],
        )
      ).rows,
    ) as Record<string, any>[];

    return plainToInstance(PetVaccination, result);
  }

  /** Inserts multiple pet vaccination records */
  static async insertPetVaccinations(
    db: DatabaseManager,
    vaccinations: PetVaccination[],
  ): Promise<void> {
    for (const vaccination of vaccinations) {
      await db.executeQuery(
        `
      INSERT INTO pet_vaccination (
        pet_id, vaccine, date
      ) VALUES (
        $1, $2, $3
      );
      `,
        [vaccination.petId, vaccination.vaccine, vaccination.date || null],
      );
    }
  }

  /** Updates an existing pet vaccination */
  static async updatePetVaccination(
    db: DatabaseManager,
    petId: string,
    vaccine?: string,
    date?: string,
  ): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (vaccine) {
      updates.push(`vaccine = $${paramIndex++}`);
      params.push(vaccine);
    }
    if (date) {
      updates.push(`date = $${paramIndex++}`);
      params.push(date);
    }
    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    params.push(petId);

    await db.executeQuery(
      `
      UPDATE pet_vaccination
      SET ${updates.join(", ")}
      WHERE pet_id = $${paramIndex};
      `,
      params,
    );
  }

  /** Deletes a pet vaccination */
  static async deletePetVaccinationById(
    db: DatabaseManager,
    petId: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM pet_vaccination
      WHERE pet_id = $1;
      `,
      [petId],
    );
  }
}

export { PetVaccinationQueries };
