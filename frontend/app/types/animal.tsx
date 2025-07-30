/**
 * Represents a complete animal profile in the adoption system.
 *
 * This type defines all information related to an animal available for adoption,
 * including basic information, health details, behavioral characteristics,
 * care requirements, and associated caretaker/NGO information.
 *
 * @type {Animal}
 */
export type Animal = {
  /** Unique identifier for the animal */
  id: string;

  /** Animal's name */
  name: string;

  /**
   * Breed information including species classification.
   * Contains detailed breed data for matching with caretaker preferences.
   */
  breed: {
    /** Specific breed name (e.g., "Golden Retriever", "Persian") */
    name: string;
    /** Species category ("Cat", "Dog", "Bird", "Rodent") */
    species: string;
    /** Additional breed information and characteristics */
    info: string;
  };

  /** Animal's age in years */
  age: number;

  /** Animal's weight in kilograms */
  weight: number;

  /** Whether the animal has been spayed/neutered */
  castration: boolean;

  /**
   * Animal's biological gender.
   * @type {"Male" | "Female" | "Diverse"}
   */
  gender: "Male" | "Female" | "Diverse";

  /**
   * List of eating behaviors and dietary preferences.
   * Examples: ["wet food", "dry food", "special diet"]
   */
  eatingBehaviour: string[];

  /**
   * List of behavioral traits and characteristics.
   * Examples: ["friendly", "energetic", "calm", "playful"]
   */
  behaviour: string[];

  /**
   * List of known fears or triggers.
   * Examples: ["loud noises", "children", "other animals"]
   */
  fears: string[];

  /**
   * Date of last veterinary checkup in ISO string format.
   * Used to track medical care currency.
   */
  lastCheckup: string;

  /**
   * Array of image URLs for the animal.
   * First image is typically used as the primary photo.
   */
  image: string[];

  /** Detailed description of the animal's personality and story */
  description: string;

  /**
   * NGO organization responsible for the animal.
   * Contains basic NGO information for contact and verification.
   */
  ngo: {
    /** Unique NGO identifier */
    id: string;
    /** NGO organization name */
    name: string;
    /** Country where NGO is located */
    country: string;
  };

  /**
   * Current location where the animal is housed.
   * Used for proximity matching with potential caretakers.
   */
  location: {
    /** Street address */
    street: string;
    /** House number */
    housenr: string;
    /** City name */
    city: string;
    /** Postal/ZIP code */
    zipCode: string;
    /** Country name */
    country: string;
  };

  /**
   * Type of location environment required for the animal.
   * @type {"urban" | "rural" | "other"}
   */
  requiredLocation: "urban" | "rural" | "other";

  /**
   * ZIP code requirement for caretaker proximity.
   * Defines geographical restrictions for adoption.
   */
  ZIPRequirement: string;

  /** Whether the animal is suitable for families with children */
  kidsAllowed: boolean;

  /**
   * Minimum experience level required from caretaker.
   * @type {">10 years" | ">5 years" | ">2 years" | ">1 year" | "No experience"}
   */
  requiredExperience:
    | ">10 years"
    | ">5 years"
    | ">2 years"
    | ">1 year"
    | "No experience";

  /**
   * Minimum living space required in square meters.
   * Used to ensure adequate space for the animal's needs.
   */
  requiredMinimumSpace: number;

  /**
   * List of known allergies.
   * Examples: ["pollen", "certain foods", "medications"]
   */
  allergies: string[];

  /**
   * Array of diseases and medical conditions.
   * Contains detailed medical information for proper care planning.
   */
  diseases: {
    /** Disease or condition name */
    name: string;
    /** ICD (International Classification of Diseases) number */
    icdno: string;
    /** Additional information about the condition */
    info: string;
    /** Required medications as array of medicine names */
    medicine: string[];
  }[];

  /**
   * List of received vaccinations.
   * Examples: ["rabies", "distemper", "parvovirus"]
   */
  vaccination: string[];

  /**
   * Optional caretaker information if animal has been matched.
   * Contains detailed profile of the assigned caretaker.
   */
  caretaker?: {
    /** Caretaker's email address */
    email: string;
    /** Caretaker's first name */
    firstname: string;
    /** Caretaker's last name */
    lastname: string;
    /** Caretaker's password (should be handled securely) */
    password: string;
    /** URL to caretaker's profile picture */
    picture: string;
    /** Caretaker's contact phone number */
    phone: string;
    /**
     * Caretaker's available hours for animal care.
     * Defines schedule and availability patterns.
     */
    officehours: {
      /** Available hours description */
      hours: string;
      /** Recurrence pattern (daily, weekly, etc.) */
      recurrence: string;
    };
  };

  /**
   * Optional NGO member information if animal was added by NGO staff.
   * Contains profile information of the NGO member who listed the animal.
   */
  ngoMember?: {
    /** NGO member's email address */
    email: string;
    /** NGO member's first name */
    firstname: string;
    /** NGO member's last name */
    lastname: string;
    /** NGO member's password (should be handled securely) */
    password: string;
    /** URL to NGO member's profile picture */
    picture: string;
    /**
     * Associated NGO organization information.
     * Links the member to their organization.
     */
    ngo: {
      /** NGO organization name */
      name: string;
      /** Country where NGO operates */
      country: string;
    };
  };
};
