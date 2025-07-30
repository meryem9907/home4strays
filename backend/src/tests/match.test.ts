import request from "supertest";
import { describe, it, afterAll, beforeAll, expect, test } from "vitest";
import { deleteMatchSetup, setupMatchData } from "./utils/setup-match-data";
import { DatabaseManager } from "../database/db";
import { server } from "../app";
import http from "http";
import {
  calculateMatchScore,
  matchAvailableTime,
  matchCastration,
  matchExperience,
  matchHolidayCare,
  matchKidsAllowd,
  matchLocality,
  matchMinimumSpace,
  matchVaccination,
  matchZip,
} from "../utils/match.service";
import { startTestServer } from "./utils/test-server";
import { Pet } from "../models/db-models/pet";
import { Caretaker } from "../models/db-models/caretaker";
import { TranslationManager } from "../utils/translations-manager";

describe("Test match function", () => {
  let db: DatabaseManager;
  let p1!: Pet;
  let p2!: Pet;
  let p3!: Pet;
  let p4!: Pet;
  let c1!: Caretaker;
  let c2!: Caretaker;
  let c3!: Caretaker;
  let c4!: Caretaker;
  let ctToken!: string;
  let ngoMemberToken!: string;
  let unverifiedNgoMemberToken!: string;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  let tm = TranslationManager.getInstance();
  tm.setLocale("en");
  beforeAll(async () => {
    try {
      testServer = startTestServer(server, "3005");
      db = DatabaseManager.getInstance();

      console.log("Testing database connectivity...");
      try {
        await db.executeQuery("SELECT 1");
        console.log("Database connection successful.");
      } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error(
          "Database is not accessible. Please ensure PostgreSQL is running and environment variables are set correctly.",
        );
      }

      console.log("Starting migrations for tests...");
      await db.migrateForTest();
      console.log("Migrations completed.");

      console.log("Setting up test data...");
      let {
        pet1,
        pet2,
        pet3,
        pet4,
        ct1,
        ct2,
        ct3,
        ct4,
        ctToken1,
        ngoMToken,
        unverNGOMToken,
      } = await setupMatchData(db, testServer, tm);
      p1 = pet1;
      p2 = pet2;
      p3 = pet3;
      p4 = pet4;
      c1 = ct1;
      c2 = ct2;
      c3 = ct3;
      c4 = ct4;
      ctToken = ctToken1;
      ngoMemberToken = ngoMToken;
      unverifiedNgoMemberToken = unverNGOMToken;
      console.log("Test data setup completed.");
    } catch (error) {
      console.error("Error in beforeAll setup:", error);
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    try {
      console.log("Starting test cleanup...");
      await deleteMatchSetup(db);
      console.log("Test data cleanup completed.");

      await db.endPool();
      console.log("Database pool closed.");

      await new Promise<void>((resolve) => {
        testServer.close(() => {
          console.log("Test server closed.");
          resolve();
        });
      });
    } catch (error) {
      console.error("Error in afterAll cleanup:", error);
    }
  }, 15000);

  it("Test successfull match results", async () => {
    const score1 = await calculateMatchScore(p1, c1, tm);
    expect(score1).toBeCloseTo(77.78, 1);
    const score2 = await calculateMatchScore(p2, c2, tm);
    expect(score2).toBeCloseTo(33.33, 1);
    const score3 = await calculateMatchScore(p3, c3, tm);
    expect(score3).toBeCloseTo(44.44, 1);
    const score4 = await calculateMatchScore(p4, c4, tm);
    expect(score4).toBeCloseTo(33.33, 1);
  });

  it("Test matching zip", async () => {
    let score = 0;
    score = matchZip(score, p1.zipRequirement!, c1.zip); // "10115" ~ "10115"
    expect(score).toBeCloseTo(11.11, 1);
    score = matchZip(score, p1.zipRequirement!, c2.zip); // "10115" ~ "20095",
    expect(score).toBeCloseTo(11.11, 1);
    score = matchZip(score, p1.zipRequirement!, c3.zip); // "10115" ~ "10225",
    expect(score).toBeCloseTo(22.22, 1);
  });

  it("Test matching locality", async () => {
    let score = 0;
    score = matchLocality(score, p2.localityTypeRequirement!, c3.localityType); // Rural vs. Rural
    expect(score).toBeCloseTo(11.11, 1);
    score = matchLocality(score, p2.localityTypeRequirement!, c1.localityType); // Rural vs. Urban
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test matching experience", async () => {
    let score = 0;
    score = matchExperience(score, p1.experienceRequirement!, c3.experience); // ">5 Years" vs. ">5 Years"
    expect(score).toBeCloseTo(11.11, 1);
    score = matchExperience(score, p1.experienceRequirement!, c4.experience); // ">5 Years" vs. ">2 Years"
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test matching minimum space", async () => {
    let score = 0;
    score = matchMinimumSpace(score, p1.minimumSpaceRequirement!, c3.space); // 30 vs. 80
    expect(score).toBeCloseTo(11.11, 1);
    score = matchMinimumSpace(score, p1.minimumSpaceRequirement!, c2.space); // 30 vs. 25
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test matching kids requirements", async () => {
    let score = 0;
    score = matchKidsAllowd(score, p1.kidsAllowed!, c3.numberKids); // yes vs. 3
    expect(score).toBeCloseTo(11.11, 1);
    score = matchKidsAllowd(score, p2.kidsAllowed!, c2.numberKids); // no vs. 0
    expect(score).toBeCloseTo(22.22, 1);
    score = matchKidsAllowd(score, p2.kidsAllowed!, c3.numberKids); // no vs. 3
    expect(score).toBeCloseTo(22.22, 1);
  });

  it("Test matching holiday care", async () => {
    let score = 0;
    score = matchHolidayCare(score, c1.holidayCare); // true
    expect(score).toBeCloseTo(11.11, 1);
    score = matchHolidayCare(score, c2.holidayCare); // false
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test matching castration", async () => {
    let score = 0;
    score = matchCastration(score, p1.castration); // true
    expect(score).toBeCloseTo(11.11, 1);
    score = matchCastration(score, p3.castration); // false
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test match available time", async () => {
    let score = 0;
    score = matchAvailableTime(score, 80); // true
    expect(score).toBeCloseTo(11.11, 1);
    score = matchAvailableTime(score, 20); // false
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test match available vaccinations", async () => {
    let score = 0;
    score = matchVaccination(score, 1); // yes
    expect(score).toBeCloseTo(11.11, 1);
    score = matchVaccination(score, 0); // no
    expect(score).toBeCloseTo(11.11, 1);
  });

  it("Test matching pet to a caretaker", async () => {
    await request(testServer)
      .post("/match-pet")
      .set("Authorization", `Bearer ${ctToken}`)
      .send({ petId: p1.id })
      .expect(200)
      .then((response) => console.log(response.body));
  });

  it("Test getting matched pets", async () => {
    await request(testServer)
      .get("/matched-pets")
      .set("Authorization", `Bearer ${ctToken}`)
      .expect(200)
      .then((response) => console.log(response.body));
  });

  it("Test getting matched caretakers with verified NGO", async () => {
    await request(testServer)
      .get("/matched-caretakers")
      .set("Authorization", `Bearer ${ngoMemberToken}`)
      .send({ petId: p1.id })
      .expect(200)
      .then((response) => console.log(response.body));
  });

  it("Test getting matched caretakers with unverified NGO", async () => {
    await request(testServer)
      .get("/matched-caretakers")
      .set("Authorization", `Bearer ${unverifiedNgoMemberToken}`)
      .send({ petId: p1.id })
      .expect(403)
      .then((response) => console.log(response.body));
  });
});
