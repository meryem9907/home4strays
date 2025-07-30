// src/utils/translation-manager.ts
import { I18n } from "i18n";
import path from "path";
import {
  Behaviour,
  Employment,
  Experience,
  Gender,
  LocalityType,
  MaritalStatus,
  Residence,
  Tenure,
  Weekday,
} from "../models/enums";

class TranslationManager {
  private static instance: TranslationManager;
  private i18n = new I18n();

  private constructor() {
    this.i18n.configure({
      locales: ["en", "de", "tr"],
      directory: path.join(__dirname, "locales"),
      objectNotation: true,
    });
  }

  geti18n() {
    return this.i18n;
  }

  setLocale(locale: string) {
    this.i18n.setLocale(locale);
  }

  static getInstance(): TranslationManager {
    /* if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager();
    }
    return TranslationManager.instance; */
    return new TranslationManager(); // i always want a new instance because the language settings should not be global
  }

  t(text: string): string {
    return this.i18n.__(text);
  }

  // --- Forward Translation Key Maps ---
  private static readonly experienceKeyMap = {
    [Experience.MoreThan10Years]: "experience.moreThan10Years",
    [Experience.MoreThan5Years]: "experience.moreThan5Years",
    [Experience.MoreThan2Years]: "experience.moreThan2Years",
    [Experience.MoreThan1Year]: "experience.moreThan1Year",
    [Experience.NoExperience]: "experience.noExperience",
  };

  private static readonly tenureKeyMap = {
    [Tenure.Rented]: "tenure.rented",
    [Tenure.Paid]: "tenure.paid",
    [Tenure.Other]: "tenure.other",
  };

  private static readonly maritalStatusKeyMap = {
    [MaritalStatus.Married]: "maritalStatus.married",
    [MaritalStatus.Single]: "maritalStatus.single",
    [MaritalStatus.Widowed]: "maritalStatus.widowed",
    [MaritalStatus.Other]: "maritalStatus.other",
  };

  private static readonly localityTypeKeyMap = {
    [LocalityType.Urban]: "localityType.urban",
    [LocalityType.Rural]: "localityType.rural",
    [LocalityType.Other]: "localityType.other",
  };

  private static readonly residenceKeyMap = {
    [Residence.House]: "residence.house",
    [Residence.Flat]: "residence.flat",
    [Residence.Other]: "residence.other",
  };

  private static readonly employmentKeyMap = {
    [Employment.Employed]: "employment.employed",
    [Employment.Freelancer]: "employment.freelancer",
    [Employment.SelfEmployed]: "employment.selfEmployed",
    [Employment.Student]: "employment.student",
    [Employment.Unemployed]: "employment.unemployed",
    [Employment.Other]: "employment.other",
  };

  private static readonly weekdayKeyMap = {
    [Weekday.Monday]: "weekday.monday",
    [Weekday.Tuesday]: "weekday.tuesday",
    [Weekday.Wednesday]: "weekday.wednesday",
    [Weekday.Thursday]: "weekday.thursday",
    [Weekday.Friday]: "weekday.friday",
    [Weekday.Saturday]: "weekday.saturday",
    [Weekday.Sunday]: "weekday.sunday",
  };

  private static readonly genderKeyMap = {
    [Gender.Male]: "gender.male",
    [Gender.Female]: "gender.female",
    [Gender.Diverse]: "gender.diverse",
  };

  private static readonly behaviourKeyMap = {
    [Behaviour.Shy]: "behaviour.shy",
    [Behaviour.Lively]: "behaviour.lively",
    [Behaviour.Vigilant]: "behaviour.vigilant",
    [Behaviour.Cautious]: "behaviour.cautious",
    [Behaviour.Sensitive]: "behaviour.sensitive",
    [Behaviour.Gentle]: "behaviour.gentle",
    [Behaviour.Defensive]: "behaviour.defensive",
    [Behaviour.Lazy]: "behaviour.lazy",
    [Behaviour.Playful]: "behaviour.playful",
    [Behaviour.Aggressive]: "behaviour.aggressive",
    [Behaviour.Obedient]: "behaviour.obedient",
    [Behaviour.Mischievous]: "behaviour.mischievous",
  };

