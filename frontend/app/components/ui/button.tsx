"use client";
import { ReactNode, useState } from "react";
import { DaisyUIColor, DaisyUISize } from "../../types/daisyui";
import { Trash2 } from "lucide-react";

interface ButtonProps {
  icon?: ReactNode;
  label?: string;
  color?: DaisyUIColor;
  size?: DaisyUISize | "xxs";
  rounded?: boolean;
  wide?: boolean;
  arialabel?: string;
  soft?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  fullwidth?: boolean;
  type?: "button" | "submit" | "reset";
  deleteHover?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  icon,
  label,
  color = "neutral",
  size = "md",
  rounded,
  wide,
  arialabel = "",
  soft,
  bordered,
  disabled,
  fullwidth,
  type = "submit",
  deleteHover = false,
  onClick,
}: ButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  const colorClassMap: Record<DaisyUIColor, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    neutral: "btn-neutral",
    info: "btn-info",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    ghost: "btn-ghost",
  };

  const sizeClassMap: Record<DaisyUISize | "xxs", string> = {
    xxs: "w-2 h-2",
    xs: "btn-xs",
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };

  const colorClass =
    deleteHover && isHovering ? "btn-error" : colorClassMap[color];
  const sizeClass = sizeClassMap[size];
  const shapeClass = !label ? "btn-square" : "";
  const roundedClass = rounded ? "rounded-full" : "";
  const widthClass = wide ? "btn-wide" : "";
  const softClass = soft ? "btn-soft" : "";
  const fullWidthClass = fullwidth ? "w-full" : "";

  const handleMouseEnter = () => {
    if (deleteHover) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (deleteHover) {
      setIsHovering(false);
    }
  };

  return (
    <button
      className={`btn ${colorClass} ${sizeClass} ${shapeClass} ${roundedClass} ${fullWidthClass} 
      ${widthClass} ${softClass} ${bordered} ${
        disabled ? "btn-disabled" : ""
      } `}
      aria-label={arialabel}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {deleteHover && isHovering ? <Trash2 size={20} /> : icon}

      {label && <p className={bordered ? "border-b-2" : ""}>{label}</p>}
    </button>
  );
}
