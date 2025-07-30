import { DaisyUIColor } from "../../types/daisyui";

interface IconHeadingProps {
  icon: React.ReactNode;
  label: string;
  color?: DaisyUIColor;
  noBorder?: boolean;
}

const colorMap: Record<DaisyUIColor, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary" },
  accent: { bg: "bg-accent/10", text: "text-accent" },
  info: { bg: "bg-info/10", text: "text-info" },
  success: { bg: "bg-success/10", text: "text-success" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
  error: { bg: "bg-error/10", text: "text-error" },
  neutral: { bg: "bg-neutral/10", text: "text-neutral" },
  ghost: { bg: "bg-base-200", text: "text-base-content" },
};

export default function IconHeading({
  icon,
  label,
  color = "secondary",
  noBorder = false,
}: IconHeadingProps) {
  const colorClasses = colorMap[color];

  return (
    <div
      className={`flex justify-between items-center ${
        noBorder ? "" : "border-b border-base-200 pb-3"
      }`}
    >
      <h2 className="card-title text-xl font-semibold flex items-center gap-2">
        <div className={`${colorClasses.bg} p-2 rounded-lg ${colorClasses.text}`}>
          {icon}
        </div>
        {label}
      </h2>
    </div>
  );
}
