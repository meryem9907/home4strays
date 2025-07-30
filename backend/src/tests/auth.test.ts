import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { server } from "../app";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import { UserQueries } from "../database/queries/user";
import { startTestServer } from "./utils/test-server";
import http from "http";

describe("POST Test login and register", () => {
  const customEmail = "emma.schneider@care4paws.org";
  const customEmail2 = "volunteer.coordinator@rescuepets.net";
  const ngoEmail = "info@strayanimals.de";
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  beforeAll(async () => {
    testServer = startTestServer(server, "3001");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();
  });
  afterAll(async () => {
    await UserQueries.deleteByEmail(db, customEmail);
    await UserQueries.deleteByEmail(db, customEmail2);
    await UserQueries.deleteByEmail(db, ngoEmail);
    await db.endPool();
    return await new Promise<void>((resolve) => {
      return testServer.close(() => resolve());
    });
  });

  it("Registering: should return 201 and a token", async () => {
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestLastName",
        email: customEmail,
        password: "q0T/ez5*3YL{",
        isNgoUser: false,
      })
      .expect(201);
  });

  it("Registering with invalid password format ", async () => {
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestLastName",
        email: customEmail2,
        password: "123",
        isNgoUser: false,
      })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toEqual(
          "password: Password must be at least 8 characters, password: Password must contain at least one uppercase letter, password: Password must contain at least one special character",
        );
      });
  });

  it("Registering with invalid email format ", async () => {
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestlastName",
        email: "email",
        password: "q0T/ez5*3YL{",
        isNgoUser: false,
      })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toEqual("email: Invalid email address");
      });
  });

  it("Double registration: should return an error", async () => {
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestlastName",
        email: customEmail,
        password: "q0T/ez5*3YL{",
        isNgoUser: false,
      })
      .expect(400);
  });

  it("Login: should return 200 and a token", async () => {
    await request(testServer)
      .post("/login")
      .send({
        email: customEmail,
        password: "q0T/ez5*3YL{",
      })
      .expect(200);
  });

  it("Login: invalid password, should return an error", async () => {
    await request(testServer)
      .post("/login")
      .send({
        email: customEmail,
        password: "q0T/ez5*3YL",
      })
      .expect(403);
  });

  it("Login: invalid user, should return an error", async () => {
    await request(testServer)
      .post("/login")
      .send({
        email: "false.email@mail.com",
        password: "q0T/ez5*3YL{",
      })
      .expect(401);
  });

  it("Registering NGO user: should return 201 and a token", async () => {
    await request(testServer)
      .post("/register")
      .send({
        firstName: "NGOFirstName",
        lastName: "NGOLastName",
        email: ngoEmail,
        password: "q0T/ez5*3YL{",
        isNgoUser: true,
      })
      .expect(201);
  });
});
