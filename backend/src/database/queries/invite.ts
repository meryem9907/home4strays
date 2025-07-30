import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import { InviteNGO } from "../../models/db-models/invite";
import { convertKeysToCamelCase } from "../../utils/formatter";

/**
 * A class containing database query operations for managing invites.
 * This class provides static methods to interact with the invite table in the database.
 */
class InviteQueries {
  /**
   * Creates a new invite record in the database.
   * This method inserts a new invite into the invite table. If an invite with the same ngo_id and email already exists, it updates the invite token.
   * @param db - The database manager instance used to execute the query.
   * @param userId - The unique identifier of the user creating the invite.
   * @param ngoId - The unique identifier of the NGO associated with the invite.
   * @param invite - The unique invite token generated for the user.
   * @param email - The email address of the user associated with the invite.
   */
  static async createInvite(
    db: DatabaseManager,
    userId: string,
    ngoId: string,
    invite: string,
    email: string,
  ) {
    await db.executeQuery(
      `INSERT into invite(user_id, ngo_id, invite, email) VALUES ($1, $2, $3, $4) ON CONFLICT(ngo_id, email) DO UPDATE SET invite = $3;`,
      [userId, ngoId, invite, email],
    );
  }

  /**
   * Retrieves all invites associated with a specific NGO.
   * This method fetches invite records from the database for the given NGO ID, converts the keys to camelCase, and returns them as InviteNGO instances.
   * @param db - The database manager instance used to execute the query.
   * @param ngoId - The unique identifier of the NGO for which to retrieve invites.
   * @returns An array of InviteNGO instances representing the retrieved invites.
   */
  static async getInvites(db: DatabaseManager, ngoId: string) {
    const ngo = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT user_id, ngo_id, email FROM invite WHERE ngo_id=$1;`,
          [ngoId],
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(InviteNGO, ngo);
  }

  /**
   * Deletes an invite record from the database.
   * This method removes an invite record based on the provided NGO ID and email address.
   * @param db - The database manager instance used to execute the query.
   * @param ngoId - The unique identifier of the NGO associated with the invite.
   * @param email - The email address of the user associated with the invite.
   */
  static async deleteInvite(
    db: DatabaseManager,
    ngoId?: string,
    email?: string,
  ) {
    await db.executeQuery(`DELETE FROM invite WHERE ngo_id=$1 AND email=$2;`, [
      ngoId,
      email,
    ]);
  }

  /**
   * Retrieves an invite record by its unique token.
   * This method fetches an invite record from the database using the invite token, converts the keys to camelCase, and returns it as an InviteNGO instance.
   * @param db - The database manager instance used to execute the query.
   * @param invite - The unique invite token used to identify the record.
   * @returns An InviteNGO instance representing the retrieved invite.
   */
  static async getInvite(db: DatabaseManager, invite: string) {
    const ngo = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT user_id, ngo_id, email FROM invite WHERE invite=$1;`,
          [invite],
        )
      ).rows,
    ) as Record<string, any>[];
    return plainToInstance(InviteNGO, ngo);
  }
}

export { InviteQueries };
