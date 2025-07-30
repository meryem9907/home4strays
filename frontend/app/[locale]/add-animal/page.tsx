"use client";

import React, {useState, useRef, ChangeEvent, FormEvent, useEffect} from "react";
import {Ban, PawPrint, Upload} from "lucide-react";
import Box from "@/app/components/ui/box";
import Button from "@/app/components/ui/button";
import UploadPictures from "@/app/components/add-animal/Pictures";
import HealthSection from "@/app/components/add-animal/Health";
import BaseInformation from "@/app/components/add-animal/BaseInformation";
import LocationSection from "@/app/components/add-animal/Location";
import BehaviourSection from "@/app/components/add-animal/Behaviour";
import RequirementsSection from "@/app/components/add-animal/Requirements";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";
import {Behaviour, Disease, Fear, Vaccination} from "@/app/types/addAnimal";
import {useAuth} from "@/contexts/AuthContext";
import {useRouter, useParams} from "next/navigation";

type Gender = "Male" | "Female" | "Unknown" | "";
type LocalityType = "Urban" | "Rural" | "Other" | "";
type Experience = ">10 Years" | ">5 Years" | ">2 Years" | ">1 Year" | "No Experience" | "";

interface PreviewImage {
  url: string;
  name: string;
}

export type AnimalFormErrors = {
  name: string;
  birthDate: string;
  species: string;
  weight: string;
  gender: string;
  country: string;
  zip: string;
  city: string;
  lastCheckup: string;
  isNeutered: string;
  isVaccinated: string;
  reqLocalityType: string;
  reqZip: string;
  reqExperience: string;
  reqMinSpace: string;
};

export default function AddAnimalPage() {
  const t = useTranslations("AddAnimal");
  const {token, isLoading} = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [ngoStatusLoading, setNgoStatusLoading] = useState(true);
  const [isVerifiedNgo, setIsVerifiedNgo] = useState(false);

  // Check authentication and NGO status
  useEffect(() => {
    const checkNgoStatus = async () => {
      if (isLoading) return;

      if (!token) {
        toast.error(t("Verification.authRequired"));
        router.push(`/${locale}/login`);
        return;
      }

      try {
        const response = await fetch("/api/ngo-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const ngoStatus = await response.json();
          if (ngoStatus.hasNgoMembership) {
            setIsVerifiedNgo(true);
          } else {
            toast.error(t("Messages.ngoRequired"));
            router.push(`/${locale}/`);
          }
        } else {
          toast.error(t("Messages.ngoRequired"));
          router.push(`/${locale}/`);
        }
      } catch (error) {
        console.error("Error checking NGO status:", error);
        toast.error(t("Messages.networkError"));
        router.push(`/${locale}/`);
      } finally {
        setNgoStatusLoading(false);
      }
    };

    checkNgoStatus();
  }, [token, isLoading, router, locale, t]);

  // Base Information
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [gender, setGender] = useState<Gender>("");

  // Location
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  // Health
  const [diseases, setDiseases] = useState<Disease[]>([{name: "", medication: "", info: ""}]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([{vaccine: "", date: ""}]);
  const [isNeutered, setIsNeutered] = useState(false);
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [hasDiseases, setHasDiseases] = useState(false);
  const [lastCheckup, setLastCheckup] = useState("");

  // Behaviour
  const [behaviour, setBehaviour] = useState<Behaviour | "">("");
  const [fear, setFear] = useState<Fear[]>([{fear: "", info: ""}]);
  const [eatingBehaviour, setEatingBehaviour] = useState("");

  // Requirements
  const [reqLocalityType, setReqLocalityType] = useState<LocalityType>("");
  const [reqExperience, setReqExperience] = useState<Experience>("");
  const [reqMinSpace, setReqMinSpace] = useState<number | "">("");
  const [reqZip, setReqZip] = useState("");
  const [kidsAllowed, setKidsAllowed] = useState(true);

  // Images
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<AnimalFormErrors>({
    name: "",
    birthDate: "",
    species: "",
    weight: "",
    gender: "",
    country: "",
    zip: "",
    city: "",
    lastCheckup: "",
    isNeutered: "",
    isVaccinated: "",
    reqLocalityType: "",
    reqZip: "",
    reqExperience: "",
    reqMinSpace: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index].url);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(t("Verification.authRequiredAction"));
      router.push(`/${locale}/login`);
      return;
    }

    // Validation
    let hasErrors = false;
    const newErrors = {
      name: "",
      birthDate: "",
      species: "",
      weight: "",
      gender: "",
      country: "",
      zip: "",
      city: "",
      lastCheckup: "",
      isNeutered: "",
      isVaccinated: "",
      reqLocalityType: "",
      reqZip: "",
      reqExperience: "",
      reqMinSpace: "",
    };

    if (name.trim() === "") {
      newErrors.name = t("Verification.reqName");
      hasErrors = true;
    }

    if (birthDate.trim() === "") {
      newErrors.birthDate = t("Verification.reqBirthDate");
      hasErrors = true;
    }

    if (species.trim() === "") {
      newErrors.species = t("Verification.reqSpecies");
      hasErrors = true;
    }

    if (breed.trim() === "") {
      toast.error(t("Verification.reqBreed"));
      hasErrors = true;
    }

    if (typeof weight === "string" && weight.trim() === "") {
      newErrors.weight = t("Verification.reqWeight");
      hasErrors = true;
    }

    if (gender.trim() === "") {
      newErrors.gender = t("Verification.reqGender");
      hasErrors = true;
    }

    if (country.trim() === "") {
      newErrors.country = t("Verification.reqCountry");
      hasErrors = true;
    }

    if (zip.trim() === "") {
      newErrors.zip = t("Verification.reqZip");
      hasErrors = true;
    }

    if (city.trim() === "") {
      newErrors.city = t("Verification.reqCity");
      hasErrors = true;
    }

    if (lastCheckup.trim() === "") {
      newErrors.lastCheckup = t("Verification.reqLastCheckup");
      hasErrors = true;
    }

    if (reqLocalityType === "") {
      newErrors.reqLocalityType = t("Verification.reqLocalityType");
      hasErrors = true;
    }

    if (reqZip.trim() === "") {
      newErrors.reqZip = t("Verification.reqZip");
      hasErrors = true;
    }

    if (reqExperience === "") {
      newErrors.reqExperience = t("Verification.reqExperience");
      hasErrors = true;
    }

    if (reqMinSpace === "") {
      newErrors.reqMinSpace = t("Verification.reqMinSpace");
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      window.scrollTo({top: 0, behavior: "smooth"});
      toast.error(t("Verification.fillAllRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare pet diseases data
      const petDiseases = hasDiseases
        ? diseases
            .filter((d) => d.name.trim() !== "")
            .map((disease) => ({
              disease: disease.name,
              info: disease.info || "",
              medications: disease.medication || "",
            }))
        : [];

      // Prepare pet fears data
      const petFears = fear
        .filter((f) => f.fear.trim() !== "")
        .map((f) => ({
          fear: f.fear,
          info: f.info || "",
          medications: "",
        }));

      // Prepare pet vaccinations data
      const petVaccinations = isVaccinated
        ? vaccinations
            .filter((v) => v.vaccine.trim() !== "")
            .map((vaccination) => ({
              vaccine: vaccination.vaccine,
              date: vaccination.date || null,
            }))
        : [];

      // Prepare the pet data according to backend expectations
      const petData = {
        name: name.trim(),
        breedName: breed.trim(),
        species: species.trim(),
        gender: gender,
        birthdate: birthDate,
        weight: typeof weight === "number" ? weight : parseFloat(weight as string),
        castration: isNeutered,
        lastCheckUp: lastCheckup,
        behaviour: behaviour ? behaviour.toLowerCase() : null,
        eatingBehaviour: eatingBehaviour || null,
        streetName: street.trim() || null,
        cityName: city.trim(),
        zip: zip.trim(),
        country: country.trim(),
        houseNumber: houseNumber.trim() || null,
        localityTypeRequirement: reqLocalityType,
        kidsAllowed: kidsAllowed,
        zipRequirement: reqZip.trim(),
        experienceRequirement: reqExperience,
        minimumSpaceRequirement: typeof reqMinSpace === "number" ? reqMinSpace : parseInt(reqMinSpace as string),
        petDisease: petDiseases,
        petFears: petFears,
        petVaccination: petVaccinations,
      };

      console.log("Submitting pet data:", petData);

      const response = await fetch(`/api/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(t("Messages.petCreated"));

        // Upload images if any
        if (images.length > 0) {
          try {
            const imageFormData = new FormData();
            images.forEach((image) => {
              imageFormData.append("pet-pictures", image);
            });

            const imageResponse = await fetch(`/api/pets/${result.petId}/pictures`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: imageFormData,
            });

            if (imageResponse.ok) {
              toast.success(t("Messages.imagesUploaded"));
            } else {
              console.error("Failed to upload images");
              toast.error(t("Messages.imageUploadFailed"));
            }
          } catch (imageError) {
            console.error("Error uploading images:", imageError);
            toast.error(t("Messages.imageUploadFailed"));
          }
        }

        router.push(`/${locale}/animals/${result.petId}`);
      } else {
        if (response.status === 401) {
          toast.error(t("Messages.authFailed"));
          router.push(`/${locale}/login`);
        } else if (response.status === 403) {
          toast.error(t("Messages.ngoRequired"));
        } else if (response.status === 400) {
          toast.error(result.message || t("Messages.invalidData"));
        } else if (response.status === 404) {
          toast.error(result.message || t("Messages.breedNotFound"));
        } else {
          toast.error(result.message || t("Messages.errorGeneric"));
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("Messages.networkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || ngoStatusLoading) {
    return (
      <div className="container mx-auto max-w-5xl md:px-4 flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!token || !isVerifiedNgo) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl md:px-4 ">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <Box size="full">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <PawPrint className="w-7 h-7 text-secondary" />
            {t("title")}
          </h1>
          <p className="text-gray-600 text-base">{t("subtitle")}</p>
        </Box>

        {/* Base Information */}
        <BaseInformation
          name={name}
          birthDate={birthDate}
          species={species}
          breed={breed}
          weight={weight}
          gender={gender}
          error={errors}
          onChange={(field, value) => {
            switch (field) {
              case "name":
                setName(value as string);
                break;
              case "birthDate":
                setBirthDate(value as string);
                break;
              case "species":
                setSpecies(value as string);
                break;
              case "breed":
                setBreed(value as string);
                break;
              case "weight":
                setWeight(typeof value === "string" ? parseFloat(value) : value);
                break;
              case "gender":
                setGender(value as Gender);
                break;
              default:
                break;
            }
          }}
        />

        {/* Location */}
        <LocationSection
          country={country}
          zip={zip}
          city={city}
          street={street}
          houseNumber={houseNumber}
          error={errors}
          onChange={(field, value) => {
            switch (field) {
              case "country":
                setCountry(value);
                break;
              case "zip":
                setZip(value);
                break;
              case "city":
                setCity(value);
                break;
              case "street":
                setStreet(value);
                break;
              case "houseNumber":
                setHouseNumber(value);
                break;
              default:
                break;
            }
          }}
        />

        {/* Health Information */}
        <HealthSection
          lastCheckup={lastCheckup}
          isNeutered={isNeutered}
          isVaccinated={isVaccinated}
          hasDiseases={hasDiseases}
          diseases={diseases}
          vaccinations={vaccinations}
          error={errors}
          onChange={(field, value) => {
            switch (field) {
              case "lastCheckup":
                if (typeof value === "string") setLastCheckup(value);
                break;
              case "isNeutered":
                if (typeof value === "boolean") setIsNeutered(value);
                break;
              case "isVaccinated":
                if (typeof value === "boolean") setIsVaccinated(value);
                break;
              case "hasDiseases":
                if (typeof value === "boolean") setHasDiseases(value);
                break;
              case "diseases":
                if (Array.isArray(value) && value.every((v) => "name" in v && "medication" in v && "info" in v)) {
                  setDiseases(value as Disease[]);
                }
                break;
              case "vaccinations":
                if (Array.isArray(value) && value.every((v) => "vaccine" in v && "date" in v)) {
                  setVaccinations(value as Vaccination[]);
                }
                break;
            }
          }}
        />

        {/* Behaviour */}
        <BehaviourSection
          behaviour={behaviour}
          fear={fear}
          eatingBehaviour={eatingBehaviour}
          onChange={(field, value) => {
            switch (field) {
              case "behaviour":
                setBehaviour(value as Behaviour);
                break;
              case "fear":
                if (Array.isArray(value)) {
                  setFear(value as Fear[]);
                }
                break;
              case "eatingBehaviour":
                if (typeof value === "string") {
                  setEatingBehaviour(value);
                }
                break;
              default:
                break;
            }
          }}
        />

        {/* Requirements */}
        <RequirementsSection
          reqZip={reqZip}
          reqMinSpace={reqMinSpace}
          reqLocalityType={reqLocalityType}
          reqExperience={reqExperience}
          kidsAllowed={kidsAllowed}
          error={errors}
          onChange={(field, value) => {
            switch (field) {
              case "reqZip":
                setReqZip(value as string);
                break;
              case "reqMinSpace":
                setReqMinSpace(value as number);
                break;
              case "reqLocalityType":
                if (["Urban", "Rural", "Other"].includes(value as string)) {
                  setReqLocalityType(value as LocalityType);
                }
                break;
              case "reqExperience":
                if ([">10 Years", ">5 Years", ">2 Years", ">1 Year", "No Experience"].includes(value as string)) {
                  setReqExperience(value as Experience);
                }
                break;
              case "kidsAllowed":
                setKidsAllowed(value as boolean);
                break;
              default:
                break;
            }
          }}
        />

        {/* Pictures */}
        <UploadPictures
          previewImages={previewImages}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          triggerFileInput={triggerFileInput}
        />

        <p className="text-sm text-gray-600 mt-2 pl-5 flex items-center gap-2">
          <span className="text-red-500">*</span> {t("Verification.missingFieldsHint")}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-6 px-4">
          <Button icon={<Ban size={18} />} label={t("cancel")} color="error" soft type="button" onClick={() => router.back()} />
          <Button
            icon={<Upload size={18} />}
            label={isSubmitting ? t("Messages.creating") : t("submit")}
            color="primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
