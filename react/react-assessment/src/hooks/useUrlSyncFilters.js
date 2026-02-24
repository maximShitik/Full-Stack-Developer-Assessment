/**
 * useUrlSyncFilters
 * -----------------
 * Synchronizes filter state with URL query parameters.
 *
 * - On mount: reads values from URL into state
 * - On change: updates URL without page reload
 *
 * Enables sharing filtered views via link.
 */

import { useEffect, useState } from "react";

export function useUrlSyncFilters({
  searchText,
  selectedCategory,
  selectedStatuses,
  sortOption,
  setSearchText,
  setSelectedCategory,
  setSelectedStatuses,
  setSortOption,
}) {
  const [didInitFromUrl, setDidInitFromUrl] = useState(false);

  // URL -> state (run once)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const search = params.get("search") || "";
    const category = params.get("category") || "";
    const status = params.get("status");
    const sort = params.get("sort") || "date_newest";

    setSearchText(search);
    setSelectedCategory(category);
    setSortOption(sort);

    if (status) {
      setSelectedStatuses(status.split(","));
    }

    setDidInitFromUrl(true);
  }, []);

  // state -> URL (after init)
  useEffect(() => {
    if (!didInitFromUrl) return;

    const params = new URLSearchParams();

    if (searchText) params.set("search", searchText);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedStatuses.length > 0) params.set("status", selectedStatuses.join(","));
    if (sortOption) params.set("sort", sortOption);

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;

    window.history.replaceState({}, "", newUrl);
  }, [didInitFromUrl, searchText, selectedCategory, selectedStatuses, sortOption]);

  return { didInitFromUrl };
}