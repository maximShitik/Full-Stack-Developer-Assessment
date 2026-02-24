import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FilterableList from "../components/FilterableList";

describe("FilterableList", () => {
  const items = [
    { id: "1", title: "Alpha", category: "Dev", status: "active", createdAt: "2024-01-01T00:00:00Z" },
    { id: "2", title: "Beta", category: "Design", status: "pending", createdAt: "2024-01-02T00:00:00Z" },
  ];

  it("shows spinner when loading=true", () => {
    const { container } = render(
      <FilterableList items={items} loading={true} onItemClick={() => {}} />
    );

    expect(container.querySelector(".fl-spinner")).toBeTruthy();
  });

  it("renders items when not loading", () => {
    render(<FilterableList items={items} loading={false} onItemClick={() => {}} />);

    expect(screen.getByText(/Alpha/i)).toBeTruthy();
    expect(screen.getByText(/Beta/i)).toBeTruthy();
  });
});