import { Calendar } from "lucide-react";
import IconHeading from "../ui/icon-heading";
import { useTranslations } from "next-intl";
import { weekdays } from "@/app/types/common";
import ScheduleEditor, { CareTime} from "../ui/schedule";

interface Props {
  isEditing?: boolean;
  schedule: Record<string, CareTime>;
  setSchedule: React.Dispatch<React.SetStateAction<Record<string, CareTime>>>;
}

export default function Hours({ 
  isEditing = false, 
  schedule,
  setSchedule
}: Props) {
  const t = useTranslations("Hours");
  
  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-neutral">
      <IconHeading icon={<Calendar />} label={t("caretakingHours")} />

      {isEditing && (
        <ScheduleEditor 
          schedule={schedule} 
          setSchedule={setSchedule}
          allDayNewLine 
        />
      )}

      {!isEditing && (
        <div className="pt-4 space-y-4">
          {weekdays.map((day) => {
            const time = schedule[day];
            const from = time?.from;
            const to = time?.to;

            return (
              <div key={day} className="flex justify-between">
                <span className="text-gray-500">{t(`weekdays.${day}`)}</span>
                <span className="font-medium">
                  {from && to ? `${from.slice(0, 5)} – ${to.slice(0, 5)}` : "-"}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
