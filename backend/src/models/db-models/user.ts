import NGOMemberHours from "./ngomemberhours";
import { NGOMemberHoursSchema } from "../zod-schemas/ngo-member.zod";

import { z } from "zod";
import { NGOMember } from "./ngomember";
class User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email!: string;
  password!: string;
  profilePicturePath?: string;
  profilePictureLink?: string;
  phoneNumber?: string;
  isAdmin!: boolean;
  isNgoUser!: boolean;
}

export { User, NGOMemberHoursSchema };
