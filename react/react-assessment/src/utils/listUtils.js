export function getCategories(items){
    return Array.from(new Set(items.map((item) => item.category)));
}

 export function filterItems(items, { searchText, selectedCategory, selectedStatuses }){
    const text = searchText.trim().toLowerCase();

    return items.filter((item) => {
        const matchesSearch = item.title
      .toLowerCase()
      .includes(debouncedSearchtext.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

    return matchesSearch && matchesCategory && matchesStatus;
  });

    }


 export function sortItems(items, sortOption){

    const items_copy = [...items]

    items_copy.sort((a,b) => {
            if (sortOption === "title_asc") return a.title.localeCompare(b.title);
    if (sortOption === "title_desc") return b.title.localeCompare(a.title);

    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);

    if (sortOption === "date_newest") return bTime - aTime;
    return aTime - bTime;
    });

    return items_copy
 }