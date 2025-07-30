import { ImageUp } from "lucide-react";
import { useId, useRef } from "react";
import PictureWithBlurryBackground from "@/app/components/ui/picture-with-blurry-background";
import Image from "next/image";

type Props = {
  label?: string;
  value: File | string | null;
  onChange: (value: File | string | null) => void;
  size?: "sm" | "md" | "lg";
  notBlurry?: boolean;
};

export default function ImageUpload({
  label,
  value,
  onChange,
  size = "md",
  notBlurry = false,
}: Props) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      return;
    }
    onChange(file);
  };

  const getImageSrc = () => {
    if (!value) return null;
    if (typeof value === "string") return value;
    return URL.createObjectURL(value);
  };

  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-38 h-38",
  };

  const imageSrc = getImageSrc();

  return (
    <div className="flex flex-col items-center justify-center">
      {label && <p className="text-sm mb-1 text-right">{label}</p>}
      <div
        className={`relative group ${sizeClasses[size]} border-4 border-accent rounded-full overflow-hidden cursor-pointer`}
        onClick={() => fileInputRef.current?.click()}
      >
        {imageSrc ? (
          notBlurry ? (
            <>
              <div className="w-full h-full">
                <Image
                  src={imageSrc}
                  width={400}
                  height={400}
                  alt="Profilbild"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <ImageUp size={40} className="text-white" />
              </div>
            </>
          ) : (
            <div className="relative">
              <PictureWithBlurryBackground image={imageSrc} title="" round size={size} />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <ImageUp size={40} className="text-white" />
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col w-full h-full items-center justify-center space-y-2">
            <ImageUp size={40} className="text-primary" />
          </div>
        )}
      </div>
      <input
        type="file"
        id={inputId}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
}
