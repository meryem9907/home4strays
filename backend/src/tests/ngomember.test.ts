import {
  describe,
  it,
  afterAll,
  beforeAll,
  expect,
  beforeEach,
  afterEach,
} from "vitest";
import { startTestServer } from "./utils/test-server";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import http from "http";
import { UserQueries } from "../database/queries/user";
import { server } from "../app";
import { v4 as uuidv4 } from "uuid";
import { NGO } from "../models/db-models/ngo";
import { NGOQueries } from "../database/queries/ngo";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { NGOMemberHoursQueries } from "../database/queries/ngomemberhours";
import { TranslationManager } from "../utils/translations-manager";

describe("NGOMember CRUD Tests", () => {
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  let userId: string;
  let ngoId: string; // Declared here to be accessible in cleanup
  let newNGOId: string; // Declared here to be accessible in cleanup
  let token: string;
  let nonExistentNGOMemberToken: string;
  const nonExistentNGOMemberMail = "kevin.nguyen@uni-muenster.de";
  const testEmail = "test.user+dev1@example.com";
  const anotherNGOMemberEmail = "mock.email+signup@dummy.org";
  let anotherNGOMemberId!: string;

  let oldNGO = "HopeCircle Foundation";
  let newNGO = "Bright Futures Alliance";
  let tm = TranslationManager.getInstance();
  tm.setLocale("en");

  beforeAll(async () => {
    testServer = startTestServer(server, "3007");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();
  });

  beforeEach(async () => {
    console.log("Starting beforeEach cleanup for NGOMember tests...");

    try {
      const emailsToClean = [
        testEmail,
        anotherNGOMemberEmail,
        nonExistentNGOMemberMail,
      ];

      // Retrieve NGOs by name/country to get their dynamic IDs for deletion
      const existingTestNgo = await NGOQueries.selectByNameAndCountry(
        db,
        oldNGO,
        "Deutschland",
      );
      const existingNewNgo = await NGOQueries.selectByNameAndCountry(
        db,
        newNGO,
        "Deutschland",
      );

      for (const email of emailsToClean) {
        const user = await UserQueries.selectByEmailUnsecure(db, email);
        if (user && user.id) {
          console.log(`Cleaning up data for user: ${email} (ID: ${user.id})`);

          try {
            if (existingTestNgo?.id) {
              // Use the ID found by name, or the one from setup if it exists
              await NGOMemberQueries.deleteNGOMemberById(
                db,
                user.id,
                existingTestNgo.id,
              );
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${existingTestNgo.id}`,
              );
            } else if (ngoId) {
              // Fallback to current test's ngoId if previous one not found
              await NGOMemberQueries.deleteNGOMemberById(db, user.id, ngoId);
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${ngoId} (from current setup)`,
              );
            }

            if (
              existingNewNgo?.id &&
              existingNewNgo.id !== existingTestNgo?.id
            ) {
              await NGOMemberQueries.deleteNGOMemberById(
                db,
                user.id,
                existingNewNgo.id,
              );
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${existingNewNgo.id}`,
              );
            } else if (newNGOId && newNGOId !== ngoId) {
              // Fallback to current test's newNGOId
              await NGOMemberQueries.deleteNGOMemberById(db, user.id, newNGOId);
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${newNGOId} (from current setup)`,
              );
            }
          } catch (error: any) {
            console.warn(
              `Failed to delete NGOMember for ${email}: ${error.message}`,
            );
          }
        }
      }

      // Now delete the users themselves
      try {
        await UserQueries.deleteByEmail(db, testEmail);
        console.log(`Deleted user: ${testEmail}`);
      } catch (error: any) {
        console.warn(`Failed to delete user ${testEmail}: ${error.message}`);
      }
      try {
        await UserQueries.deleteByEmail(db, nonExistentNGOMemberMail);
        console.log(`Deleted user: ${nonExistentNGOMemberMail}`);
      } catch (error: any) {
        console.warn(
          `Failed to delete user ${nonExistentNGOMemberMail}: ${error.message}`,
        );
      }
      try {
        await UserQueries.deleteByEmail(db, anotherNGOMemberEmail);
        console.log(`Deleted user: ${anotherNGOMemberEmail}`);
      } catch (error: any) {
        console.warn(
          `Failed to delete user ${anotherNGOMemberEmail}: ${error.message}`,
        );
      }

      // Delete NGOs last, by ID if found
      try {
        if (existingTestNgo?.id) {
          await NGOQueries.deleteById(db, existingTestNgo.id); // Using deleteById here!
          console.log(`Deleted NGO (old) by ID: ${existingTestNgo.id}`);
        } else {
          console.log("No existing NGO(old) found to delete by ID.");
        }
      } catch (error: any) {
        console.warn(`Failed to delete NGO (old) by ID: ${error.message}`);
      }
      try {
        if (existingNewNgo?.id) {
          await NGOQueries.deleteById(db, existingNewNgo.id); // Using deleteById here!
          console.log(`Deleted NGO (new) by ID: ${existingNewNgo.id}`);
        } else {
          console.log("No existing (new) found to delete by ID.");
        }
      } catch (error: any) {
        console.warn(`Failed to delete NGO (new) by ID: ${error.message}`);
      }

      console.log("beforeEach cleanup completed.");
    } catch (error: any) {
      console.error("Critical error during beforeEach cleanup:", error.message);
      throw error;
    }

    // Setup test data
    await setupTestData();
  });

  afterEach(async () => {
    console.log("Starting afterEach cleanup for NGOMember tests...");
    try {
      const emailsToClean = [
        testEmail,
        anotherNGOMemberEmail,
        nonExistentNGOMemberMail,
      ];

      // Retrieve NGOs by name/country to get their dynamic IDs for deletion
      const existingTestNgo = await NGOQueries.selectByNameAndCountry(
        db,
        oldNGO,
        "Deutschland",
      );
      const existingNewNgo = await NGOQueries.selectByNameAndCountry(
        db,
        newNGO,
        "Deutschland",
      );

      for (const email of emailsToClean) {
        const user = await UserQueries.selectByEmailUnsecure(db, email);
        if (user && user.id) {
          try {
            if (existingTestNgo?.id) {
              await NGOMemberQueries.deleteNGOMemberById(
                db,
                user.id,
                existingTestNgo.id,
              );
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${existingTestNgo.id}`,
              );
            } else if (ngoId) {
              await NGOMemberQueries.deleteNGOMemberById(db, user.id, ngoId);
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${ngoId} (from current setup)`,
              );
            }

            if (
              existingNewNgo?.id &&
              existingNewNgo.id !== existingTestNgo?.id
            ) {
              await NGOMemberQueries.deleteNGOMemberById(
                db,
                user.id,
                existingNewNgo.id,
              );
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${existingNewNgo.id}`,
              );
            } else if (newNGOId && newNGOId !== ngoId) {
              await NGOMemberQueries.deleteNGOMemberById(db, user.id, newNGOId);
              console.log(
                `Deleted NGOMember for user ID: ${user.id} from NGO ID: ${newNGOId} (from current setup)`,
              );
            }
          } catch (error: any) {
            console.warn(
              `Failed to delete NGOMember for ${email}: ${error.message}`,
            );
          }
        }
      }

      try {
        await UserQueries.deleteByEmail(db, testEmail);
        console.log(`Deleted user: ${testEmail}`);
      } catch (error: any) {
        console.warn(`Failed to delete user ${testEmail}: ${error.message}`);
      }
      try {
        await UserQueries.deleteByEmail(db, nonExistentNGOMemberMail);
        console.log(`Deleted user: ${nonExistentNGOMemberMail}`);
      } catch (error: any) {
        console.warn(
          `Failed to delete user ${nonExistentNGOMemberMail}: ${error.message}`,
        );
      }
      try {
        await UserQueries.deleteByEmail(db, anotherNGOMemberEmail);
        console.log(`Deleted user: ${anotherNGOMemberEmail}`);
      } catch (error: any) {
        console.warn(
          `Failed to delete user ${anotherNGOMemberEmail}: ${error.message}`,
        );
      }

      try {
        if (existingTestNgo?.id) {
          await NGOQueries.deleteById(db, existingTestNgo.id); // Using deleteById here!
          console.log(`Deleted NGO (old) by ID: ${existingTestNgo.id}`);
        } else {
          console.log("No existing (old) found to delete by ID.");
        }
      } catch (error: any) {
        console.warn(`Failed to delete NGO (old) by ID: ${error.message}`);
      }
      try {
        if (existingNewNgo?.id) {
          await NGOQueries.deleteById(db, existingNewNgo.id); // Using deleteById here!
          console.log(`Deleted NGO (new) by ID: ${existingNewNgo.id}`);
        } else {
          console.log("No existing (new) found to delete by ID.");
        }
      } catch (error: any) {
        console.warn(`Failed to delete NGO (new) by ID: ${error.message}`);
      }

      console.log("afterEach cleanup completed.");
    } catch (error: any) {
      console.error("Critical error during afterEach cleanup:", error.message);
    }
  });

  async function setupTestData() {
    console.log("Starting setupTestData...");
    // Register user who will become ngo member
    const registerRes = await request(testServer).post("/register").send({
      firstName: "TestNgoMember",
      lastName: "TestNgoLast",
      email: testEmail,
      password: "ILoveChaewon20!",
    });

    if (registerRes.status !== 201) {
      console.error("Registration failed for testEmail:", {
        status: registerRes.status,
        body: registerRes.body,
        text: registerRes.text,
      });
      throw new Error(
        `Registration failed with status ${registerRes.status}. Details: ${JSON.stringify(registerRes.body)}`,
      );
    }

    userId =
      registerRes.body.userId ||
      registerRes.body.user?.id ||
      registerRes.body.id;
    expect(userId).toBeDefined();
    token = registerRes.body.token;
    expect(token).toBeDefined();
    console.log(`Registered testEmail. userId: ${userId}`);

    // non existent ngo member
    const nonExistentRes = await request(testServer).post("/register").send({
      firstName: "TestNgoMember",
      lastName: "TestNgoLast",
      email: nonExistentNGOMemberMail,
      password: "ILoveChaewon20!",
    });

    if (nonExistentRes.status !== 201) {
      console.error(
        "Non-existent member registration failed for nonExistentNGOMemberMail:",
        {
          status: nonExistentRes.status,
          body: nonExistentRes.body,
          text: nonExistentRes.text,
        },
      );
      throw new Error(
        `Non-existent member registration failed with status ${nonExistentRes.status}. Details: ${JSON.stringify(nonExistentRes.body)}`,
      );
    }
    nonExistentNGOMemberToken = nonExistentRes.body.token;
    console.log("Registered nonExistentNGOMemberMail.");

    // another ngo member
    const anotherRes = await request(testServer).post("/register").send({
      firstName: "TestNgoMember",
      lastName: "TestNgoLast",
      email: anotherNGOMemberEmail,
      password: "ILoveChaewon20!",
    });

    if (anotherRes.status !== 201) {
      console.error(
        "Another member registration failed for anotherNGOMemberEmail:",
        {
          status: anotherRes.status,
          body: anotherRes.body,
          text: anotherRes.text,
        },
      );
      throw new Error(
        `Another member registration failed with status ${anotherRes.status}. Details: ${JSON.stringify(anotherRes.body)}`,
      );
    }

    anotherNGOMemberId =
      anotherRes.body.userId || anotherRes.body.user?.id || anotherRes.body.id;
    console.log(
      `Registered anotherNGOMemberEmail. anotherNGOMemberId: ${anotherNGOMemberId}`,
    );

    // old ngo
    ngoId = uuidv4();
    const ngo: NGO = {
      id: ngoId,
      name: oldNGO,
      country: "Deutschland",
      verificationDocumentLink: "",
      verificationDocumentPath: "",
      verified: false,
    };
    await NGOQueries.insert(db, ngo);
    console.log(`Inserted NGO: ${ngo.name}`);

    // add ngo members
    await NGOMemberQueries.insert(db, {
      userId: userId,
      ngoId: ngo.id,
      isAdmin: false,
    });
    console.log(`Inserted NGOMember for userId: ${userId}`);

    // new NGO
    newNGOId = uuidv4();
    const newNgo: NGO = {
      id: newNGOId,
      name: newNGO,
      country: "Deutschland",
      verificationDocumentLink: "",
      verificationDocumentPath: "",
      verified: false,
    };
    await NGOQueries.insert(db, newNgo);
    console.log(`Inserted new NGO: ${newNgo.name}`);
    console.log("setupTestData completed.");
  }

  it("Creating NGOMember Hours and Changing user data: should return 201 and a success message", async () => {
    const res = await request(testServer)
      .post("/ngo-member/hours-and-user-data")
      .set("Authorization", `Bearer ${token}`)
      .send({
        hours: [
          { startTime: "08:00", endTime: "12:00", weekday: "Monday" },
          { startTime: "13:00", endTime: "17:00", weekday: "Tuesday" },
        ],
      })
      .expect(201);

    expect(res.body.message).toBe(
      "User data changed and NGOMember Hours created successfully.",
    );
    const ngoMemberHours = await NGOMemberHoursQueries.selectById(
      db,
      userId,
      tm,
    );
  });

  it("Creating NGOMember Hours and Changing user data: should return 404 and a error message", async () => {
    const res = await request(testServer)
      .post("/ngo-member/hours-and-user-data")
      .set("Authorization", `Bearer ${nonExistentNGOMemberToken}`)
      .send({
        hours: [
          { startTime: "08:00", endTime: "12:00", weekday: "Monday" },
          { startTime: "13:00", endTime: "17:00", weekday: "Tuesday" },
        ],
      })
      .expect(404);

    expect(res.body.error.message).toBe("NGO Member not found.");
  });

  it("GET NGOMember by Id: should return 200 and the ngomember data", async () => {
    const res = await request(testServer)
      .get(`/ngo-member/?userId=${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    console.log("GET NGOMember by Id Response Body:", res.body);

    expect(res.body).toBeDefined();
    expect(res.body.ngoMember).toBeDefined();
    // This is the line to change:
    expect(res.body.ngoMember.userId).toBe(userId);
  });

  it("GET all NGOMembers: should return 200 and the ngomember data", async () => {
    const res = await request(testServer)
      .get(`/ngo-members/?ngoId=${ngoId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // Add console.log to inspect the actual response body
    console.log("GET all NGOMembers Response Body:", res.body);
    // Corrected assertions
    expect(Array.isArray(res.body)).toBe(true); // CORRECTED ASSERTION
    expect(res.body.length).toBeGreaterThanOrEqual(1); // CORRECTED ASSERTION

    // Further checks for array elements (optional but recommended)
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("ngoMember");
      expect(res.body[0].ngoMember).toHaveProperty("userId"); // Assuming user ID is 'id' within ngoMember
      expect(res.body[0]).toHaveProperty("ngoMemberHours");
      expect(Array.isArray(res.body[0].ngoMemberHours)).toBe(true);
    }
  });

  it("Updating NGOMember Hours and user data: should return 200 and a success message", async () => {
    // First create hours
    await request(testServer)
      .post("/ngo-member/hours-and-user-data")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Wick",
        phoneNumber: "+1 (407) 555-8392",
        hours: [{ startTime: "08:00", endTime: "12:00", weekday: "Monday" }],
      })
      .expect(201);

    const updatedData = {
      firstName: "Elen",
      lastName: "Wick",
      phoneNumber: "+1 (407) 555-8383",
      hours: [
        { startTime: "09:00", endTime: "13:00", weekday: "Wednesday" },
        { startTime: "14:00", endTime: "18:00", weekday: "Thursday" },
      ],
    };

    const res = await request(testServer)
      .put(`/ngo-member/hours-and-user-data`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData)
      .expect(200);

    expect(res.body.message).toBe(
      "User data and NGOMember Hours changed successfully.",
    );

    const ngoMemberHours = await NGOMemberHoursQueries.selectById(
      db,
      userId,
      tm,
    );
  });

  it("Updating NGO Members NGO: should return 200 and a success message", async () => {
    const res = await request(testServer)
      .put(`/ngo-member/ngo-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ngoId: newNGOId, isAdmin: false })
      .expect(200);

    expect(res.body.message).toBe("NGOMembers NGO updated successfully.");
  });

  it("Deleting NGOMember Hours: should return 200 and a success message", async () => {
    const res = await request(testServer)
      .delete("/ngo-member/hours")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("NGOMember Hours deleted successfully.");
  });

  it("Deleting the last NGOMember from NGO: should return 409 conflict message", async () => {
    /* await request(testServer)
      .put(`/ngo-member/ngo-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ngoId: newNGOId })
      .expect(200); */

    const res = await request(testServer)
      .delete("/ngo-member")
      .set("Authorization", `Bearer ${token}`)
      .expect(409);
  });

  it("Deleting NGOMember from NGO: should return 200 and a success message", async () => {
    /* // First move to newNGOId if not already there
    await request(testServer)
      .put(`/ngo-member/ngo-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ngoId: newNGOId })
      .expect(200); // Ensure this precondition passes */

    // add another ngo-member so that it is not the last and delete it
    await NGOMemberQueries.insert(db, {
      userId: anotherNGOMemberId,
      ngoId: ngoId,
      isAdmin: false,
    });
    console.log(
      `Inserted NGOMember for anotherNGOMemberId: ${anotherNGOMemberId}`,
    );

    const res = await request(testServer)
      .delete("/ngo-member")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("NGOMember deleted successfully.");
  });

  /* 
  it("GET Deleted NGOMember: should return 404 and an error message", async () => {
    const res = await request(testServer)
      .get(`/ngo-member/?ngoId=${newNGOId}&userId=${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(res.body.error.message).toBe("NGO Member not found.");

    const ngoMemberHours = await NGOMemberHoursQueries.select(db, userId);
    expect(ngoMemberHours).toHaveLength(0);
  }); */ // currently not testable as we expect one ngo per ngo member

  afterAll(async () => {
    await NGOQueries.deleteByEmail(db, newNGO);
    await NGOQueries.deleteByEmail(db, oldNGO);
    await db.endPool();
    await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });
});
