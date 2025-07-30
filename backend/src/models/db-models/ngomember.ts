import NGOMemberHours from "./ngomemberhours";

class NGOMember {
  userId!: string;
  ngoId!: string;
  isAdmin: boolean = false;
}

class FullNGOMember {
  id?: string;
  userId!: string;
  ngoId!: string;
  firstName?: string;
  lastName?: string;
  email!: string;
  profilePicturePath?: string;
  profilePictureLink?: string;
  phoneNumber?: string;
  userIsAdmin!: boolean;
  isNgoUser!: boolean;
  memberIsAdmin?: boolean;
}

class NGOMemberAndUserWithHours {
  ngoMember!: FullNGOMember;
  ngoMemberHours?: Array<NGOMemberHours>;
}

/* class NGOMemberWithMemberHours extends NGOMember {
  ngoMemberHours?: Array<NGOMemberHours>;
} */

export { NGOMember, NGOMemberAndUserWithHours, FullNGOMember };
