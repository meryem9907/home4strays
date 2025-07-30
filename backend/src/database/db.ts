import { Client, Pool, QueryResult } from "pg";
import MigrationsManager from "./migrations/migrations-manager";
import { getSecret } from "../utils/secret-manager";
import * as changeCase from "change-case";

/**
 * Manages PostgreSQL database connections and operations with support for migrations, transactions, and query execution.
 * This class implements a singleton pattern to ensure a single instance of the database connection pool.
 */
class DatabaseManager {
  /**
   * Singleton instance of DatabaseManager
   * @private
   */
  private static instance: DatabaseManager;

  /**
   * PostgreSQL connection pool
   * @private
   */
  private pool: Pool;

  /**
   * Private constructor to enforce singleton pattern
   * Initializes the connection pool with configuration values from environment secrets
   * @param {Object} [options] - Optional configuration overrides
   */
  private constructor() {
    this.pool = new Pool({
      connectionTimeoutMillis: 10000, // Increased to 10 seconds for better timeout handling
      idleTimeoutMillis: 30000, // Increased to 30 seconds for connection idle timeout
      max: 10, // Limit concurrent connections to prevent resource exhaustion
      user: getSecret("DB_USER", "postgres"),
      host: getSecret("DB_HOST", "127.0.0.1"),
      database: getSecret("DB_DATABASE", "postgres"),
      password: getSecret("DB_PASSWORD"),
      port: 5432,
    });

    /**
     * Custom event handler for PostgreSQL connection establishment
     * Converts snake_case field names to camelCase for consistent data representation
     */
    this.pool.on("connect", (client: any) => {
      client.connection.on("rowDescription", (msg: any) => {
        for (const field of msg.fields) {
          field.name = changeCase.camelCase(field.name);
        }
        client.activeQuery.handleRowDescription(msg);
      });
    });

    /**
     * Error handling for database pool issues
     * Logs errors to console for monitoring and debugging
     */
    this.pool.on("error", (err: Error) => {
      console.error("Database pool error:", err);
    });
  }

  /**
   * Gets the singleton instance of DatabaseManager
   * @returns {DatabaseManager} The singleton instance
   */
  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Executes a single SQL query with parameter binding
   * @param {string} sqlCommand - SQL query string
   * @param {Array} [values] - Array of parameter values
   * @returns {Promise<QueryResult>} Promise resolving to query result
   * @throws {Error} If query execution fails
   */
  public executeQuery = async (
    sqlCommand: string,
    values: Array<string | number | boolean | any> = [],
  ) => {
    const connection = await this.pool.connect();
    try {
      const result = await connection.query(sqlCommand, values);
      return result;
    } catch (error) {
      console.error("Query error:", error);
      console.error("SQL:", sqlCommand);
      console.error("Values:", values);
      throw error;
    } finally {
      connection.release();
    }
  };

  /**
   * Executes a transaction with multiple SQL commands
   * @param {Array<string>} sqlCommands - Array of SQL commands to execute
   * @param {Array<Array>} [values] - Array of parameter arrays for each command
   * @returns {Promise<Array<QueryResult>>} Promise resolving to array of query results
   * @throws {Error} If any command in the transaction fails
   */
  public executeTransaction = async (
    sqlCommands: Array<string>,
    values: Array<Array<string | number | boolean | any>> = [],
  ) => {
    const connection = await this.pool.connect();
    try {
      await connection.query("BEGIN");
      const results = [];
      for (const [index, command] of sqlCommands.entries()) {
        const params = values[index] ?? [];
        try {
          const result = await connection.query(command, params);
          results.push(result);
        } catch (error) {
          console.error(`Transaction error at command ${index}:`, error);
          console.error("SQL:", command);
          console.error("Values:", params);
          throw error;
        }
      }
      await connection.query("COMMIT");
      return results;
    } catch (e) {
      try {
        await connection.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
      throw e;
    } finally {
      connection.release();
    }
  };

  /**
   * Executes a query with a timeout constraint
   * @param {string} sqlCommand - SQL query string
   * @param {Array} [values] - Array of parameter values
   * @param {number} [timeoutMs=5000] - Maximum time in milliseconds to wait for query execution
   * @returns {Promise<QueryResult>} Promise resolving to query result
   * @throws {Error} If query execution exceeds timeout or fails
   */
  public executeQueryWithTimeout = async (
    sqlCommand: string,
    values: Array<string | number | boolean | any> = [],
    timeoutMs: number = 5000,
  ) => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), timeoutMs),
    );

    return Promise.race([
      this.executeQuery(sqlCommand, values),
      timeoutPromise,
    ]);
  };

  /**
   * Runs all database migrations
   * @param {Object} [options] - Optional migration configuration
   * @returns {Promise<void>} Promise that resolves when migrations complete
   */
  public async migrate() {
    await MigrationsManager.migrateAll(this);
  }

  /**
   * Rolls back all database migrations
   * @param {Object} [options] - Optional rollback configuration
   * @returns {Promise<void>} Promise that resolves when rollbacks complete
   */
  public async rollback() {
    await MigrationsManager.rollbackAll(this);
  }

  /**
   * Runs test-specific database migrations
   * @param {Object} [options] - Optional test migration configuration
   * @returns {Promise<void>} Promise that resolves when test migrations complete
   */
  public async migrateForTest() {
    await MigrationsManager.migrateForTest(this);
  }

  /**
   * Rolls back test-specific database migrations
   * @param {Object} [options] - Optional test rollback configuration
   * @returns {Promise<void>} Promise that resolves when test rollbacks complete
   */
  public async rollbackForTest() {
    await MigrationsManager.rollbackForTest(this);
  }

  /**
   * Gracefully ends the database connection pool
   * @returns {Promise<void>} Promise that resolves when pool is closed
   */
  async endPool(): Promise<void> {
    console.log("Starting to end pool...");
    try {
      // Wait for all connections to be idle before shutting down
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await this.pool.end();
      console.log("Pool ended successfully");
    } catch (err) {
      console.error("Error ending pool:", err);
      // Force close if graceful shutdown fails
      try {
        this.pool.end();
      } catch (forceErr) {
        console.error("Force close error:", forceErr);
      }
    }
  }

  /**
   * Gets current status of the database connection pool
   * @returns {Object} Object containing pool statistics
   * @property {number} totalCount - Total number of connections
   * @property {number} idleCount - Number of idle connections
   * @property {number} waitingCount - Number of waiting connections
   */
  public getPoolStatus() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

export { DatabaseManager };
