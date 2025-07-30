"use client";

import {useState} from "react";
import Image from "next/image";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useTranslations} from "next-intl";

interface GalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export const Gallery = ({images}: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("AnimalDetail");

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Main gallery layout */}
      <div className="flex flex-row gap-4">
        {/* Thumbnails column */}
        <div className="flex flex-col space-y-2 w-20">
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer ${index === currentIndex ? "ring-2 ring-primary" : ""}`}
              onClick={() => setCurrentIndex(index)}>
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
            </div>
          ))}
          {images.length > 4 && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center text-white cursor-pointer">
              +{images.length - 4}
            </div>
          )}
        </div>

        {/* Main image display */}
        <div className="relative flex-1 rounded-lg overflow-hidden">
          <div className=" w-full aspect-[4/3]">
            <Image src={images[currentIndex].src} alt={images[currentIndex].alt} fill className="object-cover" priority />
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrevious}
            className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
            aria-label={t("previousImage")}>
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
            aria-label={t("nextImage")}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
