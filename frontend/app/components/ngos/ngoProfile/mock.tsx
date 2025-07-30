import { Animal } from "../../../types/animal";
import { NGO } from "../../../types/ngo";

export const getNGOData = (): NGO => {
  return {
    id: "1",
    name: "Tierschutzverein Augsburg und Umgebung e.V.",
    email: "info@tierschutz-augsburg.de",
    country: "Germany",
    logo: "/bghomepage.png",
    phone: "+49 821 4552900",
    membercount: 20, 
    websites: [
      "https://www.greenfuture.de", 
      "https://www.instagram.com/tierschutzbund/?hl=de", 
      "https://www.twitch.tv/tt_teamtierschutz?lang=de"
    ],
    mission: "Our mission is to care for and rehome animals in need, advocate for animal welfare, and educate the public about responsible pet ownership. We believe every animal deserves a loving home and proper care throughout their lives.",
    member: [
      {
        name: "Nikolai Hellwig",
        email: "nikolai.hellwig@tha.de",
        image: "./logo.svg",
         schedule: [
          { weekday: "Monday", start: "09:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" },
          { weekday: "Satruday", start: "09:00", end: "17:00" },
          { weekday: "Sunday", start: "09:00", end: "17:00" }
        ],
      },
      {
        name: "Test User",	
        email: "jessica.schach1@hs-augsburg.de",
        image: null,
        schedule: [
          { weekday: "Monday", start: "09:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" },
          { weekday: "Satruday", start: "09:00", end: "17:00" },
        ],
      },
      {
        name: "Jessica Schach 2",
        email: "jessica.schach2@hs-augsburg.de",
        image: null,
         schedule: [
          { weekday: "Monday", start: "09:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" },
          { weekday: "Satruday", start: "09:00", end: "17:00" },
          { weekday: "Sunday", start: "09:00", end: "17:00" }
        ],
      },
      {
        name: "Jessica Schach 3",
        email: "jessica.schach3@hs-augsburg.de",
        image: null,
        schedule: [
          { weekday: "Monday", start: "10:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" },
          { weekday: "Satruday", start: "09:00", end: "17:00" },
          { weekday: "Sunday", start: "09:00", end: "17:00" }
        ],
      },
    ],
    ngoHours: [
      {
        start: "10:00",
        end: "17:00",
        weekday: "Monday",
      },
      {
        start: "09:00",
        end: "17:00",
        weekday: "Tuesday",
      },
      {
        start: "09:00",
        end: "17:00",
        weekday: "Wednesday",
      },
      {
        start: "09:00",
        end: "17:00",
        weekday: "Thursday",
      },
      {
        start: "09:00",
        end: "17:00",
        weekday: "Friday",
      },
    ],
    status: "Opened",
    animals: [
      {
        id: "1",
        name: "Max",
        description: "Friendly and playful dog",
        gender: "Male",
        breed: {
          name: "Labrador",
          species: "Dog",
          info: "Family-friendly breed"
        },
        age: 3,
        weight: 25,
        image: ["/bghomepage.png"],
        castration: true,
        eatingBehaviour: ["Dry food", "Wet food"],
        behaviour: ["Friendly", "Playful", "Good with kids"],
        fears: ["Loud noises"],
        lastCheckup: "2023-05-15",
        ngo: {
          id: "1",
          name: "Tierheim Augsburg",
          country: "Germany"
        },
        location: {
          street: "Holzbacherstraße",
          housenr: "4c",
          city: "Augsburg",
          zipCode: "86152",
          country: "Germany"
        },
        requiredLocation: "urban",
        ZIPRequirement: "86xxx",
        kidsAllowed: true,
        requiredExperience: "No experience",
        requiredMinimumSpace: 50,
        allergies: [],
        diseases: [],
        vaccination: ["Rabies", "Distemper"]
      },
      {
        id: "2",
        name: "Lenny",
        description: "Sweet and calm cat",
        gender: "Male",
        breed: {
          name: "Maine Coon",
          species: "Cat",
          info: "Large and friendly breed"
        },
        age: 2,
        weight: 6,
        image: ["/bghomepage.png"],
        castration: true,
        eatingBehaviour: ["Dry food", "Fish"],
        behaviour: ["Calm", "Independent"],
        fears: ["Dogs"],
        lastCheckup: "2023-06-20",
        ngo: {
          id: "1",
          name: "Tierheim Augsburg",
          country: "Germany"
        },
        location: {
          street: "Holzbacherstraße",
          housenr: "4c",
          city: "Augsburg",
          zipCode: "86152",
          country: "Germany"
        },
        requiredLocation: "urban",
        ZIPRequirement: "86xxx",
        kidsAllowed: true,
        requiredExperience: "No experience",
        requiredMinimumSpace: 30,
        allergies: [],
        diseases: [],
        vaccination: ["Rabies", "Feline Leukemia"]
      },
      {
        id: "3",
        name: "Jonny",
        description: "Energetic young dog",
        gender: "Male",
        breed: {
          name: "Beagle",
          species: "Dog",
          info: "Energetic hunting breed"
        },
        age: 1,
        weight: 12,
        image: ["/bghomepage.png"],
        castration: false,
        eatingBehaviour: ["Dry food", "Treats"],
        behaviour: ["Energetic", "Curious"],
        fears: ["Being alone"],
        lastCheckup: "2023-07-05",
        ngo: {
          id: "1",
          name: "Tierheim Augsburg",
          country: "Germany"
        },
        location: {
          street: "Holzbacherstraße",
          housenr: "4c",
          city: "Augsburg",
          zipCode: "86152",
          country: "Germany"
        },
        requiredLocation: "rural",
        ZIPRequirement: "86xxx",
        kidsAllowed: true,
        requiredExperience: ">1 year",
        requiredMinimumSpace: 80,
        allergies: [],
        diseases: [],
        vaccination: ["Rabies", "Parvovirus"]
      },
      {
        id: "4",
        name: "Bella",
        description: "Gentle and loving cat",
        gender: "Female",
        breed: {
          name: "Persian",
          species: "Cat",
          info: "Long-haired breed requiring regular grooming"
        },
        age: 4,
        weight: 5,
        image: ["/bghomepage.png"],
        castration: true,
        eatingBehaviour: ["Wet food"],
        behaviour: ["Gentle", "Calm"],
        fears: ["Loud noises", "Strangers"],
        lastCheckup: "2023-08-10",
        ngo: {
          id: "1",
          name: "Tierheim Augsburg",
          country: "Germany"
        },
        location: {
          street: "Holzbacherstraße",
          housenr: "4c",
          city: "Augsburg",
          zipCode: "86152",
          country: "Germany"
        },
        requiredLocation: "urban",
        ZIPRequirement: "86xxx",
        kidsAllowed: false,
        requiredExperience: ">2 years",
        requiredMinimumSpace: 40,
        allergies: [],
        diseases: [],
        vaccination: ["Rabies", "Feline Leukemia"]
      },
      {
        id: "5",
        name: "Rocky",
        description: "Playful and active dog",
        gender: "Male",
        breed: {
          name: "Golden Retriever",
          species: "Dog",
          info: "Friendly family dog"
        },
        age: 2,
        weight: 28,
        image: ["/bghomepage.png"],
        castration: true,
        eatingBehaviour: ["Dry food", "Wet food"],
        behaviour: ["Playful", "Friendly", "Active"],
        fears: [],
        lastCheckup: "2023-09-01",
        ngo: {
          id: "1",
          name: "Tierheim Augsburg",
          country: "Germany"
        },
        location: {
          street: "Holzbacherstraße",
          housenr: "4c",
          city: "Augsburg",
          zipCode: "86152",
          country: "Germany"
        },
        requiredLocation: "urban",
        ZIPRequirement: "86xxx",
        kidsAllowed: true,
        requiredExperience: "No experience",
        requiredMinimumSpace: 70,
        allergies: [],
        diseases: [],
        vaccination: ["Rabies", "Distemper", "Parvovirus"]
      },
    ] as Animal[],
  }; 
}
  