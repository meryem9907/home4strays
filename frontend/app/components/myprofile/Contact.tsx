import { Mail, Phone } from "lucide-react";
import IconHeading from "../ui/icon-heading";
import { useTranslations } from "next-intl";
import InputField from "../ui/inputfield";
import { Caretaker } from "@/app/types/backend/caretaker";
import { NGOMember } from "@/app/types/backend/ngoMember";

type ChangeHandler<T> = <K extends keyof T>(field: K, value: T[K]) => void;

interface Props {
  data: Caretaker | NGOMember;
  isEditing?: boolean;
  handleChange: ChangeHandler<Caretaker | NGOMember>;
}

export default function Contact({ data, isEditing = false, handleChange }: Props) {
  const t = useTranslations("CaretakerProfile.Contact");

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-neutral">
      <IconHeading icon={<Phone />} label={t("heading")} />

      <div className="pt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-base-200 p-2 rounded-lg text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div>
              <div className="font-medium text-sm opacity-70">{t("emailLabel")}</div>
              <div className="font-medium">{data.email}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-base-200 p-2 rounded-lg text-primary">
            <Phone className="h-5 w-5" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <InputField 
                placeholder={t("phoneLabel")}
                type="tel" 
                value={data.phoneNumber || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phoneNumber', e.target.value)}
              />
            ) : (
              <div>
                <div className="font-medium text-sm opacity-70">{t("phoneLabel")}</div>
                <div className="font-medium">{data.phoneNumber==null ?"–": data.phoneNumber}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
