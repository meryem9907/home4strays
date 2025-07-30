import { NextFunction, Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import multer from "multer";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { z } from "zod";

// services
import { databaseManager, minioManager } from "../app";
import MinioManager from "../utils/minio-manager";
import { TranslationManager } from "../utils/translations-manager";

// middlewares
import { authenticateToken } from "../middlewares/verifiy-token.middleware";
import { verifyNGOAdmin } from "../middlewares/verify-admin.middleware";
import { verifyNGO } from "../middlewares/verifiy-ngo.middleware";

// db
import { UserQueries } from "../database/queries/user";
import { PetPictureQueries } from "../database/queries/petpicture";
import { PetQueries } from "../database/queries/pet";
import PetPicture from "../models/db-models/petpicture";
import { NGOQueries } from "../database/queries/ngo";
import { Pet } from "../models/db-models/pet";
import { User } from "../models/db-models/user";

// errors
import {
  ForbiddenAccessError,
  LogoNotFoundError,
  MaxPetPicturesReachedError,
  NGONotFoundError,
  NoFileError,
  OldProfilePictureNotFoundError,
  PetNotFoundError,
  PictureNotFoundError,
} from "../utils/errors";

// zod schemas
import {
  PetIdParamsSchema,
  PetIdOnlyParamsSchema,
  PetPictureParamsSchema,
  NGOLogoParamsSchema,
  PetPicturesUploadResponseSchema,
  PetPictureDeleteResponseSchema,
  PetPictureGetResponseSchema,
  PetPicturesGetResponseSchema,
  UserProfilePictureUploadResponseSchema,
  UserProfilePictureDeleteResponseSchema,
  NGOLogoUploadResponseSchema,
  NGOLogoDeleteResponseSchema,
} from "../models/zod-schemas/pet.zod";

const router = Router();

const storage = multer.memoryStorage(); // to use buffer
const uploadToMem = multer({ storage }); // use this for uploading multiple pics
const uploadToDisk = multer({ dest: "../utils/uploads" });
const minio = MinioManager.getInstance();

/**
 * @route POST /user-profile-pic
 * @summary Upload user profile picture
 * @description Uploads a new profile picture for the authenticated user. Replaces any existing one.
 * @header {Authorization} Authorization - Bearer token
 * @formData {file} user-profile-picture - The image file to upload
 * @returns {UserProfilePictureUploadResponseSchema} 201 Created - Upload success with public image link
 * @throws {NoFileError} If no file is provided
 */
router.post(
  "/user-profile-pic",
  uploadToDisk.single("user-profile-picture"),
  authenticateToken,
  openAPIRoute(
    {
      tag: "user",
      summary: "Set user profile picture. Upload file.",
      description: "Writes the file to the S3 Bucket",
      response: UserProfilePictureUploadResponseSchema,
    },
    async (req, res, next) => {
      try {
        const userId = req.user!.id;
        const file = req.file as Express.Multer.File;

        if (!file) {
          throw NoFileError;
        }

        let oldProfilePic: User = await UserQueries.selectProfilePicture(
          databaseManager,
          userId,
        );

        if (oldProfilePic && oldProfilePic.profilePicturePath) {
          await minio.removeFile(oldProfilePic.profilePicturePath);
          await UserQueries.deleteUserProfilePic(databaseManager, userId);
        }

        // uploadNewPic to Minio
        const profilePicture = file;
        // include bucket for pet profile pictures with petid in the filename
        const fileExtension = path.extname(profilePicture.originalname);
        const profilePictureFilename = `user-profile-picture/${userId}-profile-pic${fileExtension}`;
        await minio.uploadFile(profilePictureFilename, profilePicture.path, {
          "Content-Type": profilePicture.mimetype,
        });

        // get Public URL and save path and public url/link to db
        let profilePicPublicURL = await minioManager.getPublicURL(
          profilePictureFilename,
        );
        await UserQueries.updateUserProfilePic(
          databaseManager,
          userId,
          profilePictureFilename,
          profilePicPublicURL,
        );

        res.status(201).json({
          message: "Profile picture uploaded successfully.",
          profilePictureLink: profilePicPublicURL,
        });
      } catch (err) {
        console.error(`Error uploading profile picture: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /user-profile-pic
 * @summary Delete user profile picture
 * @description Deletes the currently stored profile picture of the authenticated user.
 * @header {Authorization} Authorization - Bearer token
 * @returns {UserProfilePictureDeleteResponseSchema} 200 OK - Confirmation message
 * @throws {OldProfilePictureNotFoundError} If the user has no stored profile picture
 */
router.delete(
  "/user-profile-pic",
  authenticateToken,
  openAPIRoute(
    {
      tag: "user",
      summary: "Delete user profile picture",
      response: UserProfilePictureDeleteResponseSchema,
    },
    async (req, res, next) => {
      try {
        const userId = req.user!.id;

        let oldProfilePic: User = await UserQueries.selectProfilePicture(
          databaseManager,
          userId,
        );

        if (oldProfilePic && oldProfilePic.profilePicturePath) {
          await minio.removeFile(oldProfilePic.profilePicturePath);
          await UserQueries.deleteUserProfilePic(databaseManager, userId);
          res
            .status(200)
            .json({ message: "User profile picture deleted successfully." });
        } else {
          throw OldProfilePictureNotFoundError;
        }
      } catch (err) {
        console.error("Error deleting user profile picture:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /pet-profile-pic/:id
 * @summary Upload a pet's profile picture
 * @description Uploads a profile picture for the specified pet and replaces any existing one.
 * @header {Authorization} Authorization - Bearer token
 * @param {string} id - ID of the pet
 * @formData {file} pet-profile-picture - The image file to upload
 * @returns {Object} 201 Created - Upload success with public image link
 * @throws {NoFileError} If no file is provided
 */
router.post(
  "/pet-profile-pic/:id",
  authenticateToken,
  verifyNGO,
  uploadToDisk.single("pet-profile-picture"),
  openAPIRoute(
    {
      tag: "pet",
      summary: "Upload a pet's profile picture",
      params: z.object({ id: z.string() }),
      response: z.object({
        message: z.string(),
        profilePictureLink: z.string().url(),
      }),
    },
    async (req, res, next) => {
      try {
        const file = req.file as Express.Multer.File;
        const petId = req.params.id;

        if (!file) throw NoFileError;

        let oldProfilePic = await PetQueries.selectProfilePicture(
          databaseManager,
          petId,
        );
        if (oldProfilePic?.profilePicturePath) {
          await minio.removeFile(oldProfilePic.profilePicturePath);
          await PetQueries.deletePetProfilePic(databaseManager, petId);
        }

        const fileExtension = path.extname(file.originalname);
        const profilePictureFilename = `pet-profile-picture/${petId}-profile-pic${fileExtension}`;
        await minio.uploadFile(profilePictureFilename, file.path, {
          "Content-Type": file.mimetype,
        });

        const publicURL = await minioManager.getPublicURL(
          profilePictureFilename,
        );

        await PetQueries.updatePetProfilePic(
          databaseManager,
          petId,
          profilePictureFilename,
          publicURL,
        );

        res.status(201).json({
          message: "Pet profile picture uploaded successfully.",
          profilePictureLink: publicURL,
        });
      } catch (err) {
        console.log(`Error uploading pet profile picture: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /pet-profile-pic/:id
 * @summary Delete a pet's profile picture
 * @description Deletes the current profile picture for the specified pet.
 * @header {Authorization} Authorization - Bearer token
 * @param {string} id - ID of the pet
 * @returns {Object} 200 OK - Confirmation message
 * @throws {OldProfilePictureNotFoundError} If the pet has no profile picture
 */
router.delete(
  "/pet-profile-pic/:id",
  authenticateToken,
  verifyNGO,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Delete a pet's profile picture",
      params: z.object({ id: z.string() }),
      response: z.object({ message: z.string() }),
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;
        let oldProfilePic = await PetQueries.selectProfilePicture(
          databaseManager,
          petId,
        );

        if (oldProfilePic?.profilePicturePath) {
          await minio.removeFile(oldProfilePic.profilePicturePath);
          await PetQueries.deletePetProfilePic(databaseManager, petId);
          res
            .status(200)
            .json({ message: "Pet profile picture deleted successfully." });
        } else {
          throw OldProfilePictureNotFoundError;
        }
      } catch (err) {
        console.log("Error deleting pet profile picture:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route POST /ngo-logo/:ngoId
 * @summary Upload NGO logo
 * @description Uploads and stores a new logo for the specified NGO, replacing any existing logo.
 * @header {Authorization} Authorization - Bearer token
 * @param {string} ngoId - ID of the NGO
 * @formData {file} ngo-logo - Logo file to upload
 * @returns {NGOLogoUploadResponseSchema} 201 Created - Confirmation with public logo link
 * @throws {NoFileError} If no file is provided
 */
router.post(
  "/ngo-logo/:ngoId",
  authenticateToken,
  verifyNGOAdmin,
  uploadToDisk.single("ngo-logo"),
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Upload multiple pictures for a pet (duplicate endpoint)",
      description:
        "Upload multiple pictures for a pet (max 10 pictures total per pet) - duplicate endpoint",
      params: NGOLogoParamsSchema,
      response: NGOLogoUploadResponseSchema,
    },
    async (req, res, next) => {
      try {
        const file = req.file as Express.Multer.File;
        const ngoId = req.params.ngoId;

        if (!file) throw NoFileError;

        const oldLogo = await NGOQueries.selectLogo(databaseManager, ngoId);
        if (oldLogo?.logoPicturePath) {
          await minio.removeFile(oldLogo.logoPicturePath);
          await NGOQueries.deleteNgoLogoPic(databaseManager, ngoId);
        }

        const fileExtension = path.extname(file.originalname);
        const logoFilename = `ngo-logos/${ngoId}-logo${fileExtension}`;
        await minio.uploadFile(logoFilename, file.path, {
          "Content-Type": file.mimetype,
        });

        const publicURL = await minioManager.getPublicURL(logoFilename);
        await NGOQueries.updateNgoLogoPic(
          databaseManager,
          ngoId,
          logoFilename,
          publicURL,
        );

        res.status(201).json({
          message: "NGO logo picture uploaded successfully.",
          logoPictureLink: publicURL,
        });
      } catch (err) {
        console.log(`Error uploading ngo logo picture: ${err}`);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /ngo-logo/:ngoId
 * @summary Delete NGO logo
 * @description Deletes the current logo image associated with the specified NGO.
 * @header {Authorization} Authorization - Bearer token
 * @param {string} ngoId - ID of the NGO
 * @returns {NGOLogoDeleteResponseSchema} 200 OK - Confirmation message
 * @throws {LogoNotFoundError} If no logo exists for the NGO
 */
router.delete(
  "/ngo-logo/:ngoId",
  authenticateToken,
  verifyNGOAdmin,
  openAPIRoute(
    {
      tag: "ngo",
      summary: "Delete NGO logo",
      params: NGOLogoParamsSchema,
      response: NGOLogoDeleteResponseSchema,
    },
    async (req, res, next) => {
      try {
        const ngoId = req.params.ngoId;

        const ngo = await NGOQueries.selectById(databaseManager, ngoId);
        if (!ngo) throw NGONotFoundError;

        const oldLogo = await NGOQueries.selectLogo(databaseManager, ngo.id);
        if (oldLogo?.logoPicturePath) {
          await minio.removeFile(oldLogo.logoPicturePath);
          await NGOQueries.deleteNgoLogoPic(databaseManager, ngo.id);
          res
            .status(200)
            .json({ message: "Ngo logo picture deleted successfully." });
        } else {
          throw LogoNotFoundError;
        }
      } catch (err) {
        console.log("Error deleting ngo logo picture:", err);
        next(err);
      }
    },
  ),
);

//--------------- PETPICTURE ---------------//

/**
 * @route POST /pet-pictures/:id
 * @summary Upload multiple pictures for a pet
 * @description Uploads multiple images for a specific pet (maximum 10 total per pet).
 * @header {Authorization} Authorization - Bearer token
 * @param {string} id - Pet ID
 * @formData {file[]} pet-pictures - Array of image files
 * @returns {PetPicturesUploadResponseSchema} 200 OK - Confirmation and list of public URLs
 * @throws {MaxPetPicturesReachedError} If pet already has 10 pictures
 */
router.post(
  "/pet-pictures/:id",
  authenticateToken,
  verifyNGO,
  uploadToMem.array("pet-pictures"),
  openAPIRoute(
    {
      tag: "pet",
      summary: "Upload multiple pictures for a pet",
      description:
        "Upload multiple pictures for a pet (max 10 pictures per pet)",
      params: PetIdParamsSchema,
      response: PetPicturesUploadResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.id;
        const files = req.files as Express.Multer.File[];
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        if (req.ngo!.verified == false) {
          throw ForbiddenAccessError;
        }

        if (!petId) {
          throw PetNotFoundError;
        }

        if (!files) {
          throw NoFileError;
        }

        //maximum number of pictures 10
        const countResult = await databaseManager.executeQuery(
          `SELECT COUNT(*) AS count FROM pet_picture WHERE pet_id = $1`,
          [petId],
        );
        const currentCount = parseInt(countResult.rows[0].count, 10);

        if (currentCount >= 10) {
          throw MaxPetPicturesReachedError;
        }

        const pet: Pet = await PetQueries.selectByIdSecurely(
          databaseManager,
          petId,
          tm,
        );
        if (!pet) {
          throw PetNotFoundError;
        }

        let publicURLs: string[] = [];
        for (const file of files) {
          const fileExtension = path.extname(file.originalname);
          const fileId = uuidv4();
          const pictureFilename = `pet-pictures/${pet.name}-${pet.id}/${fileId}${fileExtension}`;
          await minio.uploadFileFromStream(pictureFilename, file.buffer, {
            "Content-Type": file.mimetype,
          });
          // get Public URL and save path and public url/link to db
          let picturePublicURL =
            await minioManager.getPublicURL(pictureFilename);
          const petPicture: PetPicture = {
            petId,
            pictureLink: picturePublicURL,
            picturePath: pictureFilename,
          };
          await PetPictureQueries.insert(databaseManager, petPicture);
          const pubURL = picturePublicURL;
          publicURLs.push(pubURL);
        }

        res.status(200).json({
          message: "Pet pictures uploaded successfully.",
          pictureLinks: publicURLs,
        });
      } catch (err) {
        console.log("Error uploading pet pictures:", err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /pet-picture/:petId/:pictureLink
 * @summary Get a specific pet picture
 * @description Retrieves a single image for a pet by ID and picture link.
 * @param {string} petId - Pet ID
 * @param {string} pictureLink - Picture link (file identifier)
 * @returns {PetPictureGetResponseSchema} 200 OK - Contains the picture URL
 * @throws {PictureNotFoundError} If the picture doesn't exist
 */
router.get(
  "/pet-picture/:petId/:pictureLink",
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get a specific pet picture",
      description:
        "Retrieve a specific picture of a pet by pet ID and picture link",
      params: PetPictureParamsSchema,
      response: PetPictureGetResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.petId;
        const pictureLink = req.params.pictureLink;
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        if (!pictureLink) {
          throw PictureNotFoundError;
        }

        const pet: Pet = await PetQueries.selectByIdSecurely(
          databaseManager,
          petId,
          tm,
        );
        if (!pet) {
          throw PetNotFoundError;
        }

        const petPicture = await PetPictureQueries.selectByPictureLink(
          databaseManager,
          petId,
          pictureLink,
        );
        if (!petPicture) {
          throw PictureNotFoundError;
        }

        res.status(200).json({ pictureLink: petPicture.pictureLink || "" });
      } catch (err) {
        console.log("Error GET /pet-picture/:petId :", err);
        next(err);
      }
    },
  ),
);

/**
 * @route GET /pet-pictures/:petId
 * @summary Get all pictures for a pet
 * @description Retrieves all stored images for a specific pet.
 * @param {string} petId - Pet ID
 * @returns {PetPicturesGetResponseSchema} 200 OK - Array of image URLs
 * @throws {NoFileError} If the pet has no pictures
 */
router.get(
  "/pet-pictures/:petId",
  openAPIRoute(
    {
      tag: "pet",
      summary: "Get all pictures for a pet",
      description: "Retrieve all pictures for a specific pet",
      params: PetIdOnlyParamsSchema,
      response: PetPicturesGetResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.petId;

        if (!petId) {
          throw PetNotFoundError;
        }

        const pictures = await PetPictureQueries.selectByPetId(
          databaseManager,
          petId,
        );
        if (!pictures || pictures.length === 0) {
          throw NoFileError;
        }
        let pictureLinks: Array<string> = [];
        for (const picture of pictures) {
          if (picture.pictureLink) {
            pictureLinks.push(picture.pictureLink);
          }
        }

        res.status(200).json({ pictureLinks: pictureLinks });
      } catch (err) {
        console.log("Error GET /pet-pictures/:petId :", err);
        next(err);
      }
    },
  ),
);

/**
 * @route DELETE /pet-picture/:petId/:pictureLink
 * @summary Delete a specific pet picture
 * @description Deletes a single picture belonging to a pet.
 * @header {Authorization} Authorization - Bearer token
 * @param {string} petId - Pet ID
 * @param {string} pictureLink - Unique picture identifier
 * @returns {PetPictureDeleteResponseSchema} 200 OK - Confirmation of deletion
 * @throws {ForbiddenAccessError} If the NGO is not verified
 * @throws {PictureNotFoundError} If the picture doesn't exist
 */
router.delete(
  "/pet-picture/:petId/:pictureLink",
  authenticateToken,
  verifyNGO,
  openAPIRoute(
    {
      tag: "pet",
      summary: "Delete a specific pet picture",
      description:
        "Delete a specific picture of a pet by pet ID and picture link",
      params: PetPictureParamsSchema,
      response: PetPictureDeleteResponseSchema,
    },
    async (req, res, next) => {
      try {
        const petId = req.params.petId;
        const pictureLink = req.params.pictureLink;
        const lang = res.locals.lang;
        let tm = TranslationManager.getInstance();
        tm.setLocale(lang);

        if (req.ngo!.verified == false) {
          throw ForbiddenAccessError;
        }
        if (!pictureLink) {
          throw NoFileError;
        }

        const pet: Pet = await PetQueries.selectByIdSecurely(
          databaseManager,
          petId,
          tm,
        );
        if (!pet) {
          throw PetNotFoundError;
        }

        const petPicture: PetPicture =
          await PetPictureQueries.selectByPictureLink(
            databaseManager,
            petId,
            pictureLink,
          );

        if (petPicture && petPicture.picturePath) {
          await minio.removeFile(petPicture.picturePath);
          await PetPictureQueries.deleteByPicturePath(
            databaseManager,
            petPicture.picturePath,
          );
        } else {
          throw PictureNotFoundError;
        }

        res.status(200).json({ message: "Pet picture deleted successfully." });
      } catch (err) {
        console.log("Error deleting pet picture:", err);
        next(err);
      }
    },
  ),
);

export { router as picturesRouter };
