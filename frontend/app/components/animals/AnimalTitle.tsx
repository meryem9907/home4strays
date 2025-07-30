"use client";

import { HeartIcon } from "lucide-react";
import React from "react";
import { useBookmarks } from "../../../contexts/BookmarkContext";
import { useAccessControl } from "../../../contexts/AccessControlContext";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface AnimalTitleProps {
  name: string;
  type: string;
  breed: string;
  petId: string;
  mail: string;
}

export const AnimalTitle = ({
  name,
  type,
  breed,
  petId,
  mail,
}: AnimalTitleProps) => {
  const { isBookmarked, toggleBookmark, isLoading } = useBookmarks();
  const { permissions } = useAccessControl();
  const t = useTranslations("AnimalDetail");

  const bookmarked = isBookmarked(petId);

  const handleBookmarkClick = async () => {
    await toggleBookmark(petId);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{type}</div>
          <h1 className="text-4xl font-bold">{name}</h1>
          <div className="text-lg">{breed}</div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Link className="btn btn-primary flex-1" href={`mailto:${mail}`}>
          {t("sendMessage")}
        </Link>
        {permissions.canBookmarkAnimals && (
          <button
            className={`btn btn-square ${
              bookmarked ? "btn-error" : "btn-neutral"
            }`}
            onClick={handleBookmarkClick}
            disabled={isLoading}
          >
            <HeartIcon
              className={`w-6 h-6 ${
                bookmarked ? "text-white fill-current" : "text-primary"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};
