"use client";

import Image from "next/image";

interface AboutUsCardProps {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  onClick: () => void;
}

export default function AboutUsCard({ title, image, onClick }: AboutUsCardProps) {
  return (
    <div
      onClick={onClick}
      className="card bg-accent text-accent-content shadow-sm rounded-2xl cursor-pointer
        transform transition-transform duration-100 ease-out hover:scale-105 hover:shadow-md
        w-full md:w-1/3 lg:w-1/4"
    >
      <figure className="h-48 md:h-60 lg:h-90 w-full bg-white overflow-hidden flex items-center justify-center">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={2000}
            height={3680}
            className="w-full h-full object-contain"
          />
        )}
      </figure>
      <div className="card-body flex items-center justify-center p-4 md:p-5">
        <h2 className="card-title text-xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
