"use client";

import {useTranslations} from "next-intl";

// placeholder page

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex justify-center ">
      <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>
    </div>
  );
}
