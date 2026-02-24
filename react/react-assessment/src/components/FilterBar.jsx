function FilterBar({
    searchText,
    onSearchTextChange,
    categories,
    selectedCategory,
    onSelectedCategoryChange,
    selectedStatuses,
    onToggleStatus,
    sortOption,
    onSortOptionChange,
}) {
    return (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
                placeholder="Search by title..."
                value={searchText}
                onChange={(e) => onSearchTextChange(e.target.value)}
            />

            <select
                value={selectedCategory}
                onChange={(e) => onSelectedCategoryChange(e.target.value)}
            >
                <option value="">All categories</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}

            </select>


            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedStatuses.includes("active")}
                        onChange={() => onToggleStatus("active")}
                    />
                    active
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={selectedStatuses.includes("pending")}
                        onChange={() => onToggleStatus("pending")}
                    />
                    pending
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={selectedStatuses.includes("archived")}
                        onChange={() => onToggleStatus("archived")}
                    />
                    archived
                </label>
            </div>
            <select
                value={sortOption}
                onChange={(e) => onSortOptionChange(e.target.value)}
            >
                <option value="title_asc">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
                <option value="date_newest">Date (Newest)</option>
                <option value="date_oldest">Date (Oldest)</option>
            </select>
        </div>
    );
}

export default FilterBar;
