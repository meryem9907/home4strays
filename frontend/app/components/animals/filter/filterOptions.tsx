import { Bird, Cat, Dog, Mars, Rabbit, Venus } from "lucide-react";
import { CheckboxGroupItem } from "./checkBoxGroup";

/**
 * Filter option configurations for the animal adoption system.
 *
 * This file defines all the predefined filter options used throughout the application
 * for filtering animals and NGOs. Each configuration includes values, icons, labels,
 * and tooltips for consistent UI presentation.
 */

/**
 * Gender filter options with Mars/Venus icons for animal filtering.
 * Used in ButtonGroup components for single-select gender filtering.
 *
 * @type {CheckboxGroupItem<"Male" | "Female">[]}
 */
export const genderOptions: CheckboxGroupItem<"Male" | "Female">[] = [
  { value: "Male", icon: <Mars size={16} />, label: "Male" },
  { value: "Female", icon: <Venus size={16} />, label: "Female" },
];

/**
 * Species filter options with animal icons for multi-select species filtering.
 * Each option includes an icon representing the animal type and tooltip for clarity.
 *
 * @type {CheckboxGroupItem<"any" | "Cat" | "Dog" | "Rabbit" | "Bird">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={speciesOptions}
 *   active={selectedSpecies}
 *   onChange={setSelectedSpecies}
 *   resetValue="any"
 * />
 * ```
 */
export const speciesOptions: CheckboxGroupItem<
  "any" | "Cat" | "Dog" | "Rabbit" | "Bird"
>[] = [
  { value: "Cat", icon: <Cat />, tooltip: "Cats" },
  { value: "Dog", icon: <Dog />, tooltip: "Dogs" },
  { value: "Rabbit", icon: <Rabbit />, tooltip: "Rabbits" },
  { value: "Bird", icon: <Bird />, tooltip: "Birds" },
];

/**
 * Generic age options for animals with tooltips showing age ranges.
 * Used as a fallback when species-specific age categories are not needed.
 *
 * @type {CheckboxGroupItem<"Young" | "Adult" | "Senior" | "any">[]}
 * @deprecated Use species-specific age options (catAgeOptions, dogAgeOptions, etc.) instead
 */
export const ageOptions: CheckboxGroupItem<
  "Young" | "Adult" | "Senior" | "any"
>[] = [
  { value: "Young", label: "Young", tooltip: "0-1 years" },
  { value: "Adult", label: "Adult", tooltip: "1-7 years" },
  { value: "Senior", label: "Senior", tooltip: "7+ years" },
];

/**
 * Cat-specific age categories with appropriate life stage definitions.
 * Provides accurate age categorization for feline animals.
 *
 * @type {CheckboxGroupItem<"Kitten" | "Adult" | "Senior" | "any">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={catAgeOptions}
 *   active={selectedCatAges}
 *   onChange={setSelectedCatAges}
 *   resetValue="any"
 * />
 * ```
 */
export const catAgeOptions: CheckboxGroupItem<
  "Kitten" | "Adult" | "Senior" | "any"
>[] = [
  { value: "Kitten", label: "Kitten", tooltip: "0–6 months)" },
  { value: "Adult", label: "Adult", tooltip: "7 months–6 years" },
  { value: "Senior", label: "Senior", tooltip: "7+ years" },
];

/**
 * Dog-specific age categories with appropriate life stage definitions.
 * Provides accurate age categorization for canine animals.
 *
 * @type {CheckboxGroupItem<"Puppy" | "Adult" | "Senior" | "any">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={dogAgeOptions}
 *   active={selectedDogAges}
 *   onChange={setSelectedDogAges}
 *   resetValue="any"
 * />
 * ```
 */
export const dogAgeOptions: CheckboxGroupItem<
  "Puppy" | "Adult" | "Senior" | "any"
>[] = [
  { value: "Puppy", label: "Puppy", tooltip: "0–1 year" },
  { value: "Adult", label: "Adult", tooltip: "1–7 years" },
  { value: "Senior", label: "Senior", tooltip: "7+ years" },
];

