export type Disease = {
  name: string;
  medication: string;
  info: string;
};

export type Vaccination = {
  vaccine: string;
  date: string;
};

export type Behaviour =
  | "shy"
  | "lively"
  | "vigilant"
  | "cautious"
  | "sensitive"
  | "gentle"
  | "defensive"
  | "lazy"
  | "playful"
  | "aggressive"
  | "obedient"
  | "mischievous";

export type Fear = {
  fear: string;
  info: string;
};

export type Species = "Dog" | "Cat" | "Bird" | "Rodent";
export type Breed = "Golden Retriever" | "German Sheperd" | "Chinese Shorthair" | "Chihuahua" | "Bulldog";
export type Gender = "Male" | "Female" | "Unknown";

export type LocalityType = "Urban" | "Rural" | "Other" | "";
export type Experience = ">10 Years" | ">5 Years" | ">2 Years" | ">1 Year" | "No Experience" | "";
