import request from "supertest";
import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { DatabaseManager } from "../database/db";
import { server } from "../app";
import http from "http";
import { startTestServer } from "./utils/test-server";

import {
  deleteProfilesSetup,
  setupProfiles,
} from "./utils/setup-profiles-queries";
import { TranslationManager } from "../utils/translations-manager";

describe("Test profiles route", () => {
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  let tm = TranslationManager.getInstance();
  tm.setLocale("de");
  beforeAll(async () => {
    testServer = startTestServer(server, "3010");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();
    await setupProfiles(db, tm);
  });

  afterAll(async () => {
    await deleteProfilesSetup(db);
    await db.endPool();
    return await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });

  it("Test all-animals route, should return 200 and all ngo animals in english", async () => {
    await request(testServer).get("/all-animals").expect(200);
  });

  it("Test all-animals route, should return 200 and all ngo animals in german", async () => {
    await request(testServer)
      .get("/all-animals")
      .set("Accept-Language", "de-DE")
      .expect(200);
  });

  it("Test all-animals route, should return 200 and all ngo animals in turkish", async () => {
    await request(testServer)
      .get("/all-animals")
      .set("Accept-Language", "tr-TR")
      .expect(200);
  });

  it("Test all-ngos route, should return 200 and all ngos", async () => {
    await request(testServer).get("/all-ngos").expect(200);
  });
});