  // --- Forward Translation Functions ---
  getExperienceTranslation(experience: Experience): string {
    return this.t(TranslationManager.experienceKeyMap[experience]);
  }

  getTenureTranslation(tenure: Tenure): string {
    return this.t(TranslationManager.tenureKeyMap[tenure]);
  }

  getMaritalStatusTranslation(status: MaritalStatus): string {
    return this.t(TranslationManager.maritalStatusKeyMap[status]);
  }

  getLocalityTypeTranslation(type: LocalityType): string {
    return this.t(TranslationManager.localityTypeKeyMap[type]);
  }

  getResidenceTranslation(residence: Residence): string {
    return this.t(TranslationManager.residenceKeyMap[residence]);
  }

  getEmploymentTranslation(employment: Employment): string {
    return this.t(TranslationManager.employmentKeyMap[employment]);
  }

  getWeekdayTranslation(weekday: Weekday): string {
    return this.t(TranslationManager.weekdayKeyMap[weekday]);
  }

  getGenderTranslation(gender: Gender): string {
    return this.t(TranslationManager.genderKeyMap[gender]);
  }

  getBehaviourTranslation(behaviour: Behaviour): string {
    return this.t(TranslationManager.behaviourKeyMap[behaviour]);
  }

  // --- Reverse Translation Functions ---

  private findEnumFromTranslation<T extends string>(
    translatedText: string,
    enumObj: Record<string, T>,
    keyMap: Record<T, string>,
  ): T | null {
    // First check if the input is already an enum value
    if (Object.values(enumObj).includes(translatedText as T)) {
      return translatedText as T;
    }

    // Then check translated values
    for (const enumValueString of Object.values(enumObj)) {
      if (typeof enumValueString === "string") {
        const enumValue = enumValueString as T;
        const i18nKey = keyMap[enumValue];
        if (i18nKey && this.t(i18nKey) === translatedText) {
          return enumValue;
        }
      }
    }
    return null;
  }

  findExperienceFromTranslation(translatedText: string): Experience | null {
    return this.findEnumFromTranslation(
      translatedText,
      Experience,
      TranslationManager.experienceKeyMap,
    );
  }

  findTenureFromTranslation(translatedText: string): Tenure | null {
    return this.findEnumFromTranslation(
      translatedText,
      Tenure,
      TranslationManager.tenureKeyMap,
    );
  }

  findMaritalStatusFromTranslation(
    translatedText: string,
  ): MaritalStatus | null {
    return this.findEnumFromTranslation(
      translatedText,
      MaritalStatus,
      TranslationManager.maritalStatusKeyMap,
    );
  }

  findLocalityTypeFromTranslation(translatedText: string): LocalityType | null {
    return this.findEnumFromTranslation(
      translatedText,
      LocalityType,
      TranslationManager.localityTypeKeyMap,
    );
  }

  findResidenceFromTranslation(translatedText: string): Residence | null {
    return this.findEnumFromTranslation(
      translatedText,
      Residence,
      TranslationManager.residenceKeyMap,
    );
  }

  findEmploymentFromTranslation(translatedText: string): Employment | null {
    return this.findEnumFromTranslation(
      translatedText,
      Employment,
      TranslationManager.employmentKeyMap,
    );
  }

  findWeekdayFromTranslation(localizedText: string): Weekday | null {
    return this.findEnumFromTranslation(
      localizedText,
      Weekday,
      TranslationManager.weekdayKeyMap,
    );
  }

  findGenderFromTranslation(translatedText: string): Gender | null {
    // First check if it's already an enum value (for backwards compatibility)
    if (Object.values(Gender).includes(translatedText as Gender)) {
      return translatedText as Gender;
    }

    // Then check translated values
    return this.findEnumFromTranslation(
      translatedText,
      Gender,
      TranslationManager.genderKeyMap,
    );
  }

  findBehaviourFromTranslation(translatedText: string): Behaviour | null {
    return this.findEnumFromTranslation(
      translatedText,
      Behaviour,
      TranslationManager.behaviourKeyMap,
    );
  }
}

export { TranslationManager };
