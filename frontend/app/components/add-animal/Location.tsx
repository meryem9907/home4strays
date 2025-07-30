import { Building2, Earth, Hash, Map, MapPin, Milestone } from "lucide-react";
import Box from "../ui/box";
import { AnimalFormErrors } from "@/app/[locale]/add-animal/page";
import { useTranslations } from "next-intl";
import InputField from "../ui/validation/inputfield";

interface Props {
  country: string;
  zip: string;
  city: string;
  street: string;
  houseNumber: string;
  error: AnimalFormErrors;
  onChange: (field: string, value: string) => void;
}

export default function LocationSection({
  country,
  zip,
  city,
  street,
  houseNumber,
  error,
  onChange,
}: Props) {

  const t = useTranslations("AddAnimal");

  return (
    <Box size="full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MapPin size={20} className="mr-2 text-secondary" />
        {t("Location.title")}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <InputField
          icon={<Earth size={20} />}
          type="text"
          placeholder={t("country") + '*'}
          maxLength={255}
          value={country}
          error={error.country}
          onChange={(e) => onChange("country", e.target.value)}
        />

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <InputField
              icon={<Map size={20} />}
              type="text"
              placeholder={t("zip") + '*'}
              maxLength={10}
              value={zip}
              error={error.zip}
              onChange={(e) => onChange("zip", e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <InputField
              icon={<Building2 size={20} />}
              type="text"
              placeholder={t("city") + '*'}
              maxLength={255}
              value={city}
              error={error.city}
              onChange={(e) => onChange("city", e.target.value)}
            />
          </div>
        </div>

        <InputField
          icon={<Milestone size={20} />}
          type="text"
          placeholder={t("Location.street")}
          maxLength={255}
          value={street}
          onChange={(e) => onChange("street", e.target.value)}
        />

        <InputField
          icon={<Hash size={20} />}
          type="text"
          placeholder={t("Location.houseNumber")}
          maxLength={10}
          value={houseNumber}
          onChange={(e) => onChange("houseNumber", e.target.value)}
        />
      </div>
    </Box>
  );
}
