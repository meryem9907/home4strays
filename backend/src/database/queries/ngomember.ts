import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import {
  NGOMember,
  NGOMemberAndUserWithHours,
} from "../../models/db-models/ngomember";
import { convertKeysToCamelCase } from "../../utils/formatter";
import {
  IdNotFoundError,
  NGOMemberNotFoundError,
  NGOMembersNotFoundError,
} from "../../utils/errors";

/**
 * Class containing all database query operations related to NGO members.
 * This class provides methods to interact with the ngo_member table,
 * including select, insert, update, and delete operations.
 */
class NGOMemberQueries {
  /**
   * Retrieves all NGO members from the database.
   * @param db - DatabaseManager instance used to execute the query.
   * @returns A Promise that resolves to an array of NGOMember objects.
   */
  static async select(db: DatabaseManager): Promise<NGOMember[]> {
    const result: Record<string, any>[] = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT user_id, ngo_id,is_admin FROM ngo_member;`,
        )
      ).rows,
    );
    return plainToInstance(NGOMember, result);
  }

  /**
   * Retrieves an NGO member by their email address.
   * @param db - DatabaseManager instance used to execute the query.
   * @param email - Email address of the NGO member to retrieve.
   * @returns A Promise that resolves to an NGOMember object or null if not found.
   * @throws NGOMemberNotFoundError if no member is found with the given email.
   */
  static async selectNGOMemberByEmail(
    db: DatabaseManager,
    email: string,
  ): Promise<NGOMember | null> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT user_id, ngo_id, is_admin FROM ngo_member WHERE email = $1;`,
          [email],
        )
      ).rows[0],
    ) as Record<string, any>;
    const ngoMember: NGOMember = plainToInstance(NGOMember, result);
    if (ngoMember === undefined) {
      throw NGOMemberNotFoundError;
    }
    return ngoMember;
  }

  /**
   * Counts the total number of NGO members associated with a given NGO ID.
   *
   * @param db - An instance of the DatabaseManager to execute the query.
   * @param ngoId - The unique identifier of the NGO whose members are to be counted.
   * @returns A promise that resolves to the number of members associated with the specified NGO..
   */
  static async countNGOMemberByNGOId(
    db: DatabaseManager,
    ngoId: string,
  ): Promise<number> {
    const result = await db.executeQuery(
      `SELECT COUNT(*) AS total FROM ngo_member WHERE ngo_id = $1;`,
      [ngoId],
    );
    return result.rows[0].total;
  }

  /** selects NGO member by id */
  /**
   * Retrieves an NGO member by their user ID.
   * @param db - DatabaseManager instance used to execute the query.
   * @param userId - User ID of the NGO member to retrieve.
   * @returns A Promise that resolves to an NGOMember object.
   */
  static async selectNGOMemberById(
    db: DatabaseManager,
    userId: string,
  ): Promise<NGOMember | undefined> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT user_id, ngo_id, is_admin FROM ngo_member WHERE user_id = $1;`,
          [userId],
        )
      ).rows[0],
    ) as Record<string, any>;

    const ngoMember: NGOMember = plainToInstance(NGOMember, result);
    if (ngoMember === undefined) {
      return undefined;
    }
    return ngoMember;
  }

  /**
   * Inserts a new NGO member into the database.
   * @param db - DatabaseManager instance used to execute the query.
   * @param ngoMember - NGOMember object containing the data to insert.
   * @returns A Promise that resolves to void.
   */
  static async insert(
    db: DatabaseManager,
    ngoMember: NGOMember,
  ): Promise<void> {
    await db.executeQuery(
      "INSERT INTO ngo_member(user_id, ngo_id, is_admin) VALUES($1, $2, $3);",
      [ngoMember.userId, ngoMember.ngoId, ngoMember.isAdmin],
    );
  }

  /** Updates the NGOId of an NGOmember based on userId */
  static async updateNGOAssociationMemberById(
    db: DatabaseManager,
    userId: string,
    ngoMember: NGOMember,
  ): Promise<void> {
    await db.executeQuery(`UPDATE ngo_member SET ngo_id=$2 WHERE user_id=$1;`, [
      userId,
      ngoMember.ngoId,
    ]);
  }

  /**
   * Deletes an NGO member by their email address.
   * @param db - DatabaseManager instance used to execute the query.
   * @param email - Email address of the NGO member to delete.
   * @returns A Promise that resolves to void.
   */
  static async deleteNGOMemberByEmail(
    db: DatabaseManager,
    email: string,
  ): Promise<void> {
    await db.executeQuery(`DELETE FROM ngo_member WHERE email = $1 ;`, [email]);
  }

  /**
   * Deletes an NGO member by their user ID and NGO ID.
   * @param db - DatabaseManager instance used to execute the query.
   * @param userId - User ID of the NGO member to delete.
   * @param ngoId - NGO ID of the NGO member to delete.
   * @returns A Promise that resolves to void.
   */
  static async deleteNGOMemberById(
    db: DatabaseManager,
    userId: string,
    ngoId: string,
  ): Promise<void> {
    await db.executeQuery(
      `DELETE FROM ngo_member WHERE user_id = $1 AND ngo_id =$2;`,
      [userId, ngoId],
    );
  }

  /** Delete ngo member by id of ngo user */
  static async deleteNGOMemberByUserId(
    db: DatabaseManager,
    userId: string,
  ): Promise<void> {
    await db.executeQuery(`DELETE FROM ngo_member WHERE user_id = $1;`, [
      userId,
    ]);
  }

  static async getNGOMember(
    db: DatabaseManager,
    userId: string,
  ): Promise<NGOMember[]> {
    const result = (
      await db.executeQuery(
        "SELECT user_id, ngo_id, is_admin from ngo_member WHERE user_id=$1;",
        [userId],
      )
    ).rows;
    return plainToInstance(NGOMember, result);
  }

  /**
   * Retrieves a list of users and their associated NGO member details by email.
   * This method performs a JOIN between the "user" and ngo_member tables.
   * @param db - DatabaseManager instance used to execute the query.
   * @param email - Email address of the user to filter results by.
   * @returns A Promise that resolves to an array of NGOMemberAndUser objects.
   */
  static async getUserAndNGOMember(
    db: DatabaseManager,
    email: string,
  ): Promise<NGOMemberAndUserWithHours> {
    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT u.id, u.first_name , u.last_name, u.email, n.user_id,  n.ngo_id, n.is_admin
            FROM ngo_member n RIGHT JOIN "user" u ON n.user_id = u.id
            WHERE u.email = $1`,
          [email],
        )
      ).rows[0],
    ) as Record<string, any>;
    const results: NGOMemberAndUserWithHours = plainToInstance(
      NGOMemberAndUserWithHours,
      { ngoMember: { ...result }, ngoMemberHours: undefined },
    );
    return results;
  }

  /**
   * Checks if a user exists as an NGO member in the database.
   * @param db - DatabaseManager instance used to execute the query.
   * @param userId - User ID to check for existence.
   * @returns A Promise that resolves to a boolean indicating if the user exists.
   */
  static async existsByUserId(
    db: DatabaseManager,
    userId: string,
  ): Promise<boolean> {
    const result = await db.executeQuery(
      `SELECT 1 FROM ngo_member WHERE user_id = $1;`,
      [userId],
    );
    return result.rows.length > 0;
  }
}

export { NGOMemberQueries };
