import FilterBar from "./FilterBar";
import ItemCard from "./ItemCard";
import { useState } from "react";
import "./FilterableList.css";

function FilterableList({ items, loading = false, onItemClick }) {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [sortOption, setSortOption] = useState("date_newest");
    const [useEffect , setUseEffect] = useState("");

    const categories = Array.from(new Set(items.map((item) => item.category)));

    const filtredItems = items.filter((item) => {
        const matchesSearch = item.title
            .toLowerCase()
            .includes(searchText.trim().toLowerCase());

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

    if (loading) {
        return( <div className="fl-spinner-wrapper">
      <div className="fl-spinner"></div>
    </div>);
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
                <div style={{ marginTop: 20 }}>
                    No items to Display.
                </div>
            ) : (
                <div className="fl-grid">
                    {sortedItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onClick={() => onItemClick?.(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FilterableList;
