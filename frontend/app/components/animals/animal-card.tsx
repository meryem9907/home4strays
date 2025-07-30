"use client";

import {
  Bird,
  Calendar,
  Cat,
  Dog,
  HandHelping,
  Mars,
  PawPrint,
  Rabbit,
  Transgender,
  Venus,
  Weight,
} from "lucide-react";
import Card from "../ui/card/card";
import { Animal } from "../../types/animal";

/**
 * Props for the AnimalCard component.
 *
 * @interface AnimalCardProps
 * @property {Animal} animal - Complete animal data object to display
 * @property {string} locale - Current language locale for routing and display
 */
interface AnimalCardProps {
  animal: Animal;
  locale: string;
}

/**
 * AnimalCard component that displays a summary card for an individual animal.
 *
 * This component renders a clickable card showing essential animal information
 * including name, breed, basic characteristics, and associated NGO. It handles
 * dynamic icon selection based on species and gender, and provides a consistent
 * card layout for animal browsing interfaces.
 *
 * Features:
 * - Dynamic species icon selection (Cat, Dog, Bird, Rodent, default)
 * - Dynamic gender icon selection (Male, Female, Diverse)
 * - Clickable navigation to detailed animal view
 * - Responsive card layout with image, title, and tags
 * - NGO badge showing responsible organization
 * - Internationalized routing support
 *
 * @param {AnimalCardProps} props - Component props
 * @returns {JSX.Element} Rendered animal card component
 *
 * @example
 * ```tsx
 * function AnimalGrid({ animals, locale }) {
 *   return (
 *     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 *       {animals.map(animal => (
 *         <AnimalCard
 *           key={animal.id}
 *           animal={animal}
 *           locale={locale}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In a search results component
 * function SearchResults({ searchResults, currentLocale }) {
 *   return (
 *     <section>
 *       <h2>Found {searchResults.length} animals</h2>
 *       {searchResults.map(animal => (
 *         <AnimalCard
 *           animal={animal}
 *           locale={currentLocale}
 *           key={animal.id}
 *         />
 *       ))}
 *     </section>
 *   );
 * }
 * ```
 */
export default function AnimalCard({ animal, locale }: AnimalCardProps) {
  let petIcon;
  let genderIcon;

  // Select appropriate species icon based on animal breed
  switch (animal.breed?.species) {
    case "Cat":
      petIcon = <Cat size={16} />;
      break;
    case "Dog":
      petIcon = <Dog size={16} />;
      break;
    case "Bird":
      petIcon = <Bird size={16} />;
      break;
    case "Rodent":
      petIcon = <Rabbit size={16} />;
      break;
    default:
      petIcon = <PawPrint size={16} />;
  }

  // Select appropriate gender icon based on animal gender
  switch (animal.gender) {
    case "Male":
      genderIcon = <Mars size={16} />;
      break;
    case "Female":
      genderIcon = <Venus size={16} />;
      break;
    default:
      genderIcon = <Transgender size={16} />;
  }

  return (
    <Card
      href={`/${locale}/animals/${animal.id}`}
      image={animal.image}
      title={animal.name}
      description={animal.description}
      type={animal.breed?.species}
      petIcon={petIcon}
      petId={animal.id}
      tags={[
        { icon: petIcon, label: animal.breed?.name },
        { icon: genderIcon, label: animal.gender },
        {
          icon: <Calendar size={16} />,
          label: animal.age?.toString() + " Years",
        },
        {
          icon: <Weight size={16} />,
          label: animal.weight?.toString() + " Kg",
        },
      ]}
      badge={{
        icon: <HandHelping size={18} />,
        label: animal.ngo?.name,
      }}
    />
  );
}
