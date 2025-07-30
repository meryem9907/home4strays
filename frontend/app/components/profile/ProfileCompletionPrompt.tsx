"use client";

import React, { useEffect } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";

export const ProfileCompletionPrompt: React.FC = () => {
  const { profileStatus, needsProfileCompletion } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Common");

  useEffect(() => {
    if (!needsProfileCompletion() || !profileStatus) return;

    // Don't show prompts on certain pages
    const excludedPaths = [
      "/signup",
      "/login",
      "/logout",
      "/_not-found",
      "/404",
    ];

    const isExcludedPath = excludedPaths.some((path) =>
      pathname.includes(path)
    );

    if (isExcludedPath) return;

    // Show completion prompt based on what's needed
    const { completionStep } = profileStatus;

    if (completionStep === "ngo-profile") {
      toast(
        (toastInstance) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium">{t("ngoProfileRequired")}</p>
            <p className="text-sm text-gray-600">
              {t("ngoProfileRequiredDescription")}
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.dismiss(toastInstance.id);
                  router.push(`/${locale}/signup`);
                }}
              >
                {t("completeProfile")}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toast.dismiss(toastInstance.id)}
              >
                {t("dismiss")}
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000, // 10 seconds instead of infinity
          position: "top-center",
        }
      );
    } else if (completionStep === "caretaker-profile") {
      toast(
        (toastInstance) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium">{t("caretakerProfileRequired")}</p>
            <p className="text-sm text-gray-600">
              {t("caretakerProfileRequiredDescription")}
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.dismiss(toastInstance.id);
                  router.push(`/${locale}/signup`);
                }}
              >
                {t("completeProfile")}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toast.dismiss(toastInstance.id)}
              >
                {t("dismiss")}
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
          position: "top-center",
        }
      );
    }
  }, [pathname, profileStatus, needsProfileCompletion, router, locale, t]);

  return null; // This component doesn't render anything
};
