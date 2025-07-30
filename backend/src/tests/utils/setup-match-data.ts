import { DatabaseManager } from "../../database/db";
import { v4 as uuidv4 } from "uuid";
import { PetQueries } from "../../database/queries/pet";
import { CaretakerQueries } from "../../database/queries/caretaker";
import { UserQueries } from "../../database/queries/user";
import request from "supertest";
import http from "http";
import { NGOQueries } from "../../database/queries/ngo";
import { Pet } from "../../models/db-models/pet";
import { Caretaker } from "../../models/db-models/caretaker";
import { NGO } from "../../models/db-models/ngo";
import { User } from "../../models/db-models/user";
import { NGOMemberQueries } from "../../database/queries/ngomember";
import { TranslationManager } from "../../utils/translations-manager";

// pets
const pet1Id = uuidv4();
const pet2Id = uuidv4();
const pet3Id = uuidv4();
const pet4Id = uuidv4();

// caretakers
let ct1Id = uuidv4();
let ct2Id = uuidv4();
let ct3Id = uuidv4();
let ct4Id = uuidv4();
let ctToken1: string;

// ngos
let ngoId = uuidv4();
let unverNGOId = uuidv4();

//ngo members
let ngoMId: string;
let unverNGOMId: string;

let ngoMToken: string;
let unverNGOMToken: string;

