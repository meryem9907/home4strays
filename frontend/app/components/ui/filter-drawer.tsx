"use client";
import {ReactNode, useEffect, useState} from "react";
import {FilterIcon} from "lucide-react";
import Filter from "../animals/filter/filter";
import {usePathname} from "next/navigation";
import FilterNgos, {NGOFilterState} from "../../[locale]/ngos/filterNgos";
import {FilterState} from "../animals/filter/filter";

interface Pet {
  id: number;
  name: string;
  breed: string;
  gender: string;
  birthdate: Date;
  weight: number;
  profilePictureLink: string;
  castration: boolean;
  lastCheckUp: Date;
  eatingBehaviour: string;
  caretakerId: number;
  ngoMemberId: number;
  streetName: string;
  cityName: string;
  zip: string;
  country: string;
  houseNumber: string;
  localityTypeRequirement: string;
  kidsAllowed: boolean;
  zipRequirement: string;
  experienceRequirement: string;
  minimumSpaceRequirement: number;
  breedName: string;
  species: string;
  information: string;
}

interface NGO {
  id: number;
  name: string;
  verified: boolean;
  memberCount: number;
  country: string;
  city: string;
}

interface DrawerProps {
  children: ReactNode;
  filters?: FilterState;
  onFilterChange?: (changedFilters: Partial<FilterState>) => void;
  onApplyFilters?: () => void;
  onSearchResults?: (results: Pet[]) => void;
  ngoFilters?: NGOFilterState;
  onNGOFilterChange?: (changedFilters: Partial<NGOFilterState>) => void;
  onNGOApplyFilters?: () => void;
  onNGOSearchResults?: (results: NGO[]) => void;
}

export default function Drawer({
  children,
  filters,
  onFilterChange,
  onApplyFilters,
  onSearchResults,
  ngoFilters,
  onNGOFilterChange,
  onNGOApplyFilters,
  onNGOSearchResults,
}: DrawerProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const [defaultNgoFilters, setDefaultNgoFilters] = useState<NGOFilterState>({
    searchQuery: "",
    ngoName: [],
    location: { country: [], city: "" },
    verified: "All",
    members: ["Any"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleNGOFilterChange = (changedFilters: Partial<NGOFilterState>) => {
    if (onNGOFilterChange) onNGOFilterChange(changedFilters);
    else setDefaultNgoFilters((prev) => ({ ...prev, ...changedFilters }));
  };

  const handleNGOApplyFilters = () => {
    if (onNGOApplyFilters) onNGOApplyFilters();
    else console.log("Applying NGO filters:", defaultNgoFilters);
  };

  if (isMobile) {
    // === MOBILE: Drawer ===
    return (
      <div className="drawer">
        <input id="filter-sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-base-100 w-full">
            <div className="flex-none">
              <label htmlFor="filter-sidebar" className="btn btn-square btn-ghost">
                <FilterIcon className="w-6 h-6" />
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Filters</h1>
            </div>
          </div>

          <div className="p-1">{children}</div>
        </div>

        <div className="drawer-side z-30">
          <label htmlFor="filter-sidebar" className="drawer-overlay"></label>
          <aside className="w-80 bg-accent text-base-content h-full overflow-y-auto px-4 pb-16 md:pb-0 pt-18">
            {pathname.includes("/animals") && filters && onFilterChange && onApplyFilters ? (
              <Filter
                filters={filters}
                onFilterChange={onFilterChange}
                onApplyFilters={onApplyFilters}
                onSearchResults={onSearchResults}
              />
            ) : null}
            {pathname.includes("/ngos") && (
              <FilterNgos
                filters={ngoFilters || defaultNgoFilters}
                onFilterChange={handleNGOFilterChange}
                onApplyFilters={handleNGOApplyFilters}
                onSearchResults={onNGOSearchResults}
              />
            )}
          </aside>
        </div>
      </div>
    );
  }

  // === DESKTOP: Static Layout ===
  return (
    <div className="flex">
      <aside className="fixed top-18 bottom-0 w-80 bg-accent text-base-content">
        <div className="h-full overflow-y-auto px-4 pb-15 shrink-0">
          {pathname.includes("/animals") && filters && onFilterChange && onApplyFilters ? (
            <Filter
              filters={filters}
              onFilterChange={onFilterChange}
              onApplyFilters={onApplyFilters}
              onSearchResults={onSearchResults}
            />
          ) : null}
          {pathname.includes("/ngos") && (
            <FilterNgos
              filters={ngoFilters || defaultNgoFilters}
              onFilterChange={handleNGOFilterChange}
              onApplyFilters={handleNGOApplyFilters}
              onSearchResults={onNGOSearchResults}
            />
          )}
        </div>
      </aside>
      <main className="flex-1 p-4 pl-80">{children}</main>
    </div>
  );
}
