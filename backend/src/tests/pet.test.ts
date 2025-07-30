import { describe, it, afterAll, beforeAll, expect } from "vitest";
import request from "supertest";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { DatabaseManager } from "../database/db";
import { databaseManager, server } from "../app";
import { startTestServer } from "./utils/test-server";
import { PetQueries } from "../database/queries/pet";
import { CaretakerQueries } from "../database/queries/caretaker";
import { UserQueries } from "../database/queries/user";
import { NGOQueries } from "../database/queries/ngo";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { TranslationManager } from "../utils/translations-manager";

describe("Pet CRUD Tests", () => {
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  let petId: string;
  let petId1: string;
  let petId2: string;
  let userId: string;
  let token: string;
  let ngoId: string;
  const testEmail = "nina.weiss@tierfreunde.org";

  const testPet = {
    name: "hung",
    gender: "Female",
    birthdate: "2020-01-01",
    castration: true,
    weight: null,
    species: "Dog",
    breedName: "Australian Shepherd",
    profilePictureLink: null,
    lastCheckUp: null,
    eatingBehaviour: null,
    behaviour: "shy",
    caretaker: null,
    ngoMember: null,
    streetName: null,
    cityName: null,
    zip: null,
    country: null,
    houseNumber: null,
    localityTypeRequirement: null,
    kidsAllowed: true,
    zipRequirement: null,
    experienceRequirement: null,
    minimumSpaceRequirement: null,
    petdisease: [
      {
        disease: "Arthritis",
        info: "Requires regular exercise and medication.",
        medications: "Glucosamine supplements",
      },
      {
        disease: "Obesity",
        info: "Strict diet required.",
        medications: "Weight management dog food",
      },
    ],
    petfears: [
      {
        fear: "Loud noises",
        info: "Gets anxious during thunderstorms.",
      },
      {
        fear: "Strangers",
        info: "Requires slow introductions.",
      },
    ],
    petvaccination: [
      {
        vaccine: "Rabies",
        date: "2022-08-01",
      },
      {
        vaccine: "Distemper",
        date: "2023-01-15",
      },
    ],
  };

  const testPet1 = {
    name: "bubu",
    gender: "Female",
    birthdate: "2020-01-01",
    castration: true,
    weight: null,
    species: "Cat",
    breedName: "Russian Blue",
    profilePictureLink: null,
    lastCheckUp: null,
    eatingBehaviour: null,
    behaviour: "shy",
    caretaker: null,
    ngoMember: null,
    streetName: null,
    cityName: null,
    zip: null,
    country: null,
    houseNumber: null,
    localityTypeRequirement: null,
    kidsAllowed: false,
    zipRequirement: null,
    experienceRequirement: null,
    minimumSpaceRequirement: null,
  };

  const testPet2 = {
    name: "jieqy",
    gender: "Male",
    birthdate: "2020-01-01",
    castration: true,
    weight: null,
    species: "Dog",
    breedName: "German Shorthaired Pointer",
    profilePictureLink: null,
    lastCheckUp: null,
    eatingBehaviour: null,
    behaviour: "shy",
    caretaker: null,
    ngoMember: null,
    streetName: null,
    cityName: null,
    zip: null,
    country: null,
    houseNumber: null,
    localityTypeRequirement: null,
    kidsAllowed: true,
    zipRequirement: null,
    experienceRequirement: null,
    minimumSpaceRequirement: null,
  };
  let tm = TranslationManager.getInstance();
  tm.setLocale("en");

  beforeAll(async () => {
    testServer = await startTestServer(server, "3008");
    db = DatabaseManager.getInstance();

    console.log("Starting migrations...");
    await db.migrateForTest();
    console.log("Migrations completed.");
    const registerRes = await request(testServer)
      .post("/register")
      .send({
        firstName: "TestName",
        lastName: "TestLame",
        email: testEmail,
        password: "StrongP123!",
      })
      .expect(201);

    userId =
      registerRes.body.userId ||
      registerRes.body.user?.id ||
      registerRes.body.id;
    expect(userId).toBeDefined();
    token = registerRes.body.token;
    expect(token).toBeDefined();

    const caretaker = {
      userId: userId,
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
      birthdate: new Date("1980-01-01"),
      holidayCare: true,
      adoptionWillingness: true,
    };

    await CaretakerQueries.insert(databaseManager, caretaker, tm);

    // Create NGO and make user an NGO member for pet operations
    ngoId = uuidv4();
    const ngo = {
      id: ngoId,
      name: "VitalCare Outreach",
      streetName: "NGO Street",
      cityName: "Berlin",
      zip: "10115",
      country: "Germany",
      houseNumber: "1",
      email: "test@ngo.com",
      phone: "123456789",
      verified: true,
      logoPicturePath: undefined,
      logoPictureLink: undefined,
      verificationDocumentPath: "test-doc.pdf",
      verificationDocumentLink: "https://test.com/doc.pdf",
    };

    await NGOQueries.insert(databaseManager, ngo);

    // Make the user an NGO member
    const ngoMember = {
      userId: userId,
      ngoId: ngoId,
      isAdmin: true,
    };

    await NGOMemberQueries.insert(databaseManager, ngoMember);
  });

  it("POST /pet - should create a new pet and return 201", async () => {
    const res = await request(testServer)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send(testPet)
      .expect(201);

    petId = res.body.petId;
    expect(petId).toBeDefined();
    expect(res.body.message).toBe("Pet created successfully.");
  });

  it("POST /pet - should create a new pet and return 201", async () => {
    const res = await request(testServer)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send(testPet1)
      .expect(201);

    petId1 = res.body.petId;
    expect(petId1).toBeDefined();
    expect(res.body.message).toBe("Pet created successfully.");
  });

  it("POST /pet - should create a new pet and return 201", async () => {
    const res = await request(testServer)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send(testPet2)
      .expect(201);

    petId2 = res.body.petId;
    expect(petId2).toBeDefined();
    expect(res.body.message).toBe("Pet created successfully.");
  });

  //PETBOOKMARK POST
  it("POST /petbookmark/:petId - should insert pet bookmark and return 201", async () => {
    const res = await request(testServer)
      .post(`/petbookmark/${petId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(res.body.message).toBe("Bookmark added successfully.");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.caretakerId).toBe(userId);
    expect(res.body.data.petId).toBe(petId);
  });

  //PETBOOKMARK GET - Test getting user's bookmark for a specific pet
  it("GET /petbookmark/:petId - should return bookmark status and 200", async () => {
    const res = await request(testServer)
      .get(`/petbookmark/${petId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.isBookmarked).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.caretakerId).toBe(userId);
    expect(res.body.data.petId).toBe(petId);
  });

  //PETBOOKMARKS GET ALL - Test getting all bookmarks for authenticated user
  it("GET /petbookmarks - should return user's bookmarks and 200", async () => {
    const res = await request(testServer)
      .get("/petbookmarks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].caretakerId).toBe(userId);
  });

  it("GET /pet/:id - should return pet data and 200", async () => {
    const res = await request(testServer).get(`/pet/${petId}`).expect(200);

    expect(res.body.data.kidsAllowed).toBe(testPet.kidsAllowed);
    expect(res.body.data.gender).toBe(testPet.gender);
  });

  it("GET /pets -should return 200 and an array of pets", async () => {
    const res = await request(testServer).get("/pets").expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("PUT /pet/:id - should update pet data and return 200", async () => {
    const updatedPet = {
      name: "lak",
      gender: "Female",
      birthdate: "2001-01-20",
      castration: true,
      weight: null,
      breed: "German Shorthaired Pointer",
      profilePictureLink: null,
      lastCheckUp: null,
      eatingBehaviour: null,
      behaviour: "lively",
      caretaker: null,
      ngoMember: null,
      streetName: null,
      cityName: null,
      zip: null,
      country: null,
      houseNumber: null,
      localityTypeRequirement: null,
      kidsAllowed: false,
      zipRequirement: null,
      experienceRequirement: null,
      minimumSpaceRequirement: null,
    };

    const res = await request(testServer)
      .put(`/pet/${petId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedPet)
      .expect(200);

    expect(res.body.message).toBe("Pet updated successfully.");

    const result = await db.executeQuery(`SELECT * FROM Pet WHERE Id = $1`, [
      petId,
    ]);
    console.log("DB result rows:", result.rows);
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].name).toBe("lak");
  });

  it("DELETE /petbookmark/:petId - should delete petBookmark and return 200", async () => {
    const res = await request(testServer)
      .delete(`/petbookmark/${petId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Bookmark removed successfully.");
  });

  //PETBOOKMARK GET AFTER DELETE - Test that bookmark is removed
  it("GET /petbookmark/:petId after delete - should return bookmark status false", async () => {
    const res = await request(testServer)
      .get(`/petbookmark/${petId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.isBookmarked).toBe(false);
    expect(res.body.data).toBeNull();
  });

  it("DELETE /pet/:id - should delete pet and return 200", async () => {
    const res = await request(testServer)
      .delete(`/pet/${petId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Pet deleted successfully.");
  });

  it("DELETE /pet/:id - should delete pet and return 200", async () => {
    const res = await request(testServer)
      .delete(`/pet/${petId1}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Pet deleted successfully.");
  });

  it("DELETE /pet/:id - should delete pet and return 200", async () => {
    const res = await request(testServer)
      .delete(`/pet/${petId2}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.message).toBe("Pet deleted successfully.");
  });

  it("GET /pet/:id after delete - should return 404", async () => {
    const res = await request(testServer).get(`/pet/${petId}`).expect(404);
  });

  afterAll(async () => {
    await PetQueries.deleteById(db, petId);
    await PetQueries.deleteById(db, petId2);
    await PetQueries.deleteById(db, petId1);
    await NGOQueries.deleteById(db, ngoId);
    await UserQueries.deleteByEmail(db, testEmail);
    await db.endPool();
    await new Promise<void>((resolve) => testServer.close(() => resolve()));
  });
});
