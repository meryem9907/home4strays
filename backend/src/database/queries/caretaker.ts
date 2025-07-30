import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import { Caretaker, FullCaretaker } from "../../models/db-models/caretaker";
import { convertKeysToCamelCase } from "../../utils/formatter";
import CTHours from "../../models/db-models/cthours";
import { CTHoursQueries } from "./cthours";
import { User } from "../../models/db-models/user";
import { UserQueries } from "./user";
import { TranslationManager } from "../../utils/translations-manager";
import {
  Employment,
  Experience,
  LocalityType,
  MaritalStatus,
  Residence,
  Tenure,
} from "../../models/enums";

/**
 * Class containing database query operations for managing caretaker data.
 * This class provides methods to interact with the caretaker table in the database,
 * including selecting, inserting, updating, and deleting caretaker records.
 * All operations are performed using the provided DatabaseManager instance.
 */
class CaretakerQueries {
  /**
   * Selects all caretakers from the database.
   * @param db - DatabaseManager instance used to execute the query.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to an array of Caretaker objects.
   * @throws No exceptions are explicitly thrown, but may return empty arrays if no records found.
   */
  static async select(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<Caretaker[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT
            user_id, space, experience, tenure, marital_status, financial_assistance,
            locality_type, garden, floor, residence, street_name, city_name, zip,
            country, house_number, employment_type, previous_adoption, number_kids,
            birthdate, holiday_care, adoption_willingness
          FROM caretaker;
        `)
      ).rows,
    ) as Record<string, any>[];

    const caretakers: Caretaker[] = plainToInstance(Caretaker, result);

    if (tm.geti18n().getLocale() !== "en") {
      // Translate enum values based on the provided language
      caretakers.map((value) => {
        value.experience = tm.getExperienceTranslation(
          value.experience as Experience,
        );
        value.tenure = tm.getTenureTranslation(value.tenure as Tenure);
        value.maritalStatus = tm.getMaritalStatusTranslation(
          value.maritalStatus as MaritalStatus,
        );
        value.localityType = tm.getLocalityTypeTranslation(
          value.localityType as LocalityType,
        );
        value.residence = tm.getResidenceTranslation(
          value.residence as Residence,
        );
        value.employmentType = tm.getEmploymentTranslation(
          value.employmentType as Employment,
        );
        return value;
      });
      return caretakers;
    }
    return caretakers;
  }

  /**
   * Selects a caretaker by their user ID.
   * @param db - DatabaseManager instance used to execute the query.
   * @param userId - The user ID associated with the caretaker.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to a Caretaker object or undefined if not found.
   * @throws No exceptions are explicitly thrown, but may return undefined if no record found.
   */
  static async selectById(
    db: DatabaseManager,
    userId: string,
    tm: TranslationManager,
  ): Promise<Caretaker | undefined> {
    let results = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT
            user_id, space, experience, tenure, marital_status, financial_assistance,
            locality_type, garden, floor, residence, street_name, city_name, zip,
            country, house_number, employment_type, previous_adoption, number_kids,
            birthdate, holiday_care, adoption_willingness
          FROM caretaker
          WHERE user_id = $1;
        `,
          [userId],
        )
      ).rows,
    ) as Record<string, any>[];

    if (results.length === 0 || !results) {
      return undefined;
    }

    let result: Caretaker = plainToInstance(Caretaker, results[0]);
    if (tm.geti18n().getLocale() !== "en") {
      result.experience = tm.getExperienceTranslation(
        result.experience as Experience,
      );
      result.tenure = tm.getTenureTranslation(result.tenure as Tenure);
      result.maritalStatus = tm.getMaritalStatusTranslation(
        result.maritalStatus as MaritalStatus,
      );
      result.localityType = tm.getLocalityTypeTranslation(
        result.localityType as LocalityType,
      );
      result.residence = tm.getResidenceTranslation(
        result.residence as Residence,
      );
      result.employmentType = tm.getEmploymentTranslation(
        result.employmentType as Employment,
      );
    }
    return result;
  }

  /**
   * Selects caretakers who have expressed interest in a specific pet.
   * @param db - DatabaseManager instance used to execute the query.
   * @param petId - The ID of the pet to find interested caretakers for.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to an array of Caretaker objects.
   * @throws No exceptions are explicitly thrown, but may return empty arrays if no records found.
   */
  static async selectMatchedCaretakersByPet(
    db: DatabaseManager,
    petId: string,
    tm: TranslationManager,
  ): Promise<Caretaker[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT
      c.user_id, c.space, c.experience, c.tenure, c.marital_status, c.financial_assistance,
            c.locality_type, c.garden, c.floor, c.residence, c.street_name, c.city_name, c.zip,
            c.country, c.house_number, c.employment_type, c.previous_adoption, c.number_kids,
            c.birthdate, c.holiday_care, c.adoption_willingness
      FROM caretaker c
      JOIN interested_pet ip ON c.user_id = ip.user_id
      JOIN pet p ON ip.pet_id = p.id
      WHERE p.id = $1 AND ip.interested = $2;
      `,
          [petId, true],
        )
      ).rows,
    ) as Record<string, any>[];

    let caretakers: Caretaker[] = plainToInstance(Caretaker, result);

    if (tm.geti18n().getLocale() !== "en") {
      // Translate enum values based on the provided language
      caretakers.map((value) => {
        value.experience = tm.getExperienceTranslation(
          value.experience as Experience,
        );
        value.tenure = tm.getTenureTranslation(value.tenure as Tenure);
        value.maritalStatus = tm.getMaritalStatusTranslation(
          value.maritalStatus as MaritalStatus,
        );
        value.localityType = tm.getLocalityTypeTranslation(
          value.localityType as LocalityType,
        );
        value.residence = tm.getResidenceTranslation(
          value.residence as Residence,
        );
        value.employmentType = tm.getEmploymentTranslation(
          value.employmentType as Employment,
        );
        return value;
      });
      return caretakers;
    }
    return caretakers;
  }

  /**
   * Selects all information about a caretaker including their profile, user details, and CTHours.
   * @param db - DatabaseManager instance used to execute the query.
   * @param caretakerId - The ID of the caretaker.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to a FullCaretaker object or undefined if not found.
   * @throws No exceptions are explicitly thrown, but may return undefined if no record found.
   */
  static async selectAllInfosById(
    db: DatabaseManager,
    caretakerId: string,
    tm: TranslationManager,
  ): Promise<FullCaretaker | undefined> {
    // Select caretaker profile
    const caretaker: Caretaker | undefined = await this.selectById(
      db,
      caretakerId,
      tm,
    );
    // Select CTHours
    const ctHours: CTHours[] | undefined = await CTHoursQueries.selectById(
      db,
      caretakerId,
      tm,
    );
    // Select user
    const user: User | undefined = await UserQueries.selectByIdSecurely(
      db,
      caretakerId,
    );
    if (caretaker == undefined || user == undefined) {
      return undefined;
    }

    let fullCaretakerObject = {
      ...caretaker,
      ...user,
      ctHours: ctHours,
    };

    let fullCaretaker: FullCaretaker = plainToInstance(
      FullCaretaker,
      fullCaretakerObject,
    );

    return fullCaretaker;
  }

  /**
   * Selects all full caretaker information from a list of caretaker IDs.
   * @param db - DatabaseManager instance used to execute the query.
   * @param caretakers - Array of Caretaker objects to retrieve full information for.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to an array of FullCaretaker objects.
   * @throws No exceptions are explicitly thrown, but may return empty arrays if no records found.
   */
  static async selectAllInfosByCaretakerList(
    db: DatabaseManager,
    caretakers: Caretaker[],
    tm: TranslationManager,
  ): Promise<FullCaretaker[]> {
    let fullCaretakers: FullCaretaker[] = [];
    for (const caretaker of caretakers) {
      let fullCaretaker = await this.selectAllInfosById(
        db,
        caretaker.userId,
        tm,
      );
      fullCaretaker = plainToInstance(FullCaretaker, fullCaretaker);
      fullCaretakers.push(fullCaretaker);
    }
    return plainToInstance(FullCaretaker, fullCaretakers);
  }

  /**
   * Selects a caretaker along with their CTHours information.
   * @param db - DatabaseManager instance used to execute the query.
   * @param userId - The user ID associated with the caretaker.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to an object containing Caretaker data and CTHours, or null if not found.
   * @throws No exceptions are explicitly thrown, but may return null if no record found.
   */
  static async selectCaretakerWithHoursById(
    db: DatabaseManager,
    userId: string,
    tm: TranslationManager,
  ): Promise<(Caretaker & { ctHours: CTHours[] }) | null> {
    // Select caretaker and CTHours data
    const results = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT
        a.userId, a.space, a.experience, a.tenure, a.maritalStatus, a.financialAssistance,
        a.localityType, a.garden, a.floor, a.residence, a.streetName, a.cityName, a.zip,
        a.country, a.houseNumber, a.employmentType, a.previousAdoption, a.numberKids,
        a.birthdate, a.holidayCare, a.adoptionWillingness,
        b.caretakerId, b.startTime, b.endTime, b.weekday
      FROM Caretaker a
      LEFT JOIN CTHours b
        ON a.userId = b.caretakerId
      WHERE a.userId = $1;
    `,
          [userId],
        )
      ).rows,
    ) as Record<string, any>[];

    if (results.length === 0) return null;

    let caretaker: Caretaker = plainToInstance(Caretaker, results[0]);

    const ctHours: CTHours[] = results
      .filter((r) => r.startTime !== null && r.startTime !== undefined)
      .map((r) => ({
        caretakerId: r.caretakerId,
        startTime: r.startTime,
        endTime: r.endTime,
        weekday: r.weekday,
      }));

    if (tm.geti18n().getLocale() !== "en") {
      caretaker.experience = tm.getExperienceTranslation(
        caretaker.experience as Experience,
      );
      caretaker.tenure = tm.getTenureTranslation(caretaker.tenure as Tenure);
      caretaker.maritalStatus = tm.getMaritalStatusTranslation(
        caretaker.maritalStatus as MaritalStatus,
      );
      caretaker.localityType = tm.getLocalityTypeTranslation(
        caretaker.localityType as LocalityType,
      );
      caretaker.residence = tm.getResidenceTranslation(
        caretaker.residence as Residence,
      );
      caretaker.employmentType = tm.getEmploymentTranslation(
        caretaker.employmentType as Employment,
      );
    }

    return {
      ...caretaker,
      ctHours,
    };
  }

  /**
   * Inserts a new caretaker into the database.
   * @param db - DatabaseManager instance used to execute the query.
   * @param caretaker - The Caretaker object to be inserted.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves when the insertion is complete.
   * @throws No exceptions are explicitly thrown, but may throw errors from the database operation.
   */
  static async insert(
    db: DatabaseManager,
    caretaker: Caretaker,
    tm: TranslationManager,
  ) {
    // Translate enums to their reverse values for insertion
    if (tm.geti18n().getLocale() !== "en") {
      caretaker.experience = tm.findExperienceFromTranslation(
        caretaker.experience,
      ) as string;
      caretaker.tenure = tm.findTenureFromTranslation(
        caretaker.tenure,
      ) as string;
      caretaker.maritalStatus = tm.findMaritalStatusFromTranslation(
        caretaker.maritalStatus,
      ) as string;
      caretaker.localityType = tm.findLocalityTypeFromTranslation(
        caretaker.localityType,
      ) as string;
      caretaker.residence = tm.findResidenceFromTranslation(
        caretaker.residence,
      ) as string;
      caretaker.employmentType = tm.findEmploymentFromTranslation(
        caretaker.employmentType,
      ) as string;
    }

    await db.executeQuery(
      `
      INSERT INTO caretaker (
        user_id, space, experience, tenure, marital_status, financial_assistance,
        locality_type, garden, floor, residence, street_name, city_name, zip,
        country, house_number, employment_type, previous_adoption, number_kids,
        birthdate, holiday_care, adoption_willingness
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20, $21
      )`,
      [
        caretaker.userId,
        caretaker.space,
        caretaker.experience,
        caretaker.tenure,
        caretaker.maritalStatus,
        caretaker.financialAssistance,
        caretaker.localityType,
        caretaker.garden,
        caretaker.floor,
        caretaker.residence,
        caretaker.streetName,
        caretaker.cityName,
        caretaker.zip,
        caretaker.country,
        caretaker.houseNumber,
        caretaker.employmentType,
        caretaker.previousAdoption,
        caretaker.numberKids,
        caretaker.birthdate,
        caretaker.holidayCare,
        caretaker.adoptionWillingness,
      ],
    );
  }

  /**
   * Updates an existing caretaker's information in the database.
   * @param db - DatabaseManager instance used to execute the query.
   * @param caretaker - The Caretaker object containing updated data.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves when the update is complete.
   * @throws No exceptions are explicitly thrown, but may throw errors from the database operation.
   */
  static async updateCaretakerById(
    db: DatabaseManager,
    userId: string,
    caretaker: Caretaker,
    tm: TranslationManager,
  ): Promise<void> {
    // Translate enums to their reverse values for insertion
    if (tm.geti18n().getLocale() !== "en") {
      caretaker.experience = tm.findExperienceFromTranslation(
        caretaker.experience,
      ) as string;
      caretaker.tenure = tm.findTenureFromTranslation(
        caretaker.tenure,
      ) as string;
      caretaker.maritalStatus = tm.findMaritalStatusFromTranslation(
        caretaker.maritalStatus,
      ) as string;
      caretaker.localityType = tm.findLocalityTypeFromTranslation(
        caretaker.localityType,
      ) as string;
      caretaker.residence = tm.findResidenceFromTranslation(
        caretaker.residence,
      ) as string;
      caretaker.employmentType = tm.findEmploymentFromTranslation(
        caretaker.employmentType,
      ) as string;
    }

    await db.executeQuery(
      `
      UPDATE caretaker SET
        space = $2, experience = $3, tenure = $4, marital_status = $5, financial_assistance = $6,
        locality_type = $7, garden = $8, floor = $9, residence = $10, street_name = $11, city_name = $12, zip = $13,
        country = $14, house_number = $15, employment_type = $16, previous_adoption = $17, number_kids = $18,
        birthdate = $19, holiday_care = $20, adoption_willingness = $21
      WHERE user_id = $1`,
      [
        userId,
        caretaker.space,
        caretaker.experience,
        caretaker.tenure,
        caretaker.maritalStatus,
        caretaker.financialAssistance,
        caretaker.localityType,
        caretaker.garden,
        caretaker.floor,
        caretaker.residence,
        caretaker.streetName,
        caretaker.cityName,
        caretaker.zip,
        caretaker.country,
        caretaker.houseNumber,
        caretaker.employmentType,
        caretaker.previousAdoption,
        caretaker.numberKids,
        caretaker.birthdate,
        caretaker.holidayCare,
        caretaker.adoptionWillingness,
      ],
    );
  }

  /**
   * Deletes a caretaker from the database by their user ID.
   *
   * This method removes the caretaker record associated with the provided user ID
   * from the database. It uses a parameterized SQL query to ensure security against
   * SQL injection and guarantees transactional integrity.
   *
   * @param db - The database manager instance used to execute the query.
   * @param userId - The unique identifier of the user associated with the caretaker
   *                  record to be deleted.
   * @returns A Promise that resolves when the deletion operation is complete.
   */
  static async deleteCaretakerById(
    db: DatabaseManager,
    userId: string,
  ): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM caretaker
      WHERE user_id = $1;
    `,
      [userId],
    );
  }

  /**
   * Deletes a caretaker from the database by their user ID.
   *
   * This method removes the caretaker record associated with the provided user ID
   * from the database. It uses a parameterized SQL query to ensure security against
   * SQL injection and guarantees transactional integrity.
   *
   * @param db - The database manager instance used to execute the query.
   * @param userId - The unique identifier of the user associated with the caretaker
   *                  record to be deleted.
   * @returns A Promise that resolves when the deletion operation is complete.
   */
  static async deleteById(db: DatabaseManager, userId: string): Promise<void> {
    await db.executeQuery(
      `
      DELETE FROM caretaker
      WHERE user_id = $1;
    `,
      [userId],
    );
  }
}

export { CaretakerQueries };
