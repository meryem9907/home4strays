import { plainToInstance } from "class-transformer";
import { DatabaseManager } from "../db";
import { Pet, PetWithBreed } from "../../models/db-models/pet";
import { NGO, FullNGO } from "../../models/db-models/ngo";
import { Caretaker, FullCaretaker } from "../../models/db-models/caretaker";
import { SpeciesTranslationQueries } from "./speciestranslation";
import { CaretakerQueries } from "./caretaker";
import { convertKeysToCamelCase } from "../../utils/formatter";
import { NGOQueries } from "./ngo";
import { TranslationManager } from "../../utils/translations-manager";
import { Behaviour, Gender, LocalityType } from "../../models/enums";

/**
 * A utility class for performing full-text searches across different entities.
 * This class handles translation of search queries to English for cross-language searches,
 * and provides translated results based on the requested language.
 */
class SearchQueries {
  /**
   * Searches for pets matching the query and location criteria.
   * Translates the query to English if the requested language is not English.
   * Returns pets with breed information and translated fields based on the requested language.
   *
   * @param db - Database manager instance for executing queries
   * @param query - The search query string
   * @param location - Optional location filter for search results
   * @param tm - Translation Manager translates enums
   * @returns Array of PetWithBreed objects with translated fields, or undefined if no results
   */
  static async searchPet(
    db: DatabaseManager,
    query: string,
    location: string | undefined,
    tm: TranslationManager,
  ): Promise<Pet[] | undefined> {
    const searchLang = "english";
    let translatedQ: string | undefined; // Make it undefined by default
    const lang = tm.geti18n().getLocale();
    if (lang !== "en") {
      const translate = (await import("translate")).default;
      translatedQ = await translate(query, { from: lang, to: "en" });
    }
    query = translatedQ ?? query;
    location = location ?? "";

    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT 
          p.id, p.name, p.breed, p.gender, p.birthdate, p.weight, p.profile_picture_link,
          p.castration, p.last_check_up, p.eating_behaviour, p.behaviour, p.caretaker_id, p.ngo_member_id,
          p.street_name, p.city_name, p.zip, p.country, p.house_number, p.locality_type_requirement,
          p.kids_allowed, p.zip_requirement, p.experience_requirement, p.minimum_space_requirement,
          
          b.breed_name, b.species, b.information AS "breedInformation",
          
          n.name AS "ngoName",
          n.country AS "ngoCountry", 
          n.logo_picture_link AS "ngoLogo",
          
          COALESCE(json_agg(DISTINCT pp.picture_link) FILTER (WHERE pp.picture_link IS NOT NULL), '[]'::json) AS images,
          COALESCE(json_agg(json_build_object('vaccine', pv.vaccine, 'date', pv.date)) FILTER (WHERE pv.vaccine IS NOT NULL), '[]'::json) AS vaccinations,
          COALESCE(json_agg(json_build_object('disease', pd.disease, 'info', pd.info, 'medications', pd.medications)) FILTER (WHERE pd.disease IS NOT NULL), '[]'::json) AS diseases,
          COALESCE(json_agg(json_build_object('fear_name', pf.fear, 'info', pf.info, 'medications', pf.medications)) FILTER (WHERE pf.fear IS NOT NULL), '[]'::json) AS fears
          FROM pet p
          LEFT JOIN breed b ON b.breed_name = p.breed
          LEFT JOIN ngo_member nm ON p.ngo_member_id = nm.user_id
          LEFT JOIN ngo n ON nm.ngo_id = n.id
          LEFT JOIN pet_picture pp ON pp.pet_id = p.id
          LEFT JOIN pet_vaccination pv ON pv.pet_id = p.id
          LEFT JOIN pet_disease pd ON pd.pet_id = p.id
          LEFT JOIN pet_fears pf ON pf.pet_id = p.id
          WHERE to_tsvector('${searchLang}', COALESCE(p.name, '')
          || ' ' || COALESCE(b.breed_name, '') || ' ' || COALESCE(b.species, '') || ' ' || COALESCE(b.information, '')
          || ' ' || COALESCE(p.gender) || ' ' || COALESCE(p.eating_behaviour, '') || ' ' || COALESCE(p.street_name, '')
          || ' ' || COALESCE(p.city_name, '') || ' ' || COALESCE(p.zip, '')
          || ' ' || COALESCE(p.country, '') || ' ' || COALESCE(p.locality_type_requirement, 'Other')
          || ' ' || COALESCE(p.zip_requirement, ''))
          @@ plainto_tsquery('${searchLang}', $1)
          GROUP BY
            p.id, p.name, p.breed, p.gender, p.birthdate, p.weight, p.profile_picture_link,
            p.castration, p.last_check_up, p.eating_behaviour, p.behaviour, p.caretaker_id, p.ngo_member_id,
            p.street_name, p.city_name, p.zip, p.country, p.house_number, p.locality_type_requirement,
            p.kids_allowed, p.zip_requirement, p.experience_requirement, p.minimum_space_requirement,
            b.breed_name, b.species, b.information,
            n.name, n.country, n.logo_picture_link;`,
          [`${query} and ${location}`],
        )
      ).rows,
    ) as Record<string, any>[];

    if (!result || result.length === 0) {
      return undefined;
    }

    const pets: PetWithBreed[] = plainToInstance(PetWithBreed, result);

    if (tm.geti18n().getLocale() !== "en") {
      // translate result
      for (const value of pets) {
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
        value.species =
          (
            await SpeciesTranslationQueries.selectTranslatedSpecies(
              db,
              value.species || "", // Provide default empty string
              tm,
            )
          ).translatedSpecies || "";
      }
      return pets;
    }
    return pets;
  }

  /**
   * Searches for NGOs matching the query and location criteria.
   * Translates the query to English if the requested language is not English.
   * Returns NGOs with additional information and translated fields based on the requested language.
   *
   * @param db - Database manager instance for executing queries
   * @param query - The search query string
   * @param location - Optional location filter for search results
   * @param tm - Translation Manager translates enums
   * @returns Array of FullNGO objects with translated fields, or undefined if no results
   */
  static async searchNGO(
    db: DatabaseManager,
    query: string,
    location: string | undefined,
    tm: TranslationManager,
  ): Promise<FullNGO[] | undefined> {
    let translatedQ!: string | undefined;
    const searchLanguage = "english";
    const lang = tm.geti18n().getLocale();
    if (lang !== "en") {
      const translate = (await import("translate")).default;
      translatedQ = await translate(query, { from: lang, to: "en" });
    }
    query = translatedQ ?? query;
    location = location ?? "";

    const result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT id, name, country, verified, logo_picture_link, phone_number, member_count, website, mission
          FROM ngo
          WHERE to_tsvector('${searchLanguage}', COALESCE(country, '') || ' ' || COALESCE(name, '')
          || ' ' || COALESCE(email, '') || ' ' || COALESCE(mission, ''))
          @@ plainto_tsquery('${searchLanguage}', $1);`,
          [`(${query}) and ${location}`],
        )
      ).rows,
    ) as Record<string, any>[];
    if (!result || result.length === 0) {
      return undefined;
    }

    const ngos: NGO[] = plainToInstance(NGO, result);
    const ngosWithHours: FullNGO[] | undefined =
      await NGOQueries.selectAllNGOsWithHoursByList(db, ngos, tm);
    return ngosWithHours;
  }

  /**
   * Searches for caretakers matching the query and location criteria.
   * Translates the query to English if the requested language is not English.
   * Returns caretakers with additional information and translated fields based on the requested language.
   *
   * @param db - Database manager instance for executing queries
   * @param query - The search query string
   * @param location - Optional location filter for search results
   * @param tm - Translation Manager translates enums
   * @returns Array of FullCaretaker objects with translated fields, or undefined if no results
   */
  static async searchCaretaker(
    db: DatabaseManager,
    query: string,
    location: string | undefined,
    tm: TranslationManager,
  ): Promise<FullCaretaker[] | undefined> {
    let translatedQ!: string | undefined;
    const searchLanguage = "english";
    const lang = tm.geti18n().getLocale();

    if (lang !== "en") {
      const translate = (await import("translate")).default;
      translatedQ = await translate(query, { from: lang, to: "en" });
    }
    query = translatedQ ?? query;
    location = location ?? "";
    let result = convertKeysToCamelCase(
      (
        await db.executeQuery(
          `SELECT c.user_id, c.space, c.experience, c.tenure, c.marital_status, c.financial_assistance,
          c.locality_type, c.garden, c.floor, c.residence, c.street_name, c.city_name, c.zip, c.country,
          c.house_number, c.employment_type, c.previous_adoption, c.number_kids, c.birthdate, c.holiday_care, c.adoption_willingness,
          u.first_name, u.last_name, u.profile_picture_link, u.phone_number
          FROM Caretaker c
          JOIN "user" u ON c.user_id = u.id
          WHERE to_tsvector('${searchLanguage}', COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')
          || ' ' || COALESCE(c.tenure, 'Other') || ' ' || COALESCE(c.marital_status, 'Other')
          || ' ' || COALESCE(c.locality_type, 'Other')
          || ' ' || COALESCE(c.city_name, '') || ' ' || COALESCE(c.zip, '')
          || ' ' || COALESCE(c.country, '') || ' ' || COALESCE(c.employment_type, 'Student')
          || ' ' || COALESCE(c.residence, 'Other'))
          @@ plainto_tsquery('${searchLanguage}', $1);`,
          [`(${query}) and ${location}`],
        )
      ).rows,
    ) as Record<string, any>[];

    if (!result || result.length === 0) {
      return undefined;
    }

    const caretakers: Caretaker[] = plainToInstance(Caretaker, result);
    const caretakerWithHours: FullCaretaker[] = plainToInstance(
      FullCaretaker,
      await CaretakerQueries.selectAllInfosByCaretakerList(db, caretakers, tm),
    );
    return caretakerWithHours;
  }
}

export { SearchQueries };