export const setupMatchData = async (
  db: DatabaseManager,
  testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >,
  tm: TranslationManager,
) => {
  const pet1: Pet = {
    id: pet1Id,
    name: "Buddy",
    gender: "Male",
    birthdate: new Date("2022-04-10"),
    castration: true,
    weight: 12,
    breed: "American Water Spaniel",
    profilePictureLink: "https://example.com/buddy.jpg",
    lastCheckUp: new Date("2024-12-15"),
    eatingBehaviour: "Eats twice a day, no allergies",
    streetName: "Maple Street",
    cityName: "Berlin",
    zip: "10115",
    country: "Germany",
    houseNumber: "12A",
    localityTypeRequirement: "Urban",
    kidsAllowed: true,
    zipRequirement: "10115",
    experienceRequirement: ">5 Years",
    minimumSpaceRequirement: 30,
  };

  // Pet 2 – Older female cat needing low-space rural environment
  const pet2: Pet = {
    id: pet2Id,
    name: "Mimi",
    gender: "Female",
    birthdate: new Date("2015-06-21"),
    castration: true,
    weight: 4,
    breed: "Abyssinian",
    profilePicturePath: "/images/pets/mimi.png",
    lastCheckUp: new Date("2024-09-10"),
    eatingBehaviour: "Prefers wet food",
    streetName: "Country Road",
    cityName: "Dresden",
    zip: "01127",
    country: "Germany",
    houseNumber: "7",
    localityTypeRequirement: "Rural",
    kidsAllowed: false,
    zipRequirement: "01127",
    experienceRequirement: ">1 Year",
    minimumSpaceRequirement: 10,
  };

  // Pet 3 – Young energetic rabbit, beginner-friendly
  const pet3: Pet = {
    id: pet3Id,
    name: "Hopper",
    gender: "Diverse",
    birthdate: new Date("2023-03-05"),
    castration: false,
    weight: 2,
    breed: "Rat",
    profilePictureLink: "https://example.com/hopper.jpg",
    eatingBehaviour: "Vegetarian diet, fresh greens daily",
    streetName: "Greenway Blvd",
    cityName: "Stuttgart",
    zip: "70173",
    country: "Germany",
    houseNumber: "5C",
    localityTypeRequirement: "Other",
    kidsAllowed: true,
    zipRequirement: "70173",
    experienceRequirement: "No Experience",
    minimumSpaceRequirement: 5,
  };

  // Pet 4 – Middle-aged parrot with moderate experience requirement
  const pet4: Pet = {
    id: pet4Id,
    name: "Rio",
    gender: "Male",
    birthdate: new Date("2018-09-12"),
    castration: false,
    weight: 1,
    breed: "Conure",
    profilePictureLink: "https://example.com/rio.png",
    lastCheckUp: new Date("2025-01-20"),
    eatingBehaviour: "Needs a balanced diet of seeds and fruits",
    streetName: "Palm Alley",
    cityName: "Munich",
    zip: "80331",
    country: "Germany",
    houseNumber: "29",
    localityTypeRequirement: "Urban",
    kidsAllowed: false,
    zipRequirement: "80331",
    experienceRequirement: ">2 Years",
    minimumSpaceRequirement: 8,
  };

  const ct1: Caretaker = {
    userId: ct1Id,
    space: 40,
    experience: ">10 Years",
    tenure: "Paid",
    maritalStatus: "Married",
    financialAssistance: false,
    localityType: "Urban",
    garden: true,
    floor: 0,
    residence: "House",
    streetName: "Elm Street",
    cityName: "Berlin",
    zip: "10115",
    country: "Germany",
    houseNumber: "12A",
    employmentType: "Employed",
    previousAdoption: true,
    numberKids: 2,
    birthdate: new Date("1985-05-20"),
    holidayCare: true,
    adoptionWillingness: true,
  };

  const ct2: Caretaker = {
    userId: ct2Id,
    space: 25,
    experience: "No Experience",
    tenure: "Rented",
    maritalStatus: "Single",
    financialAssistance: true,
    localityType: "Urban",
    garden: false,
    floor: 3,
    residence: "Flat",
    streetName: "Kreuzweg",
    cityName: "Hamburg",
    zip: "20095",
    country: "Germany",
    houseNumber: "5B",
    employmentType: "Student",
    previousAdoption: false,
    numberKids: 0,
    birthdate: new Date("2001-11-02"),
    holidayCare: false,
    adoptionWillingness: true,
  };

  const ct3: Caretaker = {
    userId: ct3Id,
    space: 80,
    experience: ">5 Years",
    tenure: "Paid",
    maritalStatus: "Widowed",
    financialAssistance: false,
    localityType: "Rural",
    garden: true,
    floor: 1,
    residence: "House",
    streetName: "Old Barn Road",
    cityName: "Leipzig",
    zip: "10225",
    country: "Germany",
    houseNumber: "8",
    employmentType: "Unemployed",
    previousAdoption: true,
    numberKids: 3,
    birthdate: new Date("1956-03-15"),
    holidayCare: true,
    adoptionWillingness: true,
  };
  const ct4: Caretaker = {
    userId: ct4Id,
    space: 30,
    experience: ">2 Years",
    tenure: "Other",
    maritalStatus: "Other",
    financialAssistance: true,
    localityType: "Rural",
    garden: false,
    floor: 2,
    residence: "Flat",
    streetName: "Birkenweg",
    cityName: "Freiburg",
    zip: "79098",
    country: "Germany",
    houseNumber: "14",
    employmentType: "Self-employed",
    previousAdoption: false,
    numberKids: 0,
    birthdate: new Date("1990-08-09"),
    holidayCare: false,
    adoptionWillingness: false,
  };

  const ngo: NGO = {
    id: ngoId,
    name: "Happy Animals",
    email: "ngo4u@gmail.com",
    country: "Deutschland",
    verificationDocumentPath: "path",
    verificationDocumentLink: "link",
    verified: true,
    logoPictureLink: "",
    logoPicturePath: "",
    phoneNumber: "",
    memberCount: 6,
    website: ["ngo"],
    mission: "string",
  };

  const unverNGO: NGO = {
    id: unverNGOId,
    name: "Happy Cats",
    email: "ngo4u@gmail.com",
    country: "USA",
    verificationDocumentPath: "path",
    verificationDocumentLink: "link",
    verified: false,
    logoPictureLink: "",
    logoPicturePath: "",
    phoneNumber: "",
    memberCount: 6,
    website: ["ngo"],
    mission: "string",
  };

  await NGOQueries.insert(db, ngo);
  await NGOQueries.insert(db, unverNGO);

  // caretaker
  await request(testServer)
    .post("/register")
    .send({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "hashed_Password_1",
    })
    .then((response) => {
      const body = response.body;
      ctToken1 = body.token;
    });

  // ngomember
  await request(testServer)
    .post("/register")
    .send({
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      password: "hashed_Password_1",
    })
    .then((response) => {
      const body = response.body;
      ngoMToken = body.token;
      ngoMId = body.id;
    });

  await NGOMemberQueries.insert(db, {
    userId: ngoMId,
    ngoId: ngoId,
    isAdmin: false,
  });

  // unverified ngomember
  await request(testServer)
    .post("/register")
    .send({
      firstName: "Claire",
      lastName: "Smith",
      email: "claire@example.com",
      password: "hashed_Password_1",
    })
    .then((response) => {
      const body = response.body;
      unverNGOMToken = body.token;
      unverNGOMId = body.id;
    });

  await NGOMemberQueries.insert(db, {
    userId: unverNGOMId,
    ngoId: unverNGOId,
    isAdmin: false,
  });

  await request(testServer)
    .post("/caretaker")
    .set("Authorization", `Bearer ${ctToken1}`)
    .send({
      space: 30,
      experience: ">2 Years",
      tenure: "Other",
      maritalStatus: "Other",
      financialAssistance: true,
      localityType: "Rural",
      garden: false,
      floor: 2,
      residence: "Flat",
      streetName: "Birkenweg",
      cityName: "Freiburg",
      zip: "79098",
      country: "Germany",
      houseNumber: "14",
      employmentType: "Self-employed",
      previousAdoption: false,
      numberKids: 0,
      birthdate: new Date("1990-08-09"),
      holidayCare: false,
      adoptionWillingness: false,
    });

  const u1: User = {
    id: ct1Id,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    password: "hashed_password_1",
    profilePictureLink: "https://example.com/profiles/alice.jpg",
    phoneNumber: "+491234567890",
    isAdmin: false,
    isNgoUser: false,
  };

  const u2: User = {
    id: ct2Id,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    password: "hashed_password_1",
    profilePictureLink: "https://example.com/profiles/alice.jpg",
    phoneNumber: "+491234567890",
    isAdmin: false,
    isNgoUser: false,
  };
  const u3: User = {
    id: ct3Id,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    password: "hashed_password_1",
    profilePictureLink: "https://example.com/profiles/alice.jpg",
    phoneNumber: "+491234567890",
    isAdmin: false,
    isNgoUser: false,
  };

  const u4: User = {
    id: ct4Id,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    password: "hashed_password_1",
    profilePictureLink: "https://example.com/profiles/alice.jpg",
    phoneNumber: "+491234567890",
    isAdmin: false,
    isNgoUser: false,
  };

  await PetQueries.insert(db, pet1, tm);
  await PetQueries.insert(db, pet2, tm);
  await PetQueries.insert(db, pet3, tm);
  await PetQueries.insert(db, pet4, tm);

  await UserQueries.insert(db, u1);
  await UserQueries.insert(db, u2);
  await UserQueries.insert(db, u3);
  await UserQueries.insert(db, u4);

  await CaretakerQueries.insert(db, ct1, tm);
  await CaretakerQueries.insert(db, ct2, tm);
  await CaretakerQueries.insert(db, ct3, tm);
  await CaretakerQueries.insert(db, ct4, tm);

  return {
    pet1,
    pet2,
    pet3,
    pet4,
    ct1,
    ct2,
    ct3,
    ct4,
    ctToken1,
    ngoMToken,
    unverNGOMToken,
  };
};

export const deleteMatchSetup = async (db: DatabaseManager) => {
  await PetQueries.deletePetById(db, pet1Id);
  await PetQueries.deletePetById(db, pet2Id);
  await PetQueries.deletePetById(db, pet3Id);
  await PetQueries.deletePetById(db, pet4Id);

  await UserQueries.deleteById(db, ct1Id);
  await UserQueries.deleteById(db, ct2Id);
  await UserQueries.deleteById(db, ct3Id);
  await UserQueries.deleteById(db, ct4Id);
  await UserQueries.deleteByEmail(db, "alice@example.com");
  await UserQueries.deleteByEmail(db, "john@example.com");
  await UserQueries.deleteByEmail(db, "claire@example.com");

  await NGOQueries.deleteByEmail(db, "ngo4u@gmail.com");
};
