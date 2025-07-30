"use client";
import { useState, useEffect } from "react";
import { LocateFixed, X, Search } from "lucide-react";
import SearchableDropdown from "@/app/components/animals/filter/searchDropdown";
import Button from "@/app/components/ui/button";
import { membersCount } from "@/app/components/animals/filter/filterOptions";
import CheckboxGroup from "@/app/components/animals/filter/checkBoxGroup";
import ButtonGroup from "../../components/animals/filter/buttonGroup";
import { useGeoLocation } from "../../components/animals/filter/locationTracker";
import { useTranslations } from "next-intl";
import InputField from "@/app/components/ui/validation/inputfield";

/**
 * Interface defining the complete filter state for NGO search and filtering.
 *
 * This interface represents all possible filter criteria that users can apply
 * when searching for NGO organizations, including location, verification status,
 * organization size, and text-based search.
 *
 * @interface NGOFilterState
 * @property {string} [searchQuery] - Optional text search query for NGO names and descriptions
 * @property {string[]} ngoName - Array of specific NGO names to filter by
 * @property {Object} location - Location-based filtering criteria
 * @property {string[]} location.country - Array of countries to include in search
 * @property {string} location.city - Specific city name to filter by
 * @property {string} [location.zip] - Optional ZIP/postal code for precise location filtering
 * @property {"All" | "verified" | "not verified"} verified - Verification status filter
 * @property {Array} members - Organization size categories to include in results
 */
export interface NGOFilterState {
  searchQuery?: string;
  ngoName: string[];
  location: {
    country: string[];
    city: string;
    zip?: string;
  };
  verified: "All" | "verified" | "not verified";
  members: ("Any" | "less than 15" | "15 to 30" | "more than 30")[];
}

/**
 * Interface representing an NGO organization in the system.
 *
 * @interface NGO
 * @property {number} id - Unique identifier for the NGO
 * @property {string} name - Organization name
 * @property {boolean} verified - Whether the NGO is verified by administrators
 * @property {number} memberCount - Number of members in the organization
 * @property {string} country - Country where NGO is located
 * @property {string} city - City where NGO is located
 */
interface NGO {
  id: number;
  name: string;
  verified: boolean;
  memberCount: number;
  country: string;
  city: string;
  // Add other NGO properties as needed
}

/**
 * Props interface for the NGO Filter component.
 *
 * @interface NGOFilterProps
 * @property {NGOFilterState} filters - Current filter state
 * @property {Function} onFilterChange - Callback when any filter value changes
 * @property {Function} onApplyFilters - Callback to apply current filters to search
 * @property {Function} [onSearchResults] - Optional callback with search results
 */
interface NGOFilterProps {
  filters: NGOFilterState;
  onFilterChange: (changedFilters: Partial<NGOFilterState>) => void;
  onApplyFilters: () => void;
  onSearchResults?: (results: NGO[]) => void;
}

/**
 * Verification status options for filtering NGOs.
 * Used in the verification status button group filter.
 */
const verifiedOptions = [
  { value: "verified" as const, label: "Verified" },
  { value: "not verified" as const, label: "Not Verified" },
];

/**
 * NGO Filter component providing comprehensive filtering options for NGO search.
 *
 * This component renders a complete filter interface for finding NGO organizations
 * based on various criteria including text search, location, verification status,
 * organization size, and more. It integrates with geolocation services and provides
 * real-time search capabilities.
 *
 * Features:
 * - Text-based search with real-time results
 * - Location filtering with geolocation support
 * - NGO verification status filtering
 * - Organization size filtering
 * - Specific NGO name selection
 * - Active filter count display
 * - Reset all filters functionality
 * - Internationalization support
 * - Loading states for async operations
 *
 * @param {NGOFilterProps} props - Component props
 * @returns {JSX.Element} Rendered NGO filter component
 *
 * @example
 * ```tsx
 * function NGOSearchPage() {
 *   const [filters, setFilters] = useState<NGOFilterState>({
 *     ngoName: [],
 *     location: { country: [], city: "" },
 *     verified: "All",
 *     members: ["Any"]
 *   });
 *
 *   const handleFilterChange = (changes: Partial<NGOFilterState>) => {
 *     setFilters(prev => ({ ...prev, ...changes }));
 *   };
 *
 *   const handleApplyFilters = () => {
 *     // Apply filters to NGO search
 *     searchNGOs(filters);
 *   };
 *
 *   return (
 *     <Filter
 *       filters={filters}
 *       onFilterChange={handleFilterChange}
 *       onApplyFilters={handleApplyFilters}
 *       onSearchResults={(results) => setSearchResults(results)}
 *     />
 *   );
 * }
 * ```
 */
export default function Filter({
  filters,
  onFilterChange,
  onApplyFilters,
  onSearchResults,
}: NGOFilterProps) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [availableNGOs, setAvailableNGOs] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [loadingNGOs, setLoadingNGOs] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const {
    getLocation: fetchGeoLocation,
    country: fetchedGeoCountry,
    location: fetchedGeoCityString,
  } = useGeoLocation();

  const t = useTranslations("filter");

  // Fetch available NGO names
  useEffect(() => {
    /**
     * Fetches available NGO names from the API for the searchable dropdown.
     * Handles loading states and error scenarios gracefully.
     */
    const fetchNGONames = async () => {
      console.log(`[DEBUG] Fetching NGO names...`);
      setLoadingNGOs(true);
      try {
        const response = await fetch("/api/ngos/names");
        console.log(`[DEBUG] NGO names response status: ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`[DEBUG] NGO names data:`, data);
          console.log(`[DEBUG] NGO names data.data:`, data.data);
          console.log(`[DEBUG] NGO names data.data type:`, typeof data.data);

          const filteredNGOs = (data.data || []).filter(
            (ngo: unknown) =>
              ngo != null && typeof ngo === "string" && ngo.trim() !== ""
          );

          console.log(`[DEBUG] Filtered NGO names:`, filteredNGOs);
          setAvailableNGOs(filteredNGOs);
        } else {
          console.error(
            "[DEBUG] Failed to fetch NGO names:",
            response.statusText
          );
          const errorText = await response.text();
          console.error("[DEBUG] NGO names error response:", errorText);
        }
      } catch (error) {
        console.error("[DEBUG] Error fetching NGO names:", error);
      } finally {
        setLoadingNGOs(false);
      }
    };

    fetchNGONames();
  }, []);

  // Fetch available countries
  useEffect(() => {
    /**
     * Fetches available countries from the API for location filtering.
     * Provides options for users to filter NGOs by country.
     */
    const fetchCountries = async () => {
      console.log(`[DEBUG] Fetching countries...`);
      setLoadingCountries(true);
      try {
        const response = await fetch("/api/ngos/countries");
        console.log(`[DEBUG] Countries response status: ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          console.log(`[DEBUG] Countries data:`, data);
          console.log(`[DEBUG] Countries data.data:`, data.data);
          console.log(`[DEBUG] Countries data.data type:`, typeof data.data);

          const filteredCountries = (data.data || []).filter(
            (country: unknown) =>
              country != null &&
              typeof country === "string" &&
              country.trim() !== ""
          );

          console.log(`[DEBUG] Filtered countries:`, filteredCountries);
          setAvailableCountries(filteredCountries);
        } else {
          console.error(
            "[DEBUG] Failed to fetch countries:",
            response.statusText
          );
          const errorText = await response.text();
          console.error("[DEBUG] Countries error response:", errorText);
        }
      } catch (error) {
        console.error("[DEBUG] Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  /**
   * Handles changes to individual filter values.
   *
   * @param {keyof NGOFilterState} field - The filter field being changed
   * @param {NGOFilterState[keyof NGOFilterState]} value - The new value for the field
   */
  const handleValueChange = (
    field: keyof NGOFilterState,
    value: NGOFilterState[keyof NGOFilterState]
  ) => {
    onFilterChange({ [field]: value });
  };

  /**
   * Handles changes to the country selection filter.
   *
   * @param {string[]} selectedCountries - Array of selected country names
   */
  const handleCountryChange = (selectedCountries: string[]) => {
    onFilterChange({
      location: { ...filters.location, country: selectedCountries },
    });
  };

  /**
   * Uses the device's geolocation to automatically fill location filters.
   * Requests user permission and updates country and city filters with detected location.
   */
  const handleUseCurrentLocation = async () => {
    await fetchGeoLocation();
    onFilterChange({
      location: {
        country: fetchedGeoCountry
          ? [fetchedGeoCountry]
          : filters.location.country,
        city: fetchedGeoCityString || filters.location.city,
      },
    });
  };

  /**
   * Resets all filters to their default values and immediately applies the reset.
   * Provides a quick way for users to clear all applied filters.
   */
  const handleResetAll = () => {
    onFilterChange({
      searchQuery: "",
      ngoName: [],
      location: { country: [], city: "" },
      verified: "All",
      members: ["Any"],
    });
    onApplyFilters();
  };

  /**
   * Calculates the number of active filters for display purposes.
   *
   * @returns {number} Count of currently active/applied filters
   */
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery && filters.searchQuery.trim() !== "") count++;
    if (filters.ngoName.length > 0) count++;
    if (filters.location.country.length > 0 || filters.location.city) count++;
    if (filters.verified !== "All") count++;
    if (filters.members.some((m) => m !== "Any")) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  /**
   * Performs a text-based search for NGOs using the current search query.
   *
   * Sends a search request to the backend and provides results via the
   * onSearchResults callback. Handles loading states and error scenarios.
   */
  const handleSearch = async () => {
    if (!filters.searchQuery || filters.searchQuery.trim() === "") {
      return;
    }

    try {
      setSearchLoading(true);
      const searchParams = new URLSearchParams({
        q: filters.searchQuery.trim(),
      });

      const response = await fetch(
        `/api/search-ngo?${searchParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (onSearchResults) {
          onSearchResults(data.ngos || []);
        }
      } else if (response.status === 404) {
        if (onSearchResults) {
          onSearchResults([]);
        }
      } else {
        console.error("Search failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * Handles Enter key press in search input to trigger search.
   *
   * @param {React.KeyboardEvent} e - Keyboard event from search input
   */
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center py-4 px-2 sticky top-0 bg-accent z-10">
        <h3 className="flex justify-between items-center text-lg font-semibold">
          {t("Filters", { defaultMessage: "Filters" })}
          {activeFilterCount > 0 && (
            <span className="ml-2 badge badge-primary badge-sm">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button onClick={handleResetAll} className="btn btn-ghost btn-sm">
          <X size={16} className="mr-1" />{" "}
          {t("Reset All", { defaultMessage: "Reset All" })}
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-4 px-2">
        <div className="flex gap-2" onKeyDown={handleSearchKeyPress}>
          <div className="flex-1">
            <InputField
              type="text"
              value={filters.searchQuery || ""}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder={t("searchNGOs", {
                defaultMessage: "Search NGOs...",
              })}
            />
          </div>
          <button
            className="btn btn-square btn-primary"
            onClick={handleSearch}
            disabled={searchLoading || !filters.searchQuery?.trim()}
          >
            {searchLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main filter accordion using daisyUI join */}
      <div className="join join-vertical w-full">
        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Search by Ngo", { defaultMessage: "Search by NGO" })}
            {filters.ngoName.length > 0 && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.ngoName.length}
              </span>
            )}
          </div>
          <div className="collapse-content">
            {loadingNGOs ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              <SearchableDropdown
                options={availableNGOs}
                placeholder="Choose an NGO"
                onChange={(selected: string[]) =>
                  handleValueChange("ngoName", selected)
                }
              />
            )}
          </div>
        </div>

        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Location", { defaultMessage: "Location" })}
            {(filters.location.country.length > 0 || filters.location.city) && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.location.country.length > 0 && filters.location.city
                  ? `${filters.location.country.length}+1`
                  : filters.location.country.length > 0
                  ? filters.location.country.length
                  : "1"}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <div className="flex flex-col gap-3">
              {loadingCountries ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : (
                <SearchableDropdown
                  options={availableCountries}
                  placeholder={t("Choose a country", {
                    defaultMessage: "Choose a country",
                  })}
                  onChange={(selected: string[]) =>
                    handleCountryChange(selected)
                  }
                />
              )}
              <Button
                onClick={handleUseCurrentLocation}
                label={t("Use current location", {
                  defaultMessage: "Use Current Location",
                })}
                icon={<LocateFixed size={18} />}
                color="primary"
                wide
              />
            </div>
          </div>
        </div>

        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Verified", { defaultMessage: "Verified" })}
            {filters.verified !== "All" && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.verified}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <ButtonGroup
              items={verifiedOptions}
              active={filters.verified}
              onChange={(value: "All" | "verified" | "not verified") =>
                handleValueChange("verified", value)
              }
              includeReset
              resetIcon={<X />}
              resetValue="All"
              resetLabel=""
            />
          </div>
        </div>

        <div className="collapse collapse-arrow join-item">
          <input type="checkbox" />
          <div className="flex items-center collapse-title text-md font-semibold">
            {t("Number of members", { defaultMessage: "Number of Members" })}
            {filters.members.some((m) => m !== "Any") && (
              <span className="ml-2 badge badge-primary badge-xs">
                {filters.members.filter((m) => m !== "Any").length}
              </span>
            )}
          </div>
          <div className="collapse-content">
            <CheckboxGroup
              items={membersCount}
              active={filters.members}
              onChange={(
                value: ("Any" | "less than 15" | "15 to 30" | "more than 30")[]
              ) => handleValueChange("members", value)}
              includeReset
              resetIcon={<X />}
              resetValue="Any"
              resetLabel=""
            />
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div className="fixed bottom-0 left-0 flex text-center px-4 z-20 py-3 mb-0 w-80 hidden lg:block bg-accent">
        <Button
          onClick={onApplyFilters}
          label={t("Apply Filters", { defaultMessage: "Apply Filters" })}
          color="primary"
          wide
        />
      </div>

      <div className="sticky bottom-0 left-0 flex justify-center z-20 py-3 w-full lg:hidden bg-accent">
        <Button
          onClick={onApplyFilters}
          label={t("Apply Filters", { defaultMessage: "Apply Filters" })}
          color="primary"
          wide
        />
      </div>
    </div>
  );
}
