import { Request, Response, NextFunction } from "express";
import {
  LastNGOMemberError,
  NGOMemberNotFoundError,
  NoNGOAdminError,
  UserNotFoundError,
  ValidationError,
} from "../utils/errors";
import { NGOMemberQueries } from "../database/queries/ngomember";
import { databaseManager } from "../app"; // Fixed import path

// Token authentication middleware
const verifyLastNGOMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw UserNotFoundError;
    }
    const ngoMember = await NGOMemberQueries.selectNGOMemberById(
      databaseManager,
      userId as string,
    );

    if (!ngoMember) {
      throw NGOMemberNotFoundError;
    }

    const ngoId = ngoMember.ngoId;
    const ngoMemberCount = await NGOMemberQueries.countNGOMemberByNGOId(
      databaseManager,
      ngoId,
    );

    if (ngoMemberCount == 1) {
      throw LastNGOMemberError;
    }
    next();
  } catch (err) {
    console.log(`Error in verifyLastNGOMember Middleware ${err}`);
    next(err);
  }
};

export { verifyLastNGOMember };
