interface BoxProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  children: React.ReactNode;
}

export default function Box({ size = "2xl", children }: BoxProps) {
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

  const sizeClass = sizeClassMap[size];

  return (
    <div className="min-h-full flex items-center justify-center py-2 px-4 md:p-4">
      <div
        className={`card rounded-2xl shadow-xl bg-base-100 border border-neutral p-4 md:p-6 max-w-screen ${sizeClass}`}
      >
        {children}
      </div>
    </div>
  );
}
