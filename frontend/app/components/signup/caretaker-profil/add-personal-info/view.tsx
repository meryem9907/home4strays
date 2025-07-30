import React, { useState, useEffect, JSX } from "react";
import Button from "@/app/components/ui/button";
import PersonalInfo from "./PersonalInfo";
import LivingSituation from "./LivingSituation";
import ExperienceSection from "./Experience";
import CTHours from "./CTHours";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { CareTime, initialSchedule } from "@/app/components/ui/schedule";
import { useAuth } from "@/contexts/AuthContext";

// Types
interface FormData {
  // Personal Information
  profileImage: File | string | null;
  birthdate: string;
  phone?: string;
  kids: string;
  maritalStatus: string;
  employmentType: string;
  financialSupport: boolean;

  // Living Situation
  country: string;
  zip: string;
  city: string;
  street: string;
  houseNumber: string;
  livingSituation: string;
  floor: string;
  area: string;
  residence: string;
  garden: boolean;
  localityType: string;

  // Experience
  experience: string;
  alreadyAdopted: boolean;
  vacationCare: boolean;

  // Care Times
  careSchedule: Record<string, CareTime>;
}
export interface CaretakerProfileError {
  // Personal Information
  birthdate: string;
  kids: string;
  maritalStatus: string;
  employmentType: string;

  // Living Situation
  country: string;
  zip: string;
  city: string;
  street: string;
  houseNumber: string;
  livingSituation: string;
  floor: string;
  area: string;
  residence: string;
  localityType: string;

  // Experience
  experience: string;
}

