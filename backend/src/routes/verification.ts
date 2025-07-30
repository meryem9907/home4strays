import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import fs from "fs";
import { openAPIRoute } from "express-zod-openapi-autogen";

// middlewars
import { authenticateToken } from "../middlewares/verifiy-token.middleware";

// db
import { UserQueries } from "../database/queries/user";
import { NGOQueries } from "../database/queries/ngo";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { databaseManager, minioManager } from "../app";
import { NGO } from "../models/db-models/ngo";
import { NGOMember } from "../models/db-models/ngomember";

// errors
import {
  ErrorDeletingNGOMember,
  ForbiddenAccessError,
  NoPendingVerifications,
  UserNotAuthorizedError,
  ValidationError,
} from "../utils/errors";

// zod schemas
import {
  DocumentSchema,
  LogoSchema,
  LogoSchemaType,
  NGORegisterSchema,
  RejectNGOResponseSchema,
  UnverifiedNGOsResponse,
  UnverifiedNGOsResponseSchema,
  UpdateNGOVerificationStatusRequestSchema,
  VerificationRequestResponse,
  VerificationRequestResponseSchema,
  VerifyNGOResponseSchema,
} from "../models/zod-schemas/verification.zod";

// services
import { MailQueue, sendMail } from "../utils/email-manager";
import { VerifyMail } from "../utils/email-templates/verified-email";
import { RejectionEmail } from "../utils/email-templates/rejected-verification-email";

const verificationRequestMail = fs.readFileSync(
  path.join(
    __dirname,
    "../utils/email-templates/verification-request-mail.html",
  ),
);

// Router setup
const router = Router();
const upload = multer({ dest: "../utils/uploads" });

/**
 * PUT /verify-ngo
 * Marks an NGO as verified and notifies all members.
 *
 * @param {UpdateNGOVerificationStatusRequestSchema} body - Request body containing NGO name and country.
 * @returns {VerifyNGOResponseSchema} - Confirmation that the NGO was verified.
 *
 * @description This endpoint is used by administrators to mark an NGO as verified. It updates the NGO record in the database,
 * notifies all members via email, and returns a confirmation message. Requires administrative privileges.
 */
router.put(
  "/verify-ngo",
  authenticateToken,
  openAPIRoute(
    {
      tag: "verification",
      summary: "Verify NGO",
      description:
        "Marks an NGO as verified and notifies all members via email.",
      body: UpdateNGOVerificationStatusRequestSchema,
      response: VerifyNGOResponseSchema,
    },

    async (req, res, next) => {
      try {
        const result = UpdateNGOVerificationStatusRequestSchema.safeParse(
          req.body,
        );
        const lang = res.locals.lang;
        if (!result.success) throw ValidationError;
        if (req.user?.isAdmin == false) throw ForbiddenAccessError;
        const { name, country } = result.data;

        await NGOQueries.updateAsVerified(databaseManager, name, country);

        // select email in correct language
        const verificationEmail = await new VerifyMail(lang).getEmail();

        const users = await UserQueries.selectUsersByNGO(
          databaseManager,
          name,
          country,
        );

        users.map(async (user) => {
          await sendMail({
            from: '"Home4Strays 🐶" <home4strays@obco.pro>',
            to: user.email,
            subject: "Home4Strays NGO Verification",
            html: verificationEmail,
          });
        });

        res.status(200).json({ status: `${name} from ${country} verified.` });
      } catch (err) {
        console.error("Error in /verify-ngo:", err);
        next(err);
      }
    },
  ),
);

/**
 * DELETE /reject-ngo
 * Deletes an NGO and its users if the verification is rejected.
 *
 * @param {UpdateNGOVerificationStatusRequestSchema} body - Request body containing NGO name and country.
 * @returns {RejectNGOResponseSchema} - Confirmation that the NGO was rejected and deleted.
 *
 * @description This endpoint is used by administrators to reject an NGO verification request. It deletes the NGO record,
 * removes all associated users, and notifies members via email. Requires administrative privileges.
 */
router.delete(
  "/reject-ngo",
  authenticateToken,
  openAPIRoute(
    {
      tag: "verification",
      summary: "Reject NGO verification",
      description:
        "Rejects an NGO verification request, deletes the NGO and notifies all members via email.",
      body: UpdateNGOVerificationStatusRequestSchema,
      response: RejectNGOResponseSchema,
    },
    async (req, res, next) => {
      try {
        const result = UpdateNGOVerificationStatusRequestSchema.safeParse(
          req.body,
        );
        const lang = res.locals.lang;
        if (!result.success) throw ValidationError;
        if (req.user?.isAdmin == false) throw ForbiddenAccessError;
        const { name, country } = result.data;

        const users = await UserQueries.selectUsersByNGO(
          databaseManager,
          name,
          country,
        );

        // select email in correct language
        const rejectionEmail = await new RejectionEmail(lang).getEmail();

        users.map(
          async (user) =>
            await sendMail({
              from: '"Home4Strays 🐶" <home4strays@obco.pro>',
              to: user.email,
              subject: "Home4Strays NGO Rejection",
              html: rejectionEmail,
            }),
        ),
          await Promise.all(
            users.map((user) => {
              if (!user.id) throw ErrorDeletingNGOMember;
              return UserQueries.deleteById(databaseManager, user.id);
            }),
          );

        await NGOQueries.deleteByNameAndCountry(databaseManager, name, country);

        res
          .status(200)
          .json({ status: `${name} from ${country} rejected and deleted.` });
      } catch (err) {
        console.error("Error in /reject-ngo:", err);
        next(err);
      }
    },
  ),
);

/**
 * GET /pending-verifications
 * Returns a list of NGOs pending verification.
 *
 * @returns {UnverifiedNGOsResponseSchema} - List of unverified NGOs.
 *
 * @description This endpoint retrieves all NGOs that have not yet been verified. It is used by administrators
 * to review pending verification requests. The response includes a list of NGO details that require manual review.
 */
router.get(
  "/pending-verifications",
  authenticateToken,
  openAPIRoute(
    {
      tag: "verification",
      summary: "Get pending verifications",
      description:
        "Returns a list of NGOs that are pending verification approval.",
      response: UnverifiedNGOsResponseSchema,
    },
    async (req, res, next) => {
      try {
        const unverifiedNGOs: UnverifiedNGOsResponse =
          await NGOQueries.selectUnverifiedNGOs(databaseManager);
        if (unverifiedNGOs.length == 0) {
          throw NoPendingVerifications;
        } else {
          UnverifiedNGOsResponseSchema.parse(unverifiedNGOs);
          res.status(200).json(unverifiedNGOs);
        }
      } catch (err) {
        console.error("Error in /pending-verifications:", err);
        next(err);
      }
    },
  ),
);

/**
 * POST /request-verification
 * Submits NGO verification request and uploads documents.
 *
 * @param {NGORegisterSchema} body - Request body containing NGO details.
 * @param {multipart/form-data} files - Files containing verification document (PDF) and NGO logo (image).
 * @returns {VerificationRequestCompleteResponseSchema} - Confirmation that the verification request was processed.
 *
 * @description This endpoint allows NGOs to submit verification requests by providing required documents and a logo.
 * It validates the request, stores the uploaded files in MinIO, creates an NGO record, and notifies administrators
 * via email. The request requires multipart/form-data with two files: verification-document (PDF) and ngo-logo (image).
 */
router.post(
  "/request-verification",
  authenticateToken,
  upload.fields([{ name: "verification-document" }, { name: "ngo-logo" }]),
  openAPIRoute(
    {
      tag: "verification",
      summary: "Request NGO verification",
      description:
        "Submits an NGO verification request with required documents and logo. Requires multipart/form-data with verification-document (PDF) and ngo-logo (image) files.",
      response: VerificationRequestResponseSchema,
    },
    async (req, res, next) => {
      // Ensure website is an array to satisfy Zod schema validation
      let { website } = req.body;
      req.body.website = Array.isArray(website) ? website : [website];

      try {
        const {
          name,
          email,
          country,
          phoneNumber,
          memberCount,
          website,
          mission,
        } = NGORegisterSchema.parse(req.body);
        console.log("Got data from client");
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (files["verification-document"].length < 0) {
          throw ValidationError;
        }
        const verificationDoc = DocumentSchema.parse(
          files["verification-document"][0],
        );
        let ngoLogo: LogoSchemaType | undefined;
        if (
          "ngo-logo" in files &&
          files["ngo-logo"] &&
          files["ngo-logo"].length > 0
        ) {
          ngoLogo = LogoSchema.parse(files["ngo-logo"][0]);
        }

        const verDocId = uuidv4();
        const logoId = uuidv4();

        const verDocFilename = `verification/${name}-verification-${verDocId}${path.extname(verificationDoc.originalname)}`;

        await minioManager.uploadFile(verDocFilename, verificationDoc.path, {
          "Content-Type": verificationDoc.mimetype,
        });
        let logoFilename: string | undefined;
        let logoMinioPictureLink: string | undefined;
        if (ngoLogo) {
          logoFilename = `ngo-logos/${name}-logo-${logoId}${path.extname(ngoLogo.originalname)}`;
          await minioManager.uploadFile(logoFilename, ngoLogo.path, {
            "Content-Type": ngoLogo.mimetype,
          });
          console.log("Uploaded to minio");
          logoMinioPictureLink = await minioManager.getPublicURL(logoFilename);
        }
        const ngoId = uuidv4();

        const ngo: NGO = {
          id: ngoId,
          name,
          email,
          country,
          phoneNumber,
          memberCount: parseInt(memberCount || ""),
          website,
          mission,
          verified: false,
          verificationDocumentPath: verDocFilename,
          verificationDocumentLink:
            await minioManager.getPublicURL(verDocFilename),
          logoPicturePath: logoFilename,
          logoPictureLink: logoMinioPictureLink ?? "",
        };

        await NGOQueries.insert(databaseManager, ngo);

        if (!req.user) throw UserNotAuthorizedError;

        const ngoMember: NGOMember = {
          userId: req.user.id,
          ngoId: ngoId,
          isAdmin: true,
        };

        await NGOMemberQueries.insert(databaseManager, ngoMember);
        console.log("registered new ngo and member");

        // Notify admins via email
        const admins =
          await UserQueries.selectAllAdminsSecurely(databaseManager);
        await Promise.all(
          admins.map(
            async (admin) =>
              await sendMail({
                from: '"Home4Strays 🐶" <home4strays@obco.pro>',
                to: admin.email,
                subject: "Neue Verifikationsanfrage",
                html: verificationRequestMail,
              }),
          ),
        );
        console.log("sent mails");

        const verificationRequestResponse: VerificationRequestResponse = {
          ngoId: ngoId,
          verificationDocumentLink: verDocFilename,
          logoPictureLink: logoFilename,
          status: "Verification request submitted. Admins will review it.",
        };
        const response = VerificationRequestResponseSchema.parse(
          verificationRequestResponse,
        );
        res.status(202).json(verificationRequestResponse);
      } catch (err) {
        console.error("Error in /request-verification:", err);
        next(err);
      }
    },
  ),
);

export { router as verificationRouter };
