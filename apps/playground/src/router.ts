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

  { id: "checkbox", label: "Checkbox", group: "Forms" },
  { id: "combobox", label: "Combobox", group: "Forms" },
  { id: "input", label: "Input", group: "Forms" },
  { id: "multi-select", label: "MultiSelect", group: "Forms" },
  { id: "radio", label: "Radio", group: "Forms" },
  { id: "select", label: "Select", group: "Forms" },
  { id: "switch", label: "Switch", group: "Forms" },
  { id: "textarea", label: "Textarea", group: "Forms" },

  { id: "avatar", label: "Avatar", group: "Data display" },
  { id: "badge", label: "Badge", group: "Data display" },
  { id: "card", label: "Card", group: "Data display" },

  { id: "separator", label: "Separator", group: "Layout" },

  { id: "skeleton", label: "Skeleton", group: "Feedback" },
  { id: "spinner", label: "Spinner", group: "Feedback" },
] as const;

export type Page = (typeof pages)[number];

export type PageId = Page["id"];

const FALLBACK: PageId = "overview";

function readPage(): PageId {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const known = pages.some((page) => page.id === raw);

  return known ? (raw as PageId) : FALLBACK;
}

export function pageHref(id: PageId): string {
  return `#/${id}`;
}

export function usePage(): PageId {
  const [page, setPage] = useState<PageId>(readPage);

  useEffect(() => {
    function handleChange() {
      setPage(readPage());
    }

    window.addEventListener("hashchange", handleChange);

    return () =>
      window.removeEventListener("hashchange", handleChange);
  }, []);

  return page;
}
