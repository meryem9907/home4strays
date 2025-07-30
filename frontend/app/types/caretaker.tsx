import { Experience, LocalityType } from "./addAnimal";
import { CTHours } from "./ngoMember";

/**
 * Represents a complete caretaker profile in the animal adoption system.
 *
 * This type defines all information about users who want to adopt or care for animals,
 * including personal details, living situation, experience, and availability.
 * Used for matching caretakers with suitable animals based on compatibility.
 *
 * @type {Caretaker}
 */
export type Caretaker = {
  /** Unique identifier linking to the user account */
  userId: string;

  /** Caretaker's first name */
  firstName: string;

  /** Caretaker's last name */
  lastName: string;

  /** Caretaker's email address for communication */
  email: string;

  /** Optional phone number for direct contact */
  phoneNumber?: string;

  /** Optional URL to caretaker's profile picture */
  profilePictureLink?: string;

  /**
   * Caretaker's marital status or empty string if not specified.
   * Used to understand household composition.
   */
  maritalStatus: MaritalStatus | "";

  /**
   * Date of birth in ISO string format.
   * Used for age verification and compatibility matching.
   */
  birthdate: string;

  /**
   * Number of children in the household.
   * Important for matching animals that are child-friendly.
   */
  numberKids: number;

  /** Street name of caretaker's residence */
  streetName: string;

  /** House number of caretaker's residence */
  houseNumber: string;

  /** City name of caretaker's residence */
  cityName: string;

  /** Postal/ZIP code for proximity matching */
  zip: string;

  /** Country of residence */
  country: string;

  /**
   * Type of locality (urban/rural) or empty string.
   * Used to match with animal location requirements.
   */
  localityType: LocalityType | "";

  /**
   * Available living space in square meters.
   * Used to ensure adequate space for animal needs.
   */
  space: number;

  /** Floor number of residence (relevant for apartment living) */
  floor: number;

  /** Whether the residence has a garden or yard */
  garden: boolean;

  /**
   * Type of residence or empty string.
   * Helps determine suitability for different animals.
   */
  residence: Residence | "";

  /**
   * Housing tenure status or empty string.
   * Important for understanding stability and permission for pets.
   */
  tenure: Tenure | "";

  /** Whether caretaker can provide financial assistance for animal care */
  financialAssistance: boolean;

  /**
   * Employment status or empty string.
   * Helps assess availability and financial stability.
   */
  employmentType: Employment | "";

  /** Whether caretaker has previous adoption experience */
  previousAdoption: boolean;

  /** Whether caretaker can provide holiday/temporary care */
  holidayCare: boolean;

  /** Whether caretaker is willing to adopt (vs. just foster) */
  adoptionWillingness: boolean;

  /**
   * Level of experience with animals or empty string.
   * Used to match with animals requiring specific experience levels.
   */
  experience: Experience | "";

  /**
   * Array of availability hours and schedules.
   * Defines when caretaker is available for animal care activities.
   */
  ctHours: CTHours[];

  /**
   * Optional compatibility score for animal matching.
   * Calculated score used in matching algorithms.
   */
  score?: number;
};

/**
 * Marital status options for caretakers.
 *
 * Used to understand household composition and stability
 * for appropriate animal placement decisions.
 *
 * @type {MaritalStatus}
 */
export type MaritalStatus = "Married" | "Single" | "Widowed" | "Other";

/**
 * Types of residence where caretakers live.
 *
 * Important for determining space availability and suitability
 * for different types and sizes of animals.
 *
 * @type {Residence}
 */
export type Residence = "House" | "Flat" | "Other";

/**
 * Housing tenure status indicating ownership/rental situation.
 *
 * Important for understanding:
 * - Permission to keep pets
 * - Housing stability
 * - Long-term commitment ability
 *
 * @type {Tenure}
 */
export type Tenure = "Rented" | "Paid" | "Other";

/**
 * Employment status categories for caretakers.
 *
 * Used to assess:
 * - Financial stability for animal care costs
 * - Time availability for animal care
 * - Long-term commitment capability
 *
 * @type {Employment}
 */
export type Employment =
  | "Employed"
  | "Freelancer"
  | "Self-employed"
  | "Student"
  | "Unemployed"
  | "Other";
