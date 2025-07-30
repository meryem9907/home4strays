import { v4 as uuidv4 } from "uuid";
import { Pet } from "../../models/db-models/pet";
import { NGO } from "../../models/db-models/ngo";
import { NGOQueries } from "../../database/queries/ngo";
import { DatabaseManager } from "../../database/db";
import { PetQueries } from "../../database/queries/pet";
import { TranslationManager } from "../../utils/translations-manager";

let petId: string;
let ngoId: string;
export const setupProfiles = async (
  db: DatabaseManager,
  tm: TranslationManager,
) => {
  petId = uuidv4();
  ngoId = uuidv4();
  const ngo: NGO = {
    id: ngoId,
    name: "Guardians of the Stray",
    country: "Germany",
    verified: false,
    verificationDocumentLink: "dummy",
    verificationDocumentPath: "dummy",
  };
  await NGOQueries.insert(db, ngo);
  const pet: Pet = {
    id: petId,
    name: "Süßer kleiner Engel",
    breed: "Afghan Hound",
    gender: "Weiblich",
    birthdate: new Date("2020-01-01"),
    weight: 5,
    profilePictureLink: "link",
    profilePicturePath: "path",
    castration: true,
    lastCheckUp: new Date("2023-01-01"),
    eatingBehaviour: "good",
    streetName: "Parkstraße",
    cityName: "Berlin",
    zip: "10115",
    country: "Deutschland",
    houseNumber: "1",
    localityTypeRequirement: "Städtisch",
    kidsAllowed: true,
    zipRequirement: "10115",
    experienceRequirement: "Mehr als 1 Jahr",
    minimumSpaceRequirement: 50,
  };
  await PetQueries.insert(db, pet, tm);
};

export const deleteProfilesSetup = async (db: DatabaseManager) => {
  await NGOQueries.deleteById(db, ngoId);
  await PetQueries.deletePetById(db, petId);
};
