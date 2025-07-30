export type Caretaker = {
  firstName: string, 
  lastName: string,
  email: string,
  phoneNumber: string | null,
  profilePictureLink: string | null,
  maritalStatus: string,
  birthdate: string,
  numberKids: number,
  streetName: string,
  houseNumber: string,
  cityName: string,
  zip: string,
  country: string,
  localityType: string,
  space: number,
  floor: number,
  garden: boolean,
  residence: string,
  tenure: string,
  financialAssistance: boolean,
  employmentType: string,
  previousAdoption: boolean,
  holidayCare: boolean,
  adoptionWillingness: boolean,
  experience: string,
  ctHours: CTHours[],
}

export type CTHours = {
  startTime: string
  endTime: string
  weekday: string
}

