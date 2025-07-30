"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import AnimalCard from "@/app/components/animals/animal-card";
import Drawer from "@/app/components/ui/filter-drawer";
import { PawPrint, RefreshCw } from "lucide-react";
import { FilterState } from "./filter/filter";
import { useTranslations } from "next-intl";
import { Animal } from "@/app/types/animal";
import { useSearchParams } from "next/navigation";

interface Pet {
  id: number;
  name: string;
  breed: string;
  breedName: string;
  species: string;
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
  information: string;
}

interface BackendPet {
  id?: string;
  name?: string;
  gender?: string;
  birthdate?: string;
  castration?: boolean;
  weight?: number;
  breed?: string;
  petspecies?: string;
  profilePictureLink?: string;
  profilePicturePath?: string;
  lastCheckUp?: string;
  eatingBehaviour?: string;
  careTaker?: string;
  ngoMember?: string;
  ngoName?: string;
  streetName?: string;
  cityName?: string;
  zip?: string;
  country?: string;
  houseNumber?: string;
  localityTypeRequirement?: string;
  kidsAllowed?: boolean;
  zipRequirement?: string;
  experienceRequirement?: string;
  minimumSpaceRequirement?: number;
  description?: string;
  images?: string[];
}

interface AnimalsClientProps {
  locale: string;
}

