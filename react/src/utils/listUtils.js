/**
 * listUtils.js
 * -------------
 * Pure utility functions for list processing.
 * These functions contain no React logic and can be reused
 * outside of React components.
 *
 * Responsibilities:
 * - Extract unique categories
 * - Filter items based on search and selected filters
 * - Sort items by selected sort option
 */

export function getCategories(items) {
  return Array.from(new Set(items.map((item) => item.category)));
}

export function filterItems(items, { searchText, selectedCategory, selectedStatuses }) {
  const q = searchText.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

export function sortItems(items, sortOption) {
  const copy = [...items];

  copy.sort((a, b) => {
    if (sortOption === "title_asc") return a.title.localeCompare(b.title);
    if (sortOption === "title_desc") return b.title.localeCompare(a.title);

    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);

    if (sortOption === "date_newest") return bTime - aTime;
    return aTime - bTime; // date_oldest
  });

  return copy;
}