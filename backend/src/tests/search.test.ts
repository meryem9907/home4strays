import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { server } from "../app";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import { startTestServer } from "./utils/test-server";
import http from "http";
import {
  deleteSetupNGOWithAnimal,
  setupNGOWithAnimal,
} from "./utils/setup-search-queries";

/** Test the /search route  */
describe("TEST search route", () => {
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  /**+++++++ SETUP +++++++++ */
  beforeAll(async () => {
    testServer = startTestServer(server, "3011");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();

    await setupNGOWithAnimal(db, testServer);
  });
  afterAll(async () => {
    await deleteSetupNGOWithAnimal(db);
    await db.endPool();
    return await new Promise<void>((resolve) => {
      return testServer.close(() => resolve());
    });
  });
  /**+++++++ END OF SETUP +++++++++ */

  /**++++++++ START TESTs ++++++++++*/
  it("Test successfull animal search, should return 200", async () => {
    const query = encodeURIComponent("Dog loves fish");
    await request(testServer)
      .get(`/search-animal/?q=${query}&location=germany`)
      .expect(200)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
        expect(body.pets.length).toBe(1);
        expect(body.pets[0].name).toBe("Snowpiercer");
        expect(body.pets[0].country).toBe("Germany");
      });
  });

  it("Test successfull cat search, should return 200", async () => {
    const query = encodeURIComponent("Cat eating plants");
    await request(testServer)
      .get(`/search-animal/?q=${query}&location=turkey`)
      .expect(200)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
        expect(body.pets.length).toBe(1);
        expect(body.pets[0].name).toBe("Little Angel");
        expect(body.pets[0].country).toBe("Turkey");
      });
  });

  it("Test successfull cat search, should return 200", async () => {
    const query = encodeURIComponent("Cats");
    await request(testServer)
      .get(`/search-animal/?q=${query}`)
      .expect(200)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
        expect(body.pets.length).toBeGreaterThan(0);
      });
  });

  it("Test unsuccessful animal search, should return 404", async () => {
    const query = encodeURIComponent("Not existent animal");
    await request(testServer)
      .get(`/search-animal/?q=${query}&location=france`)
      .expect(404)
      .then((response) => {
        console.log(`Response: ${JSON.stringify(response.body)}`);
        const body = response.body;
        expect(body.error.message).toBe("No results found.");
      });
  });

  it("Test successfull NGO search, should return 200", async () => {
    const query = encodeURIComponent("Stray Lovers");
    await request(testServer)
      .get(`/search-ngo/?q=${query}&location=england`)
      .expect(200)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
        expect(body.ngos.length).toBe(1);
        expect(body.ngos[0].name).toBe("Stray Lovers");
        expect(body.ngos[0].country).toBe("England");
      });
  });

  it("Test unsuccessful NGO search, should return 404", async () => {
    const query = encodeURIComponent("Not existent NGO");
    await request(testServer)
      .get(`/search-ngo/?q=${query}&location=france`)
      .expect(404)
      .then((response) => {
        console.log(`Response: ${JSON.stringify(response.body)}`);
        const body = response.body;
        expect(body.error.message).toBe("No results found.");
      });
  });

  it("Test successfull caretaker search, should return 200", async () => {
    const query = encodeURIComponent("Oliver Twist");
    await request(testServer)
      .get(`/search-caretaker/?q=${query}&location=Germany`)
      .expect(200)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
        expect(body.caretakers.length).toBe(1);
        expect(body.caretakers[0].country).toBe("Germany");
      });
  });
  it("Test unsuccessful caretaker search, should return 404", async () => {
    const query = encodeURIComponent("Not existent caretaker");
    await request(testServer)
      .get(`/search-caretaker/?q=${query}&location=france`)
      .expect(404)
      .then((response) => {
        console.log(`Response: ${JSON.stringify(response.body)}`);
        const body = response.body;
        expect(body.error.message).toBe("No results found.");
      });
  });

  it("Test empty query, should return 400", async () => {
    await request(testServer)
      .get(`/search-caretaker`)
      .expect(400)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
        expect(body.error).toEqual("q: Required");
      });
  });

  it("Test search in german", async () => {
    const q = encodeURIComponent("weibliche Katze");
    await request(testServer)
      .get(`/search-animal/?q=${q}&location=Deutschland`)
      .set("Accept-Language", "de-DE")
      .expect(200)
      .then((response) => {
        const body = response.body;
        console.log(`Response: ${JSON.stringify(response.body)}`);
      });
  });
});
