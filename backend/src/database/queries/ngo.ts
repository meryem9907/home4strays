import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { DBInsertError, NGONotFoundError } from "../../utils/errors";
import { FullNGO, NGO } from "../../models/db-models/ngo";
import { NGOHoursQueries } from "./ngohours";
import NGOHours from "../../models/db-models/ngohours";
import { TranslationManager } from "../../utils/translations-manager";

export interface NGOFilters {
  ngoName?: string[];
  country?: string[];
  city?: string;
  verified?: "All" | "verified" | "not verified";
  members?: ("Any" | "less than 15" | "15 to 30" | "more than 30")[];
}

class NGOQueries {
  // SELECT STATEMENTS

  /**
   * Retrieves all NGOs from the database.
   * This method fetches all NGO records and converts them to the NGO model class.
   * @param db - The database manager instance used to execute the query.
   * @returns A promise that resolves to an array of NGO objects or undefined if no records are found.
   */
  static async select(db: DatabaseManager): Promise<NGO[] | undefined> {
    const resultRows = convertKeysToCamelCase(
      (
        await db.executeQuery(`
      SELECT
        id, name, email, country, "verification_document_path", "verification_document_link",
        verified, "logo_picture_path", "logo_picture_link", "phone_number", "member_count",
        website, mission
      FROM ngo;
    `)
      ).rows,
    ) as Record<string, any>[];
    if (resultRows.length == 0) {
      return undefined;
    }
    const ngos: NGO[] = plainToInstance(NGO, resultRows);
    return ngos;
  }

