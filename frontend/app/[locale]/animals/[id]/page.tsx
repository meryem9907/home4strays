"use client";

import React, {useEffect, useState} from "react";
import {Gallery} from "@/app/components/animals/Gallery";
import {AnimalTitle} from "@/app/components/animals/AnimalTitle";
import {NGOInfo} from "@/app/components/animals/NGOInfo";
import {AnimalInfo} from "@/app/components/animals/AnimalInfo";
import {Calendar, Scissors, Mars, Syringe, AlertCircle} from "lucide-react";
import {useTranslations} from "next-intl";
import Badge from "@/app/components/ui/badge";

interface Image {
  src: string;
  alt: string;
}

interface NGO {
  id?: string;
  name: string;
  logo: string;
  location: string;
  country: string;
  websites?: string[];
  email: string;
}

interface AnimalData {
  id: string;
  name: string;
  type: string;
  breed: string;
  breedInformation?: string;
  age: string;
  weight: string;
  kastration: boolean;
  vaccinated: boolean;
  gender: string;
  allergies: string[];
  diseases: {disease: string; info?: string; medications?: string}[];
  vaccinations?: {vaccine: string; date: string}[];
  fears?: {name: string; info?: string; medications?: string}[];
  lastCheckup: string;
  eatingBehaviour?: string;
  behaviour?: string;
  localityTypeRequirement?: string;
  experienceRequirement?: string;
  minimumSpaceRequirement?: number;
  images: Image[];
  ngo?: NGO;
}

const calculateAgeString = (birthdate?: string, t?: (key: string, params?: Record<string, string | number | Date>) => string): string => {
  if (!birthdate) return t?.("unknownAge") || "Unknown";
  const birthDate = new Date(birthdate);
  if (isNaN(birthDate.getTime())) return t?.("unknownAge") || "Unknown";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months = months < 0 ? 12 + months : months;
    if (today.getDate() < birthDate.getDate() && months === 0) months = 11;
  }
  if (years === 0 && months === 0 && today.getDate() < birthDate.getDate()) {
    return t?.("lessThanMonth") || "Less than a month";
  }
  if (years === 0 && months === 0) return t?.("newborn") || "Newborn";

  let ageString = "";
  if (years > 0) {
    ageString += `${years} ${t?.("years", {count: years}) || (years > 1 ? "Years" : "Year")}`;
  }
  if (months > 0) {
    if (years > 0) ageString += " ";
    ageString += `${months} ${t?.("months", {count: months}) || (months > 1 ? "Months" : "Month")}`;
  }
  if (ageString === "") return t?.("lessThanMonth") || "Less than a month";
  return ageString;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return "N/A";
  }
};

interface BackendPet {
  id: string;
  name?: string;
  gender: string;
  birthdate?: string;
  castration?: boolean;
  weight?: number;
  breed?: string;
  profilePictureLink?: string;
  profilePicturePath?: string;
  lastCheckUp?: string;
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
  kidsAllowed?: boolean;
  zipRequirement?: string;
  experienceRequirement?: string;
  minimumSpaceRequirement?: number;
  petSpecies?: string;
  breedInformation?: string;
  ngoId?: string;
  ngoName?: string;
  ngoCountry?: string;
  ngoLogo?: string;
  ngoEmail: string;
  images?: string[];
  vaccinations?: {vaccine: string; date: string}[];
  diseases?: {disease: string; info?: string; medications?: string}[];
  fears?: {fearName: string; info?: string; medications?: string}[];
  websites?: string[];
}

