import { Animal } from "./animal";

export type NGO = {
  id: string;
  name: string;
  email?: string;
  country: string;
  verificationDoc?: string; // should be not null, but for Mock-Data its an optional arg -> TODO
  verified?: boolean;
  logo: string; // can be null -> TODO
  phone?: string;
  membercount: number; // can be null in DB -> TODO
  websites: string[]; // can be null -> if null: []
  mission?: string;
  member: NGOMember[];
  ngoHours: NGOHours[];
  status: "Opened" | "Closed";
  animals: Animal[];
};

export type BackendNGO = {
  id: string;
  name: string;
  email?: string;
  country: string;
  verificationDocumentLink?: string;
  verified?: boolean;
  logoPictureLink?: string;
  phoneNumber?: string;
  memberCount?: number;
  website?: string[];
  mission?: string;
};

export type NGOMember = {
  name: string;
  email: string;
  image: string | null;
  schedule: NGOHours[];
}

export type NGOHours = {
  start: string;
  end: string;
  weekday: string;
};