/**
 * Rabbit-specific age categories with appropriate life stage definitions.
 * Provides accurate age categorization for rabbit animals.
 *
 * @type {CheckboxGroupItem<"Kit" | "Adult" | "Senior" | "any">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={rabbitAgeOptions}
 *   active={selectedRabbitAges}
 *   onChange={setSelectedRabbitAges}
 *   resetValue="any"
 * />
 * ```
 */
export const rabbitAgeOptions: CheckboxGroupItem<
  "Kit" | "Adult" | "Senior" | "any"
>[] = [
  { value: "Kit", label: "Kit", tooltip: "0–6 months" },
  { value: "Adult", label: "Adult", tooltip: "6 months–4 years" },
  { value: "Senior", label: "Senior", tooltip: "4+ years" },
];

/**
 * Bird-specific age categories with appropriate life stage definitions.
 * Provides accurate age categorization for avian animals.
 *
 * @type {CheckboxGroupItem<"Chick" | "Adult" | "Senior" | "any">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={birdAgeOptions}
 *   active={selectedBirdAges}
 *   onChange={setSelectedBirdAges}
 *   resetValue="any"
 * />
 * ```
 */
export const birdAgeOptions: CheckboxGroupItem<
  "Chick" | "Adult" | "Senior" | "any"
>[] = [
  { value: "Chick", label: "Chick", tooltip: "0–6 months" },
  { value: "Adult", label: "Adult", tooltip: "6 months–5 years" },
  { value: "Senior", label: "Senior", tooltip: "5+ years" },
];

/**
 * Health status filter options for animal health condition filtering.
 * Allows filtering animals based on their current health status.
 *
 * @type {CheckboxGroupItem<"Healthy" | "Sick" | "Vaccinated">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={healthOptions}
 *   active={selectedHealthStatus}
 *   onChange={setSelectedHealthStatus}
 *   resetValue="no filter"
 * />
 * ```
 */
export const healthOptions: CheckboxGroupItem<
  "Healthy" | "Sick" | "Vaccinated"
>[] = [
  { value: "Healthy", label: "Healthy" },
  { value: "Sick", label: "Sick" },
  { value: "Vaccinated", label: "Vaccinated" },
];

/**
 * Behavioral characteristic filter options for animal personality traits.
 * Helps match animals with compatible adopters based on behavioral preferences.
 *
 * @type {CheckboxGroupItem<"Active" | "Quiet" | "Playful" | "Aggressive" | "Shy" | "Animal-friendly">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={characterOptions}
 *   active={selectedCharacteristics}
 *   onChange={setSelectedCharacteristics}
 *   resetValue="no filter"
 * />
 * ```
 */
export const characterOptions: CheckboxGroupItem<
  "Active" | "Quiet" | "Playful" | "Aggressive" | "Shy" | "Animal-friendly"
>[] = [
  { value: "Active", label: "Active" },
  { value: "Quiet", label: "Quiet" },
  { value: "Playful", label: "Playful" },
  { value: "Aggressive", label: "Aggressive" },
  { value: "Shy", label: "Shy" },
  { value: "Animal-friendly", label: "Animal-friendly" },
];

/**
 * NGO verification status filter options.
 * Used for filtering NGOs based on their verification status with the platform.
 *
 * @type {CheckboxGroupItem<"verified" | "not verified ">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={verifiedOptions}
 *   active={verificationStatus}
 *   onChange={setVerificationStatus}
 *   resetValue="All"
 * />
 * ```
 */
export const verifiedOptions: CheckboxGroupItem<
  "verified" | "not verified "
>[] = [
  { value: "verified", label: "verified" },
  { value: "not verified ", label: "not verified " },
];

/**
 * NGO member count filter options for organization size filtering.
 * Allows filtering NGOs based on their organizational size categories.
 *
 * @type {CheckboxGroupItem<"less than 15" | "15 to 30" | "more than 30">[]}
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   items={membersCount}
 *   active={selectedMemberCounts}
 *   onChange={setSelectedMemberCounts}
 *   resetValue="Any"
 * />
 * ```
 */
export const membersCount: CheckboxGroupItem<
  "less than 15" | "15 to 30" | "more than 30"
>[] = [
  { value: "less than 15", label: "less than 15" },
  { value: "15 to 30", label: "15 to 30" },
  { value: "more than 30", label: "more than 30" },
];
