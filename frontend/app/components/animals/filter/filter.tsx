"use client";
import {
  X,
  LocateFixed,
  Search,
  Cat,
  Dog,
  Rabbit,
  Bird,
  Mars,
  Venus,
} from "lucide-react";
import ButtonGroup from "./buttonGroup";
import CheckboxGroup from "./checkBoxGroup";
import {
  speciesOptions,
  healthOptions,
  catAgeOptions,
  dogAgeOptions,
  rabbitAgeOptions,
  birdAgeOptions,
} from "./filterOptions";
import SearchableDropdown from "./searchDropdown";
import Button from "../../ui/button";
import { useGeoLocation } from "./locationTracker";
import { useTranslations } from "next-intl";
import InputField from "../../ui/validation/inputfield";
import { useState, useEffect } from "react";

/**
 * Interface defining the complete filter state for animal search and filtering.
 *
 * This interface represents all possible filter criteria that users can apply
 * when searching for animals available for adoption, including species-specific
 * age categories, location preferences, health status, and behavioral characteristics.
 *
 * @interface FilterState
 * @property {"All" | "Male" | "Female"} gender - Animal gender filter
 * @property {Array} species - Array of species to include in search (Cat, Dog, Rabbit, Bird)
 * @property {string[]} breeds - Specific breed names to filter by
 * @property {Array} catAge - Age categories for cats (Kitten, Adult, Senior)
 * @property {Array} dogAge - Age categories for dogs (Puppy, Adult, Senior)
 * @property {Array} rabbitAge - Age categories for rabbits (Kit, Adult, Senior)
 * @property {Array} birdAge - Age categories for birds (Chick, Adult, Senior)
 * @property {number} [minAgeYears] - Minimum age in years for numerical age filtering
 * @property {number} [maxAgeYears] - Maximum age in years for numerical age filtering
 * @property {Object} location - Location-based filtering criteria
 * @property {string[]} location.country - Array of countries to include in search
 * @property {string} location.city - Specific city name to filter by
 * @property {string} [location.zip] - Optional ZIP/postal code for precise location filtering
 * @property {Array} health - Health status categories (Healthy, Sick, Vaccinated)
 * @property {string[]} characteristics - Behavioral characteristics to filter by
 * @property {boolean} [kidsAllowed] - Whether animal is suitable for families with children
 * @property {string[]} ngoName - Array of NGO names to filter by
 * @property {number} [minWeight] - Minimum weight in kg for animal filtering
 * @property {number} [maxWeight] - Maximum weight in kg for animal filtering
 * @property {string} [searchQuery] - Optional text search query for animal names and descriptions
 */
export interface FilterState {
  gender: "All" | "Male" | "Female";
  species: ("any" | "Cat" | "Dog" | "Rabbit" | "Bird")[];
  breeds: string[];
  catAge: ("any" | "Kitten" | "Adult" | "Senior")[];
  dogAge: ("any" | "Puppy" | "Adult" | "Senior")[];
  rabbitAge: ("any" | "Kit" | "Adult" | "Senior")[];
  birdAge: ("any" | "Chick" | "Adult" | "Senior")[];
  minAgeYears?: number;
  maxAgeYears?: number;
  location: {
    country: string[];
    city: string;
    zip?: string;
  };
  health: ("no filter" | "Healthy" | "Sick" | "Vaccinated")[];
  characteristics: string[];
  kidsAllowed?: boolean;
  ngoName: string[];
  minWeight?: number;
  maxWeight?: number;
  searchQuery?: string;
}

