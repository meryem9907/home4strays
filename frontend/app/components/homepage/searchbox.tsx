"use client";

import { Bird, Cat, Dog, Rabbit, SearchIcon } from "lucide-react";
import Button from "../ui/button";
import { useTranslations } from "next-intl";
import InputField from "../ui/validation/inputfield";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SearchBox() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Search clicked:", { searchQuery });
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    const queryString = params.toString();
    const url = queryString
      ? `/${locale}/animals?${queryString}`
      : `/${locale}/animals`;
    console.log("Search navigating to:", url);
    router.push(url);
  };

  const handleSpeciesFilter = (species: string) => {
    console.log("Species filter clicked:", species);
    const params = new URLSearchParams();
    params.set("species", species);
    const url = `/${locale}/animals?${params.toString()}`;
    console.log("Navigating to:", url);
    router.push(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="rounded-2xl bg-accent max-w-screen p-5">
        <div className="flex items-center gap-2" onKeyDown={handleKeyPress}>
          <span className="w-full">
            <InputField
              type="text"
              placeholder={t("what do you search?")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </span>
          <Button
            icon={<SearchIcon />}
            color="primary"
            onClick={handleSearch}
          />
        </div>

        <div className="md:flex hidden flex-wrap items-center justify-center mt-4 gap-2">
          <Button
            icon={<Cat />}
            label={t("cats")}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Cat")}
          />
          <Button
            icon={<Dog />}
            label={t("dogs")}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Dog")}
          />
          <Button
            icon={<Bird />}
            label={t("birds")}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Bird")}
          />
          <Button
            icon={<Rabbit />}
            label={t("rodents")}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Rabbit")}
          />
        </div>

        <div className="md:hidden flex flex-wrap items-center justify-center mt-4 gap-2">
          <Button
            icon={<Cat />}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Cat")}
          />
          <Button
            icon={<Dog />}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Dog")}
          />
          <Button
            icon={<Bird />}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Bird")}
          />
          <Button
            icon={<Rabbit />}
            rounded={true}
            color="secondary"
            onClick={() => handleSpeciesFilter("Rabbit")}
          />
        </div>
      </div>
    </div>
  );
}
