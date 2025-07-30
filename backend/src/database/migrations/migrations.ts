import { DatabaseManager } from "../db";
/**
 * Module containing the core migration interface for database schema management
 * This module defines the contract for database migration operations that
 * implementers must adhere to when creating migration classes
 */
/* Migrations */
/**
 * Migration interface defining the contract for database migration operations
 * Implementations must provide both forward and reverse migration capabilities
 * to ensure database schema can be evolved and rolled back safely
 */
export default interface Migration {
  /**
   * Applies the migration to the database
   * This method should implement the logic to modify the database schema
   * according to the migration's requirements
   * @param db - DatabaseManager instance providing access to database operations
   */
  migrate(db: DatabaseManager): void;

  /**
   * Reverts the migration changes to the database
   * This method should implement the logic to undo the changes made by the
   * migrate method, restoring the database to its previous state
   * @param db - DatabaseManager instance providing access to database operations
   */
  rollback(db: DatabaseManager): void;
}
