import { CTHoursQueries } from "../database/queries/cthours";
import { databaseManager } from "../app";
import {
  CaretakerNotFoundError,
  EmptyCaretakerHours,
  MissingMatchingDataError,
} from "./errors";
import { PetVaccinationQueries } from "../database/queries/petvaccination";
import { InterestedPetQueries } from "../database/queries/interestedpet";
import PetVaccination from "../models/db-models/petvaccination";
import { Pet } from "../models/db-models/pet";
import { Caretaker } from "../models/db-models/caretaker";
import InterestedPet from "../models/db-models/interestedpet";
import CTHours from "../models/db-models/cthours";
import { TranslationManager } from "./translations-manager";
// TODO: Test this function and add this to all update requests

const WEIGHT = 100 / 9;
/**  This function will calculate the match score between caretaker and animal as a background process */
/**
 * This function will calculate the match score between caretaker and animal as a background process.
 * It evaluates various criteria including location, experience, space, and other requirements.
 */
export async function calculateMatchScore(
  pet: Pet,
  caretaker: Caretaker,
  tm: TranslationManager,
): Promise<number> {
  const availableTime: number | undefined = await calculateAvailableTime(
    caretaker,
    tm,
  );
  const petVaccination: PetVaccination[] =
    await PetVaccinationQueries.selectById(databaseManager, pet.id);

  let score = 0;

  if (
    pet.zipRequirement &&
    pet.experienceRequirement &&
    pet.minimumSpaceRequirement &&
    pet.kidsAllowed != undefined &&
    pet.localityTypeRequirement
  ) {
    // Match zip requirement
    score = matchZip(score, pet.zipRequirement, caretaker.zip);
    // Match locality requirement
    score = matchLocality(
      score,
      pet.localityTypeRequirement,
      caretaker.localityType,
    );
    // Match experience requirement
    score = matchExperience(
      score,
      pet.experienceRequirement,
      caretaker.experience,
    );
    // Match minimum space requirement
    score = matchMinimumSpace(
      score,
      pet.minimumSpaceRequirement,
      caretaker.space,
    );
    // Match numberKids with kidsAllowed
    score = matchKidsAllowd(score, pet.kidsAllowed, caretaker.numberKids);
    // +1 if one of these is available
    score = matchHolidayCare(score, caretaker.holidayCare);
    score = matchCastration(score, pet.castration);
    score = matchAvailableTime(score, availableTime);
    score = matchVaccination(score, petVaccination.length);
  } else {
    throw MissingMatchingDataError;
  }
  // round to 2 decimal places
  score = Math.round(score * 100) / 100;
  // save score to the database
  const ip: InterestedPet = {
    userId: caretaker.userId,
    petId: pet.id,
    score: score,
  };
  await InterestedPetQueries.setScore(databaseManager, ip);
  return score;
}

/**
 * Helper to calculate available time based on caretaker's schedule.
 * This function processes the caretaker's CTHours to determine total available minutes.
 * @param caretaker - The caretaker object containing user ID and schedule information.
 * @returns Total available minutes if schedule exists, undefined otherwise.
 */
async function calculateAvailableTime(
  caretaker: Caretaker,
  tm: TranslationManager,
): Promise<number | undefined> {
  let totalAvailableMinutes: number;
  // Get caretaker hours from caretaker
  if (caretaker.userId === undefined) {
    throw CaretakerNotFoundError;
  }
  const caretakerHours: CTHours[] = await CTHoursQueries.selectById(
    databaseManager,
    caretaker.userId,
    tm,
  );

  if (caretakerHours.length > 0) {
    totalAvailableMinutes = 0;
    for (let i = 0; i < caretakerHours.length; i++) {
      let cth = caretakerHours[i];
      let availableMinutesPerCTH = 0;
      if (cth.weekday && cth.startTime && cth.endTime) {
        const startTime = new Date(cth.startTime); // expected time format: hour:minutes e.g. 12:00:00
        const endTime = new Date(cth.endTime);

        const startInMinutes =
          startTime.getHours() * 60 + startTime.getMinutes();
        const endInMinutes = endTime.getHours() * 60 + endTime.getMinutes();

        const totalMinutes = endInMinutes - startInMinutes;
        if (totalMinutes > 0) {
          availableMinutesPerCTH = totalMinutes;
          totalAvailableMinutes += availableMinutesPerCTH;
        } else {
          totalAvailableMinutes += 0;
        }
      } else {
        // Empty CTH
        throw EmptyCaretakerHours;
      }
    }
    return totalAvailableMinutes;
  } else {
    // return undefined if no cth is available in db
    return undefined;
  }
}

