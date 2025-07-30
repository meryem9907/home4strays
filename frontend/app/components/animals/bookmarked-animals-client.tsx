"use client";

import React, {useState, useEffect, useCallback} from "react";
import AnimalCard from "@/app/components/animals/animal-card";
import {PawPrint, Heart} from "lucide-react";
import {useTranslations} from "next-intl";
import {Animal} from "@/app/types/animal";
import {useAuth} from "@/contexts/AuthContext";
import Link from "next/link";

interface BackendBookmark {
  petId: string;
  caretakerId: string;
  pet?: BackendPet;
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

interface BookmarkedAnimalsClientProps {
  locale: string;
}

export default function BookmarkedAnimalsClient({locale}: BookmarkedAnimalsClientProps) {
  const t = useTranslations("animals");
  const [bookmarkedAnimals, setBookmarkedAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const {token} = useAuth();

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
      const defaultImage = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000";

      const species = petData.petspecies || t("unknown", {defaultMessage: "Unknown"});

      const petImages: string[] = [];

      if (petData.profilePictureLink && petData.profilePictureLink.trim() !== "") {
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

      if (petImages.length === 0) {
        petImages.push(defaultImage);
      }

      return {
        id: petData.id || "",
        name: petData.name || "",
        breed: {
          name: petData.breed || t("unknown", {defaultMessage: "Unknown"}),
          species: species,
          info: "test",
        },
        age: calculateAge(petData.birthdate),
        weight: petData.weight || 0,
        castration: petData.castration || false,
        gender: (petData.gender as "Male" | "Female" | "Diverse") || t("unknown", {defaultMessage: "Unknown"}),
        eatingBehaviour: petData.eatingBehaviour ? [petData.eatingBehaviour] : [],
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
        requiredLocation: "urban" as const,
        ZIPRequirement: "",
        kidsAllowed: petData.kidsAllowed || false,
        requiredExperience: "No experience" as const,
        requiredMinimumSpace: 0,
        allergies: [],
        diseases: [],
        vaccination: [],
      };
    },
    [calculateAge, t]
  );

  const fetchBookmarkedAnimals = useCallback(async () => {
    if (!token) {
      setBookmarkedAnimals([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/petbookmarks?lang=${locale}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const bookmarksData = await response.json();

        if (bookmarksData.data && Array.isArray(bookmarksData.data)) {
          const petIds = bookmarksData.data.map((bookmark: BackendBookmark) => bookmark.petId);

          if (petIds.length > 0) {
            const petsResponse = await fetch(`/api/pets?limit=100&offset=0&lang=${locale}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (petsResponse.ok) {
              const petsData = await petsResponse.json();
              const allPets = petsData.data || [];

              const bookmarkedPets = allPets.filter((pet: BackendPet) => petIds.includes(pet.id));

              const transformedAnimals = bookmarkedPets.map((pet: BackendPet) => transformPetData(pet));
              setBookmarkedAnimals(transformedAnimals);
            } else {
              console.error("Failed to fetch pets data");
              setBookmarkedAnimals([]);
            }
          } else {
            setBookmarkedAnimals([]);
          }
        } else {
          setBookmarkedAnimals([]);
        }
      } else {
        console.error("Failed to fetch bookmarks");
        setBookmarkedAnimals([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarked animals:", error);
      setBookmarkedAnimals([]);
    } finally {
      setLoading(false);
    }
  }, [token, locale, transformPetData]);

  useEffect(() => {
    fetchBookmarkedAnimals();
  }, [fetchBookmarkedAnimals]);

  if (!token) {
    return (
      <div className="w-full bg-base-100 min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-2">
              {t("bookmarksRequireLogin", {
                defaultMessage: "Please log in to view your bookmarks",
              })}
            </h1>
            <p className="text-base-content opacity-70">
              {t("bookmarksLoginDescription", {
                defaultMessage: "Sign in to save and view your favorite animals",
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-base-100 min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">{t("bookmarkedAnimals", {defaultMessage: "Bookmarked Animals"})}</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : bookmarkedAnimals.length === 0 ? (
          <div className="text-center py-20">
            <PawPrint className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">
              {t("noBookmarkedAnimals", {
                defaultMessage: "No bookmarked animals yet",
              })}
            </h2>
            <p className="text-base-content opacity-70 mb-4">
              {t("noBookmarkedAnimalsDescription", {
                defaultMessage: "Start browsing animals and save your favorites!",
              })}
            </p>
            <Link href="/animals" className="btn btn-primary">
              {t("browseAnimals", {defaultMessage: "Browse Animals"})}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-base-content opacity-70">
                {t("bookmarkedCount", {
                  defaultMessage: `Found ${bookmarkedAnimals.length} bookmarked animal${bookmarkedAnimals.length === 1 ? "" : "s"}`,
                  count: bookmarkedAnimals.length,
                })}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
