import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { databaseManager, server } from "../app";
import * as path from "path";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import { UserQueries } from "../database/queries/user";
import http from "http";
import { startTestServer } from "./utils/test-server";
import fs from "fs";

describe("TEST Verification", () => {
  let documentPath: string;
  let logoPath: string;
  let db: DatabaseManager;
  let ngoUserId: string;
  let userToken: string;
  let adminToken: string;
  let adminId: string;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  beforeAll(async () => {
    db = DatabaseManager.getInstance();
    await db.migrateForTest();
    testServer = startTestServer(server, "3013");
    // register ngo member
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestLastName",
        email: "meryem9907@googlemail.com",
        password: "s6XgT`76R8Xi",
      })
      .then((value) => {
        ngoUserId = value.body.id;
        userToken = value.body.token;
      });
    // register h4strays admin
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestLastName",
        email: "m.unuvar99@gmail.com",
        password: "s6XgT`76R8Xi",
        isAdmin: true,
      })
      .then((value) => {
        adminId = value.body.id;
        adminToken = value.body.token;
      });

    // test files
    documentPath = path.join(__dirname, "test-files", "ngo_test_doc.pdf");
    logoPath = path.join(__dirname, "test-files", "ngo-logo.png");
  });

  afterAll(async () => {
    // delete ngo member and admin user
    await UserQueries.deleteByEmail(
      databaseManager,
      "meryem9907@googlemail.com",
    );
    await UserQueries.deleteByEmail(databaseManager, "m.unuvar99@gmail.com");
    await db.endPool();
    return await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });

  it("Test pending verifications, should return 404", async () => {
    const res = await request(testServer)
      .get("/pending-verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });
  it("Test request-verification", async () => {
    await request(testServer)
      .post("/request-verification")
      .set("Authorization", `Bearer ${userToken}`)
      .field("name", "TestNGO")
      .field("email", "ngo@email.de")
      .field("country", "Deutschland")
      .field("phoneNumber", "0906245381")
      .field("memberCount", "10")
      .field("website", ["http://ngoTest/main"])
      .field("mission", "Save animals")
      .attach("verification-document", documentPath)
      .attach("ngo-logo", logoPath)
      .expect(202);
  }, 30000);

  it("Test pending verifications", async () => {
    const res = await request(testServer)
      .get("/pending-verifications")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
    console.log("aaaaaaaaaa", res.body);
  });

  it("Test verifying NGO", async () => {
    await request(testServer)
      .put("/verify-ngo")
      .set("Accept-Language", "ja-JA")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TestNGO",
        country: "Deutschland",
      })
      .expect(200);
  });

  it("Test rejecting NGO", async () => {
    await request(testServer)
      .delete("/reject-ngo")
      .set("Accept-Language", "ja-JA")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TestNGO",
        country: "Deutschland",
      })
      .expect(200);
  });

  it("Test rejecting NGO without admin rights, should return error", async () => {
    await request(testServer)
      .delete("/reject-ngo")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "TestNGO",
        country: "Deutschland",
      })
      .expect(403);
  });
});
