import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import SpeciesTranslation from "../../models/db-models/speciestranslation";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { TranslationManager } from "../../utils/translations-manager";

/**
 * Class containing query methods for interacting with the species translation database table.
 * Provides methods to retrieve translated species data with proper type conversion and formatting.
 */
class SpeciesTranslationQueries {
  /**
   * Retrieves all translated species records from the database.
   *
   * @param db - DatabaseManager instance used to execute the query
   * @returns Promise resolving to an array of SpeciesTranslation instances
   *
   * This method:
   * 1. Executes a SQL query to fetch all records from species_translation table
   * 2. Converts the result keys to camel case format
   * 3. Uses class-transformer to instantiate SpeciesTranslation objects
   * 4. Returns the array of deserialized objects
   */
  static async select(db: DatabaseManager): Promise<SpeciesTranslation[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT breed_name, language, translated_species FROM species_translation;`,
        )
      ).rows,
    ) as Record<string, any>[]; // Explicitly cast to Record<string, any>[]
    return plainToInstance(SpeciesTranslation, result);
  }

  /**
   * Retrieves all distinct translated species names for a specific language.
   *
   * @param db - DatabaseManager instance used to execute the query
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of SpeciesTranslation instances
   *
   * This method:
   * 1. Executes a SQL query joining species_translation with Breed table
   * 2. Filters results by the specified language code
   * 3. Converts the result keys to camel case format
   * 4. Uses class-transformer to instantiate SpeciesTranslation objects
   * 5. Returns the array of deserialized objects
   */
  static async selectAllTranslatedSpecies(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<SpeciesTranslation[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT DISTINCT translated_species FROM species_translation st
           JOIN Breed b ON st.breed_name = b.breed_name
           WHERE st.language = $1;`,
          [tm.geti18n().getLocale()],
        )
      ).rows,
    ) as Record<string, any>[]; // Explicitly cast to Record<string, any>[]
    return plainToInstance(SpeciesTranslation, result);
  }

  /**
   * Retrieves a specific translated species name for a given language.
   *
   * @param db - DatabaseManager instance used to execute the query
   * @param species - Species identifier to filter by
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to a SpeciesTranslation instance
   *
   * This method:
   * 1. Executes a SQL query joining species_translation with Breed table
   * 2. Filters results by both species identifier and language code
   * 3. Converts the result keys to camel case format
   * 4. Uses class-transformer to instantiate a SpeciesTranslation object
   * 5. Returns the deserialized object (assuming single result)
   */
  static async selectTranslatedSpecies(
    db: DatabaseManager,
    species: string,
    tm: TranslationManager,
  ): Promise<SpeciesTranslation> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT DISTINCT translated_species FROM species_translation st
           JOIN Breed b ON st.breed_name = b.breed_name AND b.species = $2
           WHERE st.language = $1;`,
          [tm.geti18n().getLocale(), species],
        )
      ).rows[0],
    ) as Record<string, any>; // Explicitly cast for a single object result
    return plainToInstance(SpeciesTranslation, result);
  }
}

export { SpeciesTranslationQueries };
