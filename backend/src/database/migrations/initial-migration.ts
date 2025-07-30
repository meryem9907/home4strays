import Migration from "./migrations";
import { DatabaseManager } from "../db";
import { PostgresError } from "pg-error-enum";
import * as emoji from "node-emoji";
import { red, green, cyan } from "console-log-colors";
import format from "pg-format";
import { dogBreeds } from "../../utils/breeds/dog-breeds";
import { catBreeds } from "../../utils/breeds/cat-breeds";
import { birdBreeds } from "../../utils/breeds/bird-breeds";
import { rodentBreeds } from "../../utils/breeds/rodent-breeds";
import MinioManager from "../../utils/minio-manager";

class InitialMigration implements Migration {
  async createEnums(db: DatabaseManager) {
    type EnumFunction = (db: DatabaseManager) => Promise<void>;

    const createExperienceEnum = async (db: DatabaseManager): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE experience AS ENUM ('>10 Years', '>5 Years', '>2 Years', '>1 Year', 'No Experience');`,
      );
    };

    const createTenureEnum = async (db: DatabaseManager): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE tenure AS ENUM ('Rented', 'Paid', 'Other');`,
      );
    };

    const createMaritalStatusEnum = async (
      db: DatabaseManager,
    ): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE marital_status AS ENUM ('Married', 'Single', 'Widowed', 'Other');`,
      );
    };

    const createLocalityTypeEnum = async (
      db: DatabaseManager,
    ): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE locality_type AS ENUM ('Urban', 'Rural', 'Other');`,
      );
    };
    const createResidenceTypeEnum = async (
      db: DatabaseManager,
    ): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE residence AS ENUM ('House', 'Flat', 'Other');`,
      );
    };
    const createEmploymentTypeEnum = async (
      db: DatabaseManager,
    ): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE employment AS ENUM ('Employed', 'Freelancer', 'Self-employed', 'Student', 'Unemployed', 'Other');`,
      );
    };
    const createWeekdayEnum = async (db: DatabaseManager): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE weekday AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');`,
      );
    };
    const createGenderEnum = async (db: DatabaseManager): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE gender AS ENUM ('Male', 'Female', 'Diverse');`,
      );
    };

    const createBehaviourEnum = async (db: DatabaseManager): Promise<void> => {
      await db.executeQuery(
        `CREATE TYPE behaviour AS ENUM ('shy', 'lively', 'vigilant', 'cautious', 'sensitive', 'gentle', 'defensive', 'lazy', 'playful', 'aggressive', 'obedient', 'mischievous');`,
      );
    };

    const enumFunctions: Array<EnumFunction> = [
      createExperienceEnum,
      createTenureEnum,
      createMaritalStatusEnum,
      createLocalityTypeEnum,
      createResidenceTypeEnum,
      createEmploymentTypeEnum,
      createWeekdayEnum,
      createGenderEnum,
      createBehaviourEnum,
    ];
    for (const enumFunction of enumFunctions) {
      try {
        await enumFunction(db);
      } catch (e: unknown) {
        if ((e as any).code !== PostgresError.UNIQUE_VIOLATION) {
          // Just pass it, because we don´t mind if types already exist
        }
      }
    }
  }

  createUser(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(
      `CREATE TABLE IF NOT EXISTS "user"
                (id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(254) NOT NULL,
                password TEXT NOT NULL,
                profile_picture_link VARCHAR(2000),
                profile_picture_path VARCHAR(2000),
                phone_number VARCHAR(100),
                is_admin BOOLEAN DEFAULT FALSE NOT NULL,
                is_ngo_user BOOLEAN DEFAULT FALSE NOT NULL);`,
    );
  }

  createMessage(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(
      `CREATE TABLE IF NOT EXISTS message (
                id SERIAL PRIMARY KEY,
                sender_id UUID NOT NULL REFERENCES "user"(id),
                recipient_id UUID NOT NULL REFERENCES "user"(id),
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);`,
    );
  }

  createCaretaker(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(
      `CREATE TABLE IF NOT EXISTS caretaker (
                user_id UUID PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
                space INTEGER NOT NULL,
                experience experience NOT NULL,
                tenure tenure NOT NULL,
                marital_status marital_status NOT NULL,
                financial_assistance BOOLEAN DEFAULT False NOT NULL,
                locality_type locality_type NOT NULL,
                garden BOOLEAN DEFAULT FALSE NOT NULL,
                floor INTEGER NOT NULL,
                residence residence NOT NULL,
                street_name VARCHAR(255) NOT NULL,
                city_name VARCHAR(255) NOT NULL,
                zip VARCHAR(10) NOT NULL,
                country VARCHAR(255) NOT NULL,
                house_number VARCHAR(10) NOT NULL,
                employment_type employment NOT NULL,
                previous_adoption BOOLEAN DEFAULT FALSE NOT NULL,
                number_kids INTEGER NOT NULL,
                birthdate DATE NOT NULL,
                holiday_care BOOLEAN DEFAULT FALSE NOT NULL,
                adoption_willingness BOOLEAN DEFAULT FALSE NOT NULL
                 );`,
    );
  }

  createNGO(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(
      `CREATE TABLE IF NOT EXISTS ngo (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY ,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(254),
                country VARCHAR(255) NOT NULL,
                verification_document_path VARCHAR(2000) NOT NULL,
                verification_document_link VARCHAR(2000) NOT NULL,
                verified BOOLEAN DEFAULT FALSE NOT NULL,
                logo_picture_path VARCHAR(2000),
                logo_picture_link VARCHAR(2000),
                phone_number VARCHAR(100),
                member_count INTEGER,
                website VARCHAR(2000)[],
                mission TEXT
            );`,
    );
  }

  createNGOMember(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(
      `CREATE TABLE IF NOT EXISTS ngo_member (
                user_id UUID PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
                ngo_id UUID NOT NULL REFERENCES ngo(id) ON DELETE CASCADE,
                is_admin BOOLEAN DEFAULT FALSE NOT NULL
                );`,
    );
  }

  createCTHours(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS ct_hours (
                            caretaker_id UUID NOT NULL REFERENCES caretaker(user_id) ON DELETE CASCADE,
                            start_time TIME NOT NULL,
                            end_time TIME NOT NULL,
                            weekday weekday NOT NULL,
                            PRIMARY KEY(caretaker_id, weekday, start_time),
                            CHECK (start_time < end_time));`);
  }

  createNGOHours(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS ngo_hours (
                            ngo_id UUID NOT NULL REFERENCES ngo(id) ON DELETE CASCADE,
                            start_time TIME NOT NULL,
                            end_time TIME NOT NULL,
                            weekday weekday NOT NULL,
                            PRIMARY KEY(ngo_id, weekday, start_time),
                            CHECK (start_time < end_time));`);
  }

  createNGOMemberHours(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS ngo_member_hours (
                            ngo_member_id UUID NOT NULL REFERENCES ngo_member(user_id) ON DELETE CASCADE,
                            start_time TIME NOT NULL,
                            end_time TIME NOT NULL,
                            weekday Weekday NOT NULL,
                            PRIMARY KEY(ngo_member_id, weekday, start_time),
                            CHECK (start_time < end_time));`);
  }

  createBreed(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS breed (
                breed_name VARCHAR(255),
                species VARCHAR(255),
                information TEXT,
                PRIMARY KEY(breed_name));`);
  }

  createSpeciesTranslation(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS species_translation (
                breed_name VARCHAR(255) REFERENCES breed(breed_name) ON DELETE CASCADE,
                language VARCHAR(255) CHECK (language IN ('en', 'de', 'tr')),
                translated_species VARCHAR(255) NOT NULL,
                PRIMARY KEY (breed_name, language));`);
  }

  createPet(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS pet (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255),
                breed VARCHAR(255) REFERENCES breed(breed_name) ON DELETE SET NULL,
                gender gender NOT NULL,
                birthdate DATE NOT NULL,
                weight INTEGER,
                profile_picture_link VARCHAR(2000),
                profile_picture_path VARCHAR(2000),
                castration BOOLEAN,
                last_check_up DATE,
                eating_behaviour TEXT,
                behaviour behaviour,
                caretaker_id UUID REFERENCES caretaker(user_id) ON DELETE CASCADE,
                ngo_member_id UUID REFERENCES ngo_member(user_id) ON DELETE CASCADE,
                street_name VARCHAR(255),
                city_name VARCHAR(255),
                zip VARCHAR(10),
                country VARCHAR(255),
                house_number VARCHAR(10),
                locality_type_requirement locality_type,
                kids_allowed BOOLEAN DEFAULT TRUE,
                zip_requirement VARCHAR(10),
                experience_requirement experience,
                minimum_space_requirement INTEGER);`);
  }

  createPetDisease(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS pet_disease (
                            pet_id UUID NOT NULL REFERENCES pet(id) ON DELETE CASCADE,
                            disease VARCHAR(255) NOT NULL,
                            info TEXT,
                            medications VARCHAR(255),
                            PRIMARY KEY(pet_id, disease));`);
  }

  createPetFears(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS pet_fears (
                            pet_id UUID NOT NULL REFERENCES pet(id) ON DELETE CASCADE,
                            fear VARCHAR(255) NOT NULL,
                            info TEXT,
                            medications VARCHAR(255),
                            PRIMARY KEY(pet_id, fear));`);
  }

  createPetVaccinaction(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS pet_vaccination (
                            pet_id UUID NOT NULL REFERENCES pet(id) ON DELETE CASCADE,
                            vaccine VARCHAR(255) NOT NULL,
                            date DATE,
                            PRIMARY KEY(pet_id, vaccine));`);
  }

  createPetPicture(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS pet_picture (
                            pet_id UUID NOT NULL REFERENCES pet(id) ON DELETE CASCADE,
                            picture_link VARCHAR(2000),
                            picture_path VARCHAR(2000),
                            PRIMARY KEY (pet_id, picture_path));`);
  }

  createInterestedPets(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS interested_pet (
                            user_id UUID NOT NULL REFERENCES caretaker(user_id) ON DELETE CASCADE,
                            pet_id UUID NOT NULL REFERENCES pet(id) ON DELETE CASCADE,
                            interested BOOLEAN NOT NULL DEFAULT true,
                            score DECIMAL,
                            PRIMARY KEY (user_id, pet_id));`);
  }

  insertBreeds(
    db: DatabaseManager,
    migrations: Array<string>,
    values: Array<any>,
  ) {
    dogBreeds.forEach((breed) => {
      migrations.push(`
      INSERT INTO breed(breed_name, species) VALUES($1, 'Dog') ON CONFLICT(breed_name) DO NOTHING;
      `);
      values.push([breed]);
    });
    catBreeds.forEach((breed) => {
      migrations.push(`
      INSERT INTO breed(breed_name, species) VALUES($1, 'Cat') ON CONFLICT(breed_name) DO NOTHING;
      `);
      values.push([breed]);
    });
    birdBreeds.forEach((breed) => {
      migrations.push(`
      INSERT INTO breed(breed_name, species) VALUES($1, 'Bird') ON CONFLICT(breed_name) DO NOTHING;
      `);
      values.push([breed]);
    });
    rodentBreeds.forEach((breed) => {
      migrations.push(`
      INSERT INTO breed(breed_name, species) VALUES($1, 'Rodent') ON CONFLICT(breed_name) DO NOTHING;
      `);
      values.push([breed]);
    });
  }

  insertSpeciesTranslation(
    db: DatabaseManager,
    migrations: Array<string>,
    values: Array<any>,
  ) {
    migrations.push(`INSERT INTO species_translation (breed_name, language, translated_species)
                            SELECT
                            b.breed_name,
                            'de' AS language,
                            CASE b.species
                              WHEN 'Dog' THEN 'Hund'
                              WHEN 'Cat' THEN 'Katze'
                              WHEN 'Bird' THEN 'Vogel'
                              WHEN 'Rodent' THEN 'Nagetiere'
                              ELSE b.species
                            END AS translated_species
                          FROM breed b
                          ON CONFLICT (breed_name, language) DO NOTHING;
      `);
    values.push([]);
    migrations.push(`INSERT INTO species_translation (breed_name, language, translated_species)
                              SELECT
                                b.breed_name,
                                'tr' AS language,
                                CASE b.species
                                  WHEN 'Dog' THEN 'Köpek'
                                  WHEN 'Cat' THEN 'Kedi'
                                  WHEN 'Bird' THEN 'Kuş'
                                  WHEN 'Rodent' THEN 'Kemirgen'
                                  ELSE b.species
                                END
                              FROM breed b
                              ON CONFLICT (breed_name, language) DO NOTHING;
      `);
    values.push([]);
  }
  createPetBookmark(db: DatabaseManager, migrations: Array<string>) {
    migrations.push(`CREATE TABLE IF NOT EXISTS pet_bookmark (
      caretaker_id UUID NOT NULL REFERENCES Caretaker(user_id) ON DELETE CASCADE,
      pet_id UUID NOT NULL REFERENCES Pet(Id) ON DELETE CASCADE,
      PRIMARY KEY (caretaker_id, pet_id));`);
  }

  async migrate(db: DatabaseManager) {
    console.log(
      cyan(
        emoji.emojify(":rocket: [Migrations] migrating InitialMigration", {
          fallback: "",
        }),
      ),
    );
    let migrations: Array<string> = [];
    let parameterMigrations: Array<string> = [];

    let values: Array<Array<string | number | boolean | any>> = [];
    await this.createEnums(db);
    this.createUser(db, migrations);
    this.createMessage(db, migrations);
    this.createCaretaker(db, migrations);
    this.createNGO(db, migrations);
    this.createNGOMember(db, migrations);
    this.createCTHours(db, migrations);
    this.createNGOMemberHours(db, migrations);
    this.createNGOHours(db, migrations);
    this.createBreed(db, migrations);
    this.createSpeciesTranslation(db, migrations);
    this.createPet(db, migrations);
    this.createPetDisease(db, migrations);
    this.createPetFears(db, migrations);
    this.createPetVaccinaction(db, migrations);
    this.createPetPicture(db, migrations);
    this.createPetBookmark(db, migrations);
    this.createInterestedPets(db, migrations);
    // migrations including params
    this.insertBreeds(db, parameterMigrations, values);
    this.insertSpeciesTranslation(db, parameterMigrations, values);

    try {
      await db.executeTransaction(migrations, []);
      await db.executeTransaction(parameterMigrations, values);
    } catch (e) {
      console.error(
        red(
          emoji.emojify(
            ":boom: [Migrations] Could not migrate the initial database tables! THIS IS CRITIAL!\n" +
              e,
            { fallback: "" },
          ),
        ),
      );
    }
    console.log(
      green(
        emoji.emojify(
          ":ok: [Migrations] migrated InitialMigration succesfully",
          { fallback: "" },
        ),
      ),
    );
  }

  async rollback(db: DatabaseManager) {
    const dropAllTables = async (
      db: DatabaseManager,
      tableNames: Array<string>,
    ) => {
      for (const table of tableNames) {
        // Changed from `for (const table in tableNames)` to iterate over values
        await db.executeQuery(
          format(`DROP TABLE IF EXISTS %I CASCADE;`, table),
        ); // Added CASCADE and corrected placeholder usage
      }
    };
    const dropAllEnums = async (
      db: DatabaseManager,
      enumNames: Array<string>,
    ) => {
      for (const enumName of enumNames) {
        // Changed from `for (const enumName in enumNames)`
        await db.executeQuery(
          format(`DROP TYPE IF EXISTS %I CASCADE;`, enumName),
        ); // Added CASCADE and corrected placeholder usage
      }
    };
    await dropAllTables(db, [
      "interested_pet",
      "pet_bookmark",
      "pet_picture",
      "pet_vaccination",
      "pet_fears",
      "pet_disease",
      "pet",
      "species_translation",
      "breed",
      "ngo_member_hours",
      "ngo_hours",
      "ct_hours",
      "ngo_member",
      "ngo",
      "caretaker",
      "message",
      "user",
    ]);
    await dropAllEnums(db, [
      "experience",
      "tenure",
      "marital_status",
      "locality_type",
      "residence",
      "employment",
      "weekday",
      "gender",
      "behaviour",
    ]);
  }
}

export { InitialMigration };
