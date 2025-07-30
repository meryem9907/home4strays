"use client";

import React, { ReactNode, useEffect } from "react";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Home, ShieldX } from "lucide-react";
import Button from "../ui/button";

interface AdminProtectionProps {
  children: ReactNode;
  fallback?: "redirect" | "message";
  redirectTo?: string;
}

export default function AdminProtection({
  children,
  fallback = "message",
  redirectTo,
}: AdminProtectionProps) {
  const { isSystemAdmin, permissions } = useAccessControl();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isSystemAdmin && fallback === "redirect") {
      const destination = redirectTo || `/${locale}`;
      router.push(destination);
    }
  }, [isSystemAdmin, fallback, redirectTo, router, locale]);

  if (!permissions.canAccessNGOVerification) {
    if (fallback === "redirect") {
      return null;
    }

    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-6">
            <ShieldX className="mx-auto text-red-500" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page. This page is
            restricted to administrators only.
          </p>
          <Button
            icon={<Home />}
            label="Go Home"
            color="primary"
            onClick={() => router.push(`/${locale}`)}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
