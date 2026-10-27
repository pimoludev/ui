"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  PimoluTabsActivationMode,
  PimoluTabsContentProps,
  PimoluTabsListProps,
  PimoluTabsOrientation,
  PimoluTabsProps,
  PimoluTabsTriggerProps,
} from "./tabs.types";

import { tabsVariants } from "./tabs.variants";

/* =========================================
   HELPERS
========================================= */

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

/** Stable id fragment for values such as "account settings". */
function toId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-") || "tab";
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
  );
}

function Chevron({
  direction,
}: {
  direction: "start" | "end";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          direction === "start"
            ? "m15 18-6-6 6-6"
            : "m9 18 6-6-6-6"
        }
      />
    </svg>
  );
}

/* =========================================
   CONTEXT
========================================= */

interface TabsContextValue {
  value: string | undefined;
  setValue: (value: string) => void;

  baseId: string;

  orientation: PimoluTabsOrientation;
  activationMode: PimoluTabsActivationMode;
}

const TabsContext =
  createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Tabs>.`
    );
  }

  return context;
}

/* =========================================
   ROOT
========================================= */

export function Tabs({ classNames,
  children,

  defaultValue,
  value: controlledValue,
  onValueChange,

  orientation = "horizontal",
  activationMode = "automatic",

  variant = "line",
  size = "md",

  className,
}: PimoluTabsProps) {
  const [partClasses, scopeParts] = usePartClasses("tabs", classNames, true);

  const isControlled = controlledValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] =
    useState(defaultValue);

  const value = isControlled
    ? controlledValue
    : uncontrolledValue;

  const baseId = `pimolu-tabs-${useId()}`;

  const setValue = useCallback(
    (next: string) => {
      if (next === value) return;

      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onValueChange?.(next);
    },
    [value, isControlled, onValueChange]
  );

  const context = useMemo<TabsContextValue>(
    () => ({
      value,
      setValue,
      baseId,
      orientation,
      activationMode,
    }),
    [
      value,
      setValue,
      baseId,
      orientation,
      activationMode,
    ]
  );

  return scopeParts((
    <TabsContext.Provider value={context}>
      <div
        className={mergeClasses([
          tabsVariants({ variant, size }),
          orientation === "vertical" &&
            "pimolu-tabs--vertical",
          className,
        ]
          .filter(Boolean)
          .join(" "), partClasses.root)}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  ));
}

/* =========================================
   LIST
========================================= */

export function TabsList({ classNames,
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  dividers = false,
  scrollable = false,
  scrollPreviousLabel = "Previous tabs",
  scrollNextLabel = "Next tabs",
}: PimoluTabsListProps) {
  const [partClasses, scopeParts] = usePartClasses("tabs", classNames, false);

  const {
    value,
    setValue,
    orientation,
    activationMode,
  } = useTabs("TabsList");

  const listRef = useRef<HTMLDivElement | null>(null);

  /* A vertical list scrolls as a column; the arrows are for horizontal bars. */
  const isScrollable =
    scrollable && orientation === "horizontal";

  const itemCount = Children.count(children);

  const [overflow, setOverflow] = useState({
    start: false,
    end: false,
  });

  const updateOverflow = useCallback(() => {
    const list = listRef.current;

    if (!list || !isScrollable) {
      setOverflow((current) =>
        current.start || current.end
          ? { start: false, end: false }
          : current
      );

      return;
    }

    const max =
      list.scrollWidth - list.clientWidth;

    const next = {
      start: list.scrollLeft > 1,
      end: max > 1 && list.scrollLeft < max - 1,
    };

    setOverflow((current) =>
      current.start === next.start &&
      current.end === next.end
        ? current
        : next
    );
  }, [isScrollable]);

  useEffect(() => {
    if (!isScrollable) {
      updateOverflow();
      return;
    }

    updateOverflow();

    const list = listRef.current;

    if (!list) return;

    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(updateOverflow)
        : null;

    observer?.observe(list);

    window.addEventListener("resize", updateOverflow);

    const frame =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(updateOverflow)
        : 0;

    return () => {
      observer?.disconnect();

      window.removeEventListener(
        "resize",
        updateOverflow
      );

      if (frame) cancelAnimationFrame(frame);
    };
  }, [isScrollable, itemCount, updateOverflow]);

  /* With no defaultValue, the first enabled tab becomes the selection. */

  useEffect(() => {
    if (value !== undefined) return;

    const first =
      listRef.current?.querySelector<HTMLElement>(
        '[role="tab"]:not([disabled])'
      );

    const firstValue = first?.dataset.value;

    if (firstValue) {
      setValue(firstValue);
    }
  }, [value, setValue]);

  /* Bring the selected tab into view without scrolling the page. */

  useEffect(() => {
    if (!isScrollable) return;

    const list = listRef.current;

    if (!list) return;

    const selected =
      list.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]'
      );

    if (!selected) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = selected.getBoundingClientRect();

    /* Keep the selected tab clear of the overlaid arrow buttons. */
    const arrowInset = 32;

    if (tabRect.left < listRect.left + arrowInset) {
      list.scrollLeft -=
        listRect.left + arrowInset - tabRect.left;
    } else if (
      tabRect.right >
      listRect.right - arrowInset
    ) {
      list.scrollLeft +=
        tabRect.right -
        (listRect.right - arrowInset);
    }

    updateOverflow();
  }, [value, isScrollable, updateOverflow]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    const list = listRef.current;

    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([disabled])'
      )
    );

    if (tabs.length === 0) return;

    const active =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const activeIndex = active
      ? tabs.indexOf(active)
      : -1;

    const horizontal = orientation === "horizontal";

    const nextKey = horizontal
      ? "ArrowRight"
      : "ArrowDown";

    const previousKey = horizontal
      ? "ArrowLeft"
      : "ArrowUp";

    let nextIndex: number | null = null;

    if (event.key === nextKey) {
      nextIndex =
        activeIndex < 0
          ? 0
          : (activeIndex + 1) % tabs.length;
    } else if (event.key === previousKey) {
      nextIndex =
        activeIndex < 0
          ? tabs.length - 1
          : (activeIndex - 1 + tabs.length) %
            tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const next = tabs[nextIndex];

    if (!next) return;

    next.focus();

    if (activationMode === "automatic") {
      const nextValue = next.dataset.value;

      if (nextValue) {
        setValue(nextValue);
      }
    }
  }

  function scrollTabs(direction: -1 | 1) {
    const list = listRef.current;

    if (!list) return;

    const distance = Math.max(
      120,
      Math.round(list.clientWidth * 0.7)
    );

    const behavior: ScrollBehavior =
      prefersReducedMotion() ? "auto" : "smooth";

    if (typeof list.scrollBy === "function") {
      list.scrollBy({
        left: direction * distance,
        behavior,
      });
    } else {
      list.scrollLeft += direction * distance;
    }
  }

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-tabs__list-wrap",
        isScrollable
          ? "pimolu-tabs__list-wrap--scrollable"
          : undefined
      ), partClasses.listWrap, classNames?.root)}
    >
      {isScrollable && overflow.start && (
        <button
          type="button"
          className={mergeClasses("pimolu-tabs__scroll pimolu-tabs__scroll--previous", partClasses.scroll)}
          aria-label={scrollPreviousLabel}
          onClick={() => scrollTabs(-1)}
        >
          <Chevron direction="start" />
        </button>
      )}

      <div
        ref={listRef}
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-dividers={dividers ? "true" : undefined}
        data-scrollable={
          isScrollable ? "true" : undefined
        }
        className={mergeClasses(classes(
          "pimolu-tabs__list",
          className
        ), partClasses.list)}
        onKeyDown={handleKeyDown}
        onScroll={
          isScrollable ? updateOverflow : undefined
        }
      >
        {children}
      </div>

      {isScrollable && overflow.end && (
        <button
          type="button"
          className={mergeClasses("pimolu-tabs__scroll pimolu-tabs__scroll--next", partClasses.scroll)}
          aria-label={scrollNextLabel}
          onClick={() => scrollTabs(1)}
        >
          <Chevron direction="end" />
        </button>
      )}
    </div>
  ));
}

/* =========================================
   TRIGGER
========================================= */

export function TabsTrigger({ classNames,
  value,
  disabled = false,
  children,
  className,
}: PimoluTabsTriggerProps) {
  const [partClasses, scopeParts] = usePartClasses("tabs", classNames, false);

  const { value: activeValue, setValue, baseId } =
    useTabs("TabsTrigger");

  const selected = activeValue === value;

  const slug = toId(value);

  return scopeParts((
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${slug}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${slug}`}
      tabIndex={selected ? 0 : -1}
      data-state={selected ? "active" : "inactive"}
      data-value={value}
      disabled={disabled}
      className={mergeClasses(classes(
        "pimolu-tabs__trigger",
        className
      ), partClasses.trigger, classNames?.root)}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  ));
}

/* =========================================
   PANEL
========================================= */

export function TabsContent({ classNames,
  value,
  children,
  className,
}: PimoluTabsContentProps) {
  const [partClasses, scopeParts] = usePartClasses("tabs", classNames, false);

  const { value: activeValue, baseId } =
    useTabs("TabsContent");

  const selected = activeValue === value;

  const slug = toId(value);

  return scopeParts((
    <div
      role="tabpanel"
      id={`${baseId}-panel-${slug}`}
      aria-labelledby={`${baseId}-tab-${slug}`}
      hidden={!selected}
      tabIndex={0}
      data-state={selected ? "active" : "inactive"}
      className={mergeClasses(classes(
        "pimolu-tabs__panel",
        className
      ), partClasses.panel, classNames?.root)}
    >
      {children}
    </div>
  ));
}
