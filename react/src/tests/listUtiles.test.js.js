import { describe, it, expect } from "vitest";
import { filterItems, sortItems } from "../utils/listUtils";

describe("listUtils", () => {
  const items = [
    { id: "1", title: "Project Alpha", category: "Dev", status: "active", createdAt: "2024-01-15T10:00:00Z" },
    { id: "2", title: "Design Review", category: "Design", status: "pending", createdAt: "2024-01-14T09:00:00Z" },
    { id: "3", title: "API Documentation", category: "Dev", status: "archived", createdAt: "2023-12-01T08:00:00Z" },
  ];

  it("filterItems: filters by search text (case-insensitive) + category + statuses", () => {
    const result = filterItems(items, {
      searchText: "project",
      selectedCategory: "Dev",
      selectedStatuses: ["active"],
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("sortItems: sorts by date newest", () => {
    const sorted = sortItems(items, "date_newest");
    expect(sorted[0].id).toBe("1"); // newest date
    expect(sorted[sorted.length - 1].id).toBe("3"); // oldest date
  });
});