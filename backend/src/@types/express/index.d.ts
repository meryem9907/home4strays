import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; isAdmin: boolean; ngoId?: string };
      ngo?: { verified: boolean };
    }
  }
}
export {};
