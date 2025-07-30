import CTHours from "./cthours";
import { User } from "./user";

class Caretaker {
  userId!: string;
  space!: number;
  experience!: string;
  tenure!: string;
  maritalStatus!: string;
  financialAssistance!: boolean;
  localityType!: string;
  garden!: boolean;
  floor!: number;
  residence!: string;
  streetName!: string;
  cityName!: string;
  zip!: string;
  country!: string;
  houseNumber!: string;
  employmentType!: string;
  previousAdoption!: boolean;
  numberKids!: number;
  birthdate!: Date;
  holidayCare!: boolean;
  adoptionWillingness!: boolean;
}

class FullCaretaker extends Caretaker {
  id?: string;
  firstName?: string;
  lastName?: string;
  email!: string;
  profilePicturePath?: string;
  profilePictureLink?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  isNgoUser?: boolean;
  ctHours?: Array<CTHours>;
}

export { Caretaker, FullCaretaker };
