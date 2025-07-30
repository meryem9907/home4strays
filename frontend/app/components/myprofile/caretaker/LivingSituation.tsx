import { Building2, Earth, Hash, Home, Map, MapPin, Milestone } from "lucide-react";
import IconHeading from "../../ui/icon-heading";
import { useTranslations } from "next-intl";
import Toggle from "../../ui/toogle";
import Select from "../../ui/select";
import InputField from "../../ui/inputfield";
import { Caretaker } from "@/app/types/backend/caretaker";

interface Props {
  caretakerData: Caretaker;
  isEditing: boolean;
  onInputChange: (key: keyof Caretaker, value: string | boolean) => void;
}

export default function LivingSituation({ caretakerData, isEditing, onInputChange }: Props) {
  const t = useTranslations("CaretakerProfile.LivingSituation");
  const tEdit = useTranslations("CreateCaretakerProfile.LivingSituation");
  

  const ownershipOptions = ["All", "Owned", "Rented", "Shared"];
  const localityTypeOptions = ["Urban", "Rural"];

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-8 border border-neutral">
      <IconHeading icon={<Home />} label={t("heading")} />

      { isEditing ? (
        <>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <InputField
              icon={<Earth size={20} />}
              type="text"
              placeholder={tEdit ("country") + "*"}
              maxLength={255}
              value={caretakerData.country}
              onChange={(e) => onInputChange('country', e.target.value)}
            />

            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <InputField
                  icon={<Map size={20} />}
                  type="text"
                  placeholder={tEdit ("zip") + "*"}
                  maxLength={10}
                  value={caretakerData.zip}
                  onChange={(e) => onInputChange('zip', e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  icon={<Building2 size={20} />}
                  type="text"
                  placeholder={tEdit ("city") + "*"}
                  maxLength={255}
                  value={caretakerData.cityName}
                  onChange={(e) => onInputChange('cityName', e.target.value)}
                />
              </div>
            </div>

            <InputField
              icon={<Milestone size={20} />}
              type="text"
              placeholder={tEdit ("street") + "*"}
              maxLength={255}
              value={caretakerData.streetName}
              onChange={(e) => onInputChange('streetName', e.target.value)}
            />

            <InputField
              icon={<Hash size={20} />}
              type="text"
              placeholder={tEdit ("houseNumber") + "*"}
              maxLength={10}
              value={caretakerData.houseNumber}
              onChange={(e) => onInputChange('houseNumber', e.target.value)}
            />

            <Select
              label={tEdit ("livingSituation") + "*"}
              options={localityTypeOptions}
              value={caretakerData.localityType}
              onChange={(e) => onInputChange('localityType', e)}
            />

            <div className="flex gap-4">
              <InputField
                placeholder={tEdit ("floor") + "*"}
                type="number"
                min={0}
                value={caretakerData.floor.toString()}
                onChange={(e) => onInputChange('floor', e.target.value)}
              />
              <InputField
                placeholder={tEdit ("area") + "*"}
                type="number"
                suffix="m²"
                min={0}
                value={caretakerData.space.toString()}
                onChange={(e) => onInputChange('space', e.target.value)}
              />
            </div>

            <Select
              label={tEdit ("residence") + "*"}
              options={ownershipOptions}
              value={caretakerData.residence}
              onChange={(e) => onInputChange('residence', e)}
            />

            <Toggle
              text={tEdit ("garden") + "*"}
              value={caretakerData.garden}
              onChange={(e) => onInputChange('garden', e)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="p-4 bg-neutral/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span>{t("residenceType")}</span>
                  <span className="font-semibold text-secondary">
                    {caretakerData.residence}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span>{t("tenure")}</span>
                  <span className="font-semibold text-secondary">
                    {caretakerData.tenure}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-neutral/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span>{t("floor")}</span>
                  <span className="font-semibold text-secondary">
                    {t("floorValue", { value: caretakerData.floor })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span>{t("garden")}</span>
                  <span
                    className={`font-semibold ${
                      caretakerData.garden ? "text-success" : "text-error"
                    }`}
                  >
                    {caretakerData.garden ? t("gardenPresent") : t("gardenMissing")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="mt-6 p-4 bg-neutral/10 rounded-xl border border-neutral">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-secondary mr-2" />
              <span className="font-medium">{t("address")}</span>
            </div>
            <p className="ml-7">
              {caretakerData.streetName} {caretakerData.houseNumber}
              <br />
              {caretakerData.zip} {caretakerData.cityName}
              <br />
              {caretakerData.country}
            </p>
          </div>
        </>
      )

    }

      
    </div>
  );
}
