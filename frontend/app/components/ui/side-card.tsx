'use client'
import Image from "next/image";
const sizeClassMap: Record<
    "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full",
    string
  > = {
    sm: "md:w-sm",
    md: "md:w-md",
    lg: "md:w-lg",
    xl: "md:w-xl",
    "2xl": "md:w-2xl",
    "3xl": "md:w-3xl",
    full: "w-full",
  };

interface SideCardProps {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}


export default function SideCard({ image, children, size = "sm" }: SideCardProps) {
  
  const sizeClass = sizeClassMap[size];
  return (
    <div className="min-h-full flex items-center justify-center  ">
    <div className={`card bg-base-100  w-full overflow-hidden lg:card-side flex items-center 
    justify-center lg:items-stretch rounded-2xl shadow-xl border 
      border-neutral shadow-sm ${sizeClass}`}>
<figure className=" !hidden  md:flex items-center justify-center 
  ">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="lg:max-h-100 w-auto object-contain"
      />
</figure>
<div className="w-full  flex items-center ">
          {children}
        </div>
    </div>
  </div>
  );
}