"use client";

import React from "react";
import {
  Calendar,
  Weight,
  Scissors,
  Cat,
  Mars,
  Venus,
  Syringe,
  FolderPlus,
  Plus,
  ClipboardList,
  Shield,
  AlertTriangle,
  Utensils,
  Heart,
  MapPin,
  GraduationCap,
  Home,
} from "lucide-react";
import {useTranslations} from "next-intl";

interface Vaccination {
  vaccine: string;
  date: string;
}

interface Disease {
  disease: string;
  info?: string;
  medications?: string;
}

interface Fear {
  name: string;
  info?: string;
  medications?: string;
}

interface AnimalInfoProps {
  age: string;
  weight: string;
  kastration: boolean;
  vaccinated: boolean;
  breed: string;
  gender: string;
  allergies?: string[];
  diseases?: Disease[];
  vaccinations?: Vaccination[];
  fears?: Fear[];
  lastCheckup?: string;
  eatingBehaviour?: string;
  behaviour?: string;
  localityTypeRequirement?: string;
  experienceRequirement?: string;
  minimumSpaceRequirement?: number;
}

export const AnimalInfo = ({
  age,
  weight,
  kastration,
  vaccinated,
  breed,
  gender,
  allergies = [],
  diseases = [],
  vaccinations = [],
  fears = [],
  lastCheckup,
  eatingBehaviour,
  behaviour,
  localityTypeRequirement,
  experienceRequirement,
  minimumSpaceRequirement,
}: AnimalInfoProps) => {
  const t = useTranslations("AnimalDetail");
  const GenderIcon = gender.toLowerCase() === "male" ? Mars : Venus;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <Calendar size={20} />
            <span className="font-medium">{t("age")}</span>
          </div>
          <span>{age}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <Weight size={20} />
            <span className="font-medium">{t("weight")}</span>
          </div>
          <span>{weight}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <Scissors size={20} />
            <span className="font-medium">{t("kastration")}</span>
          </div>
          <span>{kastration ? t("yes") : t("no")}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <Cat size={20} />
            <span className="font-medium">{t("breed")}</span>
          </div>
          <span>{breed}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <GenderIcon size={20} />
            <span className="font-medium">{t("gender")}</span>
          </div>
          <span>{gender}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <Syringe size={20} />
            <span className="font-medium">{t("vaccinated")}</span>
          </div>
          <span>{vaccinated ? t("yes") : t("no")}</span>
        </div>

        {allergies.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <FolderPlus size={20} />
              <span className="font-medium">{t("allergies")}</span>
            </div>
            <span>{allergies.join(", ")}</span>
          </div>
        )}

        {diseases && diseases.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <Plus size={20} />
              <span className="font-medium">{t("diseases")}</span>
            </div>
            <div className="space-y-2">
              {diseases.map((disease, index) => (
                <div key={index} className="border-l-4 border-warning pl-3">
                  <div className="font-medium">{disease.disease}</div>
                  {disease.info && <div className="text-sm text-gray-600">{disease.info}</div>}
                  {disease.medications && (
                    <div className="text-sm text-blue-600">
                      <strong>{t("medications")}:</strong> {disease.medications}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {lastCheckup && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <ClipboardList size={20} />
              <span className="font-medium">{t("lastCheckup")}</span>
            </div>
            <span>{lastCheckup}</span>
          </div>
        )}

        {eatingBehaviour && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <Utensils size={20} />
              <span className="font-medium">{t("eatingBehaviour")}</span>
            </div>
            <span>{eatingBehaviour}</span>
          </div>
        )}

        {behaviour && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <Heart size={20} />
              <span className="font-medium">{t("behaviour")}</span>
            </div>
            <span>{behaviour}</span>
          </div>
        )}

        {localityTypeRequirement && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <MapPin size={20} />
              <span className="font-medium">{t("localityTypeRequirement")}</span>
            </div>
            <span>{localityTypeRequirement}</span>
          </div>
        )}

        {experienceRequirement && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <GraduationCap size={20} />
              <span className="font-medium">{t("experienceRequirement")}</span>
            </div>
            <span>{experienceRequirement}</span>
          </div>
        )}

        {minimumSpaceRequirement && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary">
              <Home size={20} />
              <span className="font-medium">{t("minimumSpaceRequirement")}</span>
            </div>
            <span>{minimumSpaceRequirement} m²</span>
          </div>
        )}
      </div>

      {vaccinations && vaccinations.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <Shield size={20} />
            <span className="font-medium text-lg">{t("vaccinations")}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vaccinations.map((vaccination, index) => (
              <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                <div className="font-medium text-green-800">{vaccination.vaccine}</div>
                <div className="text-sm text-green-600">{vaccination.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {fears && fears.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary">
            <AlertTriangle size={20} />
            <span className="font-medium text-lg">{t("fearsAndBehavioral")}</span>
          </div>
          <div className="space-y-3">
            {fears.map((fear, index) => (
              <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                <div className="font-medium text-orange-700">{fear.name}</div>
                {fear.info && <div className="text-sm text-gray-600 mt-1">{fear.info}</div>}
                {fear.medications && (
                  <div className="text-sm text-purple-600 mt-1">
                    <strong>{t("treatment")}:</strong> {fear.medications}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
