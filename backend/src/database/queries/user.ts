import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import NGOMemberHours from "../../models/db-models/ngomemberhours";
import { convertKeysToCamelCase } from "../../utils/formatter";
import {
  FullNGOMember,
  NGOMemberAndUserWithHours,
} from "../../models/db-models/ngomember";
import { User } from "../../models/db-models/user";
import { TranslationManager } from "../../utils/translations-manager";
import { Weekday } from "../../models/enums";

/**
 * Class containing database query operations for user-related data
 */
class UserQueries {
  // SELECT STATEMENTS
  /**
   * Retrieves all user records from the database.
   * Executes a SQL query to fetch all user data, converts the result to camelCase,
   * and maps the data to User entity instances.
   *
   * @param db - The database manager instance used to execute the query.
   * @returns A promise that resolves to an array of User instances.
   *
   * @note This method assumes the database connection is properly configured.
   * @note The query result is converted to camelCase to match TypeScript property naming conventions.
   * @note The plainToInstance utility is used to map the result to User entity instances.
   *
   * Example SQL query executed:
   * SELECT id, first_name, last_name, email, password,
   *        profile_picture_link, profile_picture_path,
   *        phone_number, is_admin, is_ngo_user
   * FROM "user";
   */
  static async select(db: DatabaseManager): Promise<User[]> {
    // Execute the SQL query to retrieve all user records
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT id, first_name, last_name, email, password,
          profile_picture_link, profile_picture_path,
          phone_number, is_admin, is_ngo_user
          FROM "user";
        `)
      ).rows,
    ) as Record<string, any>[];

    // Map the result to User entity instances using TypeORM's plainToInstance utility
    // This converts plain JavaScript objects to fully instantiated User entities
    return plainToInstance(User, result);
  }
  /**
   * Selects a user's profile picture information
   * @param db - Database connection manager
   * @param userId - ID of the user to retrieve
   * @returns Promise resolving to User object containing profile picture data
   */
  static async selectProfilePicture(
    db: DatabaseManager,
    userId: string,
  ): Promise<User> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT
          profile_picture_link, profile_picture_path
          FROM "user"
          WHERE id= $1;
        `,
          [userId],
        )
      ).rows[0],
    ) as Record<string, any>;
    return plainToInstance(User, result);
  }

  /**
   * Selects users by email without exposing confidential data (password, profile pictures)
   * @param db - Database connection manager
   * @param email - Email address to search for
   * @returns Promise resolving to array of User objects
   */
  static async selectByEmailSecurely(
    db: DatabaseManager,
    email: string,
  ): Promise<User[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT id, first_name, last_name, email, profile_picture_link,
          phone_number, is_admin, is_ngo_user FROM "user" WHERE email = $1;`,
          [email],
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(User, result);
  }

  /**
   * Selects user ID and email from the database based on email
   * @param db - Database connection manager
   * @param email - Email address to search for
   * @returns Promise resolving to array of User objects containing id and email
   */
  static async selectUserIdByEmail(
    db: DatabaseManager,
    email: string,
  ): Promise<User[]> {
    const result = (
      await db.executeQuery('SELECT id, email FROM "user" WHERE email = $1;', [
        email,
      ])
    ).rows;
    return plainToInstance(User, result);
  }

  /**
   * Selects a user by ID without exposing confidential data (password)
   * @param db - Database connection manager
   * @param id - ID of the user to retrieve
   * @returns Promise resolving to User object or undefined if not found
   */
  static async selectByIdSecurely(
    db: DatabaseManager,
    id: string,
  ): Promise<User | undefined> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT id, first_name, last_name, email, profile_picture_link, profile_picture_path, phone_number,
          is_admin, is_ngo_user FROM "user" WHERE id = $1;`,
          [id],
        )
      ).rows[0],
    ) as Record<string, any>;
    if (result === undefined) {
      return undefined;
    }
    return plainToInstance(User, result);
  }

  /**
   * Selects a user by ID including confidential data (password, profile pictures)
   * @param db - Database connection manager
   * @param id - ID of the user to retrieve
   * @returns Promise resolving to User object or undefined if not found
   */
  static async selectByIdUnsecure(
    db: DatabaseManager,
    id: string,
  ): Promise<User | undefined> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT id, first_name, last_name, email, password, profile_picture_link,
        profile_picture_path, phone_number, is_admin, is_ngo_user FROM "User" WHERE Id = $1;`,
          [id],
        )
      ).rows[0],
    ) as Record<string, any>;
    if (result === undefined) {
      return undefined;
    }
    return plainToInstance(User, result);
  }

  /**
   * Selects a user by email including confidential data (password, profile pictures)
   * @param db - Database connection manager
   * @param email - Email address to search for

   * @returns Promise resolving to User object or undefined if not found
   */
  static async selectByEmailUnsecure(
    db: DatabaseManager,
    email: string,
  ): Promise<User | undefined> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT id, first_name, last_name, email, password, profile_picture_link,
          profile_picture_path, phone_number, is_admin, is_ngo_user FROM "user" WHERE email = $1;`,
          [email],
        )
      ).rows[0],
    ) as Record<string, any>;
    if (!result) {
      return undefined;
    }
    return plainToInstance(User, result);
  }

  /**
   * Selects all admin users without exposing confidential data
   * @param db - Database connection manager
   * @returns Promise resolving to array of User objects
   */
  static async selectAllAdminsSecurely(db: DatabaseManager): Promise<User[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT id, first_name, last_name, email, profile_picture_link, phone_number,
        is_admin, is_ngo_user FROM "user" WHERE is_admin = $1;`,
          [true],
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(User, result);
  }

  /**
   * Selects users associated with a specific NGO by name and country
   * @param db - Database connection manager
   * @param name - Name of the NGO
   * @param country - Country of the NGO
   * @returns Promise resolving to array of User objects containing email and ID
   */
  static async selectUsersByNGO(
    db: DatabaseManager,
    name: string,
    country: string,
  ): Promise<User[]> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
            SELECT u.email, u.id
            FROM "user" u
            JOIN ngo_member m ON m.user_id = u.id
            JOIN ngo n ON n.id = m.ngo_id
            WHERE n.name = $1 AND n.country = $2;
          `,
          [name, country],
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(User, result);
  }

  /**
   * Selects NGO members with their hours for a specific NGO
   * @param db - Database connection manager
   * @param ngoId - ID of the NGO
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to array of NGOMemberWithMemberHours objects
   */
  static async selectNGOMembersWithHoursByNGO(
    db: DatabaseManager,
    ngoId: string,
    tm: TranslationManager,
  ): Promise<NGOMemberAndUserWithHours[]> {
    const results = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
            SELECT
              u.id, u.first_name, u.last_name, u.email, u.profile_picture_link,u.profile_picture_path,
              u.phone_number, u.is_admin as user_is_admin, u.is_ngo_user,  m.ngo_id, m.user_id, m.is_admin as member_is_admin
              FROM "user" u
              JOIN ngo_member m ON m.user_id = u.id
              JOIN ngo n ON n.id = m.ngo_id
            WHERE n.id = $1;
          `,
          [ngoId],
        )
      ).rows,
    ) as Record<string, any>[];

    const processedResults = results.map((result) => ({
      ...result,
      isAdmin: Boolean(result.isAdmin),
    }));
    const ngoMembers: FullNGOMember[] = plainToInstance(
      FullNGOMember,
      processedResults,
    );

    if (ngoMembers.length == 0) {
      return [];
    }

    let ngoMembersWithHours: Array<NGOMemberAndUserWithHours> = [];
    for (const ngoMember of ngoMembers) {
      let results = convertKeysToCamelCase(
        (
          await db.executeQuery(
            `
            SELECT
              nmh.start_time, nmh.end_time, nmh.weekday
              FROM ngo_member_hours nmh
              JOIN ngo_member m ON m.user_id = nmh.ngo_member_id
            WHERE m.user_id = $1;
          `,
            [ngoMember.userId],
          )
        ).rows,
      ) as Record<string, any>[];
      let hours: NGOMemberHours[] = plainToInstance(NGOMemberHours, results);
      if (tm.geti18n().getLocale() !== "en") {
        // translate result
        hours = hours.map((value) => {
          value.weekday = tm.getWeekdayTranslation(value.weekday as Weekday);
          return value;
        });
      }
      let hoursWMember: NGOMemberAndUserWithHours = plainToInstance(
        NGOMemberAndUserWithHours,
        {
          ngoMember: { ...ngoMember },
          ngoMemberHours: [...hours],
        },
      );

      ngoMembersWithHours.push(hoursWMember as any);
    }
    return plainToInstance(NGOMemberAndUserWithHours, ngoMembersWithHours);
  }

  /**
   * Selects a specific NGO member with their hours
   * @param db - Database connection manager
   * @param ngoId - ID of the NGO
   * @param userId - ID of the user
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to object containing user and hours data or undefined
   */
  static async selectNGOMemberWithHoursByNGOAndUserId(
    db: DatabaseManager,
    userId: string,
    tm: TranslationManager,
  ): Promise<NGOMemberAndUserWithHours | undefined> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
              SELECT 
                u.id, u.first_name, u.last_name, u.email, u.profile_picture_link,
                 u.profile_picture_path,
                u.phone_number, u.is_admin, u.is_ngo_user, m.ngo_id, m.user_id
              FROM "user" u
              JOIN ngo_member m ON m.user_id = u.id
              WHERE m.user_id = $1;
          `,
          [userId],
        )
      ).rows[0],
    ) as Record<string, any>;

    let ngoMember: FullNGOMember = plainToInstance(FullNGOMember, result);
    if (ngoMember === undefined) {
      return undefined;
    }
    let results = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT
            nmh.start_time, nmh.end_time, nmh.weekday, nmh.ngo_member_id
          FROM ngo_member_hours AS nmh
          JOIN ngo_member AS m ON m.user_id = nmh.ngo_member_id
          WHERE m.user_id = $1;
          `,
          [userId],
        )
      ).rows,
    ) as Record<string, any>[];

    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      results = results.map((value) => {
        value.weekday = value.weekday = tm.getWeekdayTranslation(
          value.weekday as Weekday,
        );
        return value;
      });
    }

    const ngoMemberHours = plainToInstance(NGOMemberHours, results);

    return plainToInstance(NGOMemberAndUserWithHours, {
      ngoMember: { ...ngoMember },
      ngoMemberHours: ngoMemberHours,
    });
  }

  // INSERT OR UPDATE STATEMENTS

  /**
   * Inserts a new user into the database
   * @param db - Database connection manager
   * @param user - User object containing all required fields
   * @returns Promise resolving to void
   */
  static async insert(db: DatabaseManager, user: User): Promise<void> {
    await db.executeQuery(
      `INSERT INTO "user"(id, first_name, last_name, email, password,
        profile_picture_link, profile_picture_path, phone_number, is_admin, is_ngo_user)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.profilePictureLink,
        user.profilePictureLink,
        user.phoneNumber,
        user.isAdmin || false,
        user.isNgoUser || false,
      ],
    );
  }

  /** Update user profilePic
   * Updates the profile picture path and link for a specified user in the database.
   * This method ensures that the user's profile picture information is safely updated
   * using parameterized queries to prevent SQL injection vulnerabilities.
   *
   * @param db - The database manager instance used to execute the query.
   * @param userId - The unique identifier of the user whose profile picture is being updated.
   * @param profilePicturePath - The local path to the user's profile picture.
   * @param profilePictureLink - The URL link to the user's profile picture.
   * @returns A Promise that resolves when the update operation is complete.
   */
  static async updateUserProfilePic(
    db: DatabaseManager,
    userId: string,
    profilePicturePath: string,
    profilePictureLink: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE "user" SET
        profile_picture_path = $1,
        profile_picture_link = $2
      WHERE id = $3;`,
      [profilePicturePath, profilePictureLink, userId],
    );
  }

  /** Update user details
   * Updates the first name, last name, and phone number of a specified user in the database.
   * This method ensures that the user's basic information is safely updated
   * using parameterized queries to prevent SQL injection vulnerabilities.
   *
   * @param db - The database manager instance used to execute the query.
   * @param user - The User object containing the updated information.
   * @returns A Promise that resolves when the update operation is complete.
   */
  static async update(db: DatabaseManager, user: User): Promise<void> {
    await db.executeQuery(
      `
      UPDATE "user" SET
        first_name = $1,
        last_name = $2,
        phone_number = $3
      WHERE id = $4;
      `,
      [user.firstName, user.lastName, user.phoneNumber, user.id],
    );
  }

  // DELETE STATEMENTS

  /**
   * Deletes a user by email
   * @param db - Database connection manager
   * @param email - Email address of the user to delete
   * @returns Promise resolving to void
   */
  static async deleteByEmail(
    db: DatabaseManager,
    email: string,
  ): Promise<void> {
    await db.executeQuery(`DELETE FROM "user" WHERE email=$1;`, [email]);
  }

  /**
   * Deletes a user by ID
   * @param db - Database connection manager
   * @param id - ID of the user to delete
   * @returns Promise resolving to void
   */
  static async deleteById(db: DatabaseManager, id: string): Promise<void> {
    await db.executeQuery(`DELETE FROM "user" WHERE id=$1;`, [id]);
  }

  /**
   * Deletes a user's profile picture by setting both the external link and local path to NULL in the database.
   * This operation permanently removes the association of the profile picture with the user.
   *
   * @param db - The database manager instance used to execute the SQL query.
   * @param userId - The unique identifier of the user whose profile picture will be deleted.
   * @returns A Promise that resolves when the operation is complete.
   *
   * @remarks
   * - This function directly modifies the database and should be used with caution.
   * - The SQL query ensures both `profile_picture_link` and `profile_picture_path` are set to NULL,
   *   effectively removing the reference to the profile picture.
   * - The function assumes the `user` table contains the columns `profile_picture_link` and `profile_picture_path`.
   * - The `userId` parameter is expected to be a valid string representing a user ID in the database.
   *
   * @example
   * // Example usage:
   * await UserFunctions.deleteUserProfilePic(db, 'user123');
   */
  static async deleteUserProfilePic(
    db: DatabaseManager,
    userId: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE "user" SET
     profile_picture_link = NULL,
     profile_picture_path = NULL
    WHERE id = $1;`,
      [userId],
    );
  }
}

export { UserQueries };
