import { NGOHours } from "@/app/types/ngo";
import { useState } from "react";
import InputField from "../../ui/validation/inputfield";
import Modal from "../../ui/modal";
import Button from "../../ui/button";
import { Trash2, Plus } from "lucide-react";

const allWeekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export function EditHoursModal({
  isOpen,
  onClose,
  value,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  value: NGOHours[];
  onSave: (updated: NGOHours[]) => void;
}) {
  const [localHours, setLocalHours] = useState<NGOHours[]>(value || []);

  const updateHour = (index: number, field: keyof NGOHours, val: string) => {
    const updated = [...localHours];
    updated[index][field] = val;
    setLocalHours(updated);
  };

  const removeDay = (weekday: string) => {
    setLocalHours((prev) => prev.filter((h) => h.weekday !== weekday));
  };

  const addDay = () => {
    const remainingDays = allWeekdays.filter(
      (d) => !localHours.find((h) => h.weekday === d)
    );
    if (remainingDays.length === 0) return;
    setLocalHours([
      ...localHours,
      { weekday: remainingDays[0], start: "", end: "" },
    ]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Opening Hours">
      <div className="space-y-4">
        {localHours.map((hour, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
            <span className="font-medium">{hour.weekday}</span>
            <InputField
              placeholder="From"
              type="time"
              value={hour.start}
              onChange={(e) => updateHour(i, "start", e.target.value)}
            />
            <InputField
              placeholder="To"
              type="time"
              value={hour.end}
              onChange={(e) => updateHour(i, "end", e.target.value)}
            />
            <Button
              icon={<Trash2 className="w-4 h-4" />}
              size="sm"
              color="error"
              soft
              onClick={() => removeDay(hour.weekday)}
            />
          </div>
        ))}

        {/* Add Day Button */}
        {localHours.length < 7 && (
          <div className="flex justify-start">
            <Button
              icon={<Plus className="w-4 h-4" />}
              label="Add Day"
              size="sm"
              onClick={addDay}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            label="Okay"
            color="primary"
            onClick={() => {
              onSave(localHours);
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
