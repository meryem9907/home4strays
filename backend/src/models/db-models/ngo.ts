import NGOHours from "./ngohours";

export class NGO {
  id!: string;
  name!: string;
  email?: string;
  country!: string;
  verificationDocumentPath!: string;
  verificationDocumentLink!: string;
  verified: boolean = false;
  logoPicturePath?: string;
  logoPictureLink?: string;
  phoneNumber?: string;
  memberCount?: number;
  website?: (undefined | string | null)[];
  mission?: string;
}

export class FullNGO extends NGO {
  ngoHours?: NGOHours[];
}