export default function CaretakerForm(): JSX.Element {
  const t = useTranslations("CreateCaretakerProfile.Form");
  const locale = useLocale();
  const { token } = useAuth();

  // State for enum options
  const [maritalStatusOptions, setMaritalStatusOptions] = useState<string[]>(
    []
  );
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<string[]>(
    []
  );
  const [maritalStatusMapping, setMaritalStatusMapping] = useState<
    Record<string, string>
  >({});
  const [employmentMapping, setEmploymentMapping] = useState<
    Record<string, string>
  >({});

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    profileImage: null,
    birthdate: "",
    phone: "",
    kids: "",
    maritalStatus: "",
    employmentType: "",
    financialSupport: false,
    localityType: "",

    // Living Situation
    country: "",
    zip: "",
    city: "",
    street: "",
    houseNumber: "",
    livingSituation: "",
    floor: "",
    area: "",
    residence: "",
    garden: false,

    // Experience
    experience: "",
    alreadyAdopted: false,
    vacationCare: false,

    // Care Times
    careSchedule: initialSchedule,
  });

  const [errors, setErrors] = useState<CaretakerProfileError>({
    birthdate: "",
    kids: "",
    maritalStatus: "",
    employmentType: "",
    localityType: "",
    country: "",
    zip: "",
    city: "",
    street: "",
    houseNumber: "",
    livingSituation: "",
    floor: "",
    area: "",
    residence: "",
    experience: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for select fields -> Backend
  const livingSituationOptions: string[] = ["Rented", "Paid", "Other"];
  const ownershipOptions: string[] = ["House", "Flat", "Other"];
  const experienceOptions: string[] = [
    "No Experience",
    ">1 Year",
    ">2 Years",
    ">5 Years",
    ">10 Years",
  ];

  const localityTypeOptions: string[] = ["Rural", "Urban", "Other"];

  // Fetch enum options from backend
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        // Fetch marital status options
        const [maritalTranslatedResponse, maritalEnglishResponse] =
          await Promise.all([
            fetch(`/api/enums/marital-status?lang=${locale}`),
            fetch(`/api/enums/marital-status?lang=en`),
          ]);

        if (maritalTranslatedResponse.ok && maritalEnglishResponse.ok) {
          const maritalTranslatedData = await maritalTranslatedResponse.json();
          const maritalEnglishData = await maritalEnglishResponse.json();

          setMaritalStatusOptions(maritalTranslatedData || []);

          const maritalMapping: Record<string, string> = {};
          const maritalReverseMapping: Record<string, string> = {};

          maritalEnglishData.forEach((englishValue: string, index: number) => {
            const translatedValue = maritalTranslatedData[index];
            maritalMapping[englishValue] = translatedValue;
            maritalReverseMapping[translatedValue] = englishValue;
          });

          setMaritalStatusMapping({
            ...maritalMapping,
            ...maritalReverseMapping,
          });
        }

        // Fetch employment type options
        const [employmentTranslatedResponse, employmentEnglishResponse] =
          await Promise.all([
            fetch(`/api/enums/employment?lang=${locale}`),
            fetch(`/api/enums/employment?lang=en`),
          ]);

        if (employmentTranslatedResponse.ok && employmentEnglishResponse.ok) {
          const employmentTranslatedData =
            await employmentTranslatedResponse.json();
          const employmentEnglishData = await employmentEnglishResponse.json();

          setEmploymentTypeOptions(employmentTranslatedData || []);

          const employmentMappingObj: Record<string, string> = {};
          const employmentReverseMapping: Record<string, string> = {};

          employmentEnglishData.forEach(
            (englishValue: string, index: number) => {
              const translatedValue = employmentTranslatedData[index];
              employmentMappingObj[englishValue] = translatedValue;
              employmentReverseMapping[translatedValue] = englishValue;
            }
          );

          setEmploymentMapping({
            ...employmentMappingObj,
            ...employmentReverseMapping,
          });
        }
      } catch (error) {
        console.error("Error fetching enum options:", error);
        // Fallback to English options if fetch fails
        setMaritalStatusOptions(["Single", "Married", "Widowed", "Other"]);
        setEmploymentTypeOptions([
          "Employed",
          "Freelancer",
          "Self-employed",
          "Student",
          "Unemployed",
          "Other",
        ]);
      }
    };

    fetchEnums();
  }, [locale]);

  // Handle input changes
  const handleInputChange = <Data extends keyof FormData>(
    field: Data,
    value: FormData[Data] | undefined
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validation
    const requiredFields: (keyof CaretakerProfileError)[] = [
      "birthdate",
      "kids",
      "maritalStatus",
      "employmentType",
      "country",
      "zip",
      "city",
      "street",
      "houseNumber",
      "livingSituation",
      "floor",
      "area",
      "residence",
      "experience",
      "localityType",
    ];

    const newErrors: CaretakerProfileError = {
      birthdate: "",
      kids: "",
      maritalStatus: "",
      employmentType: "",
      country: "",
      zip: "",
      city: "",
      street: "",
      houseNumber: "",
      livingSituation: "",
      floor: "",
      area: "",
      residence: "",
      experience: "",
      localityType: "",
    };

    let hasError = false;

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && value.trim() === "") {
        newErrors[field] = "Dieses Feld darf nicht leer sein.";
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      const missingFields: string[] = [];
      if (newErrors.birthdate) missingFields.push(t("Validation.birthdate"));
      if (newErrors.kids) missingFields.push(t("Validation.kids"));
      if (newErrors.maritalStatus)
        missingFields.push(t("Validation.maritalStatus"));
      if (newErrors.employmentType)
        missingFields.push(t("Validation.employmentType"));
      if (newErrors.country) missingFields.push(t("Validation.country"));
      if (newErrors.zip) missingFields.push(t("Validation.zip"));
      if (newErrors.city) missingFields.push(t("Validation.city"));
      if (newErrors.street) missingFields.push(t("Validation.street"));
      if (newErrors.houseNumber)
        missingFields.push(t("Validation.houseNumber"));
      if (newErrors.livingSituation)
        missingFields.push(t("Validation.livingSituation"));
      if (newErrors.floor) missingFields.push(t("Validation.floor"));
      if (newErrors.area) missingFields.push(t("Validation.area"));
      if (newErrors.residence) missingFields.push(t("Validation.residence"));
      if (newErrors.experience) missingFields.push(t("Validation.experience"));
      if (newErrors.localityType)
        missingFields.push(t("Validation.localityType"));

      window.scrollTo({ top: 0, behavior: "smooth" });

      toast.error(
        `${t("Validation.missingFields")}: ${missingFields.join(", ")}`
      );
      return;
    }

    // Filter only available days for submission
    const availableDays = Object.entries(formData.careSchedule)
      .filter(([, schedule]) => schedule.available)
      .map(([day, schedule]) => ({
        day,
        from: schedule.from,
        to: schedule.to,
        allDay: schedule.allDay,
      }));

    // Convert translated values back to English for backend
    const englishMaritalStatus =
      maritalStatusMapping[formData.maritalStatus] || formData.maritalStatus;
    const englishEmploymentType =
      employmentMapping[formData.employmentType] || formData.employmentType;

    const submissionData = {
      // TODO: Bild noch hinzufügen
      phoneNumber: formData.phone,
      birthdate: formData.birthdate,
      numberKids: parseInt(formData.kids),
      maritalStatus: englishMaritalStatus,
      employmentType: englishEmploymentType,
      financialAssistance: formData.financialSupport,
      country: formData.country,
      zip: formData.zip,
      cityName: formData.city,
      streetName: formData.street,
      houseNumber: formData.houseNumber,
      tenure: formData.livingSituation,
      floor: parseInt(formData.floor),
      space: parseInt(formData.area),
      residence: formData.residence,
      garden: formData.garden,
      experience: formData.experience,
      previousAdoption: formData.alreadyAdopted,
      holidayCare: formData.vacationCare,
      localityType: formData.localityType,
      adoptionWillingness: true,
      ctHours: availableDays.map((day) => ({
        startTime: day.from,
        endTime: day.to,
        weekday: day.day.charAt(0).toUpperCase() + day.day.slice(1),
      })),
    };

    setIsSubmitting(true);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/caretaker`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "An unknown error occurred while parsing error response.",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Caretaker profile created successfully!");
      window.location.href = "/";
    } catch (err: unknown) {
      console.error("Failed to create caretaker profile:", err);
      if (err instanceof Error) {
        toast.error(
          err.message || "Failed to submit the form. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-body">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-8">
          <PersonalInfo
            formData={{
              birthdate: formData.birthdate,
              phone: formData.phone,
              kids: formData.kids,
              maritalStatus: formData.maritalStatus,
              employmentType: formData.employmentType,
              financialSupport: formData.financialSupport,
              profileImage: formData.profileImage,
            }}
            maritalStatusOptions={maritalStatusOptions}
            employmentTypeOptions={employmentTypeOptions}
            onInputChange={(field, value) =>
              handleInputChange(field as keyof FormData, value ?? null)
            }
            errors={errors}
          />

          <LivingSituation
            formData={{
              country: formData.country,
              zip: formData.zip,
              city: formData.city,
              street: formData.street,
              houseNumber: formData.houseNumber,
              livingSituation: formData.livingSituation,
              floor: formData.floor,
              area: formData.area,
              residence: formData.residence,
              garden: formData.garden,
              localityType: formData.localityType,
            }}
            livingSituationOptions={livingSituationOptions}
            ownershipOptions={ownershipOptions}
            localityTypeOptions={localityTypeOptions}
            onInputChange={(field, value) =>
              handleInputChange(field as keyof FormData, value)
            }
            errors={errors}
          />

          <ExperienceSection
            experience={formData.experience}
            alreadyAdopted={formData.alreadyAdopted}
            vacationCare={formData.vacationCare}
            experienceOptions={experienceOptions}
            onInputChange={(field, value) =>
              handleInputChange(field as keyof FormData, value)
            }
            errors={errors}
          />

          <CTHours
            careSchedule={formData.careSchedule}
            setCareSchedule={(updated) =>
              handleInputChange("careSchedule", updated)
            }
          />
        </div>

        <div className="mt-6 text-center">
          <Button
            label={t("submit")}
            color="secondary"
            fullwidth
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
