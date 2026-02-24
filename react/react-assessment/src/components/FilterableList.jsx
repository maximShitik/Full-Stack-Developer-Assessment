import FilterBar from "./FilterBar";
import ItemCard from "./ItemCard";
import { useState, useEffect ,useRef } from "react";
import "./FilterableList.css";

const wait_time = 700;



function FilterableList({ items, loading = false, onItemClick }) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortOption, setSortOption] = useState("date_newest");
  const [debouncedSearchtext, setDebouncedSearchtext] = useState(searchText);
  const [didInitFromUrl, setDidInitFromUrl] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);





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

  useEffect(() => {
    if (!didInitFromUrl) return;

    const params = new URLSearchParams();

    if (searchText) params.set("search", searchText);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedStatuses.length > 0)
      params.set("status", selectedStatuses.join(","));
    if (sortOption) params.set("sort", sortOption);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    didInitFromUrl,
    searchText,
    selectedCategory,
    selectedStatuses,
    sortOption,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchtext(searchText);
    }, wait_time);

    return () => clearTimeout(timer);
  }, [searchText]);

  const categories = Array.from(new Set(items.map((item) => item.category)));

  const filtredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(debouncedSearchtext.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedItems = [...filtredItems];

  sortedItems.sort((a, b) => {
    if (sortOption === "title_asc") return a.title.localeCompare(b.title);
    if (sortOption === "title_desc") return b.title.localeCompare(a.title);

    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);

    if (sortOption === "date_newest") return bTime - aTime;
    return aTime - bTime;
  });

    function moveFocus(nextIndex) {

  const clamped = Math.max(0, Math.min(nextIndex, sortedItems.length - 1));
  setActiveIndex(clamped);
  const el = itemRefs.current[clamped];
  if (el) el.focus();
}


  useEffect(() => {
  setActiveIndex(0);
}, [sortedItems.length]);

  if (loading) {
    return (
      <div className="fl-spinner-wrapper">
        <div className="fl-spinner"></div>
      </div>
    );
  }

  function toggleStatus(status) {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  }

  return (
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
        Showing {filtredItems.length} of {items.length} items
      </div>

      {sortedItems.length === 0 ? (
        <div style={{ marginTop: 20 }}>No items to Display.</div>
      ) : (
        <div
  className="fl-grid"
  role="list"
  onKeyDown={(e) => {
    if (sortedItems.length === 0) return;

    const isArrow =
      e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "ArrowUp";

    if (!isArrow && e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();

    if (e.key === "ArrowRight" || e.key === "ArrowDown") moveFocus(activeIndex + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") moveFocus(activeIndex - 1);

    if (e.key === "Enter" || e.key === " ") {
      onItemClick?.(sortedItems[activeIndex]);
    }
  }}
>
          {sortedItems.map((item, index) => (
  <ItemCard
    key={item.id}
    item={item}
    onClick={() => onItemClick?.(item)}
    tabIndex={index === activeIndex ? 0 : -1}
    refCallback={(el) => (itemRefs.current[index] = el)}
    role="listitem"
  />
))}
        </div>
      )}
    </div>
  );
}

export default FilterableList;
