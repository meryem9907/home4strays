import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import NGOMemberHours from "../../models/db-models/ngomemberhours";
import { ValidationError } from "../../utils/errors";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { TranslationManager } from "../../utils/translations-manager";
import { Weekday } from "../../models/enums";

/**
 * Class containing query operations for managing NGO member hours data
 * Provides methods for selecting, inserting, updating, and deleting NGO member hours records
 */
class NGOMemberHoursQueries {
  /**
   * Selects all NGO member hours records from the database
   * @param db - DatabaseManager instance for executing queries
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of NGOMemberHours objects
   *
   * This method retrieves all records from the ngo_member_hours table,
   * converts the result keys to camelCase, and translates weekday values
   * based on the specified language. If the language is not English, it
   * applies the appropriate translation using the WeekdayTranslations map.
   */
  static async select(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<NGOMemberHours[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
      SELECT ngo_member_id, start_time, end_time, weekday FROM ngo_member_hours;
    `)
      ).rows,
    ) as Record<string, any>[];

    let ngoMemberHours = plainToInstance(NGOMemberHours, result);
    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      ngoMemberHours.map((value) => {
        value.weekday = value.weekday = tm.getWeekdayTranslation(
          value.weekday as Weekday,
        );
        return value;
      });
      return ngoMemberHours;
    }
    return ngoMemberHours;
  }

  /**
   * Selects all NGO member hours by an ngo member records from the database
   * @param db - DatabaseManager instance for executing queries
   * @param ngoMemberId - specific id of ngo member
   * @param lang - Language code for translation (default is 'en')
   * @returns Promise resolving to an array of NGOMemberHours objects
   *
   * This method retrieves all records from the ngo_member_hours table by an ngo member,
   * converts the result keys to camelCase, and translates weekday values
   * based on the specified language. If the language is not English, it
   * applies the appropriate translation using the WeekdayTranslations map.
   */
  static async selectById(
    db: DatabaseManager,
    ngoMemberId: string,
    tm: TranslationManager,
  ): Promise<NGOMemberHours[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT ngo_member_id, start_time, end_time, weekday FROM ngo_member_hours
      WHERE ngo_member_id = $1;
    `,
          [ngoMemberId],
        )
      ).rows,
    ) as Record<string, any>[];

    let ngoMemberHours = plainToInstance(NGOMemberHours, result);
    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      ngoMemberHours.map((value) => {
        value.weekday = value.weekday = tm.getWeekdayTranslation(
          value.weekday as Weekday,
        );
        return value;
      });
      return ngoMemberHours;
    }
    return ngoMemberHours;
  }

  /**
   * Inserts new NGO member hours records into the database
   * @param db - DatabaseManager instance for executing queries
   * @param ngoMemberId - Identifier for the NGO member
   * @param ngoMemberHoursData - Array of NGOMemberHours objects to insert
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to void
   *
   * This method processes each hour entry in the provided data array. If the
   * language is not English, it translates the weekday value using the
   * ReverseWeekdayTranslations map. It validates that all required fields
   * (startTime, endTime, weekday) are present and that start time is before
   * end time. If any validation fails, it throws a ValidationError.
   */
  static async insertNGOMemberHours(
    db: DatabaseManager,
    ngoMemberId: string,
    ngoMemberHoursData: NGOMemberHours[],
    tm: TranslationManager,
  ): Promise<void> {
    const ngoMemberHoursExist = await this.selectById(db, ngoMemberId, tm);
    if (ngoMemberHoursExist) {
      await this.deleteAllNGOMemberHours(db, ngoMemberId);
    }
    for (const ngoMemberHour of ngoMemberHoursData) {
      if (tm.geti18n().getLocale() !== "en") {
        // translate data to english
        ngoMemberHour.weekday = tm.findWeekdayFromTranslation(
          ngoMemberHour.weekday,
        ) as string;
      }

      if (
        !ngoMemberHour.startTime ||
        !ngoMemberHour.endTime ||
        !ngoMemberHour.weekday
      ) {
        throw ValidationError;
      }

      if (ngoMemberHour.startTime >= ngoMemberHour.endTime) {
        throw ValidationError;
      }

      await db.executeQuery(
        `
        INSERT INTO ngo_member_hours (ngo_member_id, start_time, end_time, weekday)
        VALUES ($1, $2, $3, $4);
        `,
        [
          ngoMemberId,
          ngoMemberHour.startTime,
          ngoMemberHour.endTime,
          ngoMemberHour.weekday,
        ],
      );
    }
  }

  /**
   * Updates NGO member hours records by deleting existing entries first
   * @param db - DatabaseManager instance for executing queries
   * @param ngoMemberId - Identifier for the NGO member
   * @param ngoMemberHoursData - Array of NGOMemberHours objects to update
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to void
   *
   * This method performs an upsert operation. For each hour entry in the
   * provided data array, it first deletes any existing record that matches
   * the same weekday and startTime combination for the given NGO member.
   * If the language is not English, it translates the weekday value using
   * the ReverseWeekdayTranslations map. It validates that all required fields
   * (startTime, endTime, weekday) are present and that start time is before
   * end time. If any validation fails, it throws a ValidationError.
   */
  static async updateNGOMemberHours(
    db: DatabaseManager,
    ngoMemberId: string,
    ngoMemberHoursData: NGOMemberHours[],
    tm: TranslationManager,
  ): Promise<void> {
    const ngoMemberHoursExist = await this.selectById(db, ngoMemberId, tm);
    if (ngoMemberHoursExist) {
      await this.deleteAllNGOMemberHours(db, ngoMemberId);
    }
    for (const ngoMemberHour of ngoMemberHoursData) {
      if (tm.geti18n().getLocale() !== "en") {
        // translate data to english
        ngoMemberHour.weekday = tm.findWeekdayFromTranslation(
          ngoMemberHour.weekday,
        ) as string;
      }

      if (
        !ngoMemberHour.startTime ||
        !ngoMemberHour.endTime ||
        !ngoMemberHour.weekday
      ) {
        throw ValidationError;
      }

      if (ngoMemberHour.startTime >= ngoMemberHour.endTime) {
        throw ValidationError;
      }

      await db.executeQuery(
        `
        DELETE FROM ngo_member_hours
        WHERE ngo_member_id = $1 AND weekday = $2 AND start_time = $3;
        `,
        [ngoMemberId, ngoMemberHour.weekday, ngoMemberHour.startTime],
      );

      await db.executeQuery(
        `
        INSERT INTO ngo_member_hours (ngo_member_id, start_time, end_time, weekday)
        VALUES ($1, $2, $3, $4);
        `,
        [
          ngoMemberId,
          ngoMemberHour.startTime,
          ngoMemberHour.endTime,
          ngoMemberHour.weekday,
        ],
      );
    }
  }

  /**
   * Deletes a specific NGO member hour record by identifier
   * @param db - DatabaseManager instance for executing queries
   * @param ngoMemberId - Identifier for the NGO member
   * @param weekday - Weekday of the hour to delete
   * @param startTime - Start time of the hour to delete
   * @returns Promise resolving to void
   *
   * This method deletes a single record from the ngo_member_hours table
   * based on the provided NGO member ID, weekday, and start time. It ensures
   * that the exact match is removed from the database.
   */
  static async deleteNGOMemberHours(
    db: DatabaseManager,
    ngoMemberId: string,
    weekday: string,
    startTime: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM ngo_member_hours
      WHERE ngo_member_id = $1 AND weekday = $2 AND start_time = $3;
      `,
      [ngoMemberId, weekday, startTime],
    );
  }

  /**
   * Deletes all NGO member hours records for a specific member
   * @param db - DatabaseManager instance for executing queries
   * @param ngoMemberId - Identifier for the NGO member
   * @returns Promise resolving to void
   *
   * This method removes all records from the ngo_member_hours table that
   * are associated with the provided NGO member ID. It effectively clears
   * all hours for the specified member.
   */
  static async deleteAllNGOMemberHours(
    db: DatabaseManager,
    ngoMemberId: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM ngo_member_hours
      WHERE ngo_member_id = $1;
      `,
      [ngoMemberId],
    );
  }
}

export { NGOMemberHoursQueries };
