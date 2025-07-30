"use client";

import { useAccessControl } from "@/contexts/AccessControlContext";
import { Shield } from "lucide-react";

interface AdminBadgeProps {
  variant?: "badge" | "text" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AdminBadge({
  variant = "badge",
  size = "md",
  className = "",
}: AdminBadgeProps) {
  const { permissions } = useAccessControl();

  if (!permissions.canAccessNGOVerification) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  if (variant === "icon") {
    return (
      <Shield className={`text-blue-600 ${className}`} size={iconSizes[size]} />
    );
  }

  if (variant === "text") {
    return (
      <span className={`text-blue-600 font-medium ${className}`}>Admin</span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 bg-blue-100 text-blue-800 
        rounded-full font-medium ${sizeClasses[size]} ${className}
      `}
      title="Administrator"
    >
      <Shield size={iconSizes[size]} />
      Admin
    </span>
  );
}
