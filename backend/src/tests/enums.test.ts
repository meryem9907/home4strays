import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { DatabaseManager } from "../database/db";
import { BreedQueries } from "../database/queries/breed";
import http from "http";
import { startTestServer } from "./utils/test-server";
import { server } from "../app";
import request from "supertest";

describe("Test breeds migration", () => {
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  beforeAll(async () => {
    db = await DatabaseManager.getInstance();
    await db.migrateForTest();
    testServer = startTestServer(server, "3003");
  });

  afterAll(async () => {
    await db.endPool();
    return await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });

  it("Test dog breeds migration", async () => {
    const dogBreeds = await BreedQueries.selectDogBreeds(db);
    expect(dogBreeds.length).toBe(185);
  });

  it("Test cat breeds migration", async () => {
    const catBreeds = await BreedQueries.selectCatBreeds(db);
    expect(catBreeds.length).toBe(82);
  });
  it("Test bird breeds migration", async () => {
    const birdBreeds = await BreedQueries.selectBirdBreeds(db);
    expect(birdBreeds.length).toBe(22);
  });
  it("Test rodent breeds migration", async () => {
    const rodentBreeds = await BreedQueries.selectRodentBreeds(db);
    expect(rodentBreeds.length).toBe(23);
  });

  it("Test get-species in german", async () => {
    await request(testServer)
      .get("/species")
      .set("Accept-Language", "de-DE")
      .expect(200);
  });

  it("Test get-species in english", async () => {
    await request(testServer).get("/species").expect(200);
  });

  it("Test get-species in turkish", async () => {
    await request(testServer)
      .get("/species")
      .set("Accept-Language", "tr-TR")
      .expect(200);
  });

  it("Test get-breeds", async () => {
    await request(testServer).get("/breeds/?species=Bird").expect(200);
  });

  it("Test get-breeds with no result", async () => {
    await request(testServer)
      .get("/breeds/?species=Birds")
      .expect(400)
      .then((response) => {
        expect(response.body.error.message).toBe(
          `No breeds found for species.`,
        );
      });
  });

  it("Test successfull fetching enums in english", async () => {
    const enums = [
      "experience",
      "tenure",
      "maritalStatus",
      "localityType",
      "residence",
      "employment",
      "weekday",
      "gender",
      "behaviour",
    ];
    await Promise.all(
      enums.map(
        async (value) =>
          await request(testServer)
            .get(`/enum/?types=${value}`)
            .set("Accept-Language", "en-US")
            .expect(200)
            .then((res) => {
              //console.log(`Response for ${value}:`, res.body)
            }),
      ),
    );
  });

  it("Test successfull fetching enums in german", async () => {
    const enums = [
      "experience",
      "tenure",
      "maritalStatus",
      "localityType",
      "residence",
      "employment",
      "weekday",
      "gender",
      "behaviour",
    ];
    await Promise.all(
      enums.map(
        async (value) =>
          await request(testServer)
            .get(`/enum/?types=${value}`)
            .set("Accept-Language", "de-DE")
            .expect(200)
            .then((res) => {
              console.log(`Response for ${value}:`, res.body);
            }),
      ),
    );
  });

  it("Test successfull fetching enums in turkish", async () => {
    const enums = [
      "experience",
      "tenure",
      "maritalStatus",
      "localityType",
      "residence",
      "employment",
      "weekday",
      "gender",
      "behaviour",
    ];
    await Promise.all(
      enums.map(
        async (value) =>
          await request(testServer)
            .get(`/enum/?types=${value}`)
            .set("Accept-Language", "tr-TR")
            .expect(200)
            .then((res) => {
              console.log(`Response for ${value}:`, res.body);
            }),
      ),
    );
  });

  it("Test unsuccessfull enum fetch", async () => {
    const enums = ["error"]; // enum doesnt exist
    await Promise.all(
      enums.map(
        async (value) =>
          await request(testServer)
            .get(`/enum/?types=${value}`)
            .set("Accept-Language", "tr-TR")
            .expect(400)
            .then((res) => {
              console.log(`Response for ${value}:`, res.body);
            }),
      ),
    );
  });
});
