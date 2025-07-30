"use client";

import {useRouter, usePathname} from "@/i18n/routing";
import {useLocale} from "next-intl";
import {Languages} from "lucide-react";
import DropDown from "./dropDown";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    {code: "en", name: "English"},
    {code: "de", name: "Deutsch"},
    {code: "tr", name: "Türkçe"},
  ];

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
     <DropDown 
        bgColor="accent"
        icon={<Languages/>} 
        items={languages.map((lang) => ({
          label: lang.name, 
          onClick: () => changeLanguage(lang.code),
          active: lang.code === locale
        }))}
      />
  );
}