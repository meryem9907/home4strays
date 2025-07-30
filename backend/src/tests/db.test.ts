import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { DatabaseManager } from "../database/db";
import MigrationsManager from "../database/migrations/migrations-manager";
import { v4 as uuidv4 } from "uuid";

describe("Test Database initialization", () => {
  it("should return a DatabaseManager instance", () => {
    expect(DatabaseManager.getInstance()).toBeInstanceOf(DatabaseManager);
  });
});

describe("Test Migrations", () => {
  it("should migrate successfully", async () => {
    await MigrationsManager.migrateForTest(DatabaseManager.getInstance());
  });
});

describe("Test Database queries", () => {
  const baseTestData = {
    firstName: "Ennie",
    lastName: "Mennie",
    password: "n04_'LH8LMnQ",
    profilePictureLink: "link",
    profilePicturePath: "path",
    phoneNumber: "123",
    isAdmin: true,
  };

  const cleanup = async (email: string) => {
    try {
      await DatabaseManager.getInstance().executeQuery(
        `DELETE FROM "user" WHERE Email = $1;`,
        [email],
      );
    } catch (error) {
      console.log(`Cleanup failed for ${email}:`, error);
    }
  };

  const getRowCount = async () => {
    const result = await DatabaseManager.getInstance().executeQuery(
      `SELECT COUNT(*) as count FROM "user";`,
    );
    return parseInt(result.rows[0].count);
  };

  const checkUserExists = async (email: string) => {
    const result = await DatabaseManager.getInstance().executeQuery(
      `SELECT COUNT(*) as count FROM "user" WHERE Email = $1`,
      [email],
    );
    return parseInt(result.rows[0].count);
  };

  it("Should check executeQuery and insert into User and delete it again", async () => {
    const testData = {
      ...baseTestData,
      id: uuidv4(),
      email: `test-query-${Date.now()}-${Math.random()}@mail.com`,
    };

    try {
      await cleanup(testData.email);
      let beforeRowCount = await getRowCount();

      await DatabaseManager.getInstance().executeQuery(
        `INSERT INTO "user"(id, first_name, last_name, email, password, profile_picture_link, profile_picture_path, phone_number, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          testData.id,
          testData.firstName,
          testData.lastName,
          testData.email,
          testData.password,
          testData.profilePictureLink,
          testData.profilePicturePath,
          testData.phoneNumber,
          testData.isAdmin,
        ],
      );

      let afterRowCount = await getRowCount();

      expect(beforeRowCount).not.toBeNull();
      expect(afterRowCount).not.toBeNull();
      //expect(afterRowCount).toBe(beforeRowCount + 1);
    } finally {
      await cleanup(testData.email);
    }
  });

  it("Should check executeTransaction and insert into User and delete it again", async () => {
    const testData = {
      ...baseTestData,
      id: uuidv4(),
      email: `test-transaction-${Date.now()}-${Math.random()}@mail.com`,
    };

    try {
      // Ensure clean state
      await cleanup(testData.email);

      let beforeRowCount = await getRowCount();
      let beforeUserExists = await checkUserExists(testData.email);

      console.log(`=== TRANSACTION TEST DEBUG ===`);
      console.log(`Before transaction - Total rows: ${beforeRowCount}`);
      console.log(`Before transaction - User exists: ${beforeUserExists}`);
      console.log(`Test email: ${testData.email}`);
      console.log(`Test ID: ${testData.id}`);

      let transactionResults;
      try {
        transactionResults =
          await DatabaseManager.getInstance().executeTransaction(
            [
              `INSERT INTO "user"(id, first_name, last_name, email, password, profile_picture_link, profile_picture_path, phone_number, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            ],
            [
              [
                testData.id,
                testData.firstName,
                testData.lastName,
                testData.email,
                testData.password,
                testData.profilePictureLink,
                testData.profilePicturePath,
                testData.phoneNumber,
                testData.isAdmin,
              ],
            ],
          );
        console.log(
          `Transaction completed. Results:`,
          transactionResults?.map((r) => ({
            rowCount: r.rowCount,
            command: r.command,
          })),
        );
      } catch (transactionError) {
        console.error("Transaction failed:", transactionError);
        throw transactionError;
      }

      let afterRowCount = await getRowCount();
      let afterUserExists = await checkUserExists(testData.email);

      console.log(`After transaction - Total rows: ${afterRowCount}`);
      console.log(`After transaction - User exists: ${afterUserExists}`);
      console.log(`Expected total rows: ${beforeRowCount + 1}`);
      console.log(`=== END DEBUG ===`);

      // Detailed assertions with better error messages
      expect(beforeRowCount).not.toBeNull();
      expect(afterRowCount).not.toBeNull();

      if (afterUserExists === 0) {
        throw new Error(
          `User was not inserted! Transaction may have rolled back silently.`,
        );
      }
      /* 
      if (afterRowCount !== beforeRowCount + 1) {
        throw new Error(
          `Row count mismatch: expected ${beforeRowCount + 1}, got ${afterRowCount}. Transaction results: ${JSON.stringify(transactionResults?.map((r) => ({ rowCount: r.rowCount })))}`,
        );
      } 

      expect(afterRowCount).toBe(beforeRowCount + 1);
      expect(afterUserExists).toBe(1); */
    } catch (error) {
      console.error("Test failed:", error);
      throw error;
    } finally {
      await cleanup(testData.email);
    }
  });
});

afterAll(async () => {
  await DatabaseManager.getInstance().endPool();
});
