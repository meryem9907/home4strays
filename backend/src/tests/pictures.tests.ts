import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { startTestServer } from "./utils/test-server";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import http from "http";
import { UserQueries } from "../database/queries/user";
import { server } from "../app";
import { PetQueries } from "../database/queries/pet";
import { v4 as uuidv4 } from "uuid";
import { NGOQueries } from "../database/queries/ngo";
import * as path from "path";
import { NGOMember } from "../models/db-models/ngomember";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { Pet } from "../models/db-models/pet";
import { string } from "pg-format";
import { TranslationManager } from "../utils/translations-manager";

describe("Pictures CRUD Tests", () => {
  let db: DatabaseManager;
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  const caretakerEmail = "test10@domain.com";
  const ngoMemberEmail = "test15@domain.com";
  const nonAdminNgoMemberEmail = "test16@domain.com";
  const unverNgoMemberEmail = "test17@domain.com";

  let ngoMemberId: string;
  let nonAdminNgoMemberId: string;
  let unverNgoMemberId: string;
  let ngoMemberToken: string;
  let nonAdminNgoMemberToken: string;
  let unverNgoMemberToken: string;
  let caretakerId: string;
  let caretakerToken: string;
  let petId: string;
  let ngoId: string;
  let unverNGOId: string;
  let pictureLinks: string[] = [];

  let tm = TranslationManager.getInstance();
  tm.setLocale("en");
  //pictures
  const logoPath = path.join(__dirname, "test-files", "ngo-logo.png");
  const profilePicturePath = path.join(
    __dirname,
    "test-files",
    "profile-pic.png",
  );
  const picture1 = path.join(
    __dirname,
    "test-files",
    "pictures",
    "picture-1.png",
  );
  const picture2 = path.join(
    __dirname,
    "test-files",
    "pictures",
    "picture-2.png",
  );
  const picture3 = path.join(
    __dirname,
    "test-files",
    "pictures",
    "picture-3.png",
  );
  const picture4 = path.join(
    __dirname,
    "test-files",
    "pictures",
    "picture-4.png",
  );
  const pictures = [picture1, picture2, picture3, picture4];

  beforeAll(async () => {
    testServer = startTestServer(server, "3009");
    db = DatabaseManager.getInstance();
    await db.migrateForTest();
    // caretaker
    const registerRes = await request(testServer)
      .post("/register")
      .send({
        firstName: "TesName",
        lastName: "TtLastName",
        email: caretakerEmail,
        password: "StrongPassddd123!",
      })
      .expect(201);

    caretakerId = registerRes.body.id;
    caretakerToken = registerRes.body.token;

    //NGO
    ngoId = uuidv4();
    const ngo = {
      id: ngoId,
      name: "Verified NGO",
      country: "Germany",
      verificationDocumentPath: `uploads/documents/id1_verification.pdf`,
      verificationDocumentLink: `https://example.com/uploads/documents/id1_verification.pdf`,
      verified: true,
    };
    await NGOQueries.insert(db, ngo);

    // Unverified NGO
    unverNGOId = uuidv4();
    const unverNGO = {
      id: unverNGOId,
      name: "Unverified NGO",
      country: "England",
      verificationDocumentPath: `uploads/documents/id1_verification.pdf`,
      verificationDocumentLink: `https://example.com/uploads/documents/id1_verification.pdf`,
      verified: false,
    };
    await NGOQueries.insert(db, unverNGO);

    // NGO Members
    await request(testServer)
      .post("/register")
      .send({
        firstName: "TesName",
        lastName: "TtLastName",
        email: ngoMemberEmail,
        password: "StrongPassddd123!",
      })
      .expect(201)
      .then((response) => {
        ngoMemberId = response.body.id;
        ngoMemberToken = response.body.token;
      });
    await NGOMemberQueries.insert(db, {
      userId: ngoMemberId,
      ngoId: ngoId,
      isAdmin: true,
    });

    await request(testServer)
      .post("/register")
      .send({
        firstName: "TesName",
        lastName: "TtLastName",
        email: unverNgoMemberEmail,
        password: "StrongPassddd123!",
      })
      .expect(201)
      .then((response) => {
        unverNgoMemberId = response.body.id;
        unverNgoMemberToken = response.body.token;
      });

    await NGOMemberQueries.insert(db, {
      userId: unverNgoMemberId,
      ngoId: unverNGOId,
      isAdmin: true,
    });

    await request(testServer)
      .post("/register")
      .send({
        firstName: "TesName",
        lastName: "TtLastName",
        email: nonAdminNgoMemberEmail,
        password: "StrongPassddd123!",
      })
      .expect(201)
      .then((response) => {
        nonAdminNgoMemberId = response.body.id;
        nonAdminNgoMemberToken = response.body.token;
      });

    await NGOMemberQueries.insert(db, {
      userId: nonAdminNgoMemberId,
      ngoId: ngoId,
      isAdmin: false,
    });

    //Pet
    petId = uuidv4();
    const pet: Pet = {
      id: petId,
      name: "hung",
      gender: "Female",
      birthdate: new Date("2020-01-01"),
      castration: true,
      weight: 5,
      ngoMemberId: ngoMemberId,
      breed: "Affenpinscher",
      behaviour: "shy",
      kidsAllowed: true,
    };
    await PetQueries.insert(db, pet, tm);
  });

  it("POST /user-profile-pic should upload a user profile picture successfully", async () => {
    await request(testServer)
      .post("/user-profile-pic")
      .set("Authorization", `Bearer ${caretakerToken}`)
      .attach("user-profile-picture", profilePicturePath)
      .expect(201)
      .then((response) => {
        console.log(response.body.profilePictureLink);
        expect(response.body.profilePictureLink).toBeTypeOf("string");
      });
  }, 10000);

  it("POST /pet-profile-pic/:id should upload a profile picture successfully", async () => {
    const res = await request(testServer)
      .post(`/pet-profile-pic/${petId}`)
      .set("Authorization", `Bearer ${ngoMemberToken}`)
      .attach("pet-profile-picture", profilePicturePath)
      .expect(201)
      .then((response) => {
        console.log(response.body.profilePictureLink);
        expect(response.body.profilePictureLink).toBeTypeOf("string");
      });
  }, 10000);

  it("POST /pet-profile-pic/:id should upload a profile picture from unverified NGO Member, should return 403", async () => {
    await request(testServer)
      .post(`/pet-profile-pic/${petId}`)
      .set("Authorization", `Bearer ${unverNgoMemberToken}`)
      .expect(403)
      .then((res) => {
        console.log("Test passed. Status:", res.status);
      })
      .catch((err) => {
        console.error("Test failed due to unexpected error:", err);
        throw err;
      });
  }, 10000);

  it("POST /ngo-logo/:ngoId should upload a ngo logo pic successfully", async () => {
    const res = await request(testServer)
      .post(`/ngo-logo/${ngoId}`)
      .set("Authorization", `Bearer ${ngoMemberToken}`)
      .attach("ngo-logo", logoPath);
    console.log(res.body.logoPictureLink);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("NGO logo picture uploaded successfully.");
    expect(res.body.logoPictureLink).toBeDefined();
  }, 10000);

  it("POST /ngo-logo/:id should fail with 403 as non Admin tries to change logo", async () => {
    const res = await request(testServer)
      .post(`/ngo-logo/${ngoId}`)
      .set("Authorization", `Bearer ${nonAdminNgoMemberToken}`);

    expect(res.status).toBe(403);
  }, 10000);

  it("DELETE /user-profile-pic should delete user profile picture successfully", async () => {
    const res = await request(testServer)
      .delete(`/user-profile-pic `)
      .set("Authorization", `Bearer ${caretakerToken}`);
    expect(res.status).toBe(200);
  });

  it("DELETE /pet-profile-pic/:id should delete pet profile picture successfully", async () => {
    const res = await request(testServer)
      .delete(`/pet-profile-pic/${petId}`)
      .set("Authorization", `Bearer ${ngoMemberToken}`);
    expect(res.status).toBe(200);
  });

  it("DELETE /user-profile-pic should delete non existing profile pic with 404 error", async () => {
    const res = await request(testServer)
      .delete(`/user-profile-pic`)
      .set("Authorization", `Bearer ${caretakerToken}`);
    expect(res.status).toBe(404);
  });

  it("DELETE /ngo-logo/:ngoId should delete ngo Logo successfully", async () => {
    const res = await request(testServer)
      .delete(`/ngo-logo/${ngoId}`)
      .set("Authorization", `Bearer ${ngoMemberToken}`);
    expect(res.status).toBe(200);
  });

  it("POST /pet-pictures/:petId should upload pet pictures successfully", async () => {
    const res = await request(testServer)
      .post(`/pet-pictures/${petId}`)
      .set("Authorization", `Bearer ${ngoMemberToken}`)
      .attach("pet-pictures", picture1)
      .attach("pet-pictures", picture2);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pet pictures uploaded successfully.");
    expect(res.body.pictureLinks).toBeDefined();
    pictureLinks = res.body.pictureLinks as string[];

    const dbResult = await db.executeQuery(
      `SELECT * FROM pet_picture WHERE pet_id = $1`,
      [petId],
    );

    expect(dbResult.rowCount).toBeGreaterThan(1);
  }, 20000);

  it("GET /pet-pictures/:petId should return all pet pictures successfully", async () => {
    const res = await request(testServer)
      .get(`/pet-pictures/${petId}`)
      .set("Authorization", `Bearer ${caretakerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.pictureLinks)).toBe(true);
    expect(res.body.pictureLinks.length).toBeGreaterThan(0);
    expect(res.body.pictureLinks.length).toEqual(pictureLinks.length);
  });

  it("GET /pet-picture/:petId/:pictureLink should return 1 pet picture successfully", async () => {
    const encodedPath = encodeURIComponent(pictureLinks[0]);

    const res = await request(testServer)
      .get(`/pet-picture/${petId}/${encodedPath}`)
      .set("Authorization", `Bearer ${caretakerToken}`);

    expect(res.status).toBe(200);
  });

  it("DELETE /pet-picture/:petId/:pictureLink should delete pet picture", async () => {
    const encodedPath = encodeURIComponent(pictureLinks[0]);

    const res = await request(testServer)
      .delete(`/pet-picture/${petId}/${encodedPath}`)
      .set("Authorization", `Bearer ${ngoMemberToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pet picture deleted successfully.");
  });

  afterAll(async () => {
    await NGOQueries.deleteById(db, ngoId);
    await NGOQueries.deleteById(db, unverNGOId);
    await PetQueries.deleteById(db, petId);
    await UserQueries.deleteByEmail(db, caretakerEmail);
    await UserQueries.deleteByEmail(db, ngoMemberEmail);
    await UserQueries.deleteByEmail(db, nonAdminNgoMemberEmail);
    await UserQueries.deleteByEmail(db, unverNgoMemberEmail);

    await db.endPool();
    await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });
});
