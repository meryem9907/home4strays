import { DatabaseManager } from "../../database/db";
import request from "supertest";
import http from "http";
import { UserQueries } from "../../database/queries/user";
import { NGOQueries } from "../../database/queries/ngo";
import { v4 as uuidv4 } from "uuid";
import { NGOMember } from "../../models/db-models/ngomember";
import { NGOMemberQueries } from "../../database/queries/ngomember";
import { PetQueries } from "../../database/queries/pet";
import { Pet } from "../../models/db-models/pet";
import { CaretakerQueries } from "../../database/queries/caretaker";
import { Caretaker } from "../../models/db-models/caretaker";
import { NGO } from "../../models/db-models/ngo";
import { TranslationManager } from "../../utils/translations-manager";

let ngoUser1Id: string;
let ngoUser2Id: string;
let careUser1Id: string;
let careUser2Id: string;
let ngoId1 = uuidv4();
let ngoId2 = uuidv4();
let pet1Id = uuidv4();
let pet2Id = uuidv4();
let pet3Id = uuidv4();
let pet4Id = uuidv4();

export const setupNGOWithAnimal = async (
  db: DatabaseManager,
  testServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >,
) => {
  // Create user
  await request(testServer)
    .post("/register")
    .send({
      firstName: "Nick",
      lastName: "Holmes",
      email: "nick.holmes@mail.com",
      password: "0S0$:W7ae3qy",
    })
    .then((value) => {
      ngoUser1Id = value.body.id;
    });
  await request(testServer)
    .post("/register")
    .send({
      firstName: "Enola",
      lastName: "Wintergarten",
      email: "enola.wintergarten@mail.com",
      password: "0S0$:W7ae3qy",
    })
    .then((value) => {
      ngoUser2Id = value.body.id;
    });

  await request(testServer)
    .post("/register")
    .send({
      firstName: "Oliver",
      lastName: "Twist",
      email: "oliver.twist@mail.com",
      password: "0S0$:W7ae3qy",
    })
    .then((value) => {
      console.log("Oliver ID: ", value.body.id);
      careUser1Id = value.body.id;
    });

  await request(testServer)
    .post("/register")
    .send({
      firstName: "Lucy",
      lastName: "Smith",
      email: "lucy.smith@mail.com",
      password: "0S0$:W7ae3qy",
    })
    .then((value) => {
      console.log("Lucy ID: ", value.body.id);
      careUser2Id = value.body.id;
    });

  // Animals
  const pet1: Pet = {
    id: pet1Id,
    name: "Snowpiercer",
    breed: "Akita",
    gender: "Female",
    birthdate: new Date("2020-02-02"),
    weight: 20,
    profilePictureLink: "dummyLink",
    profilePicturePath: "dummyPath",
    castration: true,
    lastCheckUp: new Date("2023-01-01"),
    eatingBehaviour: "Carnivore, loves fish.",
    ngoMemberId: ngoUser1Id,
    streetName: "streetName",
    cityName: "cityName",
    zip: "12345",
    country: "Germany",
    houseNumber: "1A",
    localityTypeRequirement: "Urban",
    kidsAllowed: true,
    zipRequirement: "12345",
    experienceRequirement: ">5 Years",
    minimumSpaceRequirement: 20,
  };

  const pet2: Pet = {
    id: pet2Id,
    name: "Little Angel",
    breed: "Snowshoe",
    gender: "Female",
    birthdate: new Date("2010-02-02"),
    weight: 5,
    profilePictureLink: "dummyLink",
    profilePicturePath: "dummyPath",
    castration: true,
    lastCheckUp: new Date("2023-01-01"),
    eatingBehaviour: "eats plants",
    ngoMemberId: ngoUser1Id,
    streetName: "streetName",
    cityName: "cityName",
    zip: "12345",
    country: "Turkey",
    houseNumber: "1A",
    localityTypeRequirement: "Urban",
    kidsAllowed: true,
    zipRequirement: "12345",
    experienceRequirement: ">5 Years",
    minimumSpaceRequirement: 20,
  };

  const pet3: Pet = {
    id: pet3Id,
    name: "Crazy Cat",
    breed: "Siamese",
    gender: "Female",
    birthdate: new Date("2010-02-02"),
    weight: 5,
    profilePictureLink: "dummyLink",
    profilePicturePath: "dummyPath",
    castration: true,
    lastCheckUp: new Date("2023-01-01"),
    eatingBehaviour: "Fleischfresser",
    ngoMemberId: ngoUser2Id,
    streetName: "streetName",
    cityName: "cityName",
    zip: "12345",
    country: "England",
    houseNumber: "1A",
    localityTypeRequirement: "Urban",
    kidsAllowed: true,
    zipRequirement: "12345",
    experienceRequirement: ">5 Years",
    minimumSpaceRequirement: 20,
  };

  const petGerman: Pet = {
    id: pet4Id,
    name: "Verrückte Katze",
    breed: "Siamese",
    gender: "Weiblich",
    birthdate: new Date("2010-02-02"),
    weight: 5,
    profilePictureLink: "dummyLink",
    profilePicturePath: "dummyPath",
    castration: true,
    lastCheckUp: new Date("2023-01-01"),
    eatingBehaviour: "Fleischfresser",
    ngoMemberId: ngoUser2Id,
    streetName: "streetName",
    cityName: "cityName",
    zip: "12345",
    country: "Deutschland",
    houseNumber: "1A",
    localityTypeRequirement: "Städtisch",
    kidsAllowed: true,
    zipRequirement: "12345",
    experienceRequirement: "Mehr als 5 Jahre",
    minimumSpaceRequirement: 20,
  };
  // Caretakers
  const caretaker1: Caretaker = {
    userId: careUser1Id,
    space: 120,
    experience: ">10 Years",
    tenure: "Paid",
    maritalStatus: "Married",
    financialAssistance: false,
    localityType: "Rural",
    garden: true,
    floor: 0,
    residence: "House",
    streetName: "Oak Lane",
    cityName: "Stuttgart",
    zip: "70173",
    country: "Germany",
    houseNumber: "45",
    employmentType: "Self-employed",
    previousAdoption: true,
    numberKids: 3,
    birthdate: new Date("1978-04-22"),
    holidayCare: true,
    adoptionWillingness: true,
  };

  const caretaker2: Caretaker = {
    userId: careUser2Id,
    space: 45,
    experience: "No Experience",
    tenure: "Rented",
    maritalStatus: "Single",
    financialAssistance: true,
    localityType: "Urban",
    garden: false,
    floor: 3,
    residence: "Flat",
    streetName: "Lindenstraße",
    cityName: "Cologne",
    zip: "50667",
    country: "Germany",
    houseNumber: "12B",
    employmentType: "Student",
    previousAdoption: false,
    numberKids: 0,
    birthdate: new Date("1999-09-10"),
    holidayCare: false,
    adoptionWillingness: true,
  };

  const ngo1: NGO = {
    id: ngoId1,
    name: "Pets for Friends",
    country: "Germany",
    email: "pets4friends@mail.com",
    verificationDocumentLink: "dummy",
    verificationDocumentPath: "dummy",
    verified: false,
  };
  const ngo2: NGO = {
    id: ngoId2,
    name: "Stray Lovers",
    country: "England",
    email: "stray.lovers@mail.com",
    verificationDocumentLink: "dummy",
    verificationDocumentPath: "dummy",
    verified: false,
  };

  // ngo members
  const ngoMember1: NGOMember = {
    userId: ngoUser1Id,
    ngoId: ngoId1,
    isAdmin: false,
  };
  const ngoMember2: NGOMember = {
    userId: ngoUser2Id,
    ngoId: ngoId2,
    isAdmin: false,
  };
  // Create ngo
  await NGOQueries.insert(db, ngo1);
  await NGOQueries.insert(db, ngo2);
  // Create ngomember
  console.log("NGO User 1 ID: ", ngoUser1Id);
  await NGOMemberQueries.insert(db, ngoMember1);
  await NGOMemberQueries.insert(db, ngoMember2);
  // Create animals
  let tm = TranslationManager.getInstance();
  tm.setLocale("en");
  await PetQueries.insert(db, pet1, tm);
  await PetQueries.insert(db, pet2, tm);
  await PetQueries.insert(db, pet3, tm);
  let deTm = TranslationManager.getInstance();
  deTm.setLocale("de");
  await PetQueries.insert(db, petGerman, deTm);
  // Create Caretaker
  await CaretakerQueries.insert(db, caretaker1, tm);
  await CaretakerQueries.insert(db, caretaker2, tm);
};

export const deleteSetupNGOWithAnimal = async (db: DatabaseManager) => {
  // delete user
  await UserQueries.deleteByEmail(db, "nick.holmes@mail.com");
  await UserQueries.deleteByEmail(db, "enola.wintergarten@mail.com");
  await UserQueries.deleteByEmail(db, "oliver.twist@mail.com");
  await UserQueries.deleteByEmail(db, "lucy.smith@mail.com");

  // delete ngo too
  await NGOQueries.deleteByEmail(db, "pets4friends@mail.com");
  await NGOQueries.deleteByEmail(db, "stray.lovers@mail.com");
  // delete Animals
  await PetQueries.deleteByName(db, "Little Angel");
  await PetQueries.deleteByName(db, "Snowpiercer");
  await PetQueries.deleteByName(db, "Crazy Cat");
  await PetQueries.deleteByName(db, "Sweet Dog");
  await PetQueries.deleteByName(db, "Verrückte Katze");
};
