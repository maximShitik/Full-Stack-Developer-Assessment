/**
 * useKeyboardListNavigation
 * --------------------------
 * Implements keyboard navigation (roving tabindex pattern)
 * for accessible list navigation.
 *
 * Supports:
 * - Arrow keys (move focus)
 * - Enter / Space (trigger item click)
 */

import { useEffect, useRef, useState } from "react";

export function useKeyboardListNavigation(items, onItemClick) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  // keep index valid when list size changes
  useEffect(() => {
    setActiveIndex(0);
  }, [items.length]);

  function moveFocus(nextIndex) {
    const max = items.length - 1;
    if (max < 0) return;

    const clamped = Math.max(0, Math.min(nextIndex, max));
    setActiveIndex(clamped);

    const el = itemRefs.current[clamped];
    if (el) el.focus();
  }

  function onKeyDown(e) {
    if (items.length === 0) return;

    const isArrow =
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowUp";

    if (!isArrow && e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();

    if (e.key === "ArrowRight" || e.key === "ArrowDown") moveFocus(activeIndex + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") moveFocus(activeIndex - 1);

    if (e.key === "Enter" || e.key === " ") {
      const item = items[activeIndex];
      if (item) onItemClick?.(item);
    }
  }

  function getItemProps(index) {
    return {
      tabIndex: index === activeIndex ? 0 : -1,
      refCallback: (el) => (itemRefs.current[index] = el),
      role: "listitem",
    };
  }

  return { activeIndex, onKeyDown, getItemProps };
}