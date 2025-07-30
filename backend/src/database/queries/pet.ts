import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import { Pet } from "../../models/db-models/pet";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { TranslationManager } from "../../utils/translations-manager";
import { Behaviour, Gender, LocalityType } from "../../models/enums";

// Interface for filter criteria
export interface PetFilters {
  gender?: string;
  species?: string[];
  breeds?: string[];
  minAgeYears?: number;
  maxAgeYears?: number;
  country?: string[];
  city?: string;
  zip?: string;
  kidsAllowed?: boolean;
  ngoName?: string[];
  minWeight?: number;
  maxWeight?: number;
  characteristics?: string[];
  health?: string[];
}

class PetQueries {
  /**
   * Selects all pets from the database and returns them as an array of Pet objects.
   * @param db - DatabaseManager instance for executing queries.
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of Pet objects.
   */
  static async select(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<Pet[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT
            id, name, gender, birthdate, castration, weight, breed,
            profile_picture_link, profile_picture_path, last_check_up, eating_behaviour, behaviour,
            caretaker_id, ngo_member_id, street_name, city_name, zip, country, house_number,
            locality_type_requirement, kids_allowed, zip_requirement,
            experience_requirement, minimum_space_requirement
          FROM Pet;
        `)
      ).rows,
    ) as Record<string, any>[];
    // Explicitly cast the result of plainToInstance to Pet[]
    const pets: Pet[] = plainToInstance(Pet, result);

    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      pets.map((value) => {
        value.gender = tm.getGenderTranslation(value.gender as Gender);
        if (value.behaviour) {
          value.behaviour = tm.getBehaviourTranslation(
            value.behaviour as Behaviour,
          );
        }
        if (value.localityTypeRequirement) {
          value.localityTypeRequirement = tm.getLocalityTypeTranslation(
            value.localityTypeRequirement as LocalityType,
          );
        }
        return value;
      });
      return pets;
    }
    return pets;
  }

  //selectPetsById with other Tables
  // TODO TRANSLATE
  static async selectPetById(
    db: DatabaseManager,
    id: string,
    tm: TranslationManager,
  ): Promise<Pet | null> {
    const query = `
      SELECT
        p.id, p.name, p.gender, p.birthdate, p.castration, p.weight,
        p.breed,
        p.profile_picture_link, p.profile_picture_path, p.last_check_up, p.eating_behaviour, p.behaviour,
        p.caretaker_id, p.ngo_member_id,
        p.street_name, p.city_name, p.zip, p.country, p.house_number,
        p.locality_type_requirement, p.kids_allowed, p.zip_requirement,
        p.experience_requirement, p.minimum_space_requirement,

        b.species AS "petSpecies",
        b.information AS "breedInformation",

        n.id AS "ngoId",
        n.name AS "ngoName",
        n.country AS "ngoCountry",
        n.logo_picture_link AS "ngoLogo",
        n.website AS "websites",
        n.email AS "ngoEmail",
        COALESCE(json_agg(DISTINCT pp.picture_link) FILTER (WHERE pp.picture_link IS NOT NULL), '[]'::json) AS images,
        COALESCE(json_agg(json_build_object('vaccine', pv.vaccine, 'date', pv.date)) FILTER (WHERE pv.vaccine IS NOT NULL), '[]'::json) AS vaccinations,
        COALESCE(json_agg(json_build_object('disease', pd.disease, 'info', pd.info, 'medications', pd.medications)) FILTER (WHERE pd.disease IS NOT NULL), '[]'::json) AS diseases,
        COALESCE(json_agg(json_build_object('fear_name', pf.fear, 'info', pf.info, 'medications', pf.medications)) FILTER (WHERE pf.fear IS NOT NULL), '[]'::json) AS fears
      FROM
        pet p
      LEFT JOIN
        breed b ON p.breed = b.breed_name
      LEFT JOIN
        ngo_member nm ON p.ngo_member_id = nm.user_id 
      LEFT JOIN
        ngo n ON nm.ngo_id = n.id            
      LEFT JOIN
        pet_picture pp ON pp.pet_id = p.id
      LEFT JOIN
        pet_vaccination pv ON pv.pet_id = p.id
      LEFT JOIN
        pet_disease pd ON pd.pet_id = p.id
      LEFT JOIN
        pet_fears pf ON pf.pet_id = p.id
      WHERE
        p.id = $1
      GROUP BY
        p.id,
        b.species, b.information,
        n.id, n.name, n.country, n.logo_picture_link, n.website, n.email;
    `;
    const result = (await db.executeQuery(query, [id])).rows;

    if (result.length === 0) {
      return null;
    }

    const convertedRow = convertKeysToCamelCase(result[0]) as Record<
      string,
      any
    >;

    const pet = plainToInstance(Pet, convertedRow);
    if (tm.geti18n().getLocale() !== "en") {
      // translate result

      pet.gender = tm.getGenderTranslation(pet.gender as Gender);
      if (pet.behaviour) {
        pet.behaviour = tm.getBehaviourTranslation(pet.behaviour as Behaviour);
      }
      if (pet.localityTypeRequirement) {
        pet.localityTypeRequirement = tm.getLocalityTypeTranslation(
          pet.localityTypeRequirement as LocalityType,
        );
      }
    }

    return pet;
  }

  static async selectPetsWithOffset(
    db: DatabaseManager,
    limit: number = 9,
    offset: number = 0,
    tm: TranslationManager,
  ): Promise<{ pets: Pet[]; total: number }> {
    const petsResult = (
      await db.executeQuery(
        `
      SELECT
        p.id, p.name, p.gender, p.birthdate, p.castration, p.weight, p.breed,
        b.species AS petSpecies,
        p.profile_picture_link, p.profile_picture_path, p.last_check_up, p.eating_behaviour,
        p.caretaker_id, p.ngo_member_id, p.street_name, p.city_name, p.zip, p.country, p.house_number,
        p.locality_type_requirement, p.kids_allowed, p.zip_requirement,
        p.experience_requirement, p.minimum_space_requirement,
        n.name AS "ngoName"
      FROM pet p
      LEFT JOIN breed b ON p.breed = b.breed_name
      LEFT JOIN ngo_member nm ON p.ngo_member_id = nm.user_id
      LEFT JOIN ngo n ON nm.ngo_id = n.id
      ORDER BY p.id
      LIMIT $1 OFFSET $2;
    `,
        [limit, offset],
      )
    ).rows;

    const totalResult = (
      await db.executeQuery(`SELECT COUNT(*) as total FROM pet`)
    ).rows[0];

    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      petsResult.map((value) => {
        value.gender = tm.getGenderTranslation(value.gender as Gender);
        if (value.behaviour) {
          value.behaviour = tm.getBehaviourTranslation(
            value.behaviour as Behaviour,
          );
        }
        if (value.localityTypeRequirement) {
          value.localityTypeRequirement = tm.getLocalityTypeTranslation(
            value.localityTypeRequirement as LocalityType,
          );
        }
        return value;
      });
      return {
        pets: plainToInstance(Pet, petsResult),
        total: parseInt(totalResult.total),
      };
    }
    return {
      pets: plainToInstance(Pet, petsResult),
      total: parseInt(totalResult.total),
    };
  }

  static async selectPetsWithFilters(
    db: DatabaseManager,
    filters: PetFilters = {},
    limit: number = 9,
    offset: number = 0,
    tm: TranslationManager,
  ): Promise<{ pets: Pet[]; total: number }> {
    const queryParams: any[] = [];
    const whereClauses: string[] = [];
    let paramIndex = 1;
    let joinClauses: string[] = [
      "LEFT JOIN breed b ON p.breed = b.breed_name",
      "LEFT JOIN ngo_member nm ON p.ngo_member_id = nm.user_id",
      "LEFT JOIN ngo n ON nm.ngo_id = n.id",
    ];

    // Gender
    if (filters.gender && filters.gender.toLowerCase() !== "all") {
      whereClauses.push(`p.gender = $${paramIndex}`);
      queryParams.push(filters.gender);
      paramIndex++;
    }

    // Species
    if (filters.species && filters.species.length > 0) {
      const validSpecies = filters.species.filter(
        (s) => s && s.toLowerCase() !== "any" && s.toLowerCase() !== "all",
      );
      if (validSpecies.length > 0) {
        const speciesPlaceholders = validSpecies.map(() => `$${paramIndex++}`);
        whereClauses.push(`b.species IN (${speciesPlaceholders.join(", ")})`);
        queryParams.push(...validSpecies);
      }
    }

    // Breeds
    if (filters.breeds && filters.breeds.length > 0) {
      const validBreeds = filters.breeds.filter(
        (b) => b && b.toLowerCase() !== "any",
      );
      if (validBreeds.length > 0) {
        const breedPlaceholders = validBreeds.map(() => `$${paramIndex++}`);
        whereClauses.push(`p.breed IN (${breedPlaceholders.join(", ")})`);
        queryParams.push(...validBreeds);
      }
    }

    // Age (minAgeYears, maxAgeYears)
    if (filters.minAgeYears !== undefined) {
      whereClauses.push(
        `p.birthdate <= (NOW() - MAKE_INTERVAL(years => $${paramIndex}))`,
      );
      queryParams.push(filters.minAgeYears);
      paramIndex++;
    }
    if (filters.maxAgeYears !== undefined) {
      whereClauses.push(
        `p.birthdate > (NOW() - MAKE_INTERVAL(years => $${paramIndex}))`,
      );
      queryParams.push(filters.maxAgeYears + 1);
      paramIndex++;
    }

    // Location
    if (filters.country && filters.country.length > 0) {
      const countryPlaceholders = filters.country.map(() => `$${paramIndex++}`);
      whereClauses.push(`p.country IN (${countryPlaceholders.join(", ")})`);
      queryParams.push(...filters.country);
    }
    if (filters.city) {
      whereClauses.push(`p.city_name ILIKE $${paramIndex}`);
      queryParams.push(`%${filters.city}%`);
      paramIndex++;
    }
    if (filters.zip) {
      whereClauses.push(`p.zip = $${paramIndex}`);
      queryParams.push(filters.zip);
      paramIndex++;
    }

    // Health filters (Vaccinated, Healthy, Sick)
    if (filters.health && filters.health.length > 0) {
      const validHealthFilters = filters.health.filter(
        (h) => h && h.toLowerCase() !== "no filter",
      );

      for (const healthFilter of validHealthFilters) {
        if (healthFilter === "Vaccinated") {
          // Pet must have at least one vaccination record
          whereClauses.push(
            `EXISTS (SELECT 1 FROM pet_vaccination pv WHERE pv.pet_id = p.id)`,
          );
        } else if (healthFilter === "Healthy") {
          // Pet must NOT have any disease records
          whereClauses.push(
            `NOT EXISTS (SELECT 1 FROM pet_disease pd WHERE pd.pet_id = p.id)`,
          );
        } else if (healthFilter === "Sick") {
          // Pet must have at least one disease record
          whereClauses.push(
            `EXISTS (SELECT 1 FROM pet_disease pd WHERE pd.pet_id = p.id)`,
          );
        }
      }
    }

    // Kids Allowed
    if (filters.kidsAllowed !== undefined) {
      whereClauses.push(`p.kids_allowed = $${paramIndex}`);
      queryParams.push(filters.kidsAllowed);
      paramIndex++;
    }

    // NGO filtering - join with ngo_member and ngo tables
    if (filters.ngoName && filters.ngoName.length > 0) {
      const validNgoNames = filters.ngoName.filter(
        (name) => name && name.trim() !== "",
      );
      if (validNgoNames.length > 0) {
        const ngoConditions = validNgoNames.map(
          () => `n.name ILIKE $${paramIndex++}`,
        );
        whereClauses.push(`(${ngoConditions.join(" OR ")})`);
        queryParams.push(...validNgoNames.map((name) => `%${name}%`));
      }
    }

    // Weight
    if (filters.minWeight !== undefined) {
      whereClauses.push(`p.weight >= $${paramIndex}`);
      queryParams.push(filters.minWeight);
      paramIndex++;
    }
    if (filters.maxWeight !== undefined) {
      whereClauses.push(`p.weight <= $${paramIndex}`);
      queryParams.push(filters.maxWeight);
      paramIndex++;
    }

    // Characteristics (behaviour)
    if (filters.characteristics && filters.characteristics.length > 0) {
      const validCharacteristics = filters.characteristics.filter(
        (c) => c && c.trim() !== "",
      );
      if (validCharacteristics.length > 0) {
        const characteristicsPlaceholders = validCharacteristics.map(
          () => `$${paramIndex++}`,
        );
        whereClauses.push(
          `p.behaviour IN (${characteristicsPlaceholders.join(", ")})`,
        );
        queryParams.push(...validCharacteristics);
      }
    }

    const whereCondition =
      whereClauses.length > 0 ? whereClauses.join(" AND ") : "1=1";
    const joinCondition = joinClauses.join(" ");

    const dataQuery = `
      SELECT
        p.id, p.name, p.gender, p.birthdate, p.castration, p.weight, p.breed,
        b.species AS petSpecies,
        p.profile_picture_link, p.profile_picture_path, p.last_check_up, p.eating_behaviour,
        p.caretaker_id, p.ngo_member_id, p.street_name, p.city_name, p.zip, p.country, p.house_number,
        p.locality_type_requirement, p.kids_allowed, p.zip_requirement,
        p.experience_requirement, p.minimum_space_requirement,
        n.name AS "ngoName"
      FROM pet p
      ${joinCondition}
      WHERE ${whereCondition}
      ORDER BY p.id
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    const dataQueryParams = [...queryParams, limit, offset];
    const petsResult = (await db.executeQuery(dataQuery, dataQueryParams)).rows;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM pet p
      ${joinCondition}
      WHERE ${whereCondition};
    `;
    const totalResult = (await db.executeQuery(countQuery, queryParams))
      .rows[0];

    //-- language
    let pets = plainToInstance(Pet, petsResult);

    if (tm.geti18n().getLocale() !== "en") {
      pets.map((pet) => {
        pet.gender = tm.getGenderTranslation(pet.gender as Gender);
        if (pet.behaviour) {
          pet.behaviour = tm.getBehaviourTranslation(
            pet.behaviour as Behaviour,
          );
        }
        if (pet.localityTypeRequirement) {
          pet.localityTypeRequirement = tm.getLocalityTypeTranslation(
            pet.localityTypeRequirement as LocalityType,
          );
        }
        return pet;
      });
    }
    //--

    return {
      pets,
      total: parseInt(totalResult.total, 10),
    };
  }

  /**
   * Selects the profile picture information of a specific pet by ID.
   * @param db - DatabaseManager instance for executing queries.
   * @param petId - ID of the pet to retrieve profile picture data for.
   * @returns Promise resolving to a Pet object containing profile picture data.
   */
  static async selectProfilePicture(
    db: DatabaseManager,
    petId: string,
  ): Promise<Pet> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
          SELECT
            profile_picture_link, profile_picture_path
          FROM Pet
          WHERE id = $1;
        `,
          [petId],
        )
      ).rows[0],
    ) as Record<string, any>;

    // Explicitly cast the result of plainToInstance to Pet[]
    const petProfilePic: Pet = plainToInstance(Pet, result);

    return petProfilePic;
  }

  /**
   * Inserts a new pet into the database.
   * @param db - DatabaseManager instance for executing queries.
   * @param pet - Pet object containing the data to insert.
   * @param tm - Translation Manager translates enums
   */
  static async insert(db: DatabaseManager, pet: Pet, tm: TranslationManager) {
    // translate enums before inserting
    if (tm.geti18n().getLocale() !== "en") {
      if (pet.experienceRequirement) {
        pet.experienceRequirement = tm.findExperienceFromTranslation(
          pet.experienceRequirement,
        ) as string;
      }
      pet.gender = tm.findGenderFromTranslation(pet.gender) as string;
      if (pet.behaviour) {
        pet.behaviour = tm.findBehaviourFromTranslation(
          pet.behaviour,
        ) as string;
      }
      if (pet.localityTypeRequirement) {
        pet.localityTypeRequirement = tm.findLocalityTypeFromTranslation(
          pet.localityTypeRequirement,
        ) as string;
      }
    }

    await db.executeQuery(
      `
      INSERT INTO pet(id, name, breed, gender, birthdate, weight, profile_picture_link, profile_picture_path, castration, last_check_up, behaviour, eating_behaviour,
        caretaker_id, ngo_member_id, street_name, city_name, zip, country, house_number,
        locality_type_requirement, kids_allowed, zip_requirement, experience_requirement, minimum_space_requirement)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24);
    `,
      [
        pet.id,
        pet.name,
        pet.breed,
        pet.gender,
        pet.birthdate,
        pet.weight,
        pet.profilePictureLink,
        pet.profilePicturePath,
        pet.castration,
        pet.lastCheckUp,
        pet.behaviour,
        pet.eatingBehaviour,
        pet.caretakerId,
        pet.ngoMemberId,
        pet.streetName,
        pet.cityName,
        pet.zip,
        pet.country,
        pet.houseNumber,
        pet.localityTypeRequirement,
        pet.kidsAllowed,
        pet.zipRequirement,
        pet.experienceRequirement,
        pet.minimumSpaceRequirement,
      ],
    );
  }

  /**
   * Inserts the profile picture information of a specific pet into the database.
   * @param db - DatabaseManager instance for executing queries.
   * @param profilePicPath - Path to the pet's profile picture.
   * @param profilePicLink - Link to the pet's profile picture.
   */
  static async insertPetProfilePic(
    db: DatabaseManager,
    profilePicPath: string,
    profilePicLink: string,
  ) {
    await db.executeQuery(
      `
      INSERT INTO Pet(profile_picture_link, profile_picture_path)
      VALUES($1, $2);
    `,
      [profilePicLink, profilePicPath],
    );
  }

  /**
   * Selects matched pets from a caretaker's perspective.
   * @param db - DatabaseManager instance for executing queries.
   * @param caretakerId - ID of the caretaker to find matched pets for.
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of Pet objects.
   */
  static async selectMatchedPetsByCaretaker(
    db: DatabaseManager,
    caretakerId: string,
    tm: TranslationManager,
  ): Promise<Pet[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT  
        p.id, p.name, p.gender, p.birthdate, p.castration, p.weight, p.breed,
        p.profile_picture_link, p.last_check_up, p.eating_behaviour, p.behaviour,
        p.caretaker_id, p.ngo_member_id, p.street_name, p.city_name, p.zip, p.country, p.house_number,
        p.locality_type_requirement, p.kids_allowed, p.zip_requirement,
        p.experience_requirement, p.minimum_space_requirement,
        
        b.species AS "petSpecies",
        b.information AS "breedInformation",
        
        n.name AS "ngoName",
        n.country AS "ngoCountry",
        n.logo_picture_link AS "ngoLogo",
        
        COALESCE(json_agg(DISTINCT pp.picture_link) FILTER (WHERE pp.picture_link IS NOT NULL), '[]'::json) AS images,
        COALESCE(json_agg(json_build_object('vaccine', pv.vaccine, 'date', pv.date)) FILTER (WHERE pv.vaccine IS NOT NULL), '[]'::json) AS vaccinations,
        COALESCE(json_agg(json_build_object('disease', pd.disease, 'info', pd.info, 'medications', pd.medications)) FILTER (WHERE pd.disease IS NOT NULL), '[]'::json) AS diseases,
        COALESCE(json_agg(json_build_object('fear_name', pf.fear, 'info', pf.info, 'medications', pf.medications)) FILTER (WHERE pf.fear IS NOT NULL), '[]'::json) AS fears
      FROM pet p 
      JOIN interested_pet ip ON p.id = ip.pet_id
      JOIN caretaker c ON ip.user_id = c.user_id
      LEFT JOIN breed b ON p.breed = b.breed_name
      LEFT JOIN ngo_member nm ON p.ngo_member_id = nm.user_id
      LEFT JOIN ngo n ON nm.ngo_id = n.id
      LEFT JOIN pet_picture pp ON pp.pet_id = p.id
      LEFT JOIN pet_vaccination pv ON pv.pet_id = p.id
      LEFT JOIN pet_disease pd ON pd.pet_id = p.id
      LEFT JOIN pet_fears pf ON pf.pet_id = p.id
      WHERE c.user_id = $1 AND ip.interested = $2
      GROUP BY
        p.id, p.name, p.gender, p.birthdate, p.castration, p.weight, p.breed,
        p.profile_picture_link, p.last_check_up, p.eating_behaviour, p.behaviour,
        p.caretaker_id, p.ngo_member_id, p.street_name, p.city_name, p.zip, p.country, p.house_number,
        p.locality_type_requirement, p.kids_allowed, p.zip_requirement,
        p.experience_requirement, p.minimum_space_requirement,
        b.species, b.information,
        n.name, n.country, n.logo_picture_link;
      `,
          [caretakerId, true],
        )
      ).rows,
    ) as Record<string, any>[];

    result = plainToInstance(Pet, result);
    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      result.map((value) => {
        value.gender = tm.getGenderTranslation(value.gender as Gender);
        if (value.behaviour) {
          value.behaviour = tm.getBehaviourTranslation(
            value.behaviour as Behaviour,
          );
        }
        if (value.localityTypeRequirement) {
          value.localityTypeRequirement = tm.getLocalityTypeTranslation(
            value.localityTypeRequirement as LocalityType,
          );
        }
        return value;
      });
      return plainToInstance(Pet, result);
    }
    return plainToInstance(Pet, result);
  }

  /**
   * Selects all data except ProfilePicturePath for pets.
   * @param db - DatabaseManager instance for executing queries.
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to an array of Pet objects.
   */
  static async selectSecurely(
    db: DatabaseManager,
    tm: TranslationManager,
  ): Promise<Pet[]> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(`
          SELECT
            id, name, gender, birthdate, castration, weight, breed,
            profile_picture_link, last_check_up, eating_behaviour, behaviour,
            caretaker_id, ngo_member_id, street_name, city_name, zip, country, house_number,
            locality_type_requirement, kids_allowed, zip_requirement,
            experience_requirement, minimum_space_requirement
          FROM pet;
        `)
      ).rows,
    ) as Record<string, any>[];

    // Explicitly cast the result of plainToInstance to Pet[]
    const pets: Pet[] = plainToInstance(Pet, result);

    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      pets.map((value) => {
        // Provide a default empty string if value.gender is undefined
        value.gender = tm.getGenderTranslation(value.gender as Gender);
        if (value.behaviour) {
          value.behaviour = tm.getBehaviourTranslation(
            value.behaviour as Behaviour,
          );
        }
        if (value.localityTypeRequirement) {
          value.localityTypeRequirement = tm.getLocalityTypeTranslation(
            value.localityTypeRequirement as LocalityType,
          );
        }
        return value;
      });
      return plainToInstance(Pet, pets);
    }
    return plainToInstance(Pet, pets);
  }

  /**
   * Deletes a pet from the database by ID.
   * @param db - DatabaseManager instance for executing queries.
   * @param id - ID of the pet to delete.
   */
  static async deletePetById(db: DatabaseManager, id: string) {
    await db.executeQuery(
      `
      DELETE FROM pet WHERE id=$1;
    `,
      [id],
    );
  }

  /**
   * Selects all data from a pet except ProfilePicturePath by ID.
   * @param db - DatabaseManager instance for executing queries.
   * @param petId - ID of the pet to retrieve data for.
   * @param tm - Translation Manager translates enums
   * @returns Promise resolving to a Pet object.
   */
  static async selectByIdSecurely(
    db: DatabaseManager,
    petId: string,
    tm: TranslationManager,
  ): Promise<Pet> {
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `
      SELECT
         id, name, gender, birthdate, castration, weight, breed,
            profile_picture_link, last_check_up, eating_behaviour, behaviour,
            caretaker_id, ngo_member_id, street_name, city_name, zip, country, house_number,
            locality_type_requirement, kids_allowed, zip_requirement,
            experience_requirement, minimum_space_requirement
      FROM pet WHERE id = $1;
    `,
          [petId],
        )
      ).rows[0],
    ) as Record<string, any>;

    let pet: Pet = plainToInstance(Pet, result);
    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      pet.gender = tm.getGenderTranslation(pet.gender as Gender);
      if (pet.behaviour) {
        pet.behaviour = tm.getBehaviourTranslation(pet.behaviour as Behaviour);
      }
      if (pet.localityTypeRequirement) {
        pet.localityTypeRequirement = tm.getLocalityTypeTranslation(
          pet.localityTypeRequirement as LocalityType,
        );
      }
      return pet;
    }
    return pet;
  }

  /**
   * Deletes a pet from the database by ID.
   * @param db - DatabaseManager instance for executing queries.
   * @param id - ID of the pet to delete.
   */
  static async deleteById(db: DatabaseManager, id: string) {
    await db.executeQuery("DELETE FROM pet WHERE id=$1;", [id]);
  }

  /**
   * Deletes a pet from the database by name.
   * @param db - DatabaseManager instance for executing queries.
   * @param name - Name of the pet to delete.
   * @returns Promise resolving to void.
   */
  static async deleteByName(db: DatabaseManager, name: string): Promise<void> {
    await db.executeQuery("DELETE FROM pet WHERE name=$1;", [name]);
  }

  /** Updates pet by id */
  static async updateById(
    db: DatabaseManager,
    petId: string,
    pet: Pet,
  ): Promise<void> {
    await db.executeQuery(
      `
    UPDATE pet SET
      name = $1,
      breed = $2,
      gender = $3,
      birthdate = $4,
      weight = $5,
      profile_picture_path = $6,
      profile_picture_link = $7,
      castration = $8,
      last_check_up = $9,
      eating_behaviour = $10,
      behaviour = $11,
      caretaker_id = $12,
      ngo_member_id = $13,
      street_name = $14,
      city_name = $15,
      zip = $16,
      country = $17,
      house_number = $18,
      locality_type_requirement = $19,
      kids_allowed = $20,
      zip_requirement = $21,
      experience_requirement = $22,
      minimum_space_requirement = $23
    WHERE id = $24;
    `,
      [
        pet.name ?? null,
        pet.breed ?? null,
        pet.gender,
        pet.birthdate,
        pet.weight ?? null,
        pet.profilePicturePath ?? null,
        pet.profilePictureLink ?? null,
        pet.castration ?? null,
        pet.lastCheckUp ?? null,
        pet.eatingBehaviour ?? null,
        pet.behaviour ?? null,
        pet.caretakerId ?? null,
        pet.ngoMemberId ?? null,
        pet.streetName ?? null,
        pet.cityName ?? null,
        pet.zip ?? null,
        pet.country ?? null,
        pet.houseNumber ?? null,
        pet.localityTypeRequirement ?? null,
        pet.kidsAllowed ?? true,
        pet.zipRequirement ?? null,
        pet.experienceRequirement ?? null,
        pet.minimumSpaceRequirement ?? null,
        petId,
      ],
    );
  }

  static async selectAvailableBreeds(
    db: DatabaseManager,
  ): Promise<{ [species: string]: string[] }> {
    const result = await db.executeQuery(`
      SELECT DISTINCT b.species, p.breed
      FROM pet p
      INNER JOIN breed b ON p.breed = b.breed_name
      WHERE p.breed IS NOT NULL AND p.breed != ''
      ORDER BY b.species, p.breed;
    `);

    const breedsBySpecies: { [species: string]: string[] } = {};

    result.rows.forEach((row: any) => {
      const species = row.species;
      const breed = row.breed;

      if (!breedsBySpecies[species]) {
        breedsBySpecies[species] = [];
      }

      if (!breedsBySpecies[species].includes(breed)) {
        breedsBySpecies[species].push(breed);
      }
    });

    return breedsBySpecies;
  }

  static async selectAvailableCharacteristics(
    db: DatabaseManager,
  ): Promise<string[]> {
    const result = await db.executeQuery(`
      SELECT DISTINCT behaviour
      FROM pet
      WHERE behaviour IS NOT NULL
      ORDER BY behaviour;
    `);

    return result.rows
      .map((row: any) => row.behaviour)
      .filter((behaviour: string) => behaviour && behaviour.trim() !== "");
  }

  static async selectAvailableNGOs(
    db: DatabaseManager,
  ): Promise<{ id: string; name: string; country: string }[]> {
    const result = await db.executeQuery(`
      SELECT id, name, country
      FROM ngo
      WHERE name IS NOT NULL AND name != ''
      ORDER BY name;
    `);

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      country: row.country || "",
    }));
  }

  static async selectAvailableCountries(
    db: DatabaseManager,
  ): Promise<string[]> {
    const result = await db.executeQuery(`
      SELECT DISTINCT country
      FROM pet
      WHERE country IS NOT NULL AND country != ''
      ORDER BY country;
    `);

    return result.rows
      .map((row: any) => row.country)
      .filter((country: string) => country && country.trim() !== "");
  }

  /** Update pet profilePic */
  static async updatePetProfilePic(
    db: DatabaseManager,
    petId: string,
    profilePicturePath: string,
    profilePictureLink: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE "pet" SET
      profile_picture_path = $1,
       profile_picture_link = $2

     WHERE id = $3;`,
      [profilePicturePath, profilePictureLink, petId],
    );
  }

  /**
   * Deletes a pet's profile picture information from the database.
   * @param db - DatabaseManager instance for executing queries.
   * @param petId - ID of the pet to update.
   * @returns Promise resolving to void.
   */
  static async deletePetProfilePic(
    db: DatabaseManager,
    petId: string,
  ): Promise<void> {
    await db.executeQuery(
      `UPDATE "pet" SET
       profile_picture_link = NULL,
       profile_picture_path = NULL
     WHERE id = $1;`,
      [petId],
    );
  }
}

export { PetQueries };
