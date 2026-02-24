# Filterable Item List (React)

## Overview

This project implements a reusable `FilterableList` component built with React.

It provides filtering, sorting, URL state persistence and keyboard navigation.

The implementation focuses on:
- Clean architecture
- Separation of concerns
- Reusability
- Accessibility

---

## Features

### Core Requirements
- Display items as cards
- Case-insensitive search by title
- Category filter (dropdown)
- Status filter (multi-select)
- Sort by:
  - Title (A–Z / Z–A)
  - Date (Newest / Oldest)
- Loading state (spinner)
- Empty state message
- Responsive layout (grid → single column on mobile)

### Bonus Implemented
- Debounced search
- URL query parameter persistence
- Keyboard navigation (Arrow keys + Enter/Space)

---

## Architecture

The project separates responsibilities into three layers:

### 1. Components
UI rendering only.
- `FilterableList`
- `FilterBar`
- `ItemCard`

### 2. Hooks
Reusable stateful logic:
- `useDebouncedValue`
- `useUrlSyncFilters`
- `useKeyboardListNavigation`

### 3. Utils
Pure data-processing functions:
- `getCategories`
- `filterItems`
- `sortItems`

This separation improves readability, maintainability and testability.

---

## Assumptions

- Items are provided via props.
- `createdAt` is a valid ISO date string.
- Filtering and sorting are performed client-side.
- No external animation libraries are used.

---

## Run

cd to the react-assessment foler
npm install
npm run dev