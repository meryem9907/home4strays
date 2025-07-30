import Migration from "./migrations";
import { DatabaseManager } from "../db";
import { PostgresError } from "pg-error-enum";
import { Error as CustomError } from "../../utils/errors";
import * as emoji from "node-emoji";
import { red, green, cyan } from "console-log-colors";
import format from "pg-format";

/**
 * Represents a database migration for managing invite-related tables.
 * This class handles the creation, migration, and rollback operations for the invite table.
 */
class InvitesMigration implements Migration {
  /**
   * Creates the invite table with specified schema.
   * This method constructs the SQL statement for creating the invite table
   * with columns for user_id, ngo_id, invite, and email, including foreign key constraints.
   *
   * @param db - The database manager instance used to execute the migration.
   * @param migrations - An array to collect the SQL statements for the migration.
   */
  createInviteTable(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS invite (
            user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
            ngo_id UUID REFERENCES ngo(id) ON DELETE CASCADE,
            invite UUID DEFAULT gen_random_uuid() NOT NULL,
            email VARCHAR(254) NOT NULL,
            PRIMARY KEY(ngo_id, email));`);
  }

  /**
   * Executes the migration for the invite table.
   * This method handles the transactional migration process, including
   * creating the invite table and handling any errors that occur during migration.
   *
   * @param db - The database manager instance used to execute the migration.
   */
  async migrate(db: DatabaseManager) {
    console.log(
      cyan(
        emoji.emojify(":rocket: [Migrations] migrating Invites", {
          fallback: "",
        }),
      ),
    );
    let migrations: Array<string> = [];
    this.createInviteTable(db, migrations);

    try {
      await db.executeTransaction(migrations, []);

      console.log(
        green(
          emoji.emojify(":ok: [Migrations] migrated Invites succesfully", {
            fallback: "",
          }),
        ),
      );
    } catch (e) {
      console.error(
        red(
          emoji.emojify(
            ":boom: [Migrations] Could not migrate the Invites database tables! THIS IS CRITIAL!\n" +
              e,
            { fallback: "" },
          ),
        ),
      );
    }
  }

  /**
   * Rolls back the migration by dropping the invite table.
   * This method is used to revert the database schema to its previous state
   * by removing the invite table if it exists.
   *
   * @param db - The database manager instance used to execute the rollback.
   */
  async rollback(db: DatabaseManager) {
    await db.executeQuery(`DROP TABLE invites;`);
  }
}

export { InvitesMigration };
