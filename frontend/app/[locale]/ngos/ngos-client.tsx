"use client";

import React, {useState, useEffect, useRef, useCallback} from "react";
import NGOCard from "@/app/components/ngos/ngo-card";
import Drawer from "@/app/components/ui/filter-drawer";
import {Building2, RefreshCw} from "lucide-react";
import {NGOFilterState} from "./filterNgos";
import {useTranslations} from "next-intl";
import {NGO} from "@/app/types/ngo";

interface BackendNGOHours {
  ngoId: string;
  startTime: string;
  endTime: string;
  weekday: string;
}

interface BackendNGO {
  id: string;
  name: string;
  email?: string;
  country: string;
  verificationDocumentPath?: string;
  verificationDocumentLink?: string;
  verified?: boolean;
  logoPicturePath?: string;
  logoPictureLink?: string;
  phoneNumber?: string;
  memberCount?: number;
  website?: string[];
  mission?: string;
  ngoHours?: BackendNGOHours[];
}

interface NGOsClientProps {
  locale: string;
}

export default function NGOsClient({locale}: NGOsClientProps) {
  const t = useTranslations("ngos");
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<NGO[]>([]);
  const limit = 9;
  const observerTarget = useRef<HTMLDivElement>(null);

  const [currentFilters, setCurrentFilters] = useState<NGOFilterState>({
    searchQuery: "",
    ngoName: [],
    location: {country: [], city: ""},
    verified: "All",
    members: ["Any"],
  });

  const [appliedFilters, setAppliedFilters] = useState<NGOFilterState>({
    searchQuery: "",
    ngoName: [],
    location: {country: [], city: ""},
    verified: "All",
    members: ["Any"],
  });

  const transformNGOData = useCallback((backendNGO: BackendNGO): NGO => {
    const logoUrl = backendNGO.logoPictureLink?.trim();
    const hasValidLogo = logoUrl && logoUrl.length > 0;

    return {
      id: backendNGO.id,
      name: backendNGO.name,
      email: backendNGO.email,
      country: backendNGO.country,
      verificationDoc: backendNGO.verificationDocumentLink,
      verified: backendNGO.verified || false,
      logo: hasValidLogo ? logoUrl : "logo.png",
      phone: backendNGO.phoneNumber,
      membercount: backendNGO.memberCount || 0,
      websites: backendNGO.website || [],
      mission: backendNGO.mission,
      member: [],
      ngoHours: Array.isArray(backendNGO.ngoHours)
        ? backendNGO.ngoHours.map((hour) => ({
            start: hour.startTime,
            end: hour.endTime,
            weekday: hour.weekday,
          }))
        : [],
      status: "Opened" as const,
      animals: [],
    };
  }, []);

  const loadNGOs = useCallback(
    async (isFilterOrRefresh = false) => {
      if (loading) return;

      setLoading(true);
      const currentOffset = isFilterOrRefresh ? 0 : offset;

      try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("offset", currentOffset.toString());

        if (appliedFilters.searchQuery && appliedFilters.searchQuery.trim() !== "") {
          params.append("searchQuery", appliedFilters.searchQuery);
        }

        if (appliedFilters.location.country.length > 0) {
          appliedFilters.location.country.forEach((country: string) => {
            params.append("country", country);
          });
        }
        if (appliedFilters.location.city && appliedFilters.location.city.trim() !== "") {
          params.append("city", appliedFilters.location.city);
        }

        if (appliedFilters.ngoName && appliedFilters.ngoName.length > 0) {
          appliedFilters.ngoName.forEach((name: string) => {
            params.append("ngoName", name);
          });
        }

        if (appliedFilters.verified && appliedFilters.verified !== "All") {
          params.append("verified", appliedFilters.verified);
        }

        if (appliedFilters.members && appliedFilters.members.length > 0) {
          appliedFilters.members.forEach((memberCategory: string) => {
            if (memberCategory !== "Any") {
              params.append("members", memberCategory);
            }
          });
        }

        const response = await fetch(`/api/ngos?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const transformedNGOs = data.data.map(transformNGOData);
          setNgos((prev: NGO[]) =>
            isFilterOrRefresh ? transformedNGOs : [...prev, ...transformedNGOs.filter((n: NGO) => !prev.find((p) => p.id === n.id))]
          );
          setOffset(currentOffset + data.data.length);
          setHasMore(currentOffset + data.data.length < data.meta.total);
        } else {
          if (isFilterOrRefresh) setNgos([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading NGOs:", error);
        if (isFilterOrRefresh) setNgos([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [offset, limit, appliedFilters, transformNGOData, loading]
  );

  useEffect(() => {
    loadNGOs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadNGOs(false);
        }
      },
      {threshold: 0.1}
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadNGOs]);

  const handleNGOFilterChange = (changedFilters: Partial<NGOFilterState>) => {
    setCurrentFilters((prev: NGOFilterState) => ({
      ...prev,
      ...changedFilters,
    }));
  };

  const handleNGOApplyFilters = () => {
    setAppliedFilters({...currentFilters});
    setOffset(0);
    setNgos([]);
    setHasMore(true);
  };

  const handleRefresh = () => {
    const defaultFilters: NGOFilterState = {
      searchQuery: "",
      ngoName: [],
      location: {country: [], city: ""},
      verified: "All",
      members: ["Any"],
    };

    setCurrentFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchMode(false);
    setSearchResults([]);
    setOffset(0);
    setNgos([]);
    setHasMore(true);
    loadNGOs(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchResults = (results: any[]) => {
    const transformedSearchResults = results.map((ngo) => {
      const backendNGO: BackendNGO = {
        id: ngo.id?.toString() || "",
        name: ngo.name || "",
        email: ngo.email,
        country: ngo.country || "",
        verificationDocumentLink: ngo.verificationDocumentLink,
        verified: ngo.verified,
        logoPictureLink: ngo.logoPictureLink,
        phoneNumber: ngo.phoneNumber,
        memberCount: ngo.memberCount,
        website: ngo.website,
        mission: ngo.mission,
        ngoHours: ngo.ngoHours,
      };
      return transformNGOData(backendNGO);
    });

    setSearchResults(transformedSearchResults);
    setSearchMode(true);
  };

  return (
    <Drawer
      ngoFilters={currentFilters}
      onNGOFilterChange={handleNGOFilterChange}
      onNGOApplyFilters={handleNGOApplyFilters}
      onNGOSearchResults={handleSearchResults}>
      <div className="container mx-auto p-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t("title", {defaultMessage: "NGOs"})}</h1>
        </div>

        {searchMode && (
          <div className="mb-4 p-3 bg-accent/20 rounded-lg border border-accent/50">
            <p className="text-sm text-base-content">
              {t("searchResults", {defaultMessage: "Showing search results"})} ({searchResults.length} {t("found", {defaultMessage: "found"})})
              <button
                onClick={() => {
                  setSearchMode(false);
                  setSearchResults([]);
                  setCurrentFilters((prev) => ({...prev, searchQuery: ""}));
                }}
                className="ml-2 text-xs underline hover:no-underline">
                {t("clearSearch", {defaultMessage: "Clear search"})}
              </button>
            </p>
          </div>
        )}

        {(searchMode ? searchResults : ngos).length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 min-h-full">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              {searchMode
                ? t("noSearchResults", {
                    defaultMessage: "No search results found",
                  })
                : t("noNGOsFound", {defaultMessage: "No NGOs found"})}
            </h2>
            <p className="text-base-content/70 text-center max-w-md mb-8">
              {searchMode
                ? t("noSearchResultsMessage", {
                    defaultMessage: "Try different search terms or clear the search to browse all NGOs.",
                  })
                : t("noNGOsMessage", {
                    defaultMessage: "We couldn't find any NGOs with the current filters. Try adjusting your search or check back soon!",
                  })}
            </p>
            <button onClick={handleRefresh} className="btn btn-primary gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("refreshButton", {
                defaultMessage: "Refresh / Clear Filters",
              })}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(searchMode ? searchResults : ngos).map((ngo: NGO) => (
              <NGOCard ngo={ngo} locale={locale} key={ngo.id} />
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-8 h-full">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-75"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
            </div>
          </div>
        )}

        {!loading && !searchMode && ngos.length > 0 && hasMore && <div ref={observerTarget} className="h-10 w-full" />}

        {!loading && !searchMode && ngos.length > 0 && !hasMore && (
          <div className="text-center py-8 text-base-content/60">
            <p>
              {t("endOfList", {
                defaultMessage: "You've reached the end of the list.",
              })}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
}
