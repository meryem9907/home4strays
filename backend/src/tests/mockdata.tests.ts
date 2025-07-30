import { describe, it, afterAll, beforeAll, expect, test } from "vitest";
import { DatabaseManager } from "../database/db";
import { PetQueries } from "../database/queries/pet";
import { Pet } from "../models/db-models/pet";
import { TranslationManager } from "../utils/translations-manager";

/** Bitte seperat testen sonst kollidieren die Tests */
describe("Test mockdata availability", () => {
  let db: DatabaseManager;
  let tm = TranslationManager.getInstance();
  tm.setLocale("en");

  beforeAll(async () => {
    db = DatabaseManager.getInstance();
    await db.migrate();
  });

  it("Test selecting data", async () => {
    const pets: Pet[] = await PetQueries.select(db, tm);
    expect(pets.length).toBe(8);
  });
});
