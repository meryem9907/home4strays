import { Heart } from "lucide-react";
import React from "react";
import IconHeading from "../../ui/icon-heading";
import { NGO } from "../../../types/ngo";
import TextArea from "../../ui/textarea";

interface MissionProps {
  formData: Pick<NGO, 'mission'>;
  isEditing: boolean;
  handleChange: (
    field: keyof NGO,
    value: string
  ) => void;
}

export const Mission = ({ formData, isEditing, handleChange }: MissionProps) => {
  return (
    <div className="card bg-base-100 shadow-xl border border-neutral flex-grow">
      <div className="card-body p-5 md:p-6">

        <IconHeading icon={<Heart className="h-5 w-5" />} label="Mission &amp; Description" />

        <div className="py-4 h-full flex flex-col">
          {isEditing ? (
            <TextArea
              value={formData.mission}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('mission', e.target.value)}
              rows={5}
              placeholder="Enter your organization's mission and description"
            />
          ) : (
            <p className="text-base-content/80 leading-relaxed flex-grow">
              {formData.mission || "No mission statement available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
