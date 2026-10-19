import {
  groupPages,
  pageHref,
  type PageId,
} from "./router";

export function Sidebar({ current }: { current: PageId }) {
  return (
    <aside className="pg-sidebar">
      <nav aria-label="Documentation">
        {groupPages().map((group) => (
          <div key={group.name} className="pg-sidebar__group">
            <p className="pg-sidebar__title">{group.name}</p>

            <div className="pg-sidebar__nav">
              {group.items.map((page) => (
                <a
                  key={page.id}
                  className="pg-sidebar__link"
                  href={pageHref(page.id)}
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
