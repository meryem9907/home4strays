'use client';

import React from 'react';
import { BriefcaseMedical, ClipboardPlus, Trash2, Plus } from 'lucide-react';
import Box from '../ui/box';
import Toggle from '../ui/toogle';
import Button from '../ui/button';
import TextArea from '../ui/textarea';
import { AnimalFormErrors } from '@/app/[locale]/add-animal/page';
import InputField from '../ui/validation/inputfield';
import { useTranslations } from 'next-intl';
import { Disease, Vaccination } from '../../types/addAnimal';

interface Props {
  lastCheckup: string;
  isNeutered: boolean;
  isVaccinated: boolean;
  hasDiseases: boolean;
  diseases: Disease[];
  vaccinations: Vaccination[];
  error: AnimalFormErrors;
  onChange: (field: string, value: string | boolean | Disease[] | Vaccination[]) => void;
}

export default function HealthSection({
  lastCheckup,
  isNeutered,
  isVaccinated,
  hasDiseases,
  diseases,
  vaccinations,
  error,
  onChange,
}: Props) {

  const t = useTranslations("AddAnimal");

  const updateDisease = (index: number, field: keyof Disease, value: string) => {
    const updated = [...diseases];
    updated[index][field] = value;
    onChange('diseases', updated);
  };

  const addDisease = () => {
    onChange('diseases', [...diseases, { name: '', medication: '', info: '' }]);
  };

  const removeDisease = (index: number) => {
    const updated =
      diseases.length === 1
        ? [{ name: '', medication: '', info: '' }]
        : diseases.filter((_, i) => i !== index);
    onChange('diseases', updated);
  };

  const updateVaccination = (index: number, field: keyof Vaccination, value: string) => {
    const updated = [...vaccinations];
    updated[index][field] = value;
    onChange('vaccinations', updated);
  };

  const addVaccination = () => {
    onChange('vaccinations', [...vaccinations, { vaccine: '', date: '' }]);
  };

  const removeVaccination = (index: number) => {
    const updated =
      vaccinations.length === 1
        ? [{ vaccine: '', date: '' }]
        : vaccinations.filter((_, i) => i !== index);
    onChange('vaccinations', updated);
  };

  return (
    <Box size="full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BriefcaseMedical size={20} className="mr-2 text-secondary" />
        {t("Health.title")}
      </h2>

      <div className="grid md:grid-cols-5 gap-4 max-w-full">
        <div className="col-span-5 md:col-span-2">
          <InputField
            icon={<ClipboardPlus size={20} />}
            type="date"
            placeholder={t("lastCheckup") + '*'}
            value={lastCheckup}
            onChange={(e) => onChange('lastCheckup', e.target.value)}
            error={error.lastCheckup}
          />
        </div>

        <div className="col-span-3 flex flex-col md:flex-row items-evenly justify-start max-w-full flex-wrap gap-3">
          <Toggle
            text={t("Health.castrated") + '*'}
            value={isNeutered}
            onChange={() => onChange('isNeutered', !isNeutered)}
          />
          <Toggle
            text={t("Health.vaccinated") + '*'}
            value={isVaccinated}
            onChange={() => onChange('isVaccinated', !isVaccinated)}
          />
          <Toggle
            text={t("Health.hasDiseases") + '*'}
            value={hasDiseases}
            onChange={() => onChange('hasDiseases', !hasDiseases)}
          />
        </div>
      </div>

      {/* Add Disease */}
      {hasDiseases && (
        <>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">{t("Health.diseasesTitle")}</h3>
            
            <Button
              type="button"
              icon={<Plus size={18}/>}
              label={t("Health.addDisease")}
              color="ghost"
              onClick={addDisease}
            />
          </div>
          {diseases.map((d, idx) => (
            <div key={idx} className="mb-4">
              <div className="grid md:grid-cols-2 gap-2">

                <InputField
                  type="text"
                  placeholder={t("Health.disease")}
                  value={d.name}
                  onChange={(e) => updateDisease(idx, 'name', e.target.value)}
                />

                <div className="flex items-center gap-2">
                  <div className="flex-grow">
                    <InputField
                      type="text"
                      placeholder={t("Health.medication")}
                      value={d.medication}
                      onChange={(e) => updateDisease(idx, 'medication', e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      type="button"
                      icon={<Trash2 size={18} />}
                      color="error"
                      onClick={() => removeDisease(idx)}
                    />
                  </div>
                </div>
              </div>

              <TextArea
                label={t("Health.diseaseInfo")}
                placeholder={t("Health.diseaseInfoPlaceholder")}
                rows={2}
                value={d.info}
                onChange={(e) => updateDisease(idx, 'info', e.target.value)}
              />
            </div>
          ))}
        </div>
      </>
      )}

      {/* Add Vaccination */}
      {isVaccinated && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">{t("Health.vaccinationTitle")}</h3>
            <Button
              type="button"
              icon={<Plus size={18} />}
              label={t("Health.addVaccination")}
              color="ghost"
              onClick={addVaccination}
            />
          </div>

          {vaccinations.map((v, idx) => (
            <div key={idx} className="grid md:grid-cols-2 gap-2 mb-4">
              <InputField
                type="text"
                placeholder={t("Health.vaccine")}
                value={v.vaccine}
                onChange={(e) => updateVaccination(idx, 'vaccine', e.target.value)}
              />

              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <InputField
                    type="date"
                    placeholder={t("Health.date")}
                    value={v.date}
                    onChange={(e) => updateVaccination(idx, 'date', e.target.value)}
                  />
                </div>
                <div className="flex-shrink-0">
                  <Button
                    icon={<Trash2 size={18} />}
                    type="button"
                    color="error"
                    onClick={() => removeVaccination(idx)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}
