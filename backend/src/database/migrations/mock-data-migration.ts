import { DatabaseManager } from "../db";
import * as emoji from "node-emoji";
import { red, green, cyan } from "console-log-colors";
import MinioManager from "../../utils/minio-manager";
import { getSecret } from "../../utils/secret-manager";

const MINIO_PATH = `${getSecret("MINIO_PUBLIC_URL")}/${getSecret("MINIO_BUCKET_NAME")}`;

class MockDataMigrations {
  createMockData(db: DatabaseManager, migrations: Array<String>) {
    //Caretaker Persona 1: Reife Halterin mit Verantwortung, Platz und Erfahrung
    migrations.push(`INSERT INTO "user" (id, first_name, last_name, email, password, profile_picture_link, profile_picture_path, phone_number)
                      VALUES ('09a9e1fd-9a74-4f83-b5f6-9e4531a20f4c', 'Claudia', 'Weber', 'claudia.weber@example.com', 'hashed_pw1', '${MINIO_PATH}/mockdata/claudia weber.jpg', 'home4strays/mockdata/claudia weber.jpg', '+4917612345678');`);

    migrations.push(`INSERT INTO caretaker (
                      user_id, space, experience, tenure, marital_status, financial_assistance, locality_type,
                      garden, floor, residence, street_name, city_name, zip, country, house_number, employment_type,
                      previous_adoption, number_kids, birthdate, holiday_care, adoption_willingness
                    ) VALUES (
                      '09a9e1fd-9a74-4f83-b5f6-9e4531a20f4c', 120, '>10 Years', 'Paid', 'Married', false, 'Rural',
                      true, 0, 'House', 'Rosenweg', 'Münster', '48161', 'Germany', '5a', 'Employed',
                      true, 2, '1984-05-18', true, true
                    );`);

    //Caretaker Persona 2: Junger, tierlieber Stadtmensch mit Engagement
    migrations.push(`INSERT INTO "user" (id, first_name, last_name, email, password, profile_picture_link, profile_picture_path, phone_number)
                      VALUES ('e1e6ce56-e2b1-4f98-a6ec-c7c3c02bc3ec', 'Jonas', 'Berger', 'jonas.berger@example.com', 'hashed_pw2', '${MINIO_PATH}/mockdata/jonas berger.jpg', 'home4strays/mockdata/jonas berger.jpg', '+4915111122233');`);

    migrations.push(`INSERT INTO caretaker (
                      user_id, space, experience, tenure, marital_status, financial_assistance, locality_type,
                      garden, floor, residence, street_name, city_name, zip, country, house_number, employment_type,
                      previous_adoption, number_kids, birthdate, holiday_care, adoption_willingness
                    ) VALUES (
                      'e1e6ce56-e2b1-4f98-a6ec-c7c3c02bc3ec', 55, '>1 Year', 'Rented', 'Single', true, 'Urban',
                      false, 3, 'Flat', 'Bahnhofstraße', 'Berlin', '10115', 'Germany', '34', 'Student',
                      false, 0, '1998-11-12', false, true
                    );`);

    //CTHours
    migrations.push(`INSERT INTO ct_hours
                      (caretaker_id, weekday,  start_time, end_time) VALUES
                      ('09a9e1fd-9a74-4f83-b5f6-9e4531a20f4c', 'Monday',    '18:00', '20:00'),
                      ('09a9e1fd-9a74-4f83-b5f6-9e4531a20f4c', 'Wednesday', '18:00', '20:00'),
                      ('e1e6ce56-e2b1-4f98-a6ec-c7c3c02bc3ec', 'Saturday',  '10:00', '14:00'),
                      ('e1e6ce56-e2b1-4f98-a6ec-c7c3c02bc3ec', 'Sunday',    '10:00', '14:00');`);

    //NGO Pfotenhilfe Süd mit NGO Persona
    migrations.push(`INSERT INTO "user" (id, first_name, last_name, email, password, profile_picture_link, profile_picture_path, phone_number)
                      VALUES ('be2faeb8-59c2-4f85-b983-1a1ff1128cf2', 'Nadine', 'Kunz', 'nadine.kunz@pfotenhilfe.de', 'hashed_pw3', '${MINIO_PATH}/mockdata/nadine kunz.jpg', 'home4strays/mockdata/nadine kunz.jpg', '+497112345678');`);

    migrations.push(`INSERT INTO ngo (
                      id, name, email, country, verification_document_path, verification_document_link,
                      verified, logo_picture_path, logo_picture_link, phone_number, member_count, website, mission
                    ) VALUES (
                      '8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3', 'Pfotenhilfe Süd e.V.', 'kontakt@pfotenhilfe.de', 'Germany',
                      'home4strays/mockdata/pfotenhilfe_verificationdoc.pdf', '${MINIO_PATH}/mockdata/pfotenhilfe_verificationdoc.pdf', true, 'home4strays/mockdata/pfotenhilfesued.jpg', '${MINIO_PATH}/mockdata/pfotenhilfesued.jpg',
                      '+497112345678', 12, '{"https://pfotenhilfe-sued.de"}', 'We rescue animals from difficult situations and lovingly rehome them.'
                    );`);

    migrations.push(`INSERT INTO ngo_member (user_id, ngo_id)
                      VALUES ('be2faeb8-59c2-4f85-b983-1a1ff1128cf2', '8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3');`);

    //4 Tierpersonas für NGO Pfotenhilfe Süd
    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      '1c9d7d83-851e-4292-9c9e-749e416b9e30', 'Luna', 'Female', '2021-03-12', true, 18.5, 'Labrador Retriever',
                      '${MINIO_PATH}/mockdata/luna.jpg', 'home4strays/mockdata/luna.jpg', '2024-12-01', 'normal', 'playful',
                      'be2faeb8-59c2-4f85-b983-1a1ff1128cf2', 'Birkenweg', 'Ulm', '89073', 'Germany',
                      '12', 'Rural', true, '>2 Years', 80
                    );`);

    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      '80ae6659-fab4-4a34-83cd-df2dbfcd6e1b', 'Max', 'Male', '2019-07-04', true, 24.0, 'Golden Retriever',
                      '${MINIO_PATH}/mockdata/max.jpg', 'home4strays/mockdata/max.jpg', '2025-01-10', 'greedy', 'obedient',
                      'be2faeb8-59c2-4f85-b983-1a1ff1128cf2', 'Lindenallee', 'Ravensburg', '88212', 'Germany',
                      '8', 'Urban', true, '>5 Years', 100
                    );`);

    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      '14b339ae-dc2c-4d8a-b25c-4b89d2226f51', 'Mimi', 'Female', '2020-10-01', true, 4.2, 'Siamese',
                      '${MINIO_PATH}/mockdata/mimi.jpg', 'home4strays/mockdata/mimi.jpg', '2025-02-15', 'selective', 'shy',
                      'be2faeb8-59c2-4f85-b983-1a1ff1128cf2', 'Feldstraße', 'Konstanz', '78462', 'Germany',
                      '3', 'Urban', false, '>1 Year', 30
                    );`);

    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      'bc3f7a2e-7753-4b3a-9fd4-0169cf5f4dc9', 'Rocky', 'Male', '2018-05-22', true, 28.0, 'Rottweiler',
                      '${MINIO_PATH}/mockdata/rocky.jpg', 'home4strays/mockdata/rocky.jpg', '2024-11-20', 'normal', 'vigilant',
                      'be2faeb8-59c2-4f85-b983-1a1ff1128cf2', 'Schulweg', 'Freiburg', '79098', 'Germany',
                      '15', 'Rural', false, '>10 Years', 120
                    );`);

    //NGO Tierschutz Nordlicht mit NGO Persona
    migrations.push(`INSERT INTO "user" (id, first_name, last_name, email, password, profile_picture_link, profile_picture_path, phone_number)
                      VALUES ('f2a88914-f3a2-438e-90bb-d2c50a60f86e', 'Leon', 'Fischer', 'leon.fischer@ts-nordlicht.de', 'hashed_pw4', '${MINIO_PATH}/mockdata/leon fischer.jpg', 'home4strays/mockdata/leon fischer.jpg', '+494012345679');`);

    migrations.push(`INSERT INTO ngo (
                      id, name, email, country, verification_document_path, verification_document_link,
                      verified, logo_picture_path, logo_picture_link, phone_number, member_count, website, mission
                    ) VALUES (
                      '3c20f20a-40d0-4b56-b246-b0dc6c9837d2', 'Tierschutz Nordlicht e.V.', 'kontakt@ts-nordlicht.de', 'Germany',
                      'home4strays/mockdata/nordlicht_verificationdoc.pdf', 'http://home4strays.informatik.tha.de:9001/browser/home4strays/mockdata%2Fnordlicht_verificationdoc.pdf', true, 'home4strays/mockdata/nordlicht.png', '${MINIO_PATH}/mockdata/nordlicht.png',
                      '+494012345679', 9, '{"https://ts-nordlicht.de"}', 'We help neglected animals in the north find a new home.'
                    );`);

    migrations.push(`INSERT INTO ngo_member (user_id, ngo_id)
                      VALUES ('f2a88914-f3a2-438e-90bb-d2c50a60f86e', '3c20f20a-40d0-4b56-b246-b0dc6c9837d2');`);

    //4 Tierpersonas für NGO Tierschutz Nordlicht
    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      '95f6f237-1cd6-445b-9d06-03e5d527c404', 'Bella', 'Female', '2020-06-20', true, 16.0, 'Beagle',
                      '${MINIO_PATH}/mockdata/bella.jpg', 'home4strays/mockdata/bella.jpg', '2025-02-12', 'normal', 'lively',
                      'f2a88914-f3a2-438e-90bb-d2c50a60f86e', 'Wiesenweg', 'Kiel', '24103', 'Germany',
                      '7', 'Other', true, '>2 Years', 60
                    );`);

    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      '2ec3ef0a-e62b-44ec-8329-9b69e9e3929b', 'Charly', 'Male', '2017-03-18', true, 7.8, 'Maine Coon',
                      '${MINIO_PATH}/mockdata/charly.jpg', 'home4strays/mockdata/charly.jpg', '2024-10-01', 'greedy', 'lazy',
                      'f2a88914-f3a2-438e-90bb-d2c50a60f86e', 'Hafenstraße', 'Lübeck', '23552', 'Germany',
                      '19', 'Urban', true, '>1 Year', 40
                    );`);

    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      'd7cb41b3-7f23-4d39-8a13-bbf73ea05e9f', 'Nala', 'Female', '2022-01-10', false, 13.5, 'Border Collie',
                      '${MINIO_PATH}/mockdata/nala.jpg', 'home4strays/mockdata/nala.jpg', '2025-03-01', 'selective', 'defensive',
                      'f2a88914-f3a2-438e-90bb-d2c50a60f86e', 'Moorweg', 'Flensburg', '24937', 'Germany',
                      '10b', 'Rural', true, '>5 Years', 90
                    );`);

    migrations.push(`INSERT INTO pet (
                      id, name, gender, birthdate, castration, weight, breed, profile_picture_link, profile_picture_path,
                      last_check_up, eating_behaviour, behaviour, ngo_member_id, street_name, city_name, zip, country,
                      house_number, locality_type_requirement, kids_allowed, experience_requirement, minimum_space_requirement
                    ) VALUES (
                      'b85b8c94-24e1-45b6-a3ff-3a1e3f871b77', 'Simba', 'Male', '2021-09-08', true, 5.2, 'Bengal',
                      '${MINIO_PATH}/mockdata/simba.png', 'home4strays/mockdata/simba.png', '2025-01-25', 'normal', 'cautious',
                      'f2a88914-f3a2-438e-90bb-d2c50a60f86e', 'Nordstraße', 'Hamburg', '20095', 'Germany',
                      '23', 'Urban', false, '>2 Years', 30
                    );`);

    //PetDisease
    migrations.push(`INSERT INTO pet_disease
                      (pet_id, disease, info, medications) VALUES
                      ('bc3f7a2e-7753-4b3a-9fd4-0169cf5f4dc9', 'hip dysplasia',        'Mild osteoarthritis in the right hip.', 'Carprofen'),
                      ('2ec3ef0a-e62b-44ec-8329-9b69e9e3929b', 'Chronic renal failure', 'Regular blood tests are necessary.',  'special food');`);

    //PetFears
    migrations.push(`INSERT INTO pet_fears
                      (pet_id, fear, info) VALUES
                      ('14b339ae-dc2c-4d8a-b25c-4b89d2226f51', 'loud fireworks',   'Hides under furniture.'),
                      ('d7cb41b3-7f23-4d39-8a13-bbf73ea05e9f', 'thunderstorms',          'Calms down through physical contact.');`);

    //PetPicture
    migrations.push(`INSERT INTO pet_picture
                      (pet_id, picture_path, picture_link) VALUES
                      ('1c9d7d83-851e-4292-9c9e-749e416b9e30', 'home4strays/mockdata/luna2.jpg',  '${MINIO_PATH}/mockdata/luna2.jpg'),
                      ('80ae6659-fab4-4a34-83cd-df2dbfcd6e1b', 'home4strays/mockdata/max2.jpg', '${MINIO_PATH}/mockdata/max2.jpg'),
                      ('95f6f237-1cd6-445b-9d06-03e5d527c404', 'home4strays/mockdata/bella2.jpg', '${MINIO_PATH}/mockdata/bella2.jpg');`);

    //PetVaccination
    migrations.push(`INSERT INTO pet_vaccination
                      (pet_id, vaccine, date) VALUES
                      ('1c9d7d83-851e-4292-9c9e-749e416b9e30', 'rabies',     '2024-09-15'),
                      ('80ae6659-fab4-4a34-83cd-df2dbfcd6e1b', 'DHPPi + L',   '2025-01-05'),
                      ('b85b8c94-24e1-45b6-a3ff-3a1e3f871b77', 'panleukopenia', '2024-11-20');`);

    //PetBookmark: Claudia/Bella, Jonas/Mimi
    migrations.push(`INSERT INTO pet_bookmark
                      (caretaker_id, pet_id) VALUES
                      ('09a9e1fd-9a74-4f83-b5f6-9e4531a20f4c', '95f6f237-1cd6-445b-9d06-03e5d527c404'),
                      ('e1e6ce56-e2b1-4f98-a6ec-c7c3c02bc3ec', '14b339ae-dc2c-4d8a-b25c-4b89d2226f51');`);

    const ngoOpeningHours = [
      // Pfotenhilfe Süd
      {
        ngo_id: "8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3",
        weekday: "Monday",
        start_time: "09:00",
        end_time: "16:00",
      },
      {
        ngo_id: "8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3",
        weekday: "Tuesday",
        start_time: "09:00",
        end_time: "16:00",
      },
      {
        ngo_id: "8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3",
        weekday: "Wednesday",
        start_time: "08:00",
        end_time: "20:00",
      },
      {
        ngo_id: "8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3",
        weekday: "Thursday",
        start_time: "09:00",
        end_time: "18:00",
      },
      {
        ngo_id: "8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3",
        weekday: "Friday",
        start_time: "08:00",
        end_time: "20:00",
      },
      // Tierschutz Nordlicht
      {
        ngo_id: "3c20f20a-40d0-4b56-b246-b0dc6c9837d2",
        weekday: "Monday",
        start_time: "08:30",
        end_time: "21:00",
      },
      {
        ngo_id: "3c20f20a-40d0-4b56-b246-b0dc6c9837d2",
        weekday: "Tuesday",
        start_time: "08:30",
        end_time: "21:00",
      },
      {
        ngo_id: "3c20f20a-40d0-4b56-b246-b0dc6c9837d2",
        weekday: "Wednesday",
        start_time: "06:30",
        end_time: "16:00",
      },
      {
        ngo_id: "3c20f20a-40d0-4b56-b246-b0dc6c9837d2",
        weekday: "Thursday",
        start_time: "06:30",
        end_time: "16:00",
      },
      {
        ngo_id: "3c20f20a-40d0-4b56-b246-b0dc6c9837d2",
        weekday: "Friday",
        start_time: "07:00",
        end_time: "17:00",
      },
    ];

    ngoOpeningHours.forEach(({ ngo_id, weekday, start_time, end_time }) => {
      migrations.push(
        `INSERT INTO ngo_hours (ngo_id, weekday, start_time, end_time) VALUES ('${ngo_id}', '${weekday}', '${start_time}', '${end_time}');`,
      );
    });

    const ngoMemberOpeningHours = [
      // Pfotenhilfe Süd
      {
        ngoMemberId: "be2faeb8-59c2-4f85-b983-1a1ff1128cf2",
        weekday: "Monday",
        startTime: "09:00",
        endTime: "16:00",
      },
      {
        ngoMemberId: "be2faeb8-59c2-4f85-b983-1a1ff1128cf2",
        weekday: "Tuesday",
        startTime: "09:00",
        endTime: "16:00",
      },
      {
        ngoMemberId: "be2faeb8-59c2-4f85-b983-1a1ff1128cf2",
        weekday: "Wednesday",
        startTime: "08:00",
        endTime: "20:00",
      },
      {
        ngoMemberId: "be2faeb8-59c2-4f85-b983-1a1ff1128cf2",
        weekday: "Thursday",
        startTime: "09:00",
        endTime: "18:00",
      },
      {
        ngoMemberId: "be2faeb8-59c2-4f85-b983-1a1ff1128cf2",
        weekday: "Friday",
        startTime: "08:00",
        endTime: "20:00",
      },
      // Tierschutz Nordlicht
      {
        ngoMemberId: "f2a88914-f3a2-438e-90bb-d2c50a60f86e",
        weekday: "Monday",
        startTime: "08:30",
        endTime: "21:00",
      },
      {
        ngoMemberId: "f2a88914-f3a2-438e-90bb-d2c50a60f86e",
        weekday: "Tuesday",
        startTime: "08:30",
        endTime: "21:00",
      },
      {
        ngoMemberId: "f2a88914-f3a2-438e-90bb-d2c50a60f86e",
        weekday: "Wednesday",
        startTime: "06:30",
        endTime: "16:00",
      },
      {
        ngoMemberId: "f2a88914-f3a2-438e-90bb-d2c50a60f86e",
        weekday: "Thursday",
        startTime: "06:30",
        endTime: "16:00",
      },
      {
        ngoMemberId: "f2a88914-f3a2-438e-90bb-d2c50a60f86e",
        weekday: "Friday",
        startTime: "07:00",
        endTime: "17:00",
      },
    ];

    ngoMemberOpeningHours.forEach(
      ({ ngoMemberId, weekday, startTime, endTime }) => {
        migrations.push(
          `INSERT INTO "ngo_member_hours" ("ngo_member_id", "weekday", "start_time", "end_time") VALUES ('${ngoMemberId}', '${weekday}', '${startTime}', '${endTime}');`,
        );
      },
    );
  }

  /*   async insertPublicURLs(db: DatabaseManager) {
    const minio = MinioManager.getInstance();

    // User aktualisieren
    const users = await db.executeQuery(
      `SELECT id, profile_picture_path FROM "user";`, //
    );
    for (const user of users.rows) {
      if (user.profile_picture_path) {
        //
        const url = await minio.getPublicURL(user.profile_picture_path); //
        await db.executeQuery(
          `UPDATE "user" SET profile_picture_link = $1 WHERE id = $2;`, //
          [url, user.id],
        );
      }
    }

    // Pet aktualisieren
    const pets = await db.executeQuery(
      `SELECT id, profile_picture_path FROM pet;`, //
    );
    for (const pet of pets.rows) {
      if (pet.profile_picture_path) {
        //
        const url = await minio.getPublicURL(pet.profile_picture_path);  //
      
        await db.executeQuery(
          `UPDATE pet SET profile_picture_link = $1 WHERE id = $2;`, //
          [url, pet.id],
        );
      }
    }

    //Zusätzliche Bilder aktualisieren für Pet
    const petPics = await db.executeQuery(
      `SELECT pet_id, picture_path FROM pet_picture;`, //
    );

    for (const pic of petPics.rows) {
      if (pic.picture_path) {
        //
        const url = await minio.getPublicURL(pic.picture_path); //
        await db.executeQuery(
          `UPDATE pet_picture SET picture_link = $1 WHERE pet_id = $2 AND picture_path = $3;`, //
          [url, pic.pet_id, pic.picture_path], //
        );
      }
    }

    // NGO aktualisieren
    const ngos = await db.executeQuery(
      `SELECT id, logo_picture_path, verification_document_path FROM ngo;`, //
    );
    for (const ngo of ngos.rows) {
      const updates: string[] = [];
      const values: any[] = [];
      let index = 1;

      if (ngo.logo_picture_path) {
        //
        const logoUrl = await minio.getPublicURL(ngo.logo_picture_path); //
        updates.push(`logo_picture_link = $${index++}`); //
        values.push(logoUrl);
      }

      if (ngo.verification_document_path) {
        //
        const docUrl = await minio.getPublicURL(ngo.verification_document_path); //
        updates.push(`verification_document_link = $${index++}`); //
        values.push(docUrl);
      }

      if (updates.length > 0) {
        values.push(ngo.id);
        await db.executeQuery(
          `UPDATE ngo SET ${updates.join(", ")} WHERE id = $${index};`, //
          values,
        );
      }
    }
  }
 */
  async migrate(db: DatabaseManager) {
    console.log(
      cyan(
        emoji.emojify(":rocket: [Migrations] migrating MockDataMigrations", {
          fallback: "",
        }),
      ),
    );

    let mockDataMigrations: Array<string> = [];

    // migrate mock data queries
    this.createMockData(db, mockDataMigrations);

    try {
      await db.executeTransaction(mockDataMigrations, []);
      //await this.insertPublicURLs(db);
    } catch (e) {
      console.error(
        red(
          emoji.emojify(
            ":boom: [Migrations] Could not migrate the mock database tables! THIS IS CRITIAL!\n" +
              e,
            { fallback: "" },
          ),
        ),
      );
    }
    console.log(
      green(
        emoji.emojify(
          ":ok: [Migrations] migrated MockDataMigrations succesfully",
          { fallback: "" },
        ),
      ),
    );
  }

  async rollback(db: DatabaseManager) {
    const deleteUsers = async (db: DatabaseManager, userIds: Array<string>) => {
      for (const id of userIds) {
        await db.executeQuery(`DELETE FROM "user" WHERE id=$1;`, [id]);
      }
    };

    const deletePets = async (db: DatabaseManager, petIds: Array<string>) => {
      for (const id of petIds) {
        await db.executeQuery(`DELETE FROM pet WHERE id=$1;`, [id]);
      }
    };

    const deleteNGOs = async (db: DatabaseManager, ngoIds: Array<string>) => {
      for (const id of ngoIds) {
        await db.executeQuery(`DELETE FROM ngo WHERE id=$1;`, [id]);
      }
    };

    await deleteUsers(db, [
      "09a9e1fd-9a74-4f83-b5f6-9e4531a20f4c",
      "e1e6ce56-e2b1-4f98-a6ec-c7c3c02bc3ec",
      "be2faeb8-59c2-4f85-b983-1a1ff1128cf2",
      "f2a88914-f3a2-438e-90bb-d2c50a60f86e",
    ]);
    await deletePets(db, [
      "1c9d7d83-851e-4292-9c9e-749e416b9e30",
      "14b339ae-dc2c-4d8a-b25c-4b89d2226f51",
      "80ae6659-fab4-4a34-83cd-df2dbfcd6e1b",
      "bc3f7a2e-7753-4b3a-9fd4-0169cf5f4dc9",
      "95f6f237-1cd6-445b-9d06-03e5d527c404",
      "2ec3ef0a-e62b-44ec-8329-9b69e9e3929b",
      "d7cb41b3-7f23-4d39-8a13-bbf73ea05e9f",
      "b85b8c94-24e1-45b6-a3ff-3a1e3f871b77",
    ]);

    await deleteNGOs(db, [
      "8f95a9f0-0c2a-4b2e-9ac0-58b8b56cd8b3",
      "3c20f20a-40d0-4b56-b246-b0dc6c9837d2",
    ]);
  }
}

export { MockDataMigrations };
