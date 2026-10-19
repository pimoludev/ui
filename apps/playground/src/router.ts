import { useEffect, useState } from "react";

/**
 * Minimal hash router: no dependency, addressable pages
 * (#/overview, #/button, #/input) that can be shared or reloaded.
 *
 * Adding a component page = one entry here + one file in pages/.
 * `group` decides where the page appears in the sidebar.
 */
export const pages = [
  { id: "overview", label: "Overview", group: "Getting started" },

  { id: "button", label: "Button", group: "Actions" },
  { id: "toggle", label: "Toggle", group: "Actions" },
  { id: "toggle-group", label: "ToggleGroup", group: "Actions" },

  { id: "tabs", label: "Tabs", group: "Navigation" },
  { id: "segmented-control", label: "SegmentedControl", group: "Navigation" },
  { id: "link", label: "Link", group: "Navigation" },

  { id: "checkbox", label: "Checkbox", group: "Forms" },
  { id: "combobox", label: "Combobox", group: "Forms" },
  { id: "form-field", label: "FormField", group: "Forms" },
  { id: "input", label: "Input", group: "Forms" },
  { id: "label", label: "Label", group: "Forms" },
  { id: "multi-select", label: "MultiSelect", group: "Forms" },
  { id: "radio", label: "Radio", group: "Forms" },
  { id: "range-slider", label: "RangeSlider", group: "Forms" },
  { id: "select", label: "Select", group: "Forms" },
  { id: "slider", label: "Slider", group: "Forms" },
  { id: "switch", label: "Switch", group: "Forms" },
  { id: "textarea", label: "Textarea", group: "Forms" },

  { id: "avatar", label: "Avatar", group: "Data display" },
  { id: "badge", label: "Badge", group: "Data display" },
  { id: "card", label: "Card", group: "Data display" },

  { id: "typography", label: "Typography", group: "Typography" },
  { id: "code", label: "Code & Kbd", group: "Typography" },

  { id: "separator", label: "Separator", group: "Layout" },

  { id: "circular-progress", label: "CircularProgress", group: "Feedback" },
  { id: "dialog", label: "Dialog", group: "Feedback" },
  { id: "popover", label: "Popover", group: "Feedback" },
  { id: "progress", label: "Progress", group: "Feedback" },
  { id: "skeleton", label: "Skeleton", group: "Feedback" },
  { id: "spinner", label: "Spinner", group: "Feedback" },
  { id: "tooltip", label: "Tooltip", group: "Feedback" },
] as const;

export type Page = (typeof pages)[number];

export type PageId = Page["id"];

export interface PageGroup {
  name: string;
  items: Page[];
}

/**
 * Groups the pages in first-appearance order, so the sidebar and the
 * overview index always agree with `pages`.
 */
export function groupPages(
  entries: readonly Page[] = pages
): PageGroup[] {
  const groups: PageGroup[] = [];

  for (const page of entries) {
    const group = groups.find(
      (entry) => entry.name === page.group
    );

    if (group) {
      group.items.push(page);
    } else {
      groups.push({
        name: page.group,
        items: [page],
      });
    }
  }

  return groups;
}

const FALLBACK: PageId = "overview";

export interface ResolvedRoute {
  id: PageId;

  /** The requested hash when it named an unknown route. */
  unknown?: string;
}

export function readRoute(): ResolvedRoute {
  const raw = window.location.hash.replace(/^#\/?/, "");

  if (!raw) return { id: FALLBACK };

  const known = pages.some((page) => page.id === raw);

  return known
    ? { id: raw as PageId }
    : { id: FALLBACK, unknown: raw };
}

export function pageHref(id: PageId): string {
  return `#/${id}`;
}

/**
 * Returns the current route and, when the hash named something that does not
 * exist, the requested value: a silent fallback makes a typo or a stale bundle
 * look like a page that was never written.
 */
export function usePage(): ResolvedRoute {
  const [route, setRoute] =
    useState<ResolvedRoute>(readRoute);

  useEffect(() => {
    function handleChange() {
      setRoute(readRoute());
    }

    window.addEventListener("hashchange", handleChange);

    return () =>
      window.removeEventListener("hashchange", handleChange);
  }, []);

  return route;
}
