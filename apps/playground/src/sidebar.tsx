import { useState } from "react";

import {
  groupPages,
  pageHref,
  type PageId,
} from "./router";

export function Sidebar({ current }: { current: PageId }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="pg-sidebar" data-mobile-open={mobileOpen}>
      <button
        className="pg-sidebar__toggle"
        type="button"
        aria-controls="pg-sidebar-navigation"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        Browse components
      </button>
      <nav id="pg-sidebar-navigation" aria-label="Documentation">
        {groupPages().map((group) => (
          <div key={group.name} className="pg-sidebar__group">
            <p className="pg-sidebar__title">{group.name}</p>

            <div className="pg-sidebar__nav">
              {group.items.map((page) => (
                <a
                  key={page.id}
                  className="pg-sidebar__link"
                  href={pageHref(page.id)}
                  onClick={() => setMobileOpen(false)}
                  aria-current={
                    current === page.id ? "page" : undefined
                  }
                >
                  {page.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
