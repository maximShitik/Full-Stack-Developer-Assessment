import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

describe("useDebouncedValue", () => {
  it("returns the updated value only after the delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "a" } }
    );

    // update value
    rerender({ value: "ab" });

    // before timeout -> still old value
    expect(result.current).toBe("a");

    // after timeout -> new value appears
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("ab");

    vi.useRealTimers();
  });
});