import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { startTestServer } from "./utils/test-server";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { DatabaseManager } from "../database/db";
import http from "http";
import { UserQueries } from "../database/queries/user";
import { minioManager, server } from "../app";
import { CTHoursQueries } from "../database/queries/cthours";
import { Caretaker } from "../models/db-models/caretaker";
import { CaretakerQueries } from "../database/queries/caretaker";
import { plainToInstance } from "class-transformer";
import CTHours from "../models/db-models/cthours";
import { TranslationManager } from "../utils/translations-manager";
import path from "path";

describe("Caretaker CRUD Tests", () => {
  const caretakerEmail = "admin@pawngo.org";
  const existingCaretakerEmail = "contact@tierhilfe-berlin.de";

  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  let caretakerId: string;
  let caretakerToken: string;
  let existingCaretakerId: string;
  let existingCaretakerToken: string;
  let tm = TranslationManager.getInstance();
  tm.setLocale("en");

  beforeAll(async () => {
    testServer = startTestServer(server, "3002");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();

    // register caretaker
    const registerRes = await request(testServer)
      .post("/register")
      .send({
        firstName: "TestFirstName",
        lastName: "TestLastName",
        email: caretakerEmail,
        password: "StrongPass123!",
      })
      .expect(201);
    caretakerId = registerRes.body.id;
    expect(caretakerId).toBeDefined();
    caretakerToken = registerRes.body.token;
    expect(caretakerToken).toBeDefined();

    // add profile picture to caretaker
    /* const profilePicturePath = path.join(
        __dirname,
        "test-files",
        "profile-pic.png",
      );
    const profilePictureFilename = `user-profile-picture/${caretakerId}-profile-pic.png`;
              await minioManager.uploadFile(profilePictureFilename, profilePicturePath);
    const link=  await minioManager.getPublicURL(
              profilePictureFilename)
    await UserQueries.updateUserProfilePic(db, caretakerId, profilePictureFilename, link)  */ // uncomment for test purpose

    // create existing caretaker
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TestfirstName",
        lastName: "TestLastName",
        email: existingCaretakerEmail,
        password: "StrongPass123!",
      })
      .expect(201)
      .then((response) => {
        existingCaretakerId = response.body.id;
        existingCaretakerToken = response.body.token;
      });

    const ct: Caretaker = {
      userId: existingCaretakerId,
      space: 90,
      experience: ">10 Years",
      tenure: "Rented",
      maritalStatus: "Single",
      financialAssistance: false,
      localityType: "Urban",
      garden: true,
      floor: 2,
      residence: "House",
      streetName: "Main Street",
      cityName: "Berlin",
      zip: "10115",
      country: "Germany",
      houseNumber: "45A",
      employmentType: "Employed",
      previousAdoption: true,
      numberKids: 0,
      birthdate: new Date("1990-06-15"),
      holidayCare: true,
      adoptionWillingness: true,
    };

    await CaretakerQueries.insert(db, ct, tm);
    await CTHoursQueries.insertCTHours(
      db,
      ct.userId,
      plainToInstance(CTHours, [
        { startTime: "08:00", endTime: "12:00", weekday: "Monday" },
        { startTime: "13:00", endTime: "17:00", weekday: "Tuesday" },
      ]),
      tm,
    );
  });

  it("Creating a Caretaker: should return 201 and a success message", async () => {
    const res = await request(testServer)
      .post("/caretaker")
      .set("Authorization", `Bearer ${caretakerToken}`)
      .send({
        firstName: "John",
        lastName: "Wick",
        phoneNumber: "+1 (407) 555-8392",
        space: 2,
        experience: ">2 Years",
        tenure: "Rented",
        maritalStatus: "Married",
        financialAssistance: true,
        localityType: "Urban",
        garden: true,
        floor: 1,
        residence: "House",
        streetName: "Main Street",
        cityName: "Berlin",
        zip: "10115",
        country: "Germany",
        houseNumber: "12",
        employmentType: "Employed",
        previousAdoption: false,
        numberKids: 2,
        birthdate: "2020-01-01",
        holidayCare: true,
        adoptionWillingness: true,
        ctHours: [
          { startTime: "08:00", endTime: "12:00", weekday: "Monday" },
          { startTime: "13:00", endTime: "17:00", weekday: "Tuesday" },
        ],
      })
      .expect(201);
    expect(res.body.message).toBe("Caretaker created successfully.");

    const ctHours = await CTHoursQueries.selectById(db, caretakerId, tm);
    expect(ctHours.length).toBe(2);
  });

  it("GET /caretaker, should return 200", async () => {
    await request(testServer)
      .get(`/caretaker/${caretakerId}`)
      .set("Authorization", `Bearer ${caretakerToken}`)
      .expect(200);
  });

  it("GET /caretaker that doesnt exist, should return 404", async () => {
    await request(testServer)
      .get(`/caretaker/${uuidv4()}`)
      .set("Authorization", `Bearer ${caretakerToken}`)
      .expect(404);
  });

  it("Creating an existing caretaker: should return 400 and an error message", async () => {
    const res = await request(testServer)
      .post("/caretaker")
      .set("Authorization", `Bearer ${existingCaretakerToken}`)
      .send({
        firstName: "John",
        lastName: "Wick",
        phoneNumber: "+1 (407) 555-8392",
        space: 2,
        experience: ">2 Years",
        tenure: "Rented",
        maritalStatus: "Married",
        financialAssistance: true,
        localityType: "Urban",
        garden: true,
        floor: 1,
        residence: "House",
        streetName: "Main Street",
        cityName: "Berlin",
        zip: "10115",
        country: "Germany",
        houseNumber: "12",
        employmentType: "Employed",
        previousAdoption: false,
        numberKids: 2,
        birthdate: "2020-01-01",
        holidayCare: true,
        adoptionWillingness: true,
        ctHours: [
          { startTime: "08:00", endTime: "12:00", weekday: "Monday" },
          { startTime: "13:00", endTime: "17:00", weekday: "Tuesday" },
        ],
      })
      .expect(400);

    expect(res.body.error.message).toBe("Caretaker already exists.");
  });

  it("Updating Caretaker: should return 200 and a success message", async () => {
    const updatedData = {
      firstName: "John",
      lastName: "Wick",
      phoneNumber: "+1 (407) 555-8392",
      userId: caretakerId,
      space: 2,
      experience: ">10 Years",
      tenure: "Paid",
      maritalStatus: "Single",
      financialAssistance: true,
      localityType: "Urban",
      garden: true,
      floor: 1,
      residence: "House",
      streetName: "Main Street",
      cityName: "Berlin",
      zip: "10115",
      country: "Germany",
      houseNumber: "12",
      employmentType: "Employed",
      previousAdoption: false,
      numberKids: 2,
      birthdate: "1990-04-15",
      holidayCare: true,
      adoptionWillingness: true,
      ctHours: [
        { startTime: "08:00", endTime: "13:00", weekday: "Monday" },
        { startTime: "13:00", endTime: "18:00", weekday: "Tuesday" },
        { startTime: "14:00", endTime: "18:00", weekday: "Wednesday" },
      ],
    };

    const res = await request(testServer)
      .put(`/caretaker`)
      .set("Authorization", `Bearer ${caretakerToken}`)
      .send(updatedData)
      .expect(200);

    expect(res.body.message).toBe("Caretaker updated successfully.");
    const ctHours = await CTHoursQueries.selectById(db, caretakerId, tm);
    expect(ctHours.length).toBe(3);
  });

  it("Deleting Caretaker: should return 200 and a success message", async () => {
    const res = await request(testServer)
      .delete("/caretaker")
      .set("Authorization", `Bearer ${caretakerToken}`)
      .expect(200);

    expect(res.body.message).toBe("Caretaker deleted successfully.");
  });

  it("GET Deleted Caretaker: should return 404 and an error message", async () => {
    await request(testServer)
      .delete("/caretaker")
      .set("Authorization", `Bearer ${caretakerToken}`)
      .expect(404);
  });

  afterAll(async () => {
    await UserQueries.deleteByEmail(db, caretakerEmail);
    await UserQueries.deleteByEmail(db, existingCaretakerEmail);
    await db.endPool();
    await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });
});
