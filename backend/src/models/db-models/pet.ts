export class Pet {
  id!: string;
  name?: string;
  gender!: string;
  birthdate!: Date;
  castration?: boolean;
  weight?: number;
  breed?: string;
  profilePictureLink?: string; //public link generiert body zurueckgeben
  profilePicturePath?: string; //pfad s3 absolut interne zum loeschen, aendern
  lastCheckUp?: Date;
  eatingBehaviour?: string;
  behaviour?: string;
  caretakerId?: string;
  ngoMemberId?: string;
  streetName?: string;
  cityName?: string;
  zip?: string;
  country?: string;
  houseNumber?: string;
  localityTypeRequirement?: string;
  kidsAllowed?: boolean = true;
  zipRequirement?: string;
  experienceRequirement?: string;
  minimumSpaceRequirement?: number;
  static id: (
    val: string | number | boolean | any[] | Date | object | null | undefined,
  ) => string;
}
export class PetWithBreed extends Pet {
  breedName!: string;
  species!: string;
  information?: string;
}
