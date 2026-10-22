"use client";

import { useEffect, useRef, type ComponentType, type MouseEvent } from "react";

/** Demo links must stay in the example, including links rendered through portals. */
function keepNavigationInExample(event: MouseEvent<HTMLDivElement>) {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  const href = link.getAttribute("href") || "";
  if (link.hasAttribute("download") && (link.origin === location.origin || ["blob:", "data:"].includes(link.protocol))) return;
  if (href.startsWith("#") && href.length > 1 && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
    let id: string;
    try { id = decodeURIComponent(href.slice(1)); } catch { event.preventDefault(); return; }
    const target = document.getElementById(id);
    const scope = event.currentTarget.closest(".docs-standalone") || event.currentTarget;
    if (target && scope.contains(target) && (!link.target || link.target === "_self")) return;
  }
  // Only cancel the browser's navigation: child onClick/onSelect handlers still run.
  event.preventDefault();
}

/** The harness announces mount after the lazy module's real effects are installed. */
export function readyExample(Example: ComponentType) {
  return function ReadyExample() {
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => { container.current?.setAttribute("data-example-hydrated", "true"); }, []);
    return <div className="example-ready" ref={container} onClick={keepNavigationInExample} onAuxClick={keepNavigationInExample}><Example /></div>;
  };
}
