import Migration from "./migrations";
import { DatabaseManager } from "../db";
import * as emoji from "node-emoji";
import { red, green, cyan } from "console-log-colors";

class FullTextSearchIndizesMigration implements Migration {
  createPetIndizes(db: DatabaseManager, migrations: Array<string>) {
    // First approach - add tsvector columns to the tables that will store pre-computed vectors

    // Add tsvector columns to Pet table
    migrations.push(`
    ALTER TABLE pet
    ADD COLUMN IF NOT EXISTS search_vector_german tsvector,
    ADD COLUMN IF NOT EXISTS search_vector_english tsvector;
  `); //

    // Add triggers to update the tsvector columns on Pet
    migrations.push(`
    CREATE OR REPLACE FUNCTION pet_tsvector_trigger() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector_german = to_tsvector('german',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.breed, '') || ' ' ||
        COALESCE(NEW.eating_behaviour, '') || ' ' ||
        COALESCE(NEW.street_name, '') || ' ' ||
        COALESCE(NEW.city_name, '') || ' ' ||
        COALESCE(NEW.country, '')
      );

      NEW.search_vector_english = to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.breed, '') || ' ' ||
        COALESCE(NEW.eating_behaviour, '') || ' ' ||
        COALESCE(NEW.street_name, '') || ' ' ||
        COALESCE(NEW.city_name, '') || ' ' ||
        COALESCE(NEW.country, '')
      );

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `); //

    migrations.push(`
    DROP TRIGGER IF EXISTS pet_tsvector_update ON pet;
    CREATE TRIGGER pet_tsvector_update
    BEFORE INSERT OR UPDATE ON pet
    FOR EACH ROW EXECUTE FUNCTION pet_tsvector_trigger();
  `); //

    // Create indexes on the tsvector columns
    migrations.push(`
    CREATE INDEX IF NOT EXISTS idx_pet_search_german ON pet USING GIN(search_vector_german);
    CREATE INDEX IF NOT EXISTS idx_pet_search_english ON pet USING GIN(search_vector_english);
  `); //

    // Update existing rows
    migrations.push(`
    UPDATE pet SET name = name;
  `); //

    // Add tsvector columns to NGO table
    migrations.push(`
    ALTER TABLE ngo
    ADD COLUMN IF NOT EXISTS search_vector_german tsvector,
    ADD COLUMN IF NOT EXISTS search_vector_english tsvector;
  `); //

    // Add triggers to update the tsvector columns on NGO
    migrations.push(`
    CREATE OR REPLACE FUNCTION ngo_tsvector_trigger() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector_german = to_tsvector('german',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.mission, '') || ' ' ||
        COALESCE(NEW.country, '') || ' ' ||
        COALESCE(array_to_string(NEW.Website, ' '), '')
      );

      NEW.search_vector_english = to_tsvector('english',
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.mission, '') || ' ' ||
        COALESCE(NEW.country, '') || ' ' ||
        COALESCE(array_to_string(NEW.Website, ' '), '')
      );

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `); //

    migrations.push(`
    DROP TRIGGER IF EXISTS ngo_tsvector_update ON ngo;
    CREATE TRIGGER ngo_tsvector_update
    BEFORE INSERT OR UPDATE ON ngo
    FOR EACH ROW EXECUTE FUNCTION ngo_tsvector_trigger();
  `); //

    // Create indexes on the tsvector columns
    migrations.push(`
    CREATE INDEX IF NOT EXISTS idx_ngo_search_german ON ngo USING GIN(search_vector_german);
    CREATE INDEX IF NOT EXISTS idx_ngo_search_english ON ngo USING GIN(search_vector_english);
  `); //

    // Update existing rows
    migrations.push(`
    UPDATE ngo SET name = name;
  `); //

    // Add tsvector columns to Caretaker table
    migrations.push(`
    ALTER TABLE caretaker
    ADD COLUMN IF NOT EXISTS search_vector_german tsvector,
    ADD COLUMN IF NOT EXISTS search_vector_english tsvector;
  `); //

    // Add triggers to update the tsvector columns on Caretaker
    migrations.push(`
    CREATE OR REPLACE FUNCTION caretaker_tsvector_trigger() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector_german = to_tsvector('german',
        COALESCE(NEW.street_name, '') || ' ' ||
        COALESCE(NEW.city_name, '') || ' ' ||
        COALESCE(NEW.country, '') || ' ' ||
        COALESCE(NEW.zip, '') || ' ' ||
        COALESCE(NEW.residence::text, '') || ' ' ||
        COALESCE(NEW.locality_type::text, '') || ' ' ||
        COALESCE(NEW.experience::text, '') || ' ' ||
        COALESCE(NEW.marital_status::text, '') || ' ' ||
        COALESCE(NEW.employment_type::text, '') || ' ' ||
        COALESCE(NEW.tenure::text, '')
      );

      NEW.search_vector_english = to_tsvector('english',
        COALESCE(NEW.street_name, '') || ' ' ||
        COALESCE(NEW.city_name, '') || ' ' ||
        COALESCE(NEW.country, '') || ' ' ||
        COALESCE(NEW.zip, '') || ' ' ||
        COALESCE(NEW.residence::text, '') || ' ' ||
        COALESCE(NEW.locality_type::text, '') || ' ' ||
        COALESCE(NEW.experience::text, '') || ' ' ||
        COALESCE(NEW.marital_status::text, '') || ' ' ||
        COALESCE(NEW.employment_type::text, '') || ' ' ||
        COALESCE(NEW.tenure::text, '')
      );

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `); //

    migrations.push(`
    DROP TRIGGER IF EXISTS caretaker_tsvector_update ON caretaker;
    CREATE TRIGGER caretaker_tsvector_update
    BEFORE INSERT OR UPDATE ON caretaker
    FOR EACH ROW EXECUTE FUNCTION caretaker_tsvector_trigger();
  `); //

    // Create indexes on the tsvector columns
    migrations.push(`
    CREATE INDEX IF NOT EXISTS idx_caretaker_search_german ON caretaker USING GIN(search_vector_german);
    CREATE INDEX IF NOT EXISTS idx_caretaker_search_english ON caretaker USING GIN(search_vector_english);
  `); //

    // Update existing rows
    migrations.push(`
    UPDATE caretaker SET street_name = street_name;
  `); //
  }

