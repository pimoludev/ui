import { useEffect, useState } from "react";

/**
 * Minimal hash router: no dependency, addressable pages
 * (#/overview, #/button, #/input) that can be shared or reloaded.
 *
 * Adding a component page = one entry here + one file in pages/.
 */
export const pages = [
  { id: "overview", label: "Overview" },
  { id: "button", label: "Button" },
  { id: "input", label: "Input" },
] as const;

export type PageId = (typeof pages)[number]["id"];

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
