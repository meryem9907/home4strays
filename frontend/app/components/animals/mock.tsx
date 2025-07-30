import { Animal } from "../../types/animal";

export const getExampleAnimals = (): Animal[] => {
  return [
    {
      id: "1",
      name: "Bella",
      breed: {
        name: "Golden Retriever",
        species: "Dog",
        info: "Friendly, intelligent, and devoted family dog."
      },
      age: 4,
      weight: 28.5,
      castration: true,
      gender: "Female",
      eatingBehaviour: ["Eats twice daily", "Loves snacks"],
      behaviour: ["Very social", "Good with kids", "Obedient"],
      fears: ["Loud noises", "Thunderstorms"],
      lastCheckup: "2025-03-10",
      image: [
        "https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ], 
      description: "Bella is a loving dog looking for a forever home with an active family.",
      ngo: {
        id: "ngo1",
        name: "Happy Paws Rescue",
        country: "Germany"
      },
      location: {
        street: "Sonnenweg",
        housenr: "5a",
        city: "Berlin",
        zipCode: "10115",
        country: "Germany"
      },
      requiredLocation: "urban",
      ZIPRequirement: "10100-10200",
      kidsAllowed: true,
      requiredExperience: "No experience",
      requiredMinimumSpace: 30,
      allergies: [],
      diseases: [
        {
          name: "Arthritis",
          icdno: "M19",
          info: "Mild arthritis in hind legs.",
          medicine: ["Glucosamine supplements"]
        }
      ],
      vaccination: ["Rabies", "Parvovirus", "Distemper"]
    },
    {
      id: "2",
      name: "Milo",
      breed: {
        name: "European Shorthair",
        species: "Cat",
        info: "Common European domestic cat, very adaptable."
      },
      age: 2,
      weight: 5.2,
      castration: true,
      gender: "Male",
      eatingBehaviour: ["Eats dry and wet food", "Selective eater"],
      behaviour: ["Playful", "Independent", "Cuddly in the evening"],
      fears: ["Vacuum cleaners"],
      lastCheckup: "2025-01-25",
      image: ["https://images.unsplash.com/photo-1594401035905-9df9505015b8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
      description: "Milo is a curious cat that loves to explore and nap in sunny spots.",
      ngo: {
        id: "ngo2",
        name: "Cat Haven",
        country: "Austria"
      },
      location: {
        street: "Mauergasse",
        housenr: "12",
        city: "Vienna",
        zipCode: "1030",
        country: "Austria"
      },
      requiredLocation: "urban",
      ZIPRequirement: "1030",
      kidsAllowed: false,
      requiredExperience: ">1 year",
      requiredMinimumSpace: 20,
      allergies: ["Chicken"],
      diseases: [],
      vaccination: ["Rabies", "Feline Leukemia"]
    },
    {
      id: "3",
      name: "Charlie",
      breed: {
        name: "Shetland Pony",
        species: "Horse",
        info: "Small but strong ponies, good for children and beginners."
      },
      age: 10,
      weight: 180,
      castration: false,
      gender: "Diverse",
      eatingBehaviour: ["Grazes daily", "Hay and mineral supplements"],
      behaviour: ["Gentle", "Patient", "Sometimes stubborn"],
      fears: ["Unknown environments"],
      lastCheckup: "2025-04-05",
      image: ["https://images.unsplash.com/photo-1619541493013-dd572e797eec?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
      description: "Charlie is a kind Shetland pony, perfect for therapy work and children's lessons.",
      ngo: {
        id: "ngo3",
        name: "Farm Friends",
        country: "Switzerland"
      },
      location: {
        street: "Alpenstraße",
        housenr: "200",
        city: "Zürich",
        zipCode: "8000",
        country: "Switzerland"
      },
      requiredLocation: "rural",
      ZIPRequirement: "8000-8099",
      kidsAllowed: true,
      requiredExperience: ">5 years",
      requiredMinimumSpace: 200,
      allergies: [],
      diseases: [
        {
          name: "Laminitis",
          icdno: "M60.8",
          info: "Chronic hoof inflammation requiring special care.",
          medicine: ["Anti-inflammatory medication", "Special hoof trimming"]
        }
      ],
      vaccination: ["Tetanus", "Equine Influenza"]
    },
    {
      id: "4",
      name: "Luna",
      breed: {
        name: "Siberian Husky",
        species: "Dog",
        info: "Energetic and friendly, loves outdoor activities."
      },
      age: 3,
      weight: 22,
      castration: false,
      gender: "Female",
      eatingBehaviour: ["Eats twice daily", "Enjoys meat-based treats"],
      behaviour: ["Active", "Loyal", "Loves snow"],
      fears: ["Loud vehicles", "Strangers"],
      lastCheckup: "2025-04-01",
      image: ["https://images.unsplash.com/photo-1584299987414-263849e9dcda?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
      description: "Luna is a spirited husky who loves running in the snow and playing with kids.",
      ngo: {
        id: "ngo4",
        name: "Paws of Joy",
        country: "Finland"
      },
      location: {
        street: "Kaivokatu",
        housenr: "8",
        city: "Helsinki",
        zipCode: "00100",
        country: "Finland"
      },
      requiredLocation: "urban",
      ZIPRequirement: "00100",
      kidsAllowed: true,
      requiredExperience: "No experience",
      requiredMinimumSpace: 40,
      allergies: ["Grain"],
      diseases: [],
      vaccination: ["Rabies", "Canine Parvovirus"]
    },
    {
      id: "5",
      name: "Whiskers",
      breed: {
        name: "Maine Coon",
        species: "Cat",
        info: "Large and fluffy cats, very affectionate."
      },
      age: 5,
      weight: 8.5,
      castration: true,
      gender: "Male",
      eatingBehaviour: ["Eats dry and wet food", "Loves fish"],
      behaviour: ["Affectionate", "Lazy", "Talkative"],
      fears: ["Water", "Loud noises"],
      lastCheckup: "2025-03-15",
      image: [
        "https://images.unsplash.com/photo-1641378588520-f30c0c36ef84?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1641762998710-2139f2377ed7?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
        description: "Whiskers is a friendly cat who loves to curl up on your lap after a long day.",
      ngo: {
        id: "ngo5",
        name: "Feline Friends",
        country: "Sweden"
      },
      location: {
        street: "Sveavägen",
        housenr: "15",
        city: "Stockholm",
        zipCode: "11350",
        country: "Sweden"
      },
      requiredLocation: "urban",
      ZIPRequirement: "11350",
      kidsAllowed: true,
      requiredExperience: "No experience",
      requiredMinimumSpace: 20,
      allergies: ["Fish"],
      diseases: [],
      vaccination: ["Rabies", "Feline Leukemia"]
    },
  ];
};
