import { Award, Calendar, Heart, PawPrint } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import IconHeading from "@/app/components/ui/icon-heading";
import Select from "../../ui/select";
import Toggle from "../../ui/toogle";
import { Caretaker } from "@/app/types/backend/caretaker";
import { useState, useEffect } from "react";

interface Props {
  caretakerData: Caretaker;
  isEditing: boolean;
  onInputChange?: <K extends keyof Caretaker>(
    key: K,
    value: Caretaker[K]
  ) => void;
}

export default function Experience({
  caretakerData,
  isEditing,
  onInputChange,
}: Props) {
  const t = useTranslations("CaretakerProfile.Experience");
  const tEdit = useTranslations("CreateCaretakerProfile.ExperienceSection");
  const locale = useLocale();

  const [experienceOptions, setExperienceOptions] = useState<string[]>([]);
  const [experienceMapping, setExperienceMapping] = useState<
    Record<string, string>
  >({});

  // Fetch experience options from backend
  useEffect(() => {
    const fetchExperienceOptions = async () => {
      try {
        const [translatedResponse, englishResponse] = await Promise.all([
          fetch(`/api/enums/experience?lang=${locale}`),
          fetch(`/api/enums/experience?lang=en`),
        ]);

        if (translatedResponse.ok && englishResponse.ok) {
          const translatedData = await translatedResponse.json();
          const englishData = await englishResponse.json();

          setExperienceOptions(translatedData || []);

          const mapping: Record<string, string> = {};
          const reverseMapping: Record<string, string> = {};

          englishData.forEach((englishValue: string, index: number) => {
            const translatedValue = translatedData[index];
            mapping[englishValue] = translatedValue;
            reverseMapping[translatedValue] = englishValue;
          });

          setExperienceMapping({
            ...mapping,
            ...reverseMapping,
          });
        }
      } catch (error) {
        console.error("Error fetching experience options:", error);
        // Fallback to basic options if fetch fails
        setExperienceOptions([
          "No experience",
          "< 1 year",
          "1-3 years",
          "> 3 years",
        ]);
      }
    };

    if (isEditing) {
      fetchExperienceOptions();
    }
  }, [locale, isEditing]);

  const handleExperienceChange = (translatedValue: string) => {
    const englishValue = experienceMapping[translatedValue] || translatedValue;
    onInputChange?.("experience", englishValue);
  };

  const getTranslatedExperience = () => {
    return (
      experienceMapping[caretakerData.experience] || caretakerData.experience
    );
  };

  function parseExperienceYears(experience: string): number {
    const match = experience.match(/> (\d+) years/);
    return match ? parseInt(match[1], 10) : 0;
  }

  const getExperienceColor = (experience: string) => {
    const years = parseExperienceYears(experience);
    if (years >= 5) return "bg-success/10 text-success";
    if (years > 0) return "bg-warning/10 text-warning";
    return "bg-error/10 text-error";
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-8 border border-neutral">
      <IconHeading icon={<PawPrint />} label={t("heading")} />

      {isEditing ? (
        <div>
          <div className="flex flex-col md:flex-row gap-4 md:items-center mt-6">
            <div className="flex-1">
              <Select
                label={tEdit("label")}
                options={experienceOptions}
                value={getTranslatedExperience()}
                onChange={handleExperienceChange}
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <Toggle
                text={tEdit("alreadyAdopted")}
                value={caretakerData.previousAdoption}
                onChange={(e) => onInputChange?.("previousAdoption", e)}
              />
              <Toggle
                text={tEdit("vacationCare")}
                value={caretakerData.holidayCare}
                onChange={(e) => onInputChange?.("holidayCare", e)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Erfahrungslevel */}
          <div className="text-center bg-neutral/30 p-6 rounded-xl border border-neutral">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getExperienceColor(
                caretakerData.experience
              )}`}
            >
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-2">{t("level")}</h3>
            <p>{getTranslatedExperience()}</p>
          </div>

          {/* Vorerfahrung */}
          <div className="text-center bg-neutral/30 p-6 rounded-xl border border-neutral">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                caretakerData.previousAdoption
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-2">{t("adoption")}</h3>
            <p>
              {caretakerData.previousAdoption
                ? t("adopted")
                : t("firstAdoption")}
            </p>
          </div>

          {/* Urlaubsbetreuung */}
          <div className="text-center bg-neutral/30 p-6 rounded-xl border border-neutral">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                caretakerData.holidayCare
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              }`}
            >
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-bold mb-2">{t("holiday")}</h3>
            <p>
              {caretakerData.holidayCare
                ? t("holidayAvailable")
                : t("holidayUnavailable")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
