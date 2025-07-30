import React from 'react';
import { Building2, Earth, Hash, Home, Map, Milestone } from 'lucide-react';
import IconHeading from '@/app/components/ui/icon-heading';
import InputField from '@/app/components/ui/inputfield';
import Select from '@/app/components/ui/select';
import Toggle from '@/app/components/ui/toogle';
import { useTranslations } from 'next-intl';
import { CaretakerProfileError } from './view';

type LivingSituationFieldMap = {
  country: string;
  zip: string;
  city: string;
  street: string;
  houseNumber: string;
  livingSituation: string;
  floor: string;
  area: string;
  residence: string;
  garden: boolean;
  localityType: string;
};

interface LivingSituationProps {
  formData: {
    country: string;
    zip: string;
    city: string;
    street: string;
    houseNumber: string;
    livingSituation: string;
    floor: string;
    area: string;
    residence: string;
    garden: boolean;
    localityType: string;
  };
  livingSituationOptions: string[];
  ownershipOptions: string[];
  localityTypeOptions: string[];
  onInputChange: <K extends keyof LivingSituationFieldMap>(
    field: K,
    value: LivingSituationFieldMap[K]
  ) => void;
  errors: CaretakerProfileError;
}

export default function LivingSituation({
  formData,
  livingSituationOptions,
  ownershipOptions,
  localityTypeOptions,
  onInputChange,
  errors,
}: LivingSituationProps) {

  const t = useTranslations("CreateCaretakerProfile.LivingSituation");

  return (
    <>
      <IconHeading icon={<Home />} label={t("heading")} />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <InputField
          icon={<Earth size={20} />}
          type="text"
          placeholder={t("country") + "*"}
          maxLength={255}
          value={formData.country}
          onChange={(e) => onInputChange('country', e.target.value)}
          error={errors.country}
        />

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <InputField
              icon={<Map size={20} />}
              type="text"
              placeholder={t("zip") + "*"}
              maxLength={10}
              value={formData.zip}
              onChange={(e) => onInputChange('zip', e.target.value)}
              error={errors.zip}
            />
          </div>
          <div className="col-span-3">
            <InputField
              icon={<Building2 size={20} />}
              type="text"
              placeholder={t("city") + "*"}
              maxLength={255}
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              error={errors.city}
            />
          </div>
        </div>

        <InputField
          icon={<Milestone size={20} />}
          type="text"
          placeholder={t("street") + "*"}
          maxLength={255}
          value={formData.street}
          onChange={(e) => onInputChange('street', e.target.value)}
          error={errors.street}
        />

        <InputField
          icon={<Hash size={20} />}
          type="text"
          placeholder={t("houseNumber") + "*"}
          maxLength={10}
          value={formData.houseNumber}
          onChange={(e) => onInputChange('houseNumber', e.target.value)}
          error={errors.houseNumber}
        />

        <Select
          label={t("livingSituation") + "*"}
          options={livingSituationOptions}
          value={formData.livingSituation}
          onChange={(e) => onInputChange('livingSituation', e)}
          error={errors.livingSituation}
        />

        <div className="flex gap-4">
          <InputField
            placeholder={t("floor") + "*"}
            type="number"
            min={0}
            value={formData.floor}
            onChange={(e) => onInputChange('floor', e.target.value)}
            error={errors.floor}
          />
          <InputField
            placeholder={t("area") + "*"}
            type="number"
            suffix="m²"
            min={0}
            value={formData.area}
            onChange={(e) => onInputChange('area', e.target.value)}
            error={errors.area}
          />
        </div>

        <Select
          label={t("residence") + "*"}
          options={ownershipOptions}
          value={formData.residence}
          onChange={(e) => onInputChange('residence', e)}
          error={errors.residence}
        />

        <Select
          label={t("localityType") + "*"} // todo: missing translation
          options={localityTypeOptions}
          value={formData.localityType}
          onChange={(e) => onInputChange('localityType', e)}
          error={errors.localityType}
        />

        <Toggle
          text={t("garden") + "*"}
          value={formData.garden}
          onChange={(e) => onInputChange('garden', e)}
        />
      </div>
    </>
  );
}
