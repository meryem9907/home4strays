import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import Breed from "../../models/db-models/breed";
import { SpeciesTranslationQueries } from "./speciestranslation";
import { convertKeysToCamelCase } from "../../utils/formatter";
import SpeciesTranslation from "../../models/db-models/speciestranslation";
import { TranslationManager } from "../../utils/translations-manager";

/**
 * Class containing methods for querying breed-related data from the database.
 * This class provides static methods for selecting, inserting, and deleting breed records.
 * All queries are designed to work with the `breed` table and related translation data.
 */
class BreedQueries {
  // SELECT STATEMENTS

  /**
   * Retrieves all breeds from the database.
   * Converts query results to camelCase and maps them to the Breed class using class-transformer.
   * @param db - DatabaseManager instance for executing queries.
   * @returns Promise resolving to an array of Breed objects.
   */
  static async select(db: DatabaseManager): Promise<Breed[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT breed_name, species, information FROM breed;`,
        )
      ).rows,
    ) as Record<string, any>[]; // Cast to Record<string, any>[]
    return plainToInstance(Breed, result);
  }

  /**
   * Retrieves all dog breeds from the database.
   * Filters by species = 'Dog' and follows the same conversion and mapping process as select().
   * @param db - DatabaseManager instance for executing queries.
   * @returns Promise resolving to an array of Breed objects.
   */
  static async selectDogBreeds(db: DatabaseManager): Promise<Breed[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT breed_name, species, information FROM breed WHERE species = $1;`,
          ["Dog"],
        )
      ).rows,
    ) as Record<string, any>[]; // Cast to Record<string, any>[]
    return plainToInstance(Breed, result);
  }

  /**
   * Retrieves all cat breeds from the database.
   * Filters by species = 'Cat' and follows the same conversion and mapping process as select().
   * @param db - DatabaseManager instance for executing queries.
   * @returns Promise resolving to an array of Breed objects.
   */
  static async selectCatBreeds(db: DatabaseManager): Promise<Breed[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT breed_name, species, information FROM breed WHERE species = $1;`,
          ["Cat"],
        )
      ).rows,
    ) as Record<string, any>[]; // Cast to Record<string, any>[]
    return plainToInstance(Breed, result);
  }

  /**
   * Retrieves all bird breeds from the database.
   * Filters by species = 'Bird' and follows the same conversion and mapping process as select().
   * @param db - DatabaseManager instance for executing queries.
   * @returns Promise resolving to an array of Breed objects.
   */
  static async selectBirdBreeds(db: DatabaseManager): Promise<Breed[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT breed_name, species, information FROM breed WHERE species = $1;`,
          ["Bird"],
        )
      ).rows,
    ) as Record<string, any>[]; // Cast to Record<string, any>[]
    return plainToInstance(Breed, result);
  }

  /**
   * Retrieves all rodent breeds from the database.
   * Filters by species = 'Rodent' and follows the same conversion and mapping process as select().
   * @param db - DatabaseManager instance for executing queries.
   * @returns Promise resolving to an array of Breed objects.
   */
  static async selectRodentBreeds(db: DatabaseManager): Promise<Breed[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT breed_name, species, information FROM breed WHERE species = $1;`,
          ["Rodent"],
        )
      ).rows,
    ) as Record<string, any>[]; // Cast to Record<string, any>[]
    return plainToInstance(Breed, result);
  }

  /**
   * Retrieves species names based on language preference.
   * If language is not English, it fetches translated species names from the translation table.
   * Otherwise, it retrieves distinct species names from the breed table.
   * @param db - DatabaseManager instance for executing queries.
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of SpeciesTranslation objects or Breed objects.
   */
  static async selectSpecies(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<SpeciesTranslation[] | Breed[]> {
    let result: SpeciesTranslation[] | Breed[] | Record<string, any>[];

    if (tm.geti18n().getLocale() !== "en") {
      // Translated species query
      result = await SpeciesTranslationQueries.selectAllTranslatedSpecies(
        db,
        tm,
      );

      return plainToInstance(SpeciesTranslation, result);
    } else {
      result = convertKeysToCamelCase(
        (await db.executeQuery(`SELECT DISTINCT species FROM breed;`)).rows,
      ) as Record<string, any>[]; // Cast to Record<string, any>[]
      return plainToInstance(Breed, result);
    }
  }

  /**
   * Retrieves breed names filtered by species and language.
   * If the language is not English, it first translates the species name before querying.
   * @param db - DatabaseManager instance for executing queries.
   * @param species - Species name to filter breeds by.
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of Breed objects.
   */
  static async selectBreedsBySpecies(
    db: DatabaseManager,
    species: string,
    tm: TranslationManager,
  ): Promise<Breed[]> {
    let translatedSpecies: string | undefined;
    if (tm.geti18n().getLocale() != "en") {
      translatedSpecies = (
        await SpeciesTranslationQueries.selectTranslatedSpecies(db, species, tm)
      ).translatedSpecies;
    }

    species = translatedSpecies ?? species;

    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT DISTINCT breed_name FROM breed WHERE species = $1;`,
          [species],
        )
      ).rows,
    ) as Record<string, any>[]; // Cast to Record<string, any>[]
    return plainToInstance(Breed, result);
  }

  // INSERT OR UPDATE STATEMENTS

  /**
   * Inserts a new breed into the database.
   * Returns the inserted breed object with converted keys and mapped to the Breed class.
   * @param db - DatabaseManager instance for executing queries.
   * @param species - Species of the breed.
   * @param name - Name of the breed.
   * @param information - Optional additional information about the breed.
   * @returns Promise resolving to the inserted Breed object.
   */
  static async insertBreed(
    db: DatabaseManager,
    species: string,
    name: string,
    information?: string,
  ) {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `INSERT INTO breed (breed_name, species, information) VALUES ($1, $2, $3) RETURNING *;`,
          [name, species, information],
        )
      ).rows[0],
    ) as Record<string, any>; // Cast for a single object result
    return plainToInstance(Breed, result);
  }

  // DELETE STATEMENTS

  /**
   * Deletes a breed by its name from the database.
   * @param db - DatabaseManager instance for executing queries.
   * @param name - Name of the breed to delete.
   * @returns Promise that resolves when the deletion is complete.
   */
  static async deleteByName(db: DatabaseManager, name: string): Promise<void> {
    await db.executeQuery(`DELETE FROM breed WHERE breed_name = $1;`, [name]);
  }
}

export { BreedQueries };
