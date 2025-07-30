import React from 'react';
import { PawPrint } from 'lucide-react';
import IconHeading from '@/app/components/ui/icon-heading';
import Select from '@/app/components/ui/select';
import Toggle from '@/app/components/ui/toogle';
import { useTranslations } from 'next-intl';
import { CaretakerProfileError } from './view';

interface ExperienceSectionProps {
  experience: string;
  alreadyAdopted: boolean;
  vacationCare: boolean;
  experienceOptions: string[];
  onInputChange: <K extends 'experience' | 'alreadyAdopted' | 'vacationCare'>(
    field: K,
    value: K extends 'experience' ? string : boolean
  ) => void;
  errors: CaretakerProfileError;
}

export default function ExperienceSection({
  experience,
  alreadyAdopted,
  vacationCare,
  experienceOptions,
  onInputChange,
  errors,
}: ExperienceSectionProps) {

  const t = useTranslations("CreateCaretakerProfile.ExperienceSection");

  return (
    <div>
      <IconHeading icon={<PawPrint />} label={t("heading")} />
      <div className="flex flex-col md:flex-row gap-4 md:items-center mt-6">
        <div className="flex-1">
          <Select 
            label={t("label") + "*"} 
            options={experienceOptions} 
            value={experience}
            onChange={(e) => onInputChange('experience', e)}
            error={errors.experience}
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Toggle 
            text={t("alreadyAdopted") + "*"} 
            value={alreadyAdopted}
            onChange={(e) => onInputChange('alreadyAdopted', e)}
          />
          <Toggle 
            text={t("vacationCare") + "*"} 
            value={vacationCare}
            onChange={(e) => onInputChange('vacationCare', e)}
          />
        </div>
      </div>
    </div>
  );
}
