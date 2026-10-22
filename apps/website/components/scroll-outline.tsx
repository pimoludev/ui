"use client";

import { useEffect, useState } from "react";
import { TableOfContents, type PimoluTableOfContentsItem } from "@pimolu/react";

/** Application-level scroll tracking; the public outline remains controlled. */
export function ScrollOutline({ items, title = "On this page" }: { items: PimoluTableOfContentsItem[]; title?: string }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const ids = items.map((item) => item.id).join("|");
  useEffect(() => {
    const targets = ids.split("|").filter(Boolean).map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    let frame = 0;
    function measure() {
      frame = 0;
      const marker = Math.min(160, window.innerHeight * 0.2);
      let current = targets[0]?.id;
      for (const target of targets) if (target.getBoundingClientRect().top <= marker) current = target.id;
      if (current) setActiveId((previous) => previous === current ? previous : current);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = new ResizeObserver(schedule);
    const article = document.querySelector("main");
    if (article) observer.observe(article);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); window.removeEventListener("hashchange", schedule); };
  }, [ids]);
  return <TableOfContents title={title} items={items} activeId={items.some((item) => item.id === activeId) ? activeId : items[0]?.id} onNavigate={(item) => setActiveId(item.id)} />;
}
