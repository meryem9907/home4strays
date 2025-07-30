import {
  Banknote,
  Home,
  MapPin,
  PersonStanding,
} from "lucide-react";
import Badge from "../../ui/badge";
import { DaisyUIColor } from "@/app/types/daisyui";
import { useTranslations } from "next-intl";
import { Caretaker } from "@/app/types/backend/caretaker";

interface Props {
  caretakerData: Caretaker;
}

export default function SummaryCards({ caretakerData }: Props) {
  const t = useTranslations("CaretakerProfile.SummaryCards");

  const data = [
    {
      title: caretakerData.cityName,
      subtitle: t("location"),
      icon: MapPin,
      badge: caretakerData.localityType,
      color: "primary" as DaisyUIColor,
    },
    {
      title: t("sqm", { value: caretakerData.space }),
      subtitle: caretakerData.residence,
      icon: Home,
      badge: `${caretakerData.floor}. ${t("floor")}`,
      color: "primary" as DaisyUIColor,
    },
    {
      title: caretakerData.numberKids.toString(),
      subtitle: t("kids"),
      icon: PersonStanding,
      badge: caretakerData.numberKids > 0 ? t("kidsPresent") : t("kidsMissing"),
      color: caretakerData.numberKids > 0 ? "success" : "error",
    },
    {
      title: t("financialAssistance"),
      subtitle: caretakerData.financialAssistance ? t("financialAssistanceNeeded") : t("noFinancialAssistanceNeeded"),
      icon: Banknote,
      badge: caretakerData.financialAssistance ? t("financialAssistanceNeeded") : t("noFinancialAssistanceNeeded"),
      color: caretakerData.financialAssistance ? "success" : "error",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {data.map((item, index) => {
        const Icon = item.icon;
        const colorClasses = {
          success: "bg-success/10 text-success",
          error: "bg-error/10 text-error",
          primary: "bg-primary/10 text-primary",
        }[item.color];

        return (
          <div
            key={index}
            className="bg-base-100 rounded-xl shadow-lg p-6 border border-neutral"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${colorClasses}`}>
                <Icon className="w-6 h-6" />
              </div>
              <Badge
                label={item.badge}
                color={item.color as DaisyUIColor}
                rounded
                soft
              />
            </div>
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p>{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
