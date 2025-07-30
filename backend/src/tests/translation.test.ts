import { describe, it, afterAll, beforeAll, expect } from "vitest";
import { server } from "../app";
import request from "supertest";
import { DatabaseManager } from "../database/db";
import { UserQueries } from "../database/queries/user";
import { startTestServer } from "./utils/test-server";
import http from "http";
import { TranslationManager } from "../utils/translations-manager";
import { Experience } from "../models/enums";

describe("TEST translation manager", () => {
  let gerTm: TranslationManager; // german translator
  let trTm: TranslationManager; // turkish translator
  let db: DatabaseManager;
  beforeAll(async () => {
    gerTm = TranslationManager.getInstance();
    gerTm.setLocale("de");

    trTm = TranslationManager.getInstance();
    trTm.setLocale("tr");

    //db = DatabaseManager.getInstance();
  });

  afterAll(async () => {
    //await db.endPool();
  });

  it("Test translating enums", async () => {
    // get all experience enums
    const experiences = Object.values(Experience);
    let gerTranslatedExperiences = [];
    let trTranslatedExperiences = [];

    for (const experience of experiences) {
      gerTranslatedExperiences.push(gerTm.getExperienceTranslation(experience));
      trTranslatedExperiences.push(trTm.getExperienceTranslation(experience));
    }
    expect(trTranslatedExperiences).toEqual([
      "10 yıldan fazla",
      "5 yıldan fazla",
      "2 yıldan fazla",
      "1 yıldan fazla",
      "Deneyim yok",
    ]);
    expect(gerTranslatedExperiences).toEqual([
      "Mehr als 10 Jahre",
      "Mehr als 5 Jahre",
      "Mehr als 2 Jahre",
      "Mehr als 1 Jahr",
      "Keine Erfahrung",
    ]);
  });

  it("Test reverse translating enums", async () => {
    // get all experience enums
    const trExperiences = [
      "10 yıldan fazla",
      "5 yıldan fazla",
      "2 yıldan fazla",
      "1 yıldan fazla",
      "Deneyim yok",
    ];
    const gerExperiences = [
      "Mehr als 10 Jahre",
      "Mehr als 5 Jahre",
      "Mehr als 2 Jahre",
      "Mehr als 1 Jahr",
      "Keine Erfahrung",
    ];

    let gerTranslatedExperiences = [];
    let trTranslatedExperiences = [];

    for (const experience of trExperiences) {
      trTranslatedExperiences.push(
        trTm.findExperienceFromTranslation(experience),
      );
    }

    for (const experience of gerExperiences) {
      gerTranslatedExperiences.push(
        gerTm.findExperienceFromTranslation(experience),
      );
    }
    expect(trTranslatedExperiences).toEqual([
      ">10 Years",
      ">5 Years",
      ">2 Years",
      ">1 Year",
      "No Experience",
    ]);

    expect(gerTranslatedExperiences).toEqual([
      ">10 Years",
      ">5 Years",
      ">2 Years",
      ">1 Year",
      "No Experience",
    ]);
  });
});