  /**
   * Retrieves all NGOs along with their associated hours data.
   * This method first fetches all NGO records, then retrieves hours data for each NGO using the NGOHoursQueries.
   * @param db - The database manager instance used to execute the query.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to an array of FullNGO objects (NGO with hours data) or undefined if no records are found.
   */
  static async selectAllNGOsWithHours(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<Array<FullNGO> | undefined> {
    const resultRows = convertKeysToCamelCase(
      (
        await db.executeQuery(`
      SELECT
        id, name, email, country, "verification_document_path", "verification_document_link",
        verified, "logo_picture_path", "logo_picture_link", "phone_number", "member_count",
        website, mission
      FROM ngo;
    `)
      ).rows,
    ) as Record<string, any>[];
    if (resultRows.length == 0) {
      return undefined;
    }
    const ngos: NGO[] = plainToInstance(NGO, resultRows);

    let ngosWithHours: Array<FullNGO> = [];
    for (let ngo of ngos) {
      // get NGO Hours
      const hours: NGOHours[] = await NGOHoursQueries.selectById(
        db,
        ngo.id,
        tm,
      );
      const fullNGO: FullNGO = { ...ngo, ngoHours: hours };
      ngosWithHours.push(fullNGO);
    }
    return ngosWithHours;
  }

  /**
   * Retrieves all NGOs with hours data by a provided list of NGO objects.
   * This method takes an array of NGO objects and attaches their hours data using the NGOHoursQueries.
   * @param db - The database manager instance used to execute the query.
   * @param ngos - Array of NGO objects to process.
   * @param tm - Translation Manager translates enums
   * @returns A promise that resolves to an array of FullNGO objects (NGO with hours data) or undefined if no records are found.
   */
  static async selectAllNGOsWithHoursByList(
    db: DatabaseManager,
    ngos: NGO[],
    tm: TranslationManager,
  ): Promise<Array<FullNGO> | undefined> {
    let ngosWithHours: Array<FullNGO> = [];
    for (let ngo of ngos) {
      // get NGO Hours
      const hours: NGOHours[] = await NGOHoursQueries.selectById(
        db,
        ngo.id,
        tm,
      );
      const fullNGO: FullNGO = { ...ngo, ngoHours: hours };

      ngosWithHours.push(fullNGO);
    }
    return ngosWithHours;
  }

  /** Selects NGOs with pagination and filters */
  static async selectNGOsWithFilters(
    db: DatabaseManager,
    filters: NGOFilters = {},
    limit: number = 9,
    offset: number = 0,
    tm: TranslationManager,
  ): Promise<{ ngos: FullNGO[]; total: number }> {
    const queryParams: any[] = [];
    const whereClauses: string[] = [];
    let paramIndex = 1;

    if (filters.ngoName && filters.ngoName.length > 0) {
      const validNgoNames = filters.ngoName.filter(
        (name: string) => name && name.trim() !== "",
      );
      if (validNgoNames.length > 0) {
        const ngoConditions = validNgoNames.map(
          () => `n.name ILIKE $${paramIndex++}`,
        );
        whereClauses.push(`(${ngoConditions.join(" OR ")})`);
        queryParams.push(...validNgoNames.map((name: string) => `%${name}%`));
      }
    }

    if (filters.country && filters.country.length > 0) {
      const validCountries = filters.country.filter(
        (country: string) => country && country.trim() !== "",
      );
      if (validCountries.length > 0) {
        const countryPlaceholders = validCountries.map(
          () => `$${paramIndex++}`,
        );
        whereClauses.push(`n.country IN (${countryPlaceholders.join(", ")})`);
        queryParams.push(...validCountries);
      }
    }

    if (filters.verified && filters.verified !== "All") {
      if (filters.verified === "verified") {
        whereClauses.push(`n.verified = $${paramIndex}`);
        queryParams.push(true);
        paramIndex++;
      } else if (filters.verified === "not verified") {
        whereClauses.push(`n.verified = $${paramIndex}`);
        queryParams.push(false);
        paramIndex++;
      }
    }

    if (filters.members && filters.members.length > 0) {
      const validMemberFilters = filters.members.filter(
        (m: string) => m && m !== "Any",
      );
      if (validMemberFilters.length > 0) {
        const memberConditions: string[] = [];
        for (const memberFilter of validMemberFilters) {
          if (memberFilter === "less than 15") {
            memberConditions.push(`n.member_count < $${paramIndex++}`);
            queryParams.push(15);
          } else if (memberFilter === "15 to 30") {
            memberConditions.push(
              `(n.member_count >= $${paramIndex++} AND n.member_count <= $${paramIndex++})`,
            );
            queryParams.push(15, 30);
          } else if (memberFilter === "more than 30") {
            memberConditions.push(`n.member_count > $${paramIndex++}`);
            queryParams.push(30);
          }
        }
        if (memberConditions.length > 0) {
          whereClauses.push(`(${memberConditions.join(" OR ")})`);
        }
      }
    }

    const whereCondition =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const dataQuery = `
      SELECT
        n.id, n.name, n.email, n.country, n.verification_document_link,
        n.verified, n.logo_picture_link, n.phone_number, n.member_count,
        n.website, n.mission
      FROM ngo n
      ${whereCondition}
      ORDER BY n.name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    const dataQueryParams = [...queryParams, limit, offset];
    const ngosResult = (await db.executeQuery(dataQuery, dataQueryParams)).rows;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ngo n
      ${whereCondition};
    `;
    const totalResult = (await db.executeQuery(countQuery, queryParams))
      .rows[0];

    const ngos: NGO[] = plainToInstance(
      NGO,
      convertKeysToCamelCase(ngosResult) as Record<string, any>[],
    );

    // Add hours data to each NGO
    const ngosWithHours: FullNGO[] = [];
    for (const ngo of ngos) {
      const hours: NGOHours[] = await NGOHoursQueries.selectById(
        db,
        ngo.id,
        tm,
      );
      const fullNGO: FullNGO = { ...ngo, ngoHours: hours };
      ngosWithHours.push(fullNGO);
    }

    return {
      ngos: ngosWithHours,
      total: parseInt(totalResult.total, 10),
    };
  }

  /** Returns the verification status of a certain NGO selected by Name and Country */
  static async selectVerificationStatusByNGO(
    db: DatabaseManager,
    name: string,
    country: string,
  ): Promise<NGO> {
    const resultRow = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT verified FROM ngo WHERE name=$1 AND country=$2;`,
          [name, country],
        )
      ).rows[0],
    ) as Record<string, any>;
    if (!resultRow) {
      throw NGONotFoundError;
    }
    const ngo = plainToInstance(NGO, resultRow);
    return ngo;
  }

  /**
   * Retrieves the logo information of an NGO by its ID.
   * This method fetches the logo picture path and link from the database for the specified NGO ID.
   * @param db - The database manager instance used to execute the query.
   * @param id - ID of the NGO.
   * @returns A promise that resolves to an NGO object containing its logo information.
   */
  static async selectLogo(db: DatabaseManager, id: string): Promise<NGO> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT
      logo_picture_path, logo_picture_link
      FROM NGO
      WHERE id=$1;
    `,
          [id],
        )
      ).rows[0],
    ) as Record<string, any>;

    return plainToInstance(NGO, result);
  }

  /**
   * Retrieves all unverified NGOs from the database.
   * This method queries the database for NGOs that have not been verified.
   * @param db - The database manager instance used to execute the query.
   * @returns A promise that resolves to an array of NGO objects representing unverified NGOs.
   */
  static async selectUnverifiedNGOs(db: DatabaseManager): Promise<NGO[]> {
    const resultRows = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
        SELECT id, name, email, country, verification_document_link,
        verified, logo_picture_link, phone_number, member_count,
        website, mission
         FROM ngo WHERE verified=$1;`,
          [false],
        )
      ).rows,
    ) as Record<string, any>[];
    const ngo: NGO[] = plainToInstance(NGO, resultRows);
    return ngo;
  }

  /**
   * Retrieves all NGO data securely, excluding confidential fields like logo and verification documents.
   * This method fetches NGO data while omitting sensitive information such as logo paths and verification document paths.
   * @param db - The database manager instance used to execute the query.
   * @returns A promise that resolves to an array of NGO objects with secure data.
   */
  static async selectSecurely(db: DatabaseManager): Promise<NGO[]> {
    const resultRows = convertKeysToCamelCase(
      (
        await db.executeQuery(`
      SELECT
        id, name, email, country, verification_document_link,
        verified, logo_picture_link, phone_number, member_count,
        website, mission
      FROM ngo;
    `)
      ).rows,
    ) as Record<string, any>[]; // Quoted column names
    const ngos: NGO[] = plainToInstance(NGO, resultRows);
    return ngos;
  }

  /**
   * Retrieves an NGO by a user's ID linked to the NGO.
   * This method finds an NGO associated with a specific user ID through the ngo_member table.
   * @param db - The database manager instance used to execute the query.
   * @param userLinkedToNGO - User ID linked to the NGO.
   * @returns A promise that resolves to an NGO object associated with the user ID.
   * @throws NGONotFoundError if no NGO is found for the user ID.
   */
  static async selectNGOByUserId(
    db: DatabaseManager,
    userLinkedToNGO: string,
  ): Promise<NGO> {
    const resultRow = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
        SELECT n.id, n.name, n.email, n.country, n.verification_document_link,
        n.verified, n.logo_picture_link, n.phone_number, n.member_count,
        n.website, n.mission
        FROM ngo n
        JOIN ngo_member m
        ON n.id = m.ngo_id
        WHERE m.user_id = $1;
        `,
          [userLinkedToNGO],
        )
      ).rows[0],
    ) as Record<string, any>;

    if (resultRow === undefined) {
      throw NGONotFoundError;
    }
    const ngo: NGO = plainToInstance(NGO, resultRow);
    return ngo;
  }

  /**
   * Retrieves one NGO by its ID.
   * This method fetches an NGO record by its ID and returns it as an NGO object.
   * @param db - The database manager instance used to execute the query.
   * @param ngoId - ID of the NGO.
   * @returns A promise that resolves to an NGO object or undefined if no record is found.
   */
  static async selectById(
    db: DatabaseManager,
    ngoId: string,
  ): Promise<NGO | undefined> {
    const result = (
      await db.executeQuery(
        `
      SELECT
        id, name, email, country,
        verified, logo_picture_link, phone_number,  member_count,
        website, mission
      FROM NGO
      WHERE id = $1;
    `,
        [ngoId],
      )
    ).rows[0];
    if (result === undefined) {
      return undefined;
    }
    const camelCasedResult: Record<string, any> =
      convertKeysToCamelCase(result);

    return plainToInstance(NGO, camelCasedResult);
  }

  /**
   * Retrieves an NGO by its name and country.
   * This method fetches an NGO record based on the provided name and country.
   * @param db - The database manager instance used to execute the query.
   * @param name - Name of the NGO.
   * @param country - Country of the NGO.
   * @returns A promise that resolves to an NGO object or undefined if no record is found.
   */
  static async selectByNameAndCountry(
    db: DatabaseManager,
    name: string,
    country: string,
  ): Promise<NGO | undefined> {
    const queryResult = await db.executeQuery(
      `SELECT id, name, country, verification_document_link, verification_document_path, verified
       FROM ngo
       WHERE name = $1 AND country = $2;`,
      [name, country],
    );

    if (queryResult.rows.length === 0) {
      return undefined;
    }

    const result = convertKeysToCamelCase(queryResult.rows[0]) as Record<
      string,
      any
    >;
    return plainToInstance(NGO, result);
  }

  /**
   * Retrieves available NGO names for filtering.
   * @param db - The database manager instance used to execute the query.
   * @returns A promise that resolves to an array of NGO names.
   */
  static async selectAvailableNGONames(db: DatabaseManager): Promise<string[]> {
    console.log(`[DEBUG] NGOQueries.selectAvailableNGONames called`);
    const result = await db.executeQuery(`
      SELECT DISTINCT name
      FROM ngo
      WHERE name IS NOT NULL AND name != ''
      ORDER BY name;
    `);

    console.log(`[DEBUG] NGO names query returned ${result.rows.length} rows`);
    const names = result.rows.map((row: any) => row.name);
    console.log(`[DEBUG] NGO names:`, names);
    return names;
  }

  /**
   * Retrieves available countries for NGO filtering.
   * @param db - The database manager instance used to execute the query.
   * @returns A promise that resolves to an array of country names.
   */
  static async selectAvailableCountries(
    db: DatabaseManager,
  ): Promise<string[]> {
    console.log(`[DEBUG] NGOQueries.selectAvailableCountries called`);
    const result = await db.executeQuery(`
      SELECT DISTINCT country
      FROM ngo
      WHERE country IS NOT NULL AND country != ''
      ORDER BY country;
    `);

    console.log(
      `[DEBUG] NGO countries query returned ${result.rows.length} rows`,
    );
    const countries = result.rows.map((row: any) => row.country);
    console.log(`[DEBUG] NGO countries:`, countries);
    return countries;
  }

  // INSERT OR UPDATE STATEMENTS

  /**
   * Inserts a new NGO into the database.
   * This method inserts a new NGO record into the database and returns a boolean indicating success.
   * @param db - The database manager instance used to execute the query.
   * @param ngo - NGO object containing the data to be inserted.
   * @returns A promise that resolves to true if the insertion was successful.
   * @throws DBInsertError if the insertion fails (e.g., duplicate ID).
   */
  static async insert(db: DatabaseManager, ngo: NGO): Promise<boolean> {
    const result: NGO = (
      await db.executeQuery(
        `INSERT INTO ngo(
           id, name, email, country, "verification_document_path", "verification_document_link",
           verified, "logo_picture_path", "logo_picture_link", "phone_number", "member_count",
           website, mission
         ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`,
        [
          ngo.id,
          ngo.name,
          ngo.email,
          ngo.country,
          ngo.verificationDocumentPath,
          ngo.verificationDocumentLink,
          ngo.verified || false,
          ngo.logoPicturePath,
          ngo.logoPictureLink,
          ngo.phoneNumber,
          ngo.memberCount,
          ngo.website,
          ngo.mission,
        ],
      )
    ).rows[0];

    if (result.name !== ngo.name) {
      throw DBInsertError;
    }
    return true;
  }

  /**
   * Verifies an NGO by its name and country.
   * This method updates the 'verified' status of an NGO to true based on name and country.
   * @param db - The database manager instance used to execute the query.
   * @param name - Name of the NGO.
   * @param country - Country of the NGO.
   * @returns A promise that resolves to void after the update.
   */
  static async updateAsVerified(
    db: DatabaseManager,
    name: string,
    country: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE ngo SET verified=$1 WHERE name=$2 AND country=$3;`,
      [true, name, country],
    );
  }

  /**
   * Updates specific fields of an NGO by its ID.
   * This method updates the email, phone number, member count, website, and mission of an NGO based on its ID.
   * @param db - The database manager instance used to execute the query.
   * @param ngoData - NGO object containing the updated data.
   * @returns A promise that resolves to void after the update.
   */
  static async updateOnId(db: DatabaseManager, ngoData: NGO): Promise<void> {
    await db.executeQuery(
      `UPDATE ngo SET
      email=$2,
      phone_number= $3,
      member_count = $4,
      website =$5,
      mission=$6
      WHERE id = $1;`,
      [
        ngoData.id,
        ngoData.email,
        ngoData.phoneNumber,
        ngoData.memberCount,
        ngoData.website,
        ngoData.mission,
      ],
    );
  }

  // DELETE STATEMENTS

  /**
   * Deletes an NGO by its email address.
   * This method removes an NGO record from the database based on the email field.
   * @param db - The database manager instance used to execute the query.
   * @param email - Email of the NGO to be deleted.
   * @returns A promise that resolves to void after the deletion.
   */
  static async deleteByEmail(db: DatabaseManager, email: string) {
    // Consider adding Promise<void> or result type
    return await db.executeQuery("DELETE FROM ngo WHERE email=$1;", [email]);
  }

  /**
   * Deletes an NGO by its name and country.
   * This method removes an NGO record from the database based on the name and country fields.
   * @param db - The database manager instance used to execute the query.
   * @param name - Name of the NGO to be deleted.
   * @param country - Country of the NGO to be deleted.
   * @returns A promise that resolves to void after the deletion.
   */
  static async deleteByNameAndCountry(
    db: DatabaseManager,
    name: string,
    country: string,
  ): Promise<void> {
    await db.executeQuery(`DELETE from ngo WHERE name=$1 AND country=$2;`, [
      name,
      country,
    ]);
  }

  /**
   * Deletes an NGO by its ID.
   * This method removes an NGO record from the database based on the ID field.
   * @param db - The database manager instance used to execute the query.
   * @param id - ID of the NGO to be deleted.
   * @returns A promise that resolves to void after the deletion.
   */
  static async deleteById(db: DatabaseManager, id: string): Promise<void> {
    await db.executeQuery("DELETE FROM ngo WHERE id=$1;", [id]);
  }

  /**
   * Deletes an NGO by its name.
   * This method removes an NGO record from the database based on the name field.
   * @param db - The database manager instance used to execute the query.
   * @param name - Name of the NGO to be deleted.
   * @returns A promise that resolves to void after the deletion.
   */
  static async deleteByName(db: DatabaseManager, name: string): Promise<void> {
    await db.executeQuery("DELETE FROM ngo WHERE name=$1;", [name]);
  }

  /**
   * Updates the logo picture path and link for an NGO by its ID.
   * This method updates the logo information of an NGO based on its ID.
   * @param db - The database manager instance used to execute the query.
   * @param ngoId - ID of the NGO.
   * @param logoPicturePath - New logo picture path.
   * @param logoPictureLink - New logo picture link.
   * @returns A promise that resolves to void after the update.
   */
  static async updateNgoLogoPic(
    db: DatabaseManager,
    ngoId: string,
    logoPicturePath: string,
    logoPictureLink: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE ngo SET
       logo_picture_path = $1,
       logo_picture_link = $2
     WHERE id = $3;`,
      [logoPicturePath, logoPictureLink, ngoId],
    );
  }

  /**
   * Deletes the logo picture path and link for an NGO by its ID.
   * This method removes the logo information from an NGO record based on its ID.
   * @param db - The database manager instance used to execute the query.
   * @param ngoId - ID of the NGO.
   * @returns A promise that resolves to void after the deletion.
   */
  static async deleteNgoLogoPic(
    db: DatabaseManager,
    ngoId: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE ngo SET
       logo_picture_link = NULL,
       logo_picture_path = NULL
     WHERE id = $1;`,
      [ngoId],
    );
  }
}

export { NGOQueries };
