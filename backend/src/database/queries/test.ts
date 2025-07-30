import { DatabaseManager } from "../db";

class TestQueries {
  static async insertTest(db: DatabaseManager, id: number, test: string) {
    db.executeQuery(`INSERT INTO test (id, test) VALUES ($1, $2)`, [id, test]);
  }

  static async selectTest(db: DatabaseManager) {
    return (await db.executeQuery(`SELECT (id, test) FROM test;`)).rows;
  }
}

export { TestQueries };
