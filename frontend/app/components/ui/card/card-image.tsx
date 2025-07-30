"use client";

import { useState } from "react";
import PictureWithBlurryBackground from "../picture-with-blurry-background";
import Button from "../button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardImageProps {
  images: string[];
  title: string;
}

export default function CardImage({ images, title }: CardImageProps) {
  // Filter out empty images and use fallback if no valid images
  const validImages = images.filter((img) => img && img.trim() !== "");
  const finalImages = validImages.length > 0 ? validImages : ["/logo.png"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + finalImages.length) % finalImages.length
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % finalImages.length);
  };

  return (
    <div className="relative group">
      <PictureWithBlurryBackground
        image={finalImages[currentImageIndex]}
        title={title}
      />

      {/* Arrows */}
      {finalImages.length > 1 && (
        <div>
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 md:opacity-0 md:hover:opacity-100 group-hover:opacity-50 transition p-3"
            onClick={handlePrev}
          >
            <Button icon={<ChevronLeft />} size="sm" rounded />
          </div>

          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 md:opacity-0 md:hover:opacity-100 group-hover:opacity-50 transition p-3"
            onClick={handleNext}
          >
            <Button icon={<ChevronRight />} size="sm" rounded />
          </div>
        </div>
      )}

      {/* Dots */}
      {finalImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {finalImages.map((_, idx) => (
            <div
              className="w-4 h-4 rounded-full cursor-pointer flex items-center justify-center"
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(idx);
              }}
            >
              <div
                className={`w-2 h-2 rounded-full transition 
                    ${currentImageIndex === idx ? "bg-white" : "bg-gray-400"}
                  `}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
