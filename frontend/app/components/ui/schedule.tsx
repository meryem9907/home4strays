'use client';

import React from 'react';
import Toggle from '@/app/components/ui/toogle';
import InputField from '@/app/components/ui/inputfield';
import Button from '@/app/components/ui/button';
import { useTranslations } from 'next-intl';

export interface CareTime {
  from: string;
  to: string;
  allDay: boolean;
  available: boolean;
}

export const initialSchedule: Record<string, CareTime> = {
  monday: { from: '', to: '', allDay: false, available: false },
  tuesday: { from: '', to: '', allDay: false, available: false },
  wednesday: { from: '', to: '', allDay: false, available: false },
  thursday: { from: '', to: '', allDay: false, available: false },
  friday: { from: '', to: '', allDay: false, available: false },
  saturday: { from: '', to: '', allDay: false, available: false },
  sunday: { from: '', to: '', allDay: false, available: false },
};

interface WeekDay {
  key: string;
  label: string;
}

interface ScheduleEditorProps {
  schedule: Record<string, CareTime>;
  setSchedule: (newSchedule: Record<string, CareTime>) => void;
  allDayNewLine?: boolean;
}

export default function ScheduleEditor({
  schedule,
  setSchedule,
  allDayNewLine = false,
}: ScheduleEditorProps) {
  const t = useTranslations('Schedule');

  const weekdays: WeekDay[] = [
    { key: 'monday', label: t('monday') },
    { key: 'tuesday', label: t('tuesday') },
    { key: 'wednesday', label: t('wednesday') },
    { key: 'thursday', label: t('thursday') },
    { key: 'friday', label: t('friday') },
    { key: 'saturday', label: t('saturday') },
    { key: 'sunday', label: t('sunday') },
  ];

  const updateDay = <K extends keyof CareTime>(
    day: string,
    field: K,
    value: CareTime[K]
  ) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    });
  };

  const toggleAvailability = (day: string, available: boolean) => {
    const updated: CareTime = available
      ? {
          ...schedule[day],
          available: true,
          from: schedule[day].from || '08:00',
          to: schedule[day].to || '18:00',
        }
      : { from: '', to: '', allDay: false, available: false };

    setSchedule({
      ...schedule,
      [day]: updated,
    });
  };

  const toggleAllDay = (day: string, checked: boolean) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        allDay: checked,
        from: checked ? '00:00' : schedule[day].from,
        to: checked ? '23:59' : schedule[day].to,
      },
    });
  };

  const setQuickDays = (days: string[], from: string, to: string) => {
    const updated = { ...schedule };
    days.forEach((day) => {
      updated[day] = {
        from,
        to,
        allDay: false,
        available: true,
      };
    });
    setSchedule(updated);
  };

  const clearAll = () => {
    const cleared: Record<string, CareTime> = {};
    weekdays.forEach((day) => {
      cleared[day.key] = {
        from: '',
        to: '',
        allDay: false,
        available: false,
      };
    });
    setSchedule(cleared);
  };

  return (
    <>
      <div className="mt-6">
        <p className="text-sm text-base-content/70 mb-3">{t('quickSelectDays')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          label={t('setWorkdays')}
          color="primary"
          size="sm"
          onClick={() =>
            setQuickDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], '08:00', '18:00')
          }
        />
        <Button
          type="button"
          label={t('setWeekend')}
          color="primary"
          size="sm"
          onClick={() => setQuickDays(['saturday', 'sunday'], '09:00', '17:00')}
        />
        <Button
          type="button"
          label={t('setAllDays')}
          color="primary"
          size="sm"
          onClick={() =>
            setQuickDays(
              weekdays.map((d) => d.key),
              '08:00',
              '18:00'
            )
          }
        />
        <Button
          type="button"
          label={t('clearAll')}
          color="error"
          size="sm"
          onClick={clearAll}
        />
      </div>
      <div className="space-y-2 mt-6">
        {weekdays.map((day) => {
          const sched = schedule[day.key];
          return (
            <div
              key={day.key}
              className={`grid gap-4 p-3 rounded-md transition-all ${
                sched.available ? 'bg-accent/5' : 'bg-neutral'
                } md:grid-cols-[auto_1fr] md:items-center
                border-t border-t-base-200
                `}
            >
              <div className="flex items-center justify-between gap-3 w-full sm:w-32">
                <div className="space-y-4">
                  <Toggle
                    text={day.label}
                    value={sched.available}
                    onChange={(val) => toggleAvailability(day.key, val)}
                  />
                  { allDayNewLine && sched.available && (
                    <div className="flex-shrink-0 hidden md:block">
                      <Toggle
                        text={t('allDay')}
                        value={sched.allDay}
                        onChange={(val) => toggleAllDay(day.key, val)}
                      />
                    </div>
                  )}
                </div>
                { sched.available && (
                  <div className="md:hidden">
                    <Toggle
                      text={t('allDay')}
                      value={sched.allDay}
                      onChange={(val) => toggleAllDay(day.key, val)}
                    />
                  </div>
                )}
              </div>

              {sched.available && (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center w-full">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 w-full sm:w-auto">
                    <div className="w-full max-w-[8rem]">
                      <InputField
                        name={`${day.key}_from`}
                        type="time"
                        value={sched.from}
                        onChange={(e) =>
                          updateDay(day.key, 'from', e.target.value)
                        }
                        disabled={sched.allDay}
                      />
                    </div>
                    <span className="text-base-content/60 font-medium">
                      {t('to')}
                    </span>
                    <div className="w-full max-w-[8rem]">
                      <InputField
                        name={`${day.key}_to`}
                        type="time"
                        value={sched.to}
                        onChange={(e) =>
                          updateDay(day.key, 'to', e.target.value)
                        }
                        disabled={sched.allDay}
                      />
                    </div>
                  </div>

                  { !allDayNewLine && (
                    <div className="flex-shrink-0 hidden md:block">
                      <Toggle
                        text={t('allDay')}
                        value={sched.allDay}
                        onChange={(val) => toggleAllDay(day.key, val)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