/**
 * Helper to map experience string to numeric level.
 * Converts experience strings to a standardized numeric value for comparison.
 * @param level - Experience level string.
 * @returns Numeric representation of the experience level.
 */
function normalizeExp(level: string): number {
  const map: Record<string, number> = {
    "No Experience": 0,
    ">1 Year": 1,
    ">2 Years": 2,
    ">5 Years": 3,
    ">10 Years": 4,
  };
  return map[level] ?? 0;
}

/**
 * Matches zip code requirement between pet and caretaker.
 * @param score - Current match score.
 * @param petzipRequirement - Pet's zip code requirement.
 * @param caretakerZip - Caretaker's zip code.
 * @returns Updated match score based on zip code match.
 */
export function matchZip(
  score: number,
  petzipRequirement: string,
  caretakerZip: string,
): number {
  if (
    petzipRequirement === caretakerZip ||
    Math.abs(parseInt(petzipRequirement) - parseInt(caretakerZip)) <= 1000
  ) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Matches locality type requirement between pet and caretaker.
 * @param score - Current match score.
 * @param petlocalityTypeRequirement - Pet's locality type requirement.
 * @param caretakerlocalityType - Caretaker's locality type.
 * @returns Updated match score based on locality match.
 */
export function matchLocality(
  score: number,
  petlocalityTypeRequirement: string,
  caretakerlocalityType: string,
): number {
  if (petlocalityTypeRequirement === caretakerlocalityType) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Matches experience requirement between pet and caretaker.
 * Compares normalized experience levels to determine match.
 * @param score - Current match score.
 * @param petexperienceRequirement - Pet's experience requirement.
 * @param caretakerExperience - Caretaker's experience level.
 * @returns Updated match score based on experience match.
 */
export function matchExperience(
  score: number,
  petexperienceRequirement: string,
  caretakerExperience: string,
): number {
  if (
    normalizeExp(petexperienceRequirement) <= normalizeExp(caretakerExperience)
  ) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Matches minimum space requirement between pet and caretaker.
 * @param score - Current match score.
 * @param petminimumSpaceRequirement - Pet's minimum space requirement.
 * @param caretakerSpace - Caretaker's available space.
 * @returns Updated match score based on space match.
 */
export function matchMinimumSpace(
  score: number,
  petminimumSpaceRequirement: number,
  caretakerSpace: number,
): number {
  if (petminimumSpaceRequirement <= caretakerSpace) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Matches kids allowed requirement between pet and caretaker.
 * @param score - Current match score.
 * @param petkidsAllowed - Pet's kids allowed flag.
 * @param caretakernumberKids - Caretaker's number of kids.
 * @returns Updated match score based on kids requirement match.
 */
export function matchKidsAllowd(
  score: number,
  petkidsAllowed: boolean,
  caretakernumberKids: number,
): number {
  if (
    petkidsAllowed
      ? caretakernumberKids > 0
        ? true
        : false
      : caretakernumberKids == 0
        ? true
        : false
  ) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Raises score if caretaker has holiday care capability.
 * @param score - Current match score.
 * @param caretakerHolidayCare - Caretaker's holiday care availability.
 * @returns Updated match score based on holiday care availability.
 */
export function matchHolidayCare(
  score: number,
  caretakerHolidayCare: boolean,
): number {
  if (caretakerHolidayCare) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Raises score if pet has castration status.
 * @param score - Current match score.
 * @param petCastration - Pet's castration status.
 * @returns Updated match score based on castration status.
 */
export function matchCastration(
  score: number,
  petCastration: boolean | undefined,
): number {
  if (petCastration) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Raises score if caretaker has enough available time.
 * @param score - Current match score.
 * @param availableTime - Total available minutes calculated from CTHours.
 * @returns Updated match score based on available time.
 */
export function matchAvailableTime(
  score: number,
  availableTime: number | undefined,
): number {
  if (availableTime && availableTime > 60) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}

/**
 * Raises score if pet has vaccination records.
 * @param score - Current match score.
 * @param petVaccinationLength - Number of vaccination records for the pet.
 * @returns Updated match score based on vaccination status.
 */
export function matchVaccination(
  score: number,
  petVaccinationLength: number,
): number {
  if (petVaccinationLength > 0) {
    score += WEIGHT;
    return Math.round(score * 100) / 100;
  } else {
    return score;
  }
}
