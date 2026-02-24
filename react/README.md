# React — Filterable Item List

## Overview
This section implements a reusable `FilterableList` component in React.

It displays items as cards and supports filtering + sorting, with additional UX bonuses (debounced search, URL persistence, and keyboard navigation).

---

## Architecture

### 1. Components (UI only)
- **`FilterableList`** — orchestrates state + renders the list
- **`FilterBar`** — renders filter controls (search/category/status/sort)
- **`ItemCard`** — renders a single item as a clickable card button

### 2. Hooks (reusable behavior)
- **`useDebouncedValue`** — debounces search input to avoid filtering on every keystroke
- **`useUrlSyncFilters`** — syncs filter state ↔ URL query params (shareable links)
- **`useKeyboardListNavigation`** — accessible keyboard navigation (roving tabindex)

### 3. Utils (pure functions)
- **`getCategories`** — extract unique categories
- **`filterItems`** — apply search/category/status filtering (pure, testable)
- **`sortItems`** — sort by title/date (pure, testable)

This separation keeps rendering simple, logic testable, and behavior reusable.

---

## Features

### Core
- Items displayed as cards
- Case-insensitive search by title
- Category dropdown filter
- Status multi-select filter
- Sort:
  - Title (A–Z / Z–A)
  - Date (Newest / Oldest)
- Loading state (spinner)
- Empty state message
- Responsive layout

### Bonus
- Debounced search
- URL query parameter persistence
- Keyboard navigation (Arrow keys + Enter/Space)

### Not Implemented
- UI “smoothing” / animations

---

## Assumptions
- Items are passed via props (`items`)
- `createdAt` is a valid ISO date string
- Filtering and sorting are done client-side
- Using **JSX** is allowed for this assessment

---

## How to Run
```bash
cd react
npm install
npm run dev
npm test