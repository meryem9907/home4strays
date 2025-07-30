"use client";

import React, {useState, useEffect} from "react";
import {BrainCircuit, Plus, Trash2} from "lucide-react";
import Box from "@/app/components/ui/box";
import TextArea from "@/app/components/ui/textarea";
import {useTranslations, useLocale} from "next-intl";
import Select from "../ui/select";
import {Behaviour} from "@/app/types/addAnimal";
import InputField from "../ui/validation/inputfield";
import Button from "../ui/button";

export type Fear = {
  fear: string;
  info: string;
};

interface Props {
  behaviour: Behaviour | "";
  fear: Fear[];
  eatingBehaviour: string;
  onChange: (field: string, value: string | Fear[]) => void;
}

export default function BehaviourSection({behaviour, fear, eatingBehaviour, onChange}: Props) {
  const t = useTranslations("AddAnimal");
  const locale = useLocale();

  const [availableBehaviours, setAvailableBehaviours] = useState<string[]>([]);
  const [loadingBehaviours, setLoadingBehaviours] = useState(true);
  const [behaviourMapping, setBehaviourMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBehaviours = async () => {
      try {
        const [translatedResponse, englishResponse] = await Promise.all([
          fetch(`/api/enums/behaviour?lang=${locale}`),
          fetch(`/api/enums/behaviour?lang=en`),
        ]);

        if (translatedResponse.ok && englishResponse.ok) {
          const translatedData = await translatedResponse.json();
          const englishData = await englishResponse.json();

          setAvailableBehaviours(translatedData || []);

          const mapping: Record<string, string> = {};
          const reverseMapping: Record<string, string> = {};

          englishData.forEach((englishValue: string, index: number) => {
            const translatedValue = translatedData[index];
            mapping[englishValue] = translatedValue;
            reverseMapping[translatedValue] = englishValue;
          });

          setBehaviourMapping({...mapping, ...reverseMapping});
        } else {
          console.error("Failed to fetch behaviours");
        }
      } catch (error) {
        console.error("Error fetching behaviours:", error);
      } finally {
        setLoadingBehaviours(false);
      }
    };

    fetchBehaviours();
  }, [locale]);

  const handleBehaviourChange = (translatedValue: string) => {
    const englishValue = behaviourMapping[translatedValue] || translatedValue;
    onChange("behaviour", englishValue);
  };

  const getDisplayValue = (englishValue: string, mapping: Record<string, string>) => {
    return mapping[englishValue] || englishValue;
  };

  const updateFear = (index: number, field: keyof Fear, value: string) => {
    const updated = [...fear];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange("fear", updated);
  };

  const addFear = () => {
    onChange("fear", [...fear, {fear: "", info: ""}]);
  };

  const removeFear = (index: number) => {
    if (fear.length === 1) {
      const cleared = [{fear: "", info: "", medications: ""}];
      onChange("fear", cleared);
    } else {
      const updated = fear.filter((_, i) => i !== index);
      onChange("fear", updated);
    }
  };

  return (
    <Box size="full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BrainCircuit size={20} className="mr-2 text-secondary" />
        {t("Behaviour.title")}
      </h2>

      <div className="grid md:grid-cols-1 gap-2">
        <Select
          label={loadingBehaviours ? "Loading behaviours..." : t("Behaviour.behaviour")}
          options={availableBehaviours}
          value={getDisplayValue(behaviour, behaviourMapping)}
          onChange={handleBehaviourChange}
          disabled={loadingBehaviours}
        />

        <h3 className="text-lg font-medium mt-4">{t("Behaviour.eatingBehaviour")}</h3>

        <TextArea
          placeholder={t("Behaviour.eatingBehaviourPlaceholder")}
          rows={1}
          value={eatingBehaviour}
          onChange={(e) => onChange("eatingBehaviour", e.target.value)}
        />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">{t("Behaviour.fearsTitle")}</h3>
            <Button type="button" icon={<Plus size={18} />} label={t("Behaviour.addFear")} color="ghost" onClick={addFear} />
          </div>

          {fear.map((f, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <InputField
                    type="text"
                    placeholder={t("Behaviour.fearPlaceholder")}
                    value={f.fear}
                    onChange={(e) => updateFear(idx, "fear", e.target.value)}
                  />
                </div>
                <Button type="button" icon={<Trash2 size={18} />} color="error" onClick={() => removeFear(idx)} />
              </div>

              <TextArea
                label={t("Behaviour.fearInfo")}
                placeholder={t("Behaviour.fearInfoPlaceholder")}
                rows={2}
                value={f.info}
                onChange={(e) => updateFear(idx, "info", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}