  async migrate(db: DatabaseManager) {
    console.log(
      cyan(
        emoji.emojify(
          ":rocket: [Migrations] migrating FullTextSearchIndizesMigration",
          {
            fallback: "",
          },
        ),
      ),
    );
    let migrations: Array<string> = [];
    this.createPetIndizes(db, migrations);

    try {
      await db.executeTransaction(migrations, []);

      console.log(
        green(
          emoji.emojify(
            ":ok: [Migrations] migrated search indizes succesfully",
            {
              fallback: "",
            },
          ),
        ),
      );
    } catch (e) {
      console.error(
        red(
          emoji.emojify(
            ":boom: [Migrations] Could not migrate the fulltext search indizes database tables! THIS IS CRITIAL!\n" +
              e,
            { fallback: "" },
          ),
        ),
      );
    }
  }

  async rollback(db: DatabaseManager) {
    // Drop triggers first
    await db.executeQuery(
      `DROP TRIGGER IF EXISTS pet_tsvector_update ON pet CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP TRIGGER IF EXISTS ngo_tsvector_update ON ngo CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP TRIGGER IF EXISTS caretaker_tsvector_update ON caretaker CASCADE;`,
    ); //

    // Drop functions
    await db.executeQuery(
      `DROP FUNCTION IF EXISTS pet_tsvector_trigger CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP FUNCTION IF EXISTS ngo_tsvector_trigger CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP FUNCTION IF EXISTS caretaker_tsvector_trigger CASCADE;`,
    ); //

    // Drop indexes
    await db.executeQuery(
      `DROP INDEX IF EXISTS idx_pet_search_german CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP INDEX IF EXISTS idx_pet_search_english CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP INDEX IF EXISTS idx_ngo_search_german CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP INDEX IF EXISTS idx_ngo_search_english CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP INDEX IF EXISTS idx_caretaker_search_german CASCADE;`,
    ); //
    await db.executeQuery(
      `DROP INDEX IF EXISTS idx_caretaker_search_english CASCADE;`,
    ); //

    // Drop columns - Be cautious with CASCADE here if other objects might depend on these columns
    // For a clean rollback of *this migration*, CASCADE is appropriate.
    await db.executeQuery(`
      ALTER TABLE pet
      DROP COLUMN IF EXISTS search_vector_german CASCADE,
      DROP COLUMN IF EXISTS search_vector_english CASCADE;
    `); //
    await db.executeQuery(`
      ALTER TABLE ngo
      DROP COLUMN IF EXISTS search_vector_german CASCADE,
      DROP COLUMN IF EXISTS search_vector_english CASCADE;
    `); //
    await db.executeQuery(`
      ALTER TABLE caretaker
      DROP COLUMN IF EXISTS search_vector_german CASCADE,
      DROP COLUMN IF EXISTS search_vector_english CASCADE;
    `); //
  }
}

export { FullTextSearchIndizesMigration };
