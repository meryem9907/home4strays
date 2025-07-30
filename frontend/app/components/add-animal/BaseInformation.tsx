import {useState, useEffect} from "react";
import {PawPrint} from "lucide-react";
import Box from "../ui/box";
import InputField from "../ui/validation/inputfield";
import Select from "../ui/select";
import {useTranslations, useLocale} from "next-intl";
import {AnimalFormErrors} from "../../[locale]/add-animal/page";

interface BaseInformationProps {
  name: string;
  birthDate: string;
  species: string;
  breed: string;
  weight: number | "";
  gender: "Male" | "Female" | "Unknown" | "";
  error: AnimalFormErrors;
  onChange: (field: string, value: string | number) => void;
}

export default function BaseInformation({name, birthDate, species, breed, weight, gender, error, onChange}: BaseInformationProps) {
  const t = useTranslations("AddAnimal");
  const locale = useLocale();

  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
  const [availableGenders, setAvailableGenders] = useState<string[]>([]);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const [loadingGenders, setLoadingGenders] = useState(true);
  const [genderMapping, setGenderMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch("/api/species");
        if (response.ok) {
          const data = await response.json();
          setAvailableSpecies(data || []);
        } else {
          console.error("Failed to fetch species");
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setLoadingSpecies(false);
      }
    };

    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const [translatedResponse, englishResponse] = await Promise.all([
          fetch(`/api/enums/gender?lang=${locale}`),
          fetch(`/api/enums/gender?lang=en`),
        ]);

        if (translatedResponse.ok && englishResponse.ok) {
          const translatedData = await translatedResponse.json();
          const englishData = await englishResponse.json();

          setAvailableGenders(translatedData || []);

          const mapping: Record<string, string> = {};
          const reverseMapping: Record<string, string> = {};

          englishData.forEach((englishValue: string, index: number) => {
            const translatedValue = translatedData[index];
            mapping[englishValue] = translatedValue;
            reverseMapping[translatedValue] = englishValue;
          });

          setGenderMapping({...mapping, ...reverseMapping});
        } else {
          console.error("Failed to fetch genders");
        }
      } catch (error) {
        console.error("Error fetching genders:", error);
      } finally {
        setLoadingGenders(false);
      }
    };

    fetchGenders();
  }, [locale]);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (!species) {
        setAvailableBreeds([]);
        return;
      }

      setLoadingBreeds(true);
      try {
        const response = await fetch(`/api/breeds?species=${encodeURIComponent(species)}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableBreeds(data || []);
        } else {
          console.error("Failed to fetch breeds for species:", species);
          setAvailableBreeds([]);
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
        setAvailableBreeds([]);
      } finally {
        setLoadingBreeds(false);
      }
    };

    fetchBreeds();
  }, [species]);

  useEffect(() => {
    if (breed && !availableBreeds.includes(breed)) {
      onChange("breed", "");
    }
  }, [availableBreeds, breed, onChange]);

  const handleGenderChange = (translatedValue: string) => {
    const englishValue = genderMapping[translatedValue] || translatedValue;
    onChange("gender", englishValue);
  };

  const getDisplayValue = (englishValue: string, mapping: Record<string, string>) => {
    return mapping[englishValue] || englishValue;
  };

  return (
    <Box size="full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <PawPrint size={20} className="mr-2 text-secondary" />
        {t("BaseInformation.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          type="text"
          placeholder={t("BaseInformation.name") + " *"}
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("name", e.target.value)}
          error={error.name}
        />

        <InputField
          type="date"
          placeholder={t("BaseInformation.birthDate") + " *"}
          value={birthDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("birthDate", e.target.value)}
          error={error.birthDate}
        />

        <Select
          label={loadingSpecies ? t("BaseInformation.loadingSpecies") : t("BaseInformation.species") + " *"}
          value={species}
          onChange={(value) => onChange("species", value)}
          options={availableSpecies}
          disabled={loadingSpecies}
          error={error.species}
        />

        <Select
          label={t("BaseInformation.breed") + " *"}
          value={breed}
          onChange={(value) => onChange("breed", value)}
          options={availableBreeds}
          disabled={!species || loadingBreeds}
          disabledInfo={!species ? t("BaseInformation.selectSpeciesFirst") : t("BaseInformation.loadingBreeds")}
        />

        <InputField
          type="number"
          placeholder={t("BaseInformation.weight") + " * (kg)"}
          value={weight.toString()}
          min={0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("weight", e.target.value ? parseFloat(e.target.value) : "")}
          error={error.weight}
        />

        <Select
          label={loadingGenders ? "Loading genders..." : t("BaseInformation.gender") + " *"}
          value={getDisplayValue(gender, genderMapping)}
          onChange={handleGenderChange}
          options={availableGenders}
          disabled={loadingGenders}
          error={error.gender}
        />
      </div>
    </Box>
  );
}
