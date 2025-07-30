import React, {useState, useEffect} from "react";
import {ListChecks, MapPin, Ruler} from "lucide-react";
import Box from "@/app/components/ui/box";
import Select from "@/app/components/ui/select";
import Toggle from "@/app/components/ui/toogle";
import {useTranslations, useLocale} from "next-intl";
import {Experience, LocalityType} from "../../types/addAnimal";
import InputField from "../ui/validation/inputfield";
import {AnimalFormErrors} from "@/app/[locale]/add-animal/page";

interface Props {
  reqZip: string;
  reqMinSpace: number | "";
  reqLocalityType: LocalityType;
  reqExperience: Experience | "";
  kidsAllowed: boolean;
  error: AnimalFormErrors;
  onChange: (field: string, value: string | number | boolean) => void;
}

export default function RequirementsSection({reqZip, reqMinSpace, reqLocalityType, reqExperience, kidsAllowed, error, onChange}: Props) {
  const t = useTranslations("AddAnimal");
  const locale = useLocale();

  const [availableLocalityTypes, setAvailableLocalityTypes] = useState<string[]>([]);
  const [availableExperiences, setAvailableExperiences] = useState<string[]>([]);
  const [loadingLocalityTypes, setLoadingLocalityTypes] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  const [localityTypeMapping, setLocalityTypeMapping] = useState<Record<string, string>>({});
  const [experienceMapping, setExperienceMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLocalityTypes = async () => {
      try {
        const [translatedResponse, englishResponse] = await Promise.all([
          fetch(`/api/enums/locality-type?lang=${locale}`),
          fetch(`/api/enums/locality-type?lang=en`),
        ]);

        if (translatedResponse.ok && englishResponse.ok) {
          const translatedData = await translatedResponse.json();
          const englishData = await englishResponse.json();

          setAvailableLocalityTypes(translatedData || []);

          const mapping: Record<string, string> = {};
          const reverseMapping: Record<string, string> = {};

          englishData.forEach((englishValue: string, index: number) => {
            const translatedValue = translatedData[index];
            mapping[englishValue] = translatedValue;
            reverseMapping[translatedValue] = englishValue;
          });

          setLocalityTypeMapping({...mapping, ...reverseMapping});
        } else {
          console.error("Failed to fetch locality types");
        }
      } catch (error) {
        console.error("Error fetching locality types:", error);
      } finally {
        setLoadingLocalityTypes(false);
      }
    };

    fetchLocalityTypes();
  }, [locale]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const [translatedResponse, englishResponse] = await Promise.all([
          fetch(`/api/enums/experience?lang=${locale}`),
          fetch(`/api/enums/experience?lang=en`),
        ]);

        if (translatedResponse.ok && englishResponse.ok) {
          const translatedData = await translatedResponse.json();
          const englishData = await englishResponse.json();

          setAvailableExperiences(translatedData || []);

          const mapping: Record<string, string> = {};
          const reverseMapping: Record<string, string> = {};

          englishData.forEach((englishValue: string, index: number) => {
            const translatedValue = translatedData[index];
            mapping[englishValue] = translatedValue;
            reverseMapping[translatedValue] = englishValue;
          });

          setExperienceMapping({...mapping, ...reverseMapping});
        } else {
          console.error("Failed to fetch experiences");
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoadingExperiences(false);
      }
    };

    fetchExperiences();
  }, [locale]);

  const handleLocalityTypeChange = (translatedValue: string) => {
    const englishValue = localityTypeMapping[translatedValue] || translatedValue;
    onChange("reqLocalityType", englishValue);
  };

  const handleExperienceChange = (translatedValue: string) => {
    const englishValue = experienceMapping[translatedValue] || translatedValue;
    onChange("reqExperience", englishValue);
  };

  const getDisplayValue = (englishValue: string, mapping: Record<string, string>) => {
    return mapping[englishValue] || englishValue;
  };

  return (
    <Box size="full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ListChecks size={20} className="mr-2 text-secondary" />
        {t("Requirements.title")}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          icon={<MapPin size={20} />}
          type="text"
          placeholder={`${t("zip")}` + "*"}
          value={reqZip}
          onChange={(val) => onChange("reqZip", val.target.value)}
          error={error.reqZip}
        />

        <Select
          label={loadingLocalityTypes ? "Loading locality types..." : t("Requirements.localityType") + "*"}
          options={availableLocalityTypes}
          value={getDisplayValue(reqLocalityType, localityTypeMapping)}
          onChange={handleLocalityTypeChange}
          disabled={loadingLocalityTypes}
          error={error.reqLocalityType}
        />

        <InputField
          icon={<Ruler size={20} />}
          type="number"
          placeholder={`${t("Requirements.minSpace") || "Minimum Space (m²)"}` + "*"}
          suffix="m²"
          value={reqMinSpace.toString()}
          onChange={(e) => onChange("reqMinSpace", e.target.value)}
          error={error.reqMinSpace}
        />

        <Select
          label={loadingExperiences ? "Loading experiences..." : t("Requirements.experience") + "*"}
          options={availableExperiences}
          value={getDisplayValue(reqExperience, experienceMapping)}
          onChange={handleExperienceChange}
          disabled={loadingExperiences}
          error={error.reqExperience}
        />

        <Toggle
          text={t("Requirements.kidsAllowed") + "*" || "Kids Allowed?*"}
          value={kidsAllowed}
          onChange={(val) => onChange("kidsAllowed", val)}
          defaultTrue
        />
      </div>
    </Box>
  );
}
