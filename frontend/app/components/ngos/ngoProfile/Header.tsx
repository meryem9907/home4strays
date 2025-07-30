import Image from "next/image";
import React, {useRef, useState} from "react";
import InputField from "../../ui/validation/inputfield";
import Badge from "../../ui/badge";
import {Globe, Upload, Users} from "lucide-react";
import Button from "../../ui/button";
import {NGO} from "../../../types/ngo";

interface HeaderProps {
  formData: NGO;
  isEditing: boolean;
  handleChange: (field: keyof NGO, value: string | number) => void;
}

export const Header = ({formData, isEditing, handleChange}: HeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.logo || "/default-logo.png");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Bildvorschau anzeigen
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl); // Vorschau des Bildes setzen

    // Bild im Zustand speichern (hier über handleChange)
    handleChange("logo", imageUrl); // Speichert das Bild als URL im Zustand
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden border border-neutral">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-base-100 rounded-full shadow-md p-2 flex-shrink-0 border-4 border-base-100">
            <Image
              src={imagePreview || "/default-logo.png"} // Hier das Bild aus dem Zustand verwenden
              alt={formData.name}
              fill
              className="object-cover rounded-full"
              sizes="(max-width: 768px) 128px, 160px"
            />

            {isEditing && (
              <>
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  <Button icon={<Upload className="h-4 w-4" />} rounded />
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </>
            )}
          </div>

          <div className="text-center md:text-left w-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-base-content">{formData.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <Badge icon={<Globe className="h-4 w-4" />} label={formData.country} color="secondary" size="lg" />
              {isEditing ? (
                <div className="flex items-center">
                  <InputField
                    type="number"
                    placeholder="Members"
                    value={formData.membercount.toString()}
                    onChange={(e) => handleChange("membercount", parseInt(e.target.value))}
                  />
                </div>
              ) : (
                <Badge icon={<Users className="h-4 w-4" />} label={formData.membercount.toString() + " Members"} color="primary" size="lg" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