const transformBackendPetToAnimalData = (
  backendPet: BackendPet,
  t?: (key: string, params?: Record<string, string | number | Date>) => string
): AnimalData => {
  const animalImages: Image[] = [];
  const addedImageLinks = new Set<string>();

  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return false;
    }
    try {
      new URL(url.trim());
      return true;
    } catch {
      return false;
    }
  };

  if (backendPet.profilePictureLink && isValidUrl(backendPet.profilePictureLink)) {
    animalImages.push({
      src: backendPet.profilePictureLink,
      alt: `${backendPet.name || t?.("unnamedAnimal") || "Animal"} ${t?.("profilePicture") || "profile picture"}`,
    });
    addedImageLinks.add(backendPet.profilePictureLink);
  }

  if (backendPet.images && Array.isArray(backendPet.images)) {
    backendPet.images.forEach((link, index) => {
      if (link && typeof link === "string" && link.trim() !== "" && isValidUrl(link) && !addedImageLinks.has(link)) {
        animalImages.push({
          src: link,
          alt: `${backendPet.name || t?.("unnamedAnimal") || "Animal"} ${t?.("image") || "image"} ${index + 1}`,
        });
        addedImageLinks.add(link);
      }
    });
  }

  if (animalImages.length === 0) {
    animalImages.push({
      src: "/logo.png",
      alt: t?.("noImageAvailable") || "No image available",
    });
  }

  const ngoData: NGO | undefined = backendPet.ngoName
    ? {
        id: backendPet.ngoId,
        name: backendPet.ngoName,
        logo: backendPet.ngoLogo && isValidUrl(backendPet.ngoLogo) ? backendPet.ngoLogo : "/logo.png",
        location: backendPet.ngoCountry || t?.("locationNotSpecified") || "Location not specified",
        country: backendPet.ngoCountry || backendPet.country || "N/A",
        websites: backendPet.websites || [],
        email: backendPet.ngoEmail,
      }
    : undefined;

  return {
    id: backendPet.id,
    name: backendPet.name || t?.("unnamedAnimal") || "Unnamed Animal",
    type: backendPet.petSpecies || t?.("unknownType") || "Unknown Type",
    breed: backendPet.breed || t?.("unknownBreed") || "Unknown Breed",
    breedInformation: backendPet.breedInformation,
    age: calculateAgeString(backendPet.birthdate, t),
    weight: backendPet.weight ? `${backendPet.weight} kg` : "N/A",
    kastration: backendPet.castration === true,
    vaccinated: !!(backendPet.vaccinations && backendPet.vaccinations.length > 0),
    gender: backendPet.gender || t?.("unknownAge") || "Unknown",
    allergies: [],
    diseases: backendPet.diseases?.filter((d) => d.disease) || [],
    vaccinations: backendPet.vaccinations || [],
    fears:
      backendPet.fears?.map((f) => ({
        name: f.fearName,
        info: f.info,
        medications: f.medications,
      })) || [],
    lastCheckup: formatDate(backendPet.lastCheckUp),
    eatingBehaviour: backendPet.eatingBehaviour,
    behaviour: backendPet.behaviour,
    localityTypeRequirement: backendPet.localityTypeRequirement,
    experienceRequirement: backendPet.experienceRequirement,
    minimumSpaceRequirement: backendPet.minimumSpaceRequirement,
    images: animalImages,
    ngo: ngoData,
  };
};

interface AnimalDetailPageProps {
  params: Promise<{id: string; locale: string}>;
}

