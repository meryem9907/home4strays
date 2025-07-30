"use client";

"use client";

import React from "react";
import Image from "next/image";
import { Globe, Info, Copy, ImageOff, Mail } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getWebsiteIcon } from "../ui/card/functions";
import Button from "../ui/button";
import { useRouter } from "next/navigation";

interface NGOInfoProps {
  id?: string;
  name: string;
  logo: string;
  email: string;
  country: string;
  websites?: string[];
}

export const NGOInfo = ({
  id,
  name,
  logo,
  email,
  country,
  websites = [],
}: NGOInfoProps) => {
  const t = useTranslations("AnimalDetail");
  const locale = useLocale();
  const router = useRouter();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleMoreInfoClick = () => {
    if (id) {
      router.push(`/${locale}/ngos/${id}`);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md border border-neutral">
      <div className="card-body">
        <h2 className="card-title text-xl font-medium mb-3">
          {t("informationAboutNGO")}
        </h2>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-3 border-neutral">
            {logo !== null ? (
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <ImageOff className="text-base-content/50" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-xl">{name}</h3>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Mail size={20} />
            <span>{email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe size={20} />
            <span>{country}</span>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="flex justify-between">
          <button
            className="text-sm btn btn-sm btn-ghost text-secondary flex items-center gap-2 hover:text-secondary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleMoreInfoClick}
            disabled={!id}
          >
            <Info size={16} />
            <span>{t("moreInformation")}</span>
          </button>

          {websites.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="tooltip" data-tip="Copy URL">
                <Button
                  icon={<Copy size={16} />}
                  onClick={() => copyToClipboard()}
                  color="ghost"
                  size="sm"
                  rounded
                />
              </div>
              {websites.slice(0, 3).map((website, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="tooltip" data-tip={website}>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-circle btn-sm btn-ghost"
                    >
                      {getWebsiteIcon(website)}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
