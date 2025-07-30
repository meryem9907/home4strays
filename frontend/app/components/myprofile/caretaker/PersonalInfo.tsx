import { Cake, User } from "lucide-react";
import IconHeading from "../../ui/icon-heading";
import { useTranslations, useLocale } from "next-intl";
import InputField from "../../ui/inputfield";
import Select from "../../ui/select";
import Toggle from "../../ui/toogle";
import { Caretaker } from "@/app/types/backend/caretaker";
import { useState, useEffect } from "react";

interface Props {
  caretakerData: Caretaker;
  age: number;
  isEditing: boolean;
  onInputChange: <K extends keyof Caretaker>(
    key: K,
    value: Caretaker[K]
  ) => void;
}

export default function PersonalInfo({
  caretakerData,
  age,
  isEditing,
  onInputChange,
}: Props) {
  const t = useTranslations("CaretakerProfile.PersonalInfo");
  const tEdit = useTranslations("CreateCaretakerProfile.PersonalInfo");
  const locale = useLocale();

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

  const handleMaritalStatusChange = (translatedValue: string) => {
    const englishValue =
      maritalStatusMapping[translatedValue] || translatedValue;
    onInputChange("maritalStatus", englishValue);
  };

  const handleEmploymentTypeChange = (translatedValue: string) => {
    const englishValue = employmentMapping[translatedValue] || translatedValue;
    onInputChange("employmentType", englishValue);
  };

  // Get translated value for display
  const getTranslatedMaritalStatus = () => {
    return (
      maritalStatusMapping[caretakerData.maritalStatus] ||
      caretakerData.maritalStatus
    );
  };

  const getTranslatedEmploymentType = () => {
    return (
      employmentMapping[caretakerData.employmentType] ||
      caretakerData.employmentType
    );
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-neutral">
      <IconHeading icon={<User />} label={t("heading")} />

      {isEditing ? (
        <div className="pt-4 space-y-4">
          <InputField
            icon={<Cake size={20} />}
            type="date"
            placeholder={tEdit("birthdate") + "*"}
            value={
              caretakerData.birthdate
                ? caretakerData.birthdate.split("T")[0]
                : ""
            }
            onChange={(e) => onInputChange("birthdate", e.target.value)}
          />
          <Select
            label={tEdit("maritalStatus") + "*"}
            options={maritalStatusOptions}
            value={getTranslatedMaritalStatus()}
            onChange={handleMaritalStatusChange}
          />
          <InputField
            name="kids"
            type="number"
            placeholder={tEdit("kids") + "*"}
            min={0}
            value={caretakerData.numberKids.toString()}
            onChange={(e) => {
              const numValue = parseInt(e.target.value, 10);
              onInputChange("numberKids", isNaN(numValue) ? 0 : numValue);
            }}
          />
          <Select
            label={tEdit("employmentType") + "*"}
            options={employmentTypeOptions}
            value={getTranslatedEmploymentType()}
            onChange={handleEmploymentTypeChange}
          />

          <Toggle
            text={tEdit("financialSupport") + "*"}
            value={caretakerData.financialAssistance}
            onChange={(checked) =>
              onInputChange("financialAssistance", checked)
            }
          />
        </div>
      ) : (
        <div className="pt-4 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">{t("age")}</span>
            <span className="font-medium">{t("ageYears", { value: age })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("maritalStatus")}</span>
            <span className="font-medium">{getTranslatedMaritalStatus()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("kids")}</span>
            <span className="font-medium">{caretakerData.numberKids}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("employment")}</span>
            <span className="font-medium">{getTranslatedEmploymentType()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("financialSupport")}</span>
            <span className="font-medium">
              {caretakerData.financialAssistance ? t("yes") : t("no")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
