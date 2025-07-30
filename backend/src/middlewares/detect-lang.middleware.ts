import { Request, Response, NextFunction } from "express";

/**
 * Middleware to detect and set the user's preferred language based on the Accept-Language header.
 * This middleware extracts the primary language code from the request headers and sets it in res.locals.
 * If the detected language is not supported, it defaults to English ('en').
 *
 * @param {Request} req - Express request object containing headers
 * @param {Response} res - Express response object used to store language information in res.locals
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 */
export const detectLanguage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /**
     * Extract the primary language code from the Accept-Language header.
     * Example header format: "Accept-Language: tr-TR; en-US,en;q=0.9"
     * The first segment (before ';') represents the preferred language.
     * We split by commas to get the first entry, then split by '-' to get the base language code.
     * For example, "tr-TR" becomes "tr".
     */
    const lang = req.headers["accept-language"]?.split(",")[0].split("-")[0]; // e.g., 'tr-TR' -> 'tr'

    /**
     * Set the detected language in res.locals. If the detected language is one of the supported
     * languages ('en', 'de', 'tr'), it is used. Otherwise, the default language 'en' is applied.
     * This value can be accessed in templates or other middleware via res.locals.lang.
     */
    res.locals.lang = ["en", "de", "tr"].includes(lang || "") ? lang : "en"; // default language is english

    /**
     * Continue to the next middleware in the chain
     */
    next();
  } catch (err) {
    /**
     * Log any errors that occur during language detection
     */
    console.log(`Error occured in detect language middleware ${err}.`);

    /**
     * Pass the error to the next middleware in the error handling chain
     */
    next(err);
  }
};