export default function AnimalDetailPage({params}: AnimalDetailPageProps) {
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const t = useTranslations("AnimalDetail");

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const {id} = await params;
        console.log(`[DEBUG] Client-side: Fetching animal data for ID: ${id}`);
        console.log(`[DEBUG] Client-side: ID type:`, typeof id);
        console.log(`[DEBUG] Client-side: ID length:`, id?.length);

        // First test if API routes work at all
        console.log(`[DEBUG] Client-side: Testing general API connectivity...`);
        try {
          const testRes = await fetch("/api/pets?limit=1&offset=0");
          console.log(`[DEBUG] Client-side: Test API call status:`, testRes.status);
          if (testRes.ok) {
            const testData = await testRes.json();
            console.log(`[DEBUG] Client-side: Test API call successful, got data:`, !!testData.data);
          }
        } catch (testError) {
          console.log(`[DEBUG] Client-side: Test API call failed:`, testError);
        }

        const apiUrl = `/api/pets/${id}`;
        console.log(`[DEBUG] Client-side: API URL: ${apiUrl}`);
        console.log(`[DEBUG] Client-side: Current window.location:`, window.location.href);

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(`[DEBUG] Client-side: API response status: ${res.status}`);
        console.log(`[DEBUG] Client-side: API response headers:`, Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          if (res.status === 404) {
            console.log(`[DEBUG] Client-side: Animal not found (404)`);
            setError(true);
            setErrorDetails("Animal not found");
            return;
          }
          const errorText = await res.text();
          console.log(`[DEBUG] Client-side: API error response:`, errorText);
          setError(true);
          setErrorDetails(`API Error: ${res.status} - ${errorText}`);
          return;
        }

        const responseData = await res.json();
        console.log(`[DEBUG] Client-side: API response success, full response:`, responseData);
        console.log(`[DEBUG] Client-side: API response data keys:`, Object.keys(responseData.data || {}));

        if (!responseData.data) {
          setError(true);
          setErrorDetails("No data returned from API");
          return;
        }
        const transformedData = transformBackendPetToAnimalData(responseData.data as BackendPet, t);
        setAnimalData(transformedData);
      } catch (error) {
        console.error("[DEBUG] Client-side: Error fetching animal data:", error);
        console.log(`[DEBUG] Client-side: Error type:`, typeof error);
        console.log(`[DEBUG] Client-side: Error name:`, error instanceof Error ? error.name : "Unknown");
        console.log(`[DEBUG] Client-side: Error message:`, error instanceof Error ? error.message : "Unknown");
        console.log(`[DEBUG] Client-side: Error stack:`, error instanceof Error ? error.stack : "No stack");
        setError(true);
        setErrorDetails(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [params, t]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 h-full flex flex-col justify-center items-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Loading animal details...</p>
      </div>
    );
  }

  if (error || !animalData) {
    return (
      <div className="container mx-auto py-8 px-4 h-full flex flex-col justify-center items-center">
        <AlertCircle className="mx-auto h-16 w-16 text-error mb-4" />
        <h1 className="text-2xl font-bold">{t("animalNotFound")}</h1>
        <p>{t("animalNotFoundMessage")}</p>
        {errorDetails && (
          <details className="mt-4 text-sm text-gray-600">
            <summary className="cursor-pointer">Technical Details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{errorDetails}</pre>
          </details>
        )}
      </div>
    );
  }

  const displayNGO = animalData.ngo || {
    id: undefined,
    name: t("ngoInfoNotAvailable"),
    logo: "/logo.png",
    location: "N/A",
    email: "N/A",
    country: "N/A",
    websites: [],
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Gallery images={animalData.images} />

          <div className="mt-8 card bg-base-100 border border-neutral shadow-md">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold mb-2">{t("informationAbout", {name: animalData.name})}</h2>
              <div className="flex flex-wrap mb-4 gap-2">
                <Badge icon={<Mars size={16} />} label={animalData.gender} color="primary" soft />
                <Badge icon={<Calendar size={16} />} label={animalData.age} color="primary" soft />

                {animalData.kastration && <Badge icon={<Scissors size={16} />} label={t("neuteredSpayed")} color="success" soft />}
                {animalData.vaccinated && <Badge icon={<Syringe size={16} />} label={t("vaccinated")} color="success" soft />}
              </div>

              <AnimalInfo
                age={animalData.age}
                weight={animalData.weight}
                kastration={animalData.kastration}
                vaccinated={animalData.vaccinated}
                breed={animalData.breed}
                gender={animalData.gender}
                allergies={animalData.allergies}
                diseases={animalData.diseases}
                vaccinations={animalData.vaccinations}
                fears={animalData.fears}
                lastCheckup={animalData.lastCheckup}
                eatingBehaviour={animalData.eatingBehaviour}
                behaviour={animalData.behaviour}
                localityTypeRequirement={animalData.localityTypeRequirement}
                experienceRequirement={animalData.experienceRequirement}
                minimumSpaceRequirement={animalData.minimumSpaceRequirement}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AnimalTitle
            name={animalData.name}
            type={animalData.type}
            breed={animalData.breed}
            petId={animalData.id}
            mail={animalData.ngo?.email || ""}
          />

          <div className="mt-8">
            <NGOInfo
              id={displayNGO.id}
              name={displayNGO.name}
              logo={displayNGO.logo}
              email={displayNGO.email}
              country={displayNGO.country}
              websites={displayNGO.websites}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
