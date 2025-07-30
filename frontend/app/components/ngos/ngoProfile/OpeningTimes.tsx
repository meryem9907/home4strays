import {useState} from "react";
import {Clock, ChevronDown, ChevronUp} from "lucide-react";
import IconHeading from "../../ui/icon-heading";

interface OpeningTimesProps {
  formData: {
    ngoHours?: NGOHours[];
  };
  isEditing: boolean;
  handleChange: (field: "ngoHours", value: NGOHours[]) => void;
}

export type NGOHours = {
  start: string;
  end: string;
  weekday: string;
};

const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const OpeningTimes = ({formData, isEditing, handleChange}: OpeningTimesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hours = formData.ngoHours || [];

  const sortedHours = [...hours].sort((a, b) => weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday));

  const formatTime = (time: string) => {
    if (!time) return time;
    return time.split(":").slice(0, 2).join(":");
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const addTimeSlot = () => {
    const newHours = [...hours, {weekday: "Monday", start: "09:00", end: "17:00"}];
    handleChange("ngoHours", newHours);
  };

  const updateTimeSlot = (index: number, field: keyof NGOHours, value: string) => {
    const newHours = [...hours];
    newHours[index] = {...newHours[index], [field]: value};
    handleChange("ngoHours", newHours);
  };

  const removeTimeSlot = (index: number) => {
    const newHours = hours.filter((_, i) => i !== index);
    handleChange("ngoHours", newHours);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 flex-grow">
      <div className="card-body p-5 md:p-6">
        <div className="flex justify-between items-center cursor-pointer border-b border-base-200 pb-3" onClick={toggleOpen}>
          <IconHeading icon={<Clock className="h-5 w-5" />} label="Opening Times" noBorder />
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>

        {isOpen && (
          <>
            {!isEditing ? (
              <div className="mt-4">
                {sortedHours.length > 0 ? (
                  <ul className="space-y-2">
                    {sortedHours.map((hour, index) => (
                      <li key={index} className="flex items-center">
                        <span className="font-medium w-28">{hour.weekday}:</span>
                        <span>
                          {formatTime(hour.start)} - {formatTime(hour.end)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No opening hours specified</p>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {hours.map((hour, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    <select
                      className="select select-bordered w-32"
                      value={hour.weekday}
                      onChange={(e) => updateTimeSlot(index, "weekday", e.target.value)}>
                      {weekdayOrder.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      className="input input-bordered w-28"
                      value={hour.start}
                      onChange={(e) => updateTimeSlot(index, "start", e.target.value)}
                    />

                    <span>-</span>

                    <input
                      type="time"
                      className="input input-bordered w-28"
                      value={hour.end}
                      onChange={(e) => updateTimeSlot(index, "end", e.target.value)}
                    />

                    <button type="button" className="btn btn-ghost btn-circle" onClick={() => removeTimeSlot(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                <button type="button" className="btn btn-outline btn-sm mt-2" onClick={addTimeSlot}>
                  Add Opening Hours
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
