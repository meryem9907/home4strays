import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import CTHours from "../../models/db-models/cthours";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { ValidationError } from "../../utils/errors";
import { TranslationManager } from "../../utils/translations-manager";
import { Weekday } from "../../models/enums";

/**
 * Class containing methods to query, manipulate, and manage caretaker hours data
 * This class provides database operations for retrieving, creating, updating, and deleting caretaker hours records
 */
class CTHoursQueries {
  /**
   * Selects all caretaker hours records from the database
   * @param db - DatabaseManager instance for executing queries
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of CTHours objects
   * @throws Error if database query fails
   */
  static async selectCTHours(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<CTHours[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT caretaker_id, start_time, end_time, weekday FROM ct_hours;
        `)
      ).rows,
    ) as Record<string, any>[];

    const ctHours: CTHours[] = plainToInstance(CTHours, result);

    if (tm.geti18n().getLocale() !== "en") {
      // Translate weekday values according to the specified language
      ctHours.map((value) => {
        value.weekday = tm.getWeekdayTranslation(value.weekday as Weekday);
        return value;
      });
      return ctHours;
    }
    return ctHours;
  }

  /**
   * Selects caretaker hours records by caretaker ID
   * @param db - DatabaseManager instance for executing queries
   * @param caretakerId - ID of the caretaker to filter records
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of CTHours objects
   * @throws Error if database query fails
   */
  static async selectById(
    db: DatabaseManager,
    caretakerId: string,
    tm: TranslationManager,
  ): Promise<CTHours[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT caretaker_id, start_time, end_time, weekday FROM ct_hours WHERE caretaker_id = $1;
        `,
          [caretakerId],
        )
      ).rows,
    ) as Record<string, any>[];

    const ctHours: CTHours[] = plainToInstance(CTHours, result);

    if (tm.geti18n().getLocale() !== "en") {
      // Translate weekday values according to the specified language
      ctHours.map((value) => {
        value.weekday = tm.getWeekdayTranslation(value.weekday as Weekday);
        return value;
      });
      return ctHours;
    }
    return ctHours;
  }

  /**
   * Selects a specific caretaker hour record by caretaker ID, weekday, and start time
   * @param db - DatabaseManager instance for executing queries
   * @param caretakerId - ID of the caretaker to filter records
   * @param weekday - Weekday to filter records
   * @param startTime - Start time to filter records
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to a CTHours object or undefined if not found
   * @throws Error if database query fails
   */
  static async selectCTHour(
    db: DatabaseManager,
    caretakerId: string,
    weekday: string,
    startTime: string,
    tm: TranslationManager,
  ): Promise<CTHours | undefined> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT caretaker_id, start_time, end_time, weekday FROM ct_hours
          WHERE caretaker_id = $1 AND
          weekday = $2 AND
          start_time =$3;
        `,
          [caretakerId, weekday, startTime],
        )
      ).rows[0],
    ) as Record<string, any>;
    if (result === undefined) {
      return undefined;
    }

    let ctHour: CTHours = plainToInstance(CTHours, result);

    if (tm.geti18n().getLocale() !== "en") {
      // Translate weekday values according to the specified language
      ctHour.weekday = tm.getWeekdayTranslation(ctHour.weekday as Weekday);
    }
    return ctHour;
  }

  /**
   * Inserts new caretaker hours records into the database
   * @param db - DatabaseManager instance for executing queries
   * @param caretakerId - ID of the caretaker associated with the hours
   * @param ctHoursData - Array of CTHours objects to insert
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to void
   * @throws ValidationError if any required fields are missing or start time >= end time
   */
  static async insertCTHours(
    db: DatabaseManager,
    caretakerId: string,
    ctHoursData: CTHours[],
    tm: TranslationManager,
  ): Promise<void> {
    // Check if caretaker hours already exist for this combination
    const ctHoursExist = await this.selectById(db, caretakerId, tm);
    if (ctHoursExist) {
      console.log("Ct hours existed, will be deleted first.");
      // Delete existing record before inserting new one
      await this.deleteCTHoursById(db, caretakerId);
    }
    for (let ctHour of ctHoursData) {
      if (tm.geti18n().getLocale() !== "en") {
        // Translate weekday value to English if language is not English
        ctHour.weekday = tm.findWeekdayFromTranslation(
          ctHour.weekday,
        ) as string;
      }

      if (!ctHour.startTime || !ctHour.endTime || !ctHour.weekday) {
        throw ValidationError;
      }

      if (ctHour.startTime >= ctHour.endTime) {
        throw ValidationError;
      }

      await db.executeQuery(
        `
      INSERT INTO ct_hours (
        caretaker_id, start_time, end_time, weekday
      )
      VALUES (
        $1, $2, $3, $4
      );
      `,
        [caretakerId, ctHour.startTime, ctHour.endTime, ctHour.weekday],
      );
    }
  }

  /**
   * Updates caretaker hours records or inserts new ones if they don't exist
   * @param db - DatabaseManager instance for executing queries
   * @param caretakerId - ID of the caretaker associated with the hours
   * @param ctHoursData - Array of CTHours objects to process
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to void
   * @throws ValidationError if any required fields are missing or start time >= end time
   */
  static async updateCTHours(
    db: DatabaseManager,
    caretakerId: string,
    ctHoursData: CTHours[],
    tm: TranslationManager,
  ): Promise<void> {
    // Check if caretaker hours already exist
    const ctHoursExist = await this.selectById(db, caretakerId, tm);
    if (ctHoursExist) {
      console.log("Ct hours existed, will be deleted first.");
      // Delete existing record before inserting new one
      await this.deleteCTHoursById(db, caretakerId);
    }
    for (let ctHour of ctHoursData) {
      if (tm.geti18n().getLocale() !== "en") {
        // Translate weekday value to English if language is not English
        ctHour.weekday = tm.findWeekdayFromTranslation(
          ctHour.weekday,
        ) as string;
      }

      if (!ctHour.startTime || !ctHour.endTime || !ctHour.weekday) {
        throw ValidationError;
      }

      if (ctHour.startTime >= ctHour.endTime) {
        throw ValidationError;
      }

      await db.executeQuery(
        `
      INSERT INTO ct_hours (
        caretaker_id, start_time, end_time, weekday
      )
      VALUES (
        $1, $2, $3, $4
      );
      `,
        [caretakerId, ctHour.startTime, ctHour.endTime, ctHour.weekday],
      );
    }
  }

  /**
   * Deletes a specific caretaker hour record by caretaker ID, weekday, and start time
   * @param db - DatabaseManager instance for executing queries
   * @param caretakerId - ID of the caretaker associated with the hours
   * @param weekday - Weekday of the hour to delete
   * @param startTime - Start time of the hour to delete
   * @returns Promise resolving to void
   * @throws Error if database query fails
   */
  static async deleteCTHours(
    db: DatabaseManager,
    caretakerId: string,
    weekday: string,
    startTime: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM ct_hours
      WHERE caretaker_id = $1 AND weekday = $2 AND start_time = $3;
      `,
      [caretakerId, weekday, startTime],
    );
  }

  /**
   * Deletes all caretaker hours records associated with a specific caretaker ID
   * @param db - DatabaseManager instance for executing queries
   * @param caretakerId - ID of the caretaker whose hours to delete
   * @returns Promise resolving to void
   * @throws Error if database query fails
   */
  static async deleteCTHoursById(
    db: DatabaseManager,
    caretakerId: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM ct_hours
      WHERE caretaker_id = $1;
      `,
      [caretakerId],
    );
  }
}

export { CTHoursQueries };
