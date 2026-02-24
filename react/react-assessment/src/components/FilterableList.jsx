import FilterBar from "./FilterBar";
import ItemCard from "./ItemCard";
import { useState } from "react";
import "./FilterableList.css";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useUrlSyncFilters } from "../hooks/useUrlSyncFilters";
import { useKeyboardListNavigation } from "../hooks/useKeyboardListNavigation";
import { getCategories, filterItems, sortItems } from "../utils/listUtils";

const WAIT_TIME_MS = 700;

function FilterableList({ items, loading = false, onItemClick }) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortOption, setSortOption] = useState("date_newest");

  // Debounce search
  const debouncedSearchText = useDebouncedValue(searchText, WAIT_TIME_MS);

  // URL sync (bonus)
  useUrlSyncFilters({
    searchText,
    selectedCategory,
    selectedStatuses,
    sortOption,
    setSearchText,
    setSelectedCategory,
    setSelectedStatuses,
    setSortOption,
  });

  const categories = getCategories(items);

  const filteredItems = filterItems(items, {
    searchText: debouncedSearchText,
    selectedCategory,
    selectedStatuses,
  });

  const sortedItems = sortItems(filteredItems, sortOption);

  // Keyboard navigation (bonus)
  const nav = useKeyboardListNavigation(sortedItems, onItemClick);

  function toggleStatus(status) {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  }


return (
  <>
    <h2 className="fl-h2">Filterable List</h2>

    <div className="fl-container">
      <FilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        selectedStatuses={selectedStatuses}
        onToggleStatus={toggleStatus}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />

      <div className="fl-inner-container">
        Showing {filteredItems.length} of {items.length} items
      </div>

      {/* 👇 כאן שמים את הספינר רק במקום הרשימה */}
      {loading ? (
        <div className="fl-spinner-wrapper">
          <div className="fl-spinner"></div>
        </div>
      ) : sortedItems.length === 0 ? (
        <div style={{ marginTop: 20 }}>No items to display.</div>
      ) : (
        <div className="fl-grid" role="list" onKeyDown={nav.onKeyDown}>
          {sortedItems.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
              {...nav.getItemProps(index)}
            />
          ))}
        </div>
      )}
    </div>
  </>
);
}

export default FilterableList;