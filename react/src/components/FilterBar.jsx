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
    <div className="filterbar">
      {/* Search */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="search">Search</label>
        <input
          id="search"
          className="filter-input"
          placeholder="Search by title..."
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="category">Category</label>
        <select
          id="category"
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onSelectedCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <fieldset className="filter-group filter-fieldset">
        <legend className="filter-label">Status</legend>

        <label className="filter-check">
          <input
            type="checkbox"
            checked={selectedStatuses.includes("active")}
            onChange={() => onToggleStatus("active")}
          />
          <span>Active</span>
        </label>

        <label className="filter-check">
          <input
            type="checkbox"
            checked={selectedStatuses.includes("pending")}
            onChange={() => onToggleStatus("pending")}
          />
          <span>Pending</span>
        </label>

        <label className="filter-check">
          <input
            type="checkbox"
            checked={selectedStatuses.includes("archived")}
            onChange={() => onToggleStatus("archived")}
          />
          <span>Archived</span>
        </label>
      </fieldset>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="sort">Sort</label>
        <select
          id="sort"
          className="filter-select"
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value)}
        >
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
          <option value="date_newest">Date (Newest)</option>
          <option value="date_oldest">Date (Oldest)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;