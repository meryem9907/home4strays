import { Cake, Phone, User } from "lucide-react";
import IconHeading from "@/app/components/ui/icon-heading";
import InputField from "@/app/components/ui/inputfield";
import Select from "@/app/components/ui/select";
import Toggle from "@/app/components/ui/toogle";
import { useTranslations } from "next-intl";
import { CaretakerProfileError } from "./view";
import ImageUpload from "@/app/components/ui/image-upload";

type PersonalInfoFieldMap = {
  birthdate: string;
  phone?: string;
  kids: string;
  maritalStatus: string;
  employmentType: string;
  financialSupport: boolean;
  profileImage: File | string | null;
};

interface PersonalInfoProps {
  formData: {
    birthdate: string;
    phone?: string;
    kids: string;
    maritalStatus: string;
    employmentType: string;
    financialSupport: boolean;
    profileImage: File | string | null;
  };
  maritalStatusOptions: string[];
  employmentTypeOptions: string[];
  onInputChange: <K extends keyof PersonalInfoFieldMap>(
    field: K,
    value: PersonalInfoFieldMap[K]
  ) => void;
  errors: CaretakerProfileError;
}

export default function PersonalInfo({
  formData,
  maritalStatusOptions,
  employmentTypeOptions,
  onInputChange,
  errors,
}: PersonalInfoProps) {
  const t = useTranslations("CreateCaretakerProfile.PersonalInfo");

  return (
    <div>
      <IconHeading icon={<User />} label={t("heading")} />
      <div className="flex flex-col lg:flex-row gap-4 mb-0 mt-6">
        <ImageUpload
          value={formData.profileImage}
          onChange={(val) => onInputChange("profileImage", val)}
          notBlurry
        />

        <div className="flex-1 space-y-4">
          {/* Zeile 1 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <InputField
              icon={<Cake size={20} />}
              name="birthdate"
              type="date"
              placeholder={t("birthdate") + "*"}
              value={formData.birthdate}
              onChange={(e) => onInputChange("birthdate", e.target.value)}
              error={errors.birthdate}
            />
            <div className="flex-1">
              <InputField
                icon={<Phone size={20} />}
                name="phone"
                type="text"
                placeholder={t("phone")}
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Zeile 2 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              label={t("maritalStatus") + "*"}
              options={maritalStatusOptions}
              value={formData.maritalStatus}
              onChange={(value) => onInputChange("maritalStatus", value)}
              error={errors.maritalStatus}
            />
            <Select
              label={t("employmentType") + "*"}
              options={employmentTypeOptions}
              value={formData.employmentType}
              onChange={(value) => onInputChange("employmentType", value)}
              error={errors.employmentType}
            />
          </div>

          {/* Zeile 3 */}
          <div className="md:flex justify-between items-center space-y-4 md:space-y-0 gap-2">
            <div className="md:w-1/3">
              <InputField
                name="kids"
                type="number"
                placeholder={t("kids") + "*"}
                min={0}
                value={formData.kids}
                onChange={(e) => onInputChange("kids", e.target.value)}
                error={errors.kids}
              />
            </div>
            <div className="flex-1">
              <Toggle
                text={t("financialSupport") + "*"}
                value={formData.financialSupport}
                onChange={(checked) =>
                  onInputChange("financialSupport", checked)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
