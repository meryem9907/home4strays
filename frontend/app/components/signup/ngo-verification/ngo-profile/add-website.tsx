"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import InputField from "@/app/components/ui/validation/inputfield";
import Button from "@/app/components/ui/button";
import Badge from "@/app/components/ui/badge";
import { getWebsiteIcon } from "@/app/components/ui/card/functions";

interface AddWebsiteProps {
  websites: string[];
  setWebsites: (sites: string[]) => void;
}

export default function AddWebsite({ websites, setWebsites }: AddWebsiteProps) {
  const t = useTranslations("CreateNGOProfile");

  const [websiteInput, setWebsiteInput] = useState("");

  const isValidURL = (url: string) => {
    if (!url.trim()) return false;

    try {
      // If URL doesn't start with protocol, add https://
      const urlToTest =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;

      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddWebsite = () => {
    const trimmed = websiteInput.trim();
    if (trimmed !== "" && isValidURL(trimmed)) {
      // Ensure URL has protocol when adding
      const urlToAdd =
        trimmed.startsWith("http://") || trimmed.startsWith("https://")
          ? trimmed
          : `https://${trimmed}`;

      setWebsites([...websites, urlToAdd]);
      setWebsiteInput("");
    }
  };

  const handleRemoveWebsite = (index: number) => {
    const updated = websites.filter((_, i) => i !== index);
    setWebsites(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWebsite();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1" onKeyDown={handleKeyDown}>
          <InputField
            type="text"
            placeholder={t("url")}
            value={websiteInput}
            onChange={(e) => setWebsiteInput(e.target.value)}
          />
        </div>

        <Button
          label={t("add")}
          color="primary"
          type="button"
          onClick={handleAddWebsite}
          disabled={!websiteInput.trim() || !isValidURL(websiteInput.trim())}
        />
      </div>

      <div className="flex flex-wrap items-start gap-2 mt-3">
        {websites.map(
          (url, idx) =>
            isValidURL(url) && (
              <div
                className="group cursor-pointer max-w-full tooltip"
                key={idx}
                data-tip={url}
                onClick={() => handleRemoveWebsite(idx)}
              >
                <Badge
                  size="lg"
                  icon={
                    <div>
                      {/* Original Icon */}
                      <span className="group-hover:hidden block">
                        {getWebsiteIcon(url)}
                      </span>

                      {/* Cross Icon (Hovereffect) */}
                      <span className="group-hover:block hidden">
                        <X className="text-error" size={20} />
                      </span>
                    </div>
                  }
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}
