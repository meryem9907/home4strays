import { ReactNode } from "react";
import { DaisyUIColor, DaisyUISize } from "../../types/daisyui";

interface BadgeProps {
  icon?: ReactNode;
  label?: string;
  color?: DaisyUIColor;
  size?: DaisyUISize | 'xl';
  soft?: boolean;
  rounded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Badge({
  icon,
  label,
  color = "neutral",
  size = "md", 
  soft,
  rounded,
  onClick,
}: BadgeProps) {

  const sizeClassMap: Record<DaisyUISize | "xl", string> = {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg",
    xl: "badge-xl",
  };

  const colorClassMap: Record<DaisyUIColor, string> = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    neutral: "badge-neutral",
    info: "badge-info",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    ghost: "badge-ghost",
  };

  const softClass = soft ? "badge-soft" : "";
  const roundedClass = rounded ? "rounded-full" : "";
  const colorClass = colorClassMap[color];
  const sizeClass = sizeClassMap[size];

  return (
    <div className={`badge max-w-full ${colorClass} ${roundedClass} ${sizeClass} ${softClass}`} onClick={onClick}>
      { icon }
      { label && 
        <p className="truncate"> { label } </p>
      }
    </div>
  )   
}
