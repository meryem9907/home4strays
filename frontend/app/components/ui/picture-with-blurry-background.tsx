import Image from "next/image";

interface PictureProps {
  image: string;
  title: string;
  round?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function PictureWithBlurryBackground({
  image,
  title,
  round,
  size = "xl",
}: PictureProps) {
  const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-38 h-38",
    xl: "h-60 w-full",
  };

  // Use fallback image if image is empty, undefined, or null
  const imageSource = image && image.trim() !== "" ? image : "/logo.png";

  return (
    <figure
      className={`relative overflow-hidden ${sizeClasses[size]} ${
        round ? "rounded-full" : "rounded-t-2xl"
      }`}
    >
      <Image
        src={imageSource}
        alt={title}
        fill
        className="object-cover w-full h-full blur-md scale-110"
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Image
          src={imageSource}
          alt={title}
          fill
          className="object-contain max-h-full"
        />
      </div>
    </figure>
  );
}