export default function AnimalsClient({ locale }: AnimalsClientProps) {
  const t = useTranslations("animals");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Animal[]>([]);
  const limit = 9;
  const observerTarget = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const hasProcessedURLParams = useRef(false);

  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    gender: "All",
    species: ["any"],
    breeds: [],
    catAge: ["any"],
    dogAge: ["any"],
    rabbitAge: ["any"],
    birdAge: ["any"],
    minAgeYears: undefined,
    maxAgeYears: undefined,
    location: { country: [], city: "", zip: "" },
    health: ["no filter"],
    characteristics: [],
    kidsAllowed: undefined,
    ngoName: [],
    minWeight: undefined,
    maxWeight: undefined,
    searchQuery: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ...currentFilters,
  });

  useEffect(() => {
    if (hasProcessedURLParams.current) return;

    const urlSearch = searchParams.get("search");
    const urlLocation = searchParams.get("location");
    const urlSpecies = searchParams.get("species");

    if (!urlSearch && !urlLocation && !urlSpecies) {
      hasProcessedURLParams.current = true;
      return;
    }

    const initialFilters: Partial<FilterState> = {};

    if (urlSearch) {
      initialFilters.searchQuery = urlSearch;
    }

    if (urlLocation) {
      initialFilters.location = {
        country: [],
        city: urlLocation,
        zip: "",
      };
    }

    if (urlSpecies) {
      initialFilters.species = [
        urlSpecies as "Cat" | "Dog" | "Rabbit" | "Bird",
      ];
    }

    const updatedCurrentFilters = { ...currentFilters, ...initialFilters };
    const updatedAppliedFilters = { ...appliedFilters, ...initialFilters };

    setTimeout(() => {
      setCurrentFilters(updatedCurrentFilters);
      setAppliedFilters(updatedAppliedFilters);
      hasProcessedURLParams.current = true;
    }, 100);
  }, [searchParams]);

  const calculateAge = useCallback((birthdate: string | undefined): number => {
    if (!birthdate) return 0;
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  }, []);

  const transformPetData = useCallback(
    (petData: BackendPet): Animal => {
      const defaultImage =
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000";

      const species =
        petData.petspecies || t("unknown", { defaultMessage: "Unknown" });

      const petImages: string[] = [];

      if (
        petData.profilePictureLink &&
        petData.profilePictureLink.trim() !== ""
      ) {
        try {
          new URL(petData.profilePictureLink);
          petImages.push(petData.profilePictureLink);
        } catch {
          // Invalid URL
        }
      }

      if (petData.images && Array.isArray(petData.images)) {
        petData.images.forEach((imageUrl: string) => {
          if (imageUrl && imageUrl.trim() !== "") {
            try {
              new URL(imageUrl);
              petImages.push(imageUrl);
            } catch {
              // Invalid URL
            }
          }
        });
      }

      // Use default image if no valid images found
      if (petImages.length === 0) {
        petImages.push(defaultImage);
      }

      return {
        id: petData.id || "",
        name: petData.name || "",
        breed: {
          name: petData.breed || t("unknown", { defaultMessage: "Unknown" }),
          species: species,
          info: "test",
        },
        age: calculateAge(petData.birthdate),
        weight: petData.weight || 0,
        castration: petData.castration || false,
        gender:
          (petData.gender as "Male" | "Female" | "Diverse") ||
          t("unknown", { defaultMessage: "Unknown" }),
        eatingBehaviour: petData.eatingBehaviour
          ? [petData.eatingBehaviour]
          : [],
        behaviour: [],
        fears: [],
        lastCheckup: petData.lastCheckUp || "",
        image: petImages,
        description: petData.description || "",
        ngo: {
          id: petData.ngoMember || "",
          name: petData.ngoName || "",
          country: petData.country || "",
        },
        location: {
          street: petData.streetName || "",
          housenr: petData.houseNumber || "",
          city: petData.cityName || "",
          zipCode: petData.zip || "",
          country: petData.country || "",
        },
        requiredLocation: "urban",
        ZIPRequirement: "",
        kidsAllowed: petData.kidsAllowed || false,
        requiredExperience: "No experience",
        requiredMinimumSpace: 0,
        allergies: [],
        diseases: [],
        vaccination: [],
      };
    },
    [t, calculateAge]
  );

  const loadAnimals = useCallback(
    async (isFilterOrRefresh = false) => {
      const currentOffset = isFilterOrRefresh ? 0 : offset;
      if (loading && !isFilterOrRefresh) return;
      if (!hasMore && !isFilterOrRefresh) return;

      setLoading(true);
      if (isFilterOrRefresh) {
        setAnimals([]);
        setHasMore(true);
      }

      try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("offset", currentOffset.toString());

        if (
          appliedFilters.gender &&
          appliedFilters.gender.toLowerCase() !== "all"
        ) {
          params.append("gender", appliedFilters.gender);
        }

        appliedFilters.species?.forEach((s: string) => {
          if (s && s.toLowerCase() !== "any" && s.toLowerCase() !== "all") {
            params.append("species", s);
          }
        });

        appliedFilters.breeds?.forEach((b: string) => {
          if (b && b.toLowerCase() !== "any") params.append("breeds", b);
        });
        if (appliedFilters.minAgeYears !== undefined) {
          params.append("minAgeYears", appliedFilters.minAgeYears.toString());
        }
        if (appliedFilters.maxAgeYears !== undefined) {
          params.append("maxAgeYears", appliedFilters.maxAgeYears.toString());
        }
        if (
          appliedFilters.location?.country &&
          appliedFilters.location.country.length > 0
        ) {
          appliedFilters.location.country.forEach((country: string) => {
            if (country) params.append("country", country);
          });
        }
        if (appliedFilters.location?.city) {
          params.append("city", appliedFilters.location.city);
        }
        if (appliedFilters.location?.zip) {
          params.append("zip", appliedFilters.location.zip);
        }
        if (appliedFilters.kidsAllowed !== undefined) {
          params.append("kidsAllowed", appliedFilters.kidsAllowed.toString());
        }
        if (appliedFilters.ngoName) {
          appliedFilters.ngoName.forEach((name: string) => {
            params.append("ngoName", name);
          });
        }
        if (appliedFilters.minWeight !== undefined) {
          params.append("minWeight", appliedFilters.minWeight.toString());
        }
        if (appliedFilters.maxWeight !== undefined) {
          params.append("maxWeight", appliedFilters.maxWeight.toString());
        }

        appliedFilters.characteristics?.forEach((c: string) => {
          if (c && c.trim() !== "") {
            params.append("characteristics", c);
          }
        });

        appliedFilters.health?.forEach((h: string) => {
          if (h && h.toLowerCase() !== "no filter") {
            params.append("health", h);
          }
        });

        console.log("API call parameters:", params.toString());
        console.log("Applied filters:", appliedFilters);

        const response = await fetch(`/api/pets?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const transformedAnimals = data.data.map(transformPetData);
          setAnimals((prev: Animal[]) =>
            isFilterOrRefresh
              ? transformedAnimals
              : [
                  ...prev,
                  ...transformedAnimals.filter(
                    (a: Animal) => !prev.find((p) => p.id === a.id)
                  ),
                ]
          );
          setOffset(currentOffset + data.data.length);
          setHasMore(currentOffset + data.data.length < data.meta.total);
        } else {
          if (isFilterOrRefresh) setAnimals([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading animals:", error);
        if (isFilterOrRefresh) setAnimals([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [offset, limit, appliedFilters, transformPetData, loading, hasMore]
  );

  useEffect(() => {
    loadAnimals(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadAnimals(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadAnimals]);

  const handleFilterChange = (changedFilters: Partial<FilterState>) => {
    let minAge: number | undefined = undefined;
    let maxAge: number | undefined = undefined;

    const ageCategories: (keyof FilterState)[] = [
      "catAge",
      "dogAge",
      "rabbitAge",
      "birdAge",
    ];
    let activeAgeCategory: string | undefined;

    for (const catKey of ageCategories) {
      const ages =
        (changedFilters[catKey] as string[] | undefined) ||
        (currentFilters[catKey] as string[]);
      activeAgeCategory = ages.find((age) => age && age !== "any");
      if (activeAgeCategory) break;
    }

    if (activeAgeCategory) {
      if (["Kitten", "Puppy", "Kit", "Chick"].includes(activeAgeCategory)) {
        minAge = 0;
        maxAge = 1;
      } else if (activeAgeCategory === "Adult") {
        minAge = 1;
        maxAge = 7;
      } else if (activeAgeCategory === "Senior") {
        minAge = 7;
      }
    }

    setCurrentFilters((prev: FilterState) => ({
      ...prev,
      ...changedFilters,
      minAgeYears: minAge,
      maxAgeYears: maxAge,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...currentFilters });
  };

  const handleRefresh = () => {
    const defaultFilters = {
      gender: "All",
      species: ["any"],
      breeds: [],
      catAge: ["any"],
      dogAge: ["any"],
      rabbitAge: ["any"],
      birdAge: ["any"],
      minAgeYears: undefined,
      maxAgeYears: undefined,
      location: { country: [], city: "", zip: "" },
      health: ["no filter"],
      characteristics: [],
      kidsAllowed: undefined,
      ngoName: [],
      minWeight: undefined,
      maxWeight: undefined,
      searchQuery: "",
    };

    setCurrentFilters(defaultFilters as FilterState);
    setAppliedFilters(defaultFilters as FilterState);
    setSearchMode(false);
    setSearchResults([]);

    setOffset(0);
    setAnimals([]);
    setHasMore(true);
    loadAnimals(true);
  };

  const handleSearchResults = (results: Pet[]) => {
    console.log("Received search results:", results);
    const transformedSearchResults = results.map((pet) => {
      const backendPet: BackendPet = {
        id: pet.id?.toString(),
        name: pet.name,
        gender: pet.gender,
        birthdate: pet.birthdate?.toString(),
        castration: pet.castration,
        weight: pet.weight,
        breed: pet.breedName || pet.breed,
        petspecies: pet.species,
        profilePictureLink: pet.profilePictureLink,
        lastCheckUp: pet.lastCheckUp?.toString(),
        eatingBehaviour: pet.eatingBehaviour,
        ngoMember: pet.ngoMemberId?.toString(),
        ngoName: "",
        streetName: pet.streetName,
        cityName: pet.cityName,
        zip: pet.zip,
        country: pet.country,
        houseNumber: pet.houseNumber,
        localityTypeRequirement: pet.localityTypeRequirement,
        kidsAllowed: pet.kidsAllowed,
        zipRequirement: pet.zipRequirement,
        experienceRequirement: pet.experienceRequirement,
        minimumSpaceRequirement: pet.minimumSpaceRequirement,
        description: pet.information,
      };
      return transformPetData(backendPet);
    });

    setSearchResults(transformedSearchResults);
    setSearchMode(true);
  };

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlLocation = searchParams.get("location");

    if (urlSearch && appliedFilters.searchQuery) {
      const performSearch = async () => {
        try {
          const params = new URLSearchParams({ q: urlSearch.trim() });
          if (urlLocation) {
            params.set("location", urlLocation.trim());
          }

          const response = await fetch(
            `/api/search/animals?${params.toString()}`
          );

          if (response.ok) {
            const data = await response.json();
            handleSearchResults(data.pets || []);
          } else if (response.status === 404) {
            handleSearchResults([]);
          }
        } catch (error) {
          console.error("Error during URL search:", error);
        }
      };

      performSearch();
    }
  }, [appliedFilters.searchQuery, searchParams]);

  return (
    <Drawer
      filters={currentFilters}
      onFilterChange={handleFilterChange}
      onApplyFilters={handleApplyFilters}
      onSearchResults={handleSearchResults}
    >
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
          {t("pageTitle", { defaultMessage: "Animals Available for Adoption" })}
        </h1>

        {searchMode && (
          <div className="mb-4 p-3 bg-accent/20 rounded-lg border border-accent/50">
            <p className="text-sm text-base-content">
              {t("searchResults", { defaultMessage: "Showing search results" })}{" "}
              ({searchResults.length} {t("found", { defaultMessage: "found" })})
              <button
                onClick={() => {
                  setSearchMode(false);
                  setSearchResults([]);
                  setCurrentFilters((prev) => ({ ...prev, searchQuery: "" }));
                }}
                className="ml-2 text-xs underline hover:no-underline cursor-pointer"
              >
                {t("clearSearch", { defaultMessage: "Clear search" })}
              </button>
            </p>
          </div>
        )}

        {(searchMode ? searchResults : animals).length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
              <PawPrint className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              {searchMode
                ? t("noSearchResults", {
                    defaultMessage: "No search results found",
                  })
                : t("noAnimalsFound", { defaultMessage: "No animals found" })}
            </h2>
            <p className="text-base-content/70 text-center max-w-md mb-8">
              {searchMode
                ? t("noSearchResultsMessage", {
                    defaultMessage:
                      "Try different search terms or clear the search to browse all animals.",
                  })
                : t("noAnimalsMessage", {
                    defaultMessage:
                      "We couldn't find any animals with the current filters. Try adjusting your search or check back soon!",
                  })}
            </p>
            <button onClick={handleRefresh} className="btn btn-primary gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("refreshButton", {
                defaultMessage: "Refresh / Clear Filters",
              })}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(searchMode ? searchResults : animals).map((animal: Animal) => (
              <AnimalCard animal={animal} locale={locale} key={animal.id} />
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-75"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
            </div>
          </div>
        )}

        {!loading && !searchMode && animals.length > 0 && hasMore && (
          <div ref={observerTarget} className="h-10 w-full" />
        )}

        {!loading && !searchMode && animals.length > 0 && !hasMore && (
          <div className="text-center py-8 text-base-content/60">
            <p>
              {t("endOfList", {
                defaultMessage: "You've reached the end of the list.",
              })}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
}