/**
 * Interface representing a pet/animal in the adoption system.
 *
 * @interface Pet
 * @property {number} id - Unique identifier for the pet
 * @property {string} name - Pet's name
 * @property {string} breed - Pet's breed name
 * @property {string} gender - Pet's gender
 * @property {Date} birthdate - Pet's date of birth
 * @property {number} weight - Pet's weight in kg
 * @property {string} profilePictureLink - URL to pet's profile picture
 * @property {boolean} castration - Whether the pet is spayed/neutered
 * @property {Date} lastCheckUp - Date of last veterinary checkup
 * @property {string} eatingBehaviour - Pet's eating habits description
 * @property {number} caretakerId - ID of assigned caretaker (if any)
 * @property {number} ngoMemberId - ID of NGO member who listed the pet
 * @property {string} streetName - Street address where pet is located
 * @property {string} cityName - City where pet is located
 * @property {string} zip - ZIP/postal code of pet's location
 * @property {string} country - Country where pet is located
 * @property {string} houseNumber - House number of pet's location
 * @property {string} localityTypeRequirement - Required locality type (urban/rural)
 * @property {boolean} kidsAllowed - Whether pet is suitable for families with children
 * @property {string} zipRequirement - ZIP code requirement for adopters
 * @property {string} experienceRequirement - Required experience level for adopters
 * @property {number} minimumSpaceRequirement - Minimum living space required
 * @property {string} breedName - Detailed breed name
 * @property {string} species - Species category
 * @property {string} information - Additional information about the pet
 */
interface Pet {
  id: number;
  name: string;
  breed: string;
  gender: string;
  birthdate: Date;
  weight: number;
  profilePictureLink: string;
  castration: boolean;
  lastCheckUp: Date;
  eatingBehaviour: string;
  caretakerId: number;
  ngoMemberId: number;
  streetName: string;
  cityName: string;
  zip: string;
  country: string;
  houseNumber: string;
  localityTypeRequirement: string;
  kidsAllowed: boolean;
  zipRequirement: string;
  experienceRequirement: string;
  minimumSpaceRequirement: number;
  breedName: string;
  species: string;
  information: string;
}

/**
 * Props interface for the Animal Filter component.
 *
 * @interface FilterProps
 * @property {FilterState} filters - Current filter state
 * @property {Function} onFilterChange - Callback when any filter value changes
 * @property {Function} onApplyFilters - Callback to apply current filters to search
 * @property {Function} [onSearchResults] - Optional callback with search results
 */
interface FilterProps {
  filters: FilterState;
  onFilterChange: (changedFilters: Partial<FilterState>) => void;
  onApplyFilters: () => void;
  onSearchResults?: (results: Pet[]) => void;
}

/**
 * Interface for organizing available breeds by species.
 *
 * @interface AvailableBreeds
 */
interface AvailableBreeds {
  [species: string]: string[];
}

/**
 * Animal Filter component providing comprehensive filtering options for animal adoption search.
 *
 * This component renders a complete filter interface for finding animals available for adoption
 * based on various criteria including species, breed, age, location, health status, behavioral
 * characteristics, and more. It integrates with geolocation services, provides real-time search
 * capabilities, and adapts the interface based on selected species.
 *
 * Features:
 * - Species-specific filtering with appropriate age categories
 * - Dynamic breed filtering based on selected species
 * - Location filtering with geolocation support
 * - Health and behavioral characteristic filtering
 * - Text-based search with real-time results
 * - Weight and age range filtering
 * - NGO-specific filtering
 * - Active filter count display
 * - Reset functionality for individual filter groups
 * - Internationalization support
 * - Loading states for async operations
 *
 * @param {FilterProps} props - Component props
 * @returns {JSX.Element} Rendered animal filter component
 *
 * @example
 * ```tsx
 * function AnimalSearchPage() {
 *   const [filters, setFilters] = useState<FilterState>({
 *     gender: "All",
 *     species: ["any"],
 *     breeds: [],
 *     catAge: ["any"],
 *     dogAge: ["any"],
 *     rabbitAge: ["any"],
 *     birdAge: ["any"],
 *     location: { country: [], city: "" },
 *     health: ["no filter"],
 *     characteristics: [],
 *     ngoName: []
 *   });
 *
 *   const handleFilterChange = (changes: Partial<FilterState>) => {
 *     setFilters(prev => ({ ...prev, ...changes }));
 *   };
 *
 *   const handleApplyFilters = () => {
 *     searchAnimals(filters);
 *   };
 *
 *   return (
 *     <Filter
 *       filters={filters}
 *       onFilterChange={handleFilterChange}
 *       onApplyFilters={handleApplyFilters}
 *       onSearchResults={(results) => setSearchResults(results)}
 *     />
 *   );
 * }
 * ```
 */
