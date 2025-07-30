import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import { server } from "../app"; // app statt server.listen
import { DatabaseManager } from "../database/db";
import { v4 as uuidv4 } from "uuid";
import http from "http";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { UserQueries } from "../database/queries/user";
import { FullNGO, NGO } from "../models/db-models/ngo";
import { NGOQueries } from "../database/queries/ngo";
import { NGOHoursQueries } from "../database/queries/ngohours";
import { startTestServer } from "./utils/test-server";
import { TranslationManager } from "../utils/translations-manager";

describe("Test NGO routes", () => {
  let db: DatabaseManager;
  let authToken = "";

  let ngoMemberNotAdminToken: string;
  let ngoMemberNotAdminId: string;
  let ngoMemberId!: string;
  let ngoId = uuidv4();
  let ngoNotVerId = uuidv4();
  let testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  let tm = TranslationManager.getInstance();
  tm.setLocale("en");

  beforeAll(async () => {
    testServer = startTestServer(server, "3006");

    db = DatabaseManager.getInstance();
    await db.migrateForTest();
    const ngo: NGO = {
      id: ngoId,
      name: "Global Hope Foundation",
      email: "contact@globalhope.org",
      country: "Germany",
      verificationDocumentPath: "/documents/verification/global-hope.pdf",
      verificationDocumentLink:
        "https://cdn.ngoplatform.org/docs/global-hope.pdf",
      verified: true,
      logoPicturePath: "/images/logos/global-hope.png",
      logoPictureLink: "https://cdn.ngoplatform.org/logos/global-hope.png",
      phoneNumber: "+49 30 123456789",
      memberCount: 250,
      website: ["https://www.globalhope.org"],
      mission:
        "To empower communities through education, health, and sustainability initiatives.",
    };
    const ngoNotVerified: NGO = {
      id: ngoNotVerId,
      name: "Youth for Tomorrow",
      email: "info@youthfortomorrow.net",
      country: "Kenya",
      verificationDocumentPath:
        "/documents/verification/youth-for-tomorrow.pdf",
      verificationDocumentLink:
        "https://cdn.ngoplatform.org/docs/youth-for-tomorrow.pdf",
      verified: false,
      logoPicturePath: "/images/logos/youth-for-tomorrow.png",
      logoPictureLink:
        "https://cdn.ngoplatform.org/logos/youth-for-tomorrow.png",
      phoneNumber: "+254 712 345678",
      memberCount: 120,
      website: ["https://www.youthfortomorrow.net"],
      mission:
        "To support underprivileged youth through education and skill development programs.",
    };
    await NGOQueries.insert(db, ngo);
    await NGOQueries.insert(db, ngoNotVerified);

    await request(testServer)
      .post("/register")
      .send({
        email: "a.rahman23@students.hu-berlin.de",
        password: "adminpassWord.123",
        firstName: "Hellen",
        lastName: "Muster",
        isAdmin: false,
      })
      .then((response) => {
        authToken = response.body.token;
        ngoMemberId = response.body.id;
      });
    await request(testServer)
      .post("/register")
      .send({
        email: "hannah.wolf@student.uni-koeln.de",
        password: "notadminpAssword!221",
        firstName: "Mister",
        lastName: "Muster",
        isAdmin: false,
      })
      .then((response) => {
        ngoMemberNotAdminToken = response.body.token;
        ngoMemberNotAdminId = response.body.id;
      });
    await NGOMemberQueries.insert(db, {
      ngoId: ngoId,
      userId: ngoMemberId,
      isAdmin: true,
    });
    await NGOMemberQueries.insert(db, {
      ngoId: ngoId,
      userId: ngoMemberNotAdminId,
      isAdmin: false,
    });

    // not admin ngo??
  });

  afterAll(async () => {
    await NGOQueries.deleteById(db, ngoId);
    await NGOQueries.deleteById(db, ngoNotVerId);
    await UserQueries.deleteById(db, ngoMemberId);
    await UserQueries.deleteById(db, ngoMemberNotAdminId);
    await db.endPool();
    await new Promise<void>((resolve) => {
      testServer.close(() => resolve());
    });
  });

  it("GET /ngo returns NGO details", async () => {
    // Falls noch keine NGO erstellt wurde, erstelle eine

    const createRes = await request(testServer)
      .get(`/ngo/${ngoId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);
    expect(createRes.status).toBe(200);
  });

  it("PUT /ngo/:ngoId updates NGO details", async () => {
    const ngo = {
      id: ngoId,
      name: "Global Hope Foundation",
      email: "contact@globalhope.org",
      country: "Germany",
      verificationDocumentPath: "/documents/verification/global-hope.pdf",
      verificationDocumentLink:
        "https://cdn.ngoplatform.org/docs/global-hope.pdf",
      verified: true,
      logoPicturePath: "/images/logos/global-hope.png",
      logoPictureLink: "https://cdn.ngoplatform.org/logos/global-hope.png",
      phoneNumber: "+49 30 123479234",
      memberCount: 250,
      website: ["https://www.globalhope.org"],
      mission:
        "To empower communities through education, health, and sustainability initiatives.",
      ngoHours: [
        { startTime: "08:00", endTime: "13:00", weekday: "Monday" },
        { startTime: "13:00", endTime: "18:00", weekday: "Tuesday" },
        { startTime: "14:00", endTime: "18:00", weekday: "Wednesday" },
      ],
    };
    await request(testServer)
      .put(`/ngo/${ngoId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ ngo: ngo })
      .expect(200);

    let newNgo = await NGOQueries.selectById(db, ngoId);
    let ngoHours = await NGOHoursQueries.selectById(db, ngoId, tm);
    expect(newNgo?.phoneNumber).toBe("+49 30 123479234");
    expect(ngoHours).toBeDefined();
  });

  it("PUT /ngo/:ngoId updates NGO details without admin status, should return 403", async () => {
    const ngo = {
      id: ngoId,
      name: "Global Hope Foundation",
      email: "contact@globalhope.org",
      country: "Germany",
      verificationDocumentPath: "/documents/verification/global-hope.pdf",
      verificationDocumentLink:
        "https://cdn.ngoplatform.org/docs/global-hope.pdf",
      verified: true,
      logoPicturePath: "/images/logos/global-hope.png",
      logoPictureLink: "https://cdn.ngoplatform.org/logos/global-hope.png",
      phoneNumber: "+49 30 123479234",
      memberCount: 250,
      website: ["https://www.globalhope.org"],
      mission:
        "To empower communities through education, health, and sustainability initiatives.",
      ngoHours: [],
    };
    await request(testServer)
      .put(`/ngo/${ngoId}`)
      .set("Authorization", `Bearer ${ngoMemberNotAdminToken}`)
      .send(ngo)
      .expect(403);
  });

  it("DELETE /ngo/:ngoId deletes ngo profile by non admin ngo, should return 403", async () => {
    await request(testServer)
      .delete(`/ngo/${ngoId}`)
      .set("Authorization", `Bearer ${ngoMemberNotAdminToken}`)
      .expect(403);
  });

  it("DELETE /ngo/:ngoId deletes ngo profile", async () => {
    await request(testServer)
      .delete(`/ngo/${ngoId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);
  });
});
