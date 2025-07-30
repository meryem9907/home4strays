import { InitialMigration } from "./initial-migration";
import { FullTextSearchIndizesMigration } from "./create-fulltext-search-indizes-migration";
import { InvitesMigration } from "./invites";
import { DatabaseManager } from "../db";
import { MockDataMigrations } from "./mock-data-migration";
/**
 * Manages database migrations for application setup and data consistency.
 * This class orchestrates the execution of migration scripts in a defined order,
 * supporting both full migration workflows and test-specific migration scenarios.
 * It ensures database schema evolution while maintaining compatibility with
 * different environments and use cases.
 */
export default class MigrationsManager {
  /**
   * Array of all database migrations to be executed during a full migration.
   * This includes core migrations for schema creation, full-text search indices,
   * invite functionality, and mock data setup.
   *
   * @type {Migration[]}
   */
  private static migrations = [
    new InitialMigration(),
    new FullTextSearchIndizesMigration(),
    new InvitesMigration(),
    new MockDataMigrations(),
  ];

  /**
   * Array of database migrations to be executed during test environments.
   * This excludes mock data migrations to ensure test databases remain clean
   * and focused on core functionality validation.
   *
   * @type {Migration[]}
   */
  private static migrationsForTest = [
    new InitialMigration(),
    new FullTextSearchIndizesMigration(),
    new InvitesMigration(),
  ];

  /**
   * Executes all registered migrations in sequence to update the database schema.
   * This method is typically used during application initialization to ensure
   * the database is in a consistent and up-to-date state.
   *
   * @param db - DatabaseManager instance that provides database connection
   * @returns Promise that resolves when all migrations have completed successfully
   */
  static async migrateAll(db: DatabaseManager) {
    for (let migration of this.migrations) {
      await migration.migrate(db);
    }
  }

  /**
   * Reverts all migrations in reverse order to rollback database schema changes.
   * This method is useful for testing or when manual schema adjustments are needed.
   *
   * @param db - DatabaseManager instance that provides database connection
   * @returns Promise that resolves when all rollbacks have completed successfully
   */
  static async rollbackAll(db: DatabaseManager) {
    for (let migration of this.migrations) {
      await migration.rollback(db);
    }
  }

  /**
   * Executes migrations specific to test environments, excluding mock data setup.
   * This method ensures test databases are initialized with core functionality
   * without including mock data that could interfere with test scenarios.
   *
   * @param db - DatabaseManager instance that provides database connection
   * @returns Promise that resolves when all test migrations have completed successfully
   */
  static async migrateForTest(db: DatabaseManager) {
    for (let migration of this.migrationsForTest) {
      await migration.migrate(db);
    }
  }

  /**
   * Reverts migrations specific to test environments, excluding mock data.
   * This method is used to clean up test databases after test execution,
   * ensuring they return to their original state without mock data remnants.
   *
   * @param db - DatabaseManager instance that provides database connection
   * @returns Promise that resolves when all test rollbacks have completed successfully
   */
  static async rollbackForTest(db: DatabaseManager) {
    for (let migration of this.migrationsForTest) {
      await migration.rollback(db);
    }
  }
}