export default function Filter({
  filters,
  onFilterChange,
  onApplyFilters,
  onSearchResults,
}: FilterProps) {
  const [availableBreeds, setAvailableBreeds] = useState<AvailableBreeds>({});
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [availableCharacteristics, setAvailableCharacteristics] = useState<
    string[]
  >([]);
  const [characteristicsLoading, setCharacteristicsLoading] = useState(true);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [availableNGOs, setAvailableNGOs] = useState<
    { id: string; name: string; country: string }[]
  >([]);
  const [ngosLoading, setNgosLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    getLocation: fetchGeoLocation,
    country: fetchedGeoCountry,
    location: fetchedGeoCityString,
  } = useGeoLocation();
  const t = useTranslations("filter");

  // Create gender options with translations
  const genderOptions = [
    {
      value: "Male" as const,
      icon: <Mars size={16} />,
      label: t("Male", { defaultMessage: "Male" }),
    },
    {
      value: "Female" as const,
      icon: <Venus size={16} />,
      label: t("Female", { defaultMessage: "Female" }),
    },
  ];

  useEffect(() => {
    /**
     * Fetches available breeds organized by species from the API.
     * Provides breed options for the breed filter dropdown.
     */
    const fetchAvailableBreeds = async () => {
      try {
        setBreedsLoading(true);
        const response = await fetch("/api/breeds/available");
        if (response.ok) {
          const data = await response.json();
          setAvailableBreeds(data.data || {});
        } else {
          console.error("Failed to fetch available breeds");
          setAvailableBreeds({});
        }
      } catch (error) {
        console.error("Error fetching available breeds:", error);
        setAvailableBreeds({});
      } finally {
        setBreedsLoading(false);
      }
    };

    /**
     * Fetches available behavioral characteristics from the API.
     * Provides options for the characteristics filter.
     */
    const fetchAvailableCharacteristics = async () => {
      try {
        setCharacteristicsLoading(true);
        const response = await fetch("/api/characteristics/available");
        if (response.ok) {
          const data = await response.json();
          setAvailableCharacteristics(data.data || []);
        } else {
          console.error("Failed to fetch available characteristics");
          setAvailableCharacteristics([]);
        }
      } catch (error) {
        console.error("Error fetching available characteristics:", error);
        setAvailableCharacteristics([]);
      } finally {
        setCharacteristicsLoading(false);
      }
    };

    /**
     * Fetches available countries from the API for location filtering.
     * Provides options for users to filter animals by country.
     */
    const fetchAvailableCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch("/api/countries/available");
        if (response.ok) {
          const data = await response.json();
          setAvailableCountries(data.data || []);
        } else {
          console.error("Failed to fetch available countries");
          setAvailableCountries([]);
        }
      } catch (error) {
        console.error("Error fetching available countries:", error);
        setAvailableCountries([]);
      } finally {
        setCountriesLoading(false);
      }
    };

    /**
     * Fetches available NGOs from the API for NGO-specific filtering.
     * Allows users to filter animals by the NGO that listed them.
     */
    const fetchAvailableNGOs = async () => {
      try {
        setNgosLoading(true);
        const response = await fetch("/api/ngos/available");
        if (response.ok) {
          const data = await response.json();
          setAvailableNGOs(data.data || []);
        } else {
          console.error("Failed to fetch available NGOs");
          setAvailableNGOs([]);
        }
      } catch (error) {
        console.error("Error fetching available NGOs:", error);
        setAvailableNGOs([]);
      } finally {
        setNgosLoading(false);
      }
    };

    fetchAvailableBreeds();
    fetchAvailableCharacteristics();
    fetchAvailableCountries();
    fetchAvailableNGOs();
  }, []);

  const handleValueChange = (
    field: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    onFilterChange({ [field]: value });
  };

  // const handleLocationInputChange = (field: "city", value: string) => {
  //   onFilterChange({location: {...filters.location, [field]: value}});
  // };

  const handleCountryChange = (selectedCountries: string[]) => {
    onFilterChange({
      location: { ...filters.location, country: selectedCountries },
    });
  };

  const handleUseCurrentLocation = async () => {
    await fetchGeoLocation();
    onFilterChange({
      location: {
        country: fetchedGeoCountry
          ? [fetchedGeoCountry]
          : filters.location.country,
        city: fetchedGeoCityString || filters.location.city,
      },
    });
  };

  const handleResetAll = () => {
    onFilterChange({
      gender: "All",
      species: ["any"],
      breeds: [],
      catAge: ["any"],
      dogAge: ["any"],
      rabbitAge: ["any"],
      birdAge: ["any"],
      minAgeYears: undefined,
      maxAgeYears: undefined,
      location: { country: [], city: "" },
      health: ["no filter"],
      characteristics: [],
      kidsAllowed: undefined,
      ngoName: [],
      minWeight: undefined,
      maxWeight: undefined,
      searchQuery: "",
    });
    onApplyFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.gender !== "All") count++;
    if (filters.species.some((s) => s !== "any")) count++;
    if (
      filters.breeds.length > 0 &&
      filters.breeds.some((b) => b.toLowerCase() !== "any")
    )
      count++;
    if (filters.catAge.some((a) => a !== "any")) count++;
    if (filters.dogAge.some((a) => a !== "any")) count++;
    if (filters.rabbitAge.some((a) => a !== "any")) count++;
    if (filters.birdAge.some((a) => a !== "any")) count++;
    if (filters.location.country.length > 0 || filters.location.city) count++;
    if (filters.health.some((h) => h !== "no filter")) count++;
    if (filters.characteristics.length > 0) count++;
    if (filters.kidsAllowed !== undefined) count++;
    if (filters.ngoName.length > 0) count++;
    if (filters.minWeight !== undefined || filters.maxWeight !== undefined)
      count++;
    if (filters.searchQuery && filters.searchQuery.trim() !== "") count++;
    return count;
  };
  const activeFilterCount = getActiveFilterCount();

  // Get selected species that aren't 'any'
  const selectedSpecies = filters.species.filter((s) => s !== "any");
  const hasSelectedSpecies = selectedSpecies.length > 0;

  // Check if any age filters are active
  const hasActiveAgeFilters = () => {
    return (
      filters.catAge.some((a) => a !== "any") ||
      filters.dogAge.some((a) => a !== "any") ||
      filters.rabbitAge.some((a) => a !== "any") ||
      filters.birdAge.some((a) => a !== "any")
    );
  };

  const handleSearch = async () => {
    if (!filters.searchQuery || filters.searchQuery.trim() === "") {
      return;
    }

    try {
      setSearchLoading(true);
      const searchParams = new URLSearchParams({
        q: filters.searchQuery.trim(),
      });

      const response = await fetch(
        `/api/search/animals?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (onSearchResults) {
          onSearchResults(data.pets || []);
        }
      } else if (response.status === 404) {
        if (onSearchResults) {
          onSearchResults([]);
        }
      } else {
        console.error("Search failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center py-4 px-2 sticky top-0 bg-accent z-10">
        <h3 className="flex justify-between items-center text-lg font-semibold">
          {t("Filters", { defaultMessage: "Filters" })}
          {activeFilterCount > 0 && (
            <span className="ml-2 badge badge-primary badge-sm">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button onClick={handleResetAll} className="btn btn-ghost btn-sm">
          <X size={16} className="mr-1" />{" "}
          {t("Reset All", { defaultMessage: "Reset All" })}
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-4 px-2">
        <div className="flex gap-2" onKeyDown={handleSearchKeyPress}>
          <div className="flex-1">
            <InputField
              type="text"
              value={filters.searchQuery || ""}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder={t("searchAnimals", {
                defaultMessage: "Search animals...",
              })}
            />
          </div>
          <button
            className="btn btn-square btn-primary"
            onClick={handleSearch}
            disabled={searchLoading || !filters.searchQuery?.trim()}
          >
            {searchLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main filter accordion using daisyUI join */}
      <div className="join join-vertical w-full">
        {/* Gender Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Gender", { defaultMessage: "Gender" })}
            {filters.gender !== "All" && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.gender}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <ButtonGroup
              items={genderOptions}
              active={filters.gender}
              onChange={(value: "All" | "Male" | "Female") =>
                handleValueChange("gender", value)
              }
              includeReset
              resetIcon={<X />}
              resetValue="All"
              resetLabel=""
            />
          </div>
        </div>

        {/* Species Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Species", { defaultMessage: "Species" })}
            {hasSelectedSpecies && (
              <span className="ml-2 badge badge-primary badge-xs">
                {selectedSpecies.length}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <CheckboxGroup
              items={speciesOptions}
              active={filters.species}
              size="md"
              onChange={(
                value: ("any" | "Cat" | "Dog" | "Rabbit" | "Bird")[]
              ) => handleValueChange("species", value)}
              includeReset
              resetIcon={<X />}
              resetValue="any"
              resetLabel=""
            />
          </div>
        </div>

        {/* Breed Filters - Conditional based on selected species */}
        {hasSelectedSpecies && (
          <div className="collapse collapse-arrow join-item">
            <input type="checkbox" />
            <div className="flex items-center collapse-title text-md font-semibold">
              {t("Breeds", { defaultMessage: "Breeds" })}
              {filters.breeds.length > 0 && (
                <span className="ml-2 badge badge-primary badge-xs">
                  {filters.breeds.length}
                </span>
              )}
            </div>
            <div className="collapse-content pr-0">
              <div className="flex flex-col gap-4">
                {filters.species.includes("Cat") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-2">
                      <Cat size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {t("Cat breeds", { defaultMessage: "Cat breeds" })}
                      </label>
                    </span>

                    <SearchableDropdown
                      options={
                        breedsLoading ? [] : availableBreeds["Cat"] || []
                      }
                      placeholder={
                        breedsLoading
                          ? "Loading cat breeds..."
                          : t("Choose cat breeds", {
                              defaultMessage: "Choose cat breeds",
                            })
                      }
                      onChange={(selected: string[]) =>
                        handleValueChange("breeds", selected)
                      }
                    />
                  </div>
                )}
                {filters.species.includes("Dog") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-2">
                      <Dog size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {t("Dog breeds", { defaultMessage: "Dog breeds" })}
                      </label>
                    </span>
                    <SearchableDropdown
                      options={
                        breedsLoading ? [] : availableBreeds["Dog"] || []
                      }
                      placeholder={
                        breedsLoading
                          ? "Loading dog breeds..."
                          : t("Choose dog breeds", {
                              defaultMessage: "Choose dog breeds",
                            })
                      }
                      onChange={(selected: string[]) =>
                        handleValueChange("breeds", selected)
                      }
                    />
                  </div>
                )}
                {filters.species.includes("Rabbit") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-2">
                      <Rabbit size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {t("Rabbit breeds", {
                          defaultMessage: "Rabbit breeds",
                        })}
                      </label>
                    </span>
                    <SearchableDropdown
                      options={
                        breedsLoading
                          ? []
                          : availableBreeds["Rabbit"] ||
                            availableBreeds["Rodent"] ||
                            []
                      }
                      placeholder={
                        breedsLoading
                          ? "Loading rabbit breeds..."
                          : t("Choose rabbit breeds", {
                              defaultMessage: "Choose rabbit breeds",
                            })
                      }
                      onChange={(selected: string[]) =>
                        handleValueChange("breeds", selected)
                      }
                    />
                  </div>
                )}
                {filters.species.includes("Bird") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-2">
                      <Bird size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {t("Bird breeds", { defaultMessage: "Bird breeds" })}
                      </label>
                    </span>
                    <SearchableDropdown
                      options={
                        breedsLoading ? [] : availableBreeds["Bird"] || []
                      }
                      placeholder={
                        breedsLoading
                          ? "Loading bird breeds..."
                          : t("Choose bird breeds", {
                              defaultMessage: "Choose bird breeds",
                            })
                      }
                      onChange={(selected: string[]) =>
                        handleValueChange("breeds", selected)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Age Filters - Grouped under single accordion */}
        {hasSelectedSpecies && (
          <div className="collapse collapse-arrow join-item">
            <input type="checkbox" />
            <div className="flex items-center collapse-title text-md font-semibold">
              {t("Age", { defaultMessage: "Age" })}
              {hasActiveAgeFilters() && (
                <span className="ml-2 badge badge-primary badge-xs">•</span>
              )}
            </div>
            <div className="collapse-content pr-0">
              <div className="flex flex-col gap-4">
                {/* Nested age filters for each selected species */}
                {filters.species.includes("Cat") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-4">
                      <Cat size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {t("Cat age", { defaultMessage: "Cat age" })}
                      </label>
                      {filters.catAge.some((a) => a !== "any") && (
                        <span className="ml-2 badge badge-secondary badge-xs">
                          {filters.catAge.filter((a) => a !== "any").join(", ")}
                        </span>
                      )}
                    </span>
                    <CheckboxGroup
                      items={catAgeOptions}
                      active={filters.catAge}
                      onChange={(
                        newValues: ("any" | "Kitten" | "Adult" | "Senior")[]
                      ) => handleValueChange("catAge", newValues)}
                      includeReset
                      resetIcon={<X />}
                      resetValue="any"
                      resetLabel=""
                      size="sm"
                      direction="row"
                    />
                  </div>
                )}

                {filters.species.includes("Dog") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-4">
                      <Dog size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {" "}
                        {t("Dog age", { defaultMessage: "Dog age" })}
                      </label>
                      {filters.dogAge.some((a) => a !== "any") && (
                        <span className="ml-2 badge badge-secondary badge-xs">
                          {filters.dogAge.filter((a) => a !== "any").join(", ")}
                        </span>
                      )}
                    </span>

                    <CheckboxGroup
                      items={dogAgeOptions}
                      active={filters.dogAge}
                      onChange={(
                        newValues: ("any" | "Puppy" | "Adult" | "Senior")[]
                      ) => handleValueChange("dogAge", newValues)}
                      includeReset
                      resetIcon={<X />}
                      resetValue="any"
                      resetLabel=""
                      size="sm"
                      direction="row"
                    />
                  </div>
                )}

                {filters.species.includes("Rabbit") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-4">
                      <Rabbit size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {" "}
                        {t("Rabbit age", { defaultMessage: "Rabbit age" })}
                      </label>
                      {filters.rabbitAge.some((a) => a !== "any") && (
                        <span className="ml-2 badge badge-secondary badge-xs">
                          {filters.rabbitAge
                            .filter((a) => a !== "any")
                            .join(", ")}
                        </span>
                      )}
                    </span>
                    <CheckboxGroup
                      items={rabbitAgeOptions}
                      active={filters.rabbitAge}
                      onChange={(
                        newValues: ("any" | "Kit" | "Adult" | "Senior")[]
                      ) => handleValueChange("rabbitAge", newValues)}
                      includeReset
                      resetIcon={<X />}
                      resetValue="any"
                      resetLabel=""
                      size="sm"
                      direction="row"
                    />
                  </div>
                )}

                {filters.species.includes("Bird") && (
                  <div className="border border-base-100 rounded-lg py-3 px-2">
                    <span className="flex items-center gap-2 mb-4">
                      <Bird size={20} />
                      <label className="text-sm font-medium opacity-70 block">
                        {" "}
                        {t("Bird age", { defaultMessage: "Bird age" })}
                      </label>
                      {filters.birdAge.some((a) => a !== "any") && (
                        <span className="ml-2 badge badge-secondary badge-xs">
                          {filters.birdAge
                            .filter((a) => a !== "any")
                            .join(", ")}
                        </span>
                      )}
                    </span>
                    <CheckboxGroup
                      items={birdAgeOptions}
                      active={filters.birdAge}
                      onChange={(
                        newValues: ("any" | "Chick" | "Adult" | "Senior")[]
                      ) => handleValueChange("birdAge", newValues)}
                      includeReset
                      resetIcon={<X />}
                      resetValue="any"
                      resetLabel=""
                      size="sm"
                      direction="row"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Location Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Location", { defaultMessage: "Location" })}
            {(filters.location.country.length > 0 || filters.location.city) && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.location.country.length > 0 && filters.location.city
                  ? `${filters.location.country.length}+1`
                  : filters.location.country.length > 0
                  ? filters.location.country.length
                  : "1"}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <div className="flex flex-col gap-3">
              <SearchableDropdown
                options={countriesLoading ? [] : availableCountries}
                placeholder={
                  countriesLoading
                    ? "Loading countries..."
                    : t("Choose a country", {
                        defaultMessage: "Choose a country",
                      })
                }
                onChange={(selected: string[]) => handleCountryChange(selected)}
              />
              <Button
                onClick={handleUseCurrentLocation}
                label={t("Use current location", {
                  defaultMessage: "Use Current Location",
                })}
                icon={<LocateFixed size={18} />}
                color="primary"
                wide
              />
            </div>
          </div>
        </div>

        {/* Characteristics Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Characteristics", { defaultMessage: "Characteristics" })}
            {filters.characteristics.length > 0 && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.characteristics.length}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <SearchableDropdown
              options={characteristicsLoading ? [] : availableCharacteristics}
              placeholder={
                characteristicsLoading
                  ? "Loading characteristics..."
                  : t("Choose characteristics", {
                      defaultMessage: "Choose characteristics",
                    })
              }
              onChange={(selected: string[]) =>
                handleValueChange("characteristics", selected)
              }
            />
          </div>
        </div>

        {/* Health Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Health", { defaultMessage: "Health" })}
            {filters.health.some((h) => h !== "no filter") && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.health.filter((h) => h !== "no filter").length}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <SearchableDropdown
              options={healthOptions.map((option) => option.value)}
              placeholder={t("Choose health status", {
                defaultMessage: "Choose health status",
              })}
              onChange={(selected: string[]) =>
                handleValueChange(
                  "health",
                  selected.length > 0 ? selected : ["no filter"]
                )
              }
            />
          </div>
        </div>

        {/* Kids Friendly Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Kids Friendly", { defaultMessage: "Kids Friendly" })}
            {filters.kidsAllowed !== undefined && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.kidsAllowed ? "✓" : "✗"}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <div className="form-control">
              <label className="label cursor-pointer flex items-center justify-between">
                <span className="label-text text-base-content">
                  {t("Allowed with kids?", {
                    defaultMessage: "Allowed with kids?",
                  })}
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={filters.kidsAllowed === true}
                  onChange={(e) =>
                    handleValueChange(
                      "kidsAllowed",
                      e.target.checked ? true : undefined
                    )
                  }
                />
              </label>
            </div>
          </div>
        </div>

        {/* Weight Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Weight (kg)", { defaultMessage: "Weight (kg)" })}
            {(filters.minWeight !== undefined ||
              filters.maxWeight !== undefined) && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.minWeight || "0"}-{filters.maxWeight || "∞"}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <div className="flex gap-2 items-center">
              <InputField
                type="number"
                placeholder={t("Min", { defaultMessage: "Min" })}
                value={
                  filters.minWeight === undefined
                    ? ""
                    : filters.minWeight.toString()
                }
                onChange={(e) =>
                  handleValueChange(
                    "minWeight",
                    e.target.value === ""
                      ? undefined
                      : parseFloat(e.target.value)
                  )
                }
                min={0}
              />
              <span>-</span>
              <InputField
                type="number"
                placeholder={t("Max", { defaultMessage: "Max" })}
                value={
                  filters.maxWeight === undefined
                    ? ""
                    : filters.maxWeight.toString()
                }
                onChange={(e) =>
                  handleValueChange(
                    "maxWeight",
                    e.target.value === ""
                      ? undefined
                      : parseFloat(e.target.value)
                  )
                }
                min={0}
              />
            </div>
          </div>
        </div>

        {/* NGO Name Filter */}
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("NGO Name", { defaultMessage: "NGO Name" })}
            {filters.ngoName.length > 0 && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.ngoName.length}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <SearchableDropdown
              options={ngosLoading ? [] : availableNGOs.map((ngo) => ngo.name)}
              placeholder={
                ngosLoading
                  ? "Loading NGOs..."
                  : t("Search NGO", { defaultMessage: "Search NGO" })
              }
              onChange={(selected: string[]) =>
                handleValueChange("ngoName", selected)
              }
            />
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div className="fixed bottom-0 left-0 hidden text-center px-4 z-20 py-3 mb-0 w-80 lg:block bg-accent">
        <Button
          onClick={onApplyFilters}
          label={t("Apply Filters", { defaultMessage: "Apply Filters" })}
          color="primary"
          wide
        />
      </div>

      <div className="sticky bottom-0 left-0 flex justify-center z-20 py-3 w-full lg:hidden bg-accent">
        <Button
          onClick={onApplyFilters}
          label={t("Apply Filters", { defaultMessage: "Apply Filters" })}
          color="primary"
          wide
        />
      </div>
    </div>
  );
}
