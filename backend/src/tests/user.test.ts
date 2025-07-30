import { describe, it, afterAll, beforeAll } from "vitest";
import { server } from "../app";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import { UserQueries } from "../database/queries/user";
import http from "http";
import { startTestServer } from "./utils/test-server";

describe("Test user routes", () => {
  let token = "";
  let db: DatabaseManager;
  let customEmail: string = "eproject.lead@straycompassion.org";
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  beforeAll(async () => {
    testServer = startTestServer(server, "3012");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();

    await request(testServer)
      .post("/register")
      .send({
        email: customEmail,
        password: "s6XgT`76R8Xi",
        firstName: "TestFirstName",
        lastName: "TestLastName",
        isNgoUser: false,
      })
      .then((value) => {
        token = value.body.token;
      });
  });
  afterAll(async () => {
    await UserQueries.deleteByEmail(db, customEmail);
    await db.endPool();
    return await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });

  it("Get user that is registered", async () => {
    await request(testServer)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("Invalid token should return error", async () => {
    await request(testServer)
      .get("/me")
      .set("Authorization", `Bearer ${123}`)
      .expect(403);
  });
  it("No token provided should return error", async () => {
    await request(testServer).get("/me").expect(401);
  });
});
