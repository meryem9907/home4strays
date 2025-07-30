import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import NGOHours from "../../models/db-models/ngohours";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { TranslationManager } from "../../utils/translations-manager";
import { Weekday } from "../../models/enums";

/**
 * Class containing database query operations for NGO hours data
 * Handles CRUD operations and multilingual translation for NGO hours records
 */
class NGOHoursQueries {
  /**
   * Retrieves all NGO hours records from the database
   * @param db - DatabaseManager instance for executing queries
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to array of NGOHours objects
   */
  static async select(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<NGOHours[]> {
    // Fetch raw query results and convert key names to camelCase
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
      SELECT ngo_id, start_time, end_time, weekday FROM ngo_hours;
    `)
      ).rows,
    ) as Record<string, any>[];

    // Convert raw data to NGOHours class instances
    let ngoHours = plainToInstance(NGOHours, result);

    // If language is not English, translate weekday values
    if (tm.geti18n().getLocale() !== "en") {
      // Map through each hour record and translate weekday
      ngoHours = ngoHours.map((value) => {
        value.weekday = tm.getWeekdayTranslation(value.weekday as Weekday);
        return value;
      });
      return ngoHours;
    }

    return ngoHours;
  }

  /**
   * Retrieves NGO hours records by NGO ID
   * @param db - DatabaseManager instance for executing queries
   * @param ngoId - Identifier for the NGO
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to array of NGOHours objects
   */
  static async selectById(
    db: DatabaseManager,
    ngoId: string,
    tm: TranslationManager,
  ): Promise<NGOHours[]> {
    // Fetch raw query results and convert key names to camelCase
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT ngo_id, start_time, end_time, weekday FROM ngo_hours
      WHERE ngo_id = $1;
    `,
          [ngoId],
        )
      ).rows,
    ) as Record<string, any>[];

    // Convert raw data to NGOHours class instances
    const ngoHours: NGOHours[] = plainToInstance(NGOHours, result);

    // If language is not English, translate weekday values
    if (tm.geti18n().getLocale() !== "en") {
      // Map through each hour record and translate weekday
      ngoHours.map((value) => {
        value.weekday = value.weekday = tm.getWeekdayTranslation(
          value.weekday as Weekday,
        );
        return value;
      });
      return ngoHours;
    }
    return ngoHours;
  }

  /**
   * Inserts new NGO hours records into the database
   * @param db - DatabaseManager instance for executing queries
   * @param ngoId - Identifier for the NGO
   * @param hours - Array of NGOHours objects to insert
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to void
   */
  static async insert(
    db: DatabaseManager,
    ngoId: string,
    hours: NGOHours[],
    tm: TranslationManager,
  ): Promise<void> {
    for (let hour of hours) {
      if (tm.geti18n().getLocale() !== "en") {
        hour.weekday = tm.findWeekdayFromTranslation(hour.weekday) as string;
      }

      if (
        !hour.startTime ||
        !hour.endTime ||
        hour.startTime.trim() === "" ||
        hour.endTime.trim() === ""
      ) {
        continue;
      }

      await db.executeQuery(
        `
      INSERT INTO ngo_hours(ngo_id, start_time, end_time, weekday)
      VALUES($1, $2, $3, $4);
    `,
        [ngoId, hour.startTime, hour.endTime, hour.weekday],
      );
    }
  }

  /**
   * Updates existing NGO hours records or inserts new ones if they don't exist
   * @param db - DatabaseManager instance for executing queries
   * @param ngoId - Identifier for the NGO
   * @param hours - Array of NGOHours objects to update or insert
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to void
   */
  static async update(
    db: DatabaseManager,
    ngoId: string,
    hours: NGOHours[],
    tm: TranslationManager,
  ): Promise<void> {
    for (let hour of hours) {
      if (tm.geti18n().getLocale() !== "en") {
        hour.weekday = tm.findWeekdayFromTranslation(hour.weekday) as string;
      }

      if (
        !hour.startTime ||
        !hour.endTime ||
        hour.startTime.trim() === "" ||
        hour.endTime.trim() === ""
      ) {
        continue;
      }

      const existingHours = plainToInstance(
        NGOHours,
        (
          await db.executeQuery(
            `
      SELECT ngo_id, start_time, end_time, weekday
      FROM ngo_hours
      WHERE ngo_id = $1 AND start_time = $2 AND weekday = $3;
      `,
            [ngoId, hour.startTime, hour.weekday],
          )
        ).rows[0],
      );

      if (existingHours) {
        await db.executeQuery(
          `
         UPDATE ngo_hours
        SET end_time = $1
        WHERE ngo_id = $2 AND weekday = $3 AND start_time = $4;
        `,
          [hour.endTime, ngoId, hour.weekday, hour.startTime],
        );
      } else {
        await db.executeQuery(
          `
      INSERT INTO ngo_hours(ngo_id, start_time, end_time, weekday)
      VALUES($1, $2, $3, $4);
    `,
          [ngoId, hour.startTime, hour.endTime, hour.weekday],
        );
      }
    }
  }

  /**
   * Deletes all NGO hours records associated with a specific NGO ID
   * @param db - DatabaseManager instance for executing queries
   * @param ngoId - Identifier for the NGO
   * @returns Promise resolving to void
   */
  static async deleteById(db: DatabaseManager, ngoId: string): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM ngo_hours
      WHERE ngo_id = $1;
      `,
      [ngoId],
    );
  }
}

export { NGOHoursQueries };
