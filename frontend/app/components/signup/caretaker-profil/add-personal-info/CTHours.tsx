// components/CTHours.tsx
import React from 'react';
import IconHeading from '@/app/components/ui/icon-heading';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ScheduleEditor from '@/app/components/ui/schedule';

interface CareTime {
  from: string;
  to: string;
  allDay: boolean;
  available: boolean;
}

interface CTHoursProps {
  careSchedule: Record<string, CareTime>;
  setCareSchedule: (updated: Record<string, CareTime>) => void;
}

export default function CTHours({
  careSchedule,
  setCareSchedule
}: CTHoursProps) {

  const t = useTranslations("CreateCaretakerProfile.CTHours");

  return (
    <>
      <IconHeading icon={<Calendar />} label={t("availableCareTimes")} />

      <ScheduleEditor
        schedule={careSchedule}
        setSchedule={setCareSchedule}
      />

    </>
  );
}
