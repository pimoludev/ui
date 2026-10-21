"use client";

import { useId } from "react";

import type {
  PimoluTableOfContentsItem,
  PimoluTableOfContentsProps,
} from "./table-of-contents.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

interface TocGroup {
  item: PimoluTableOfContentsItem;
  children: PimoluTableOfContentsItem[];
}

/**
 * Groups the flat heading list into level 2 entries and their level 3
 * descendants. A level 3 entry without a preceding level 2 entry starts
 * a new top-level entry, so incomplete data still renders something
 * usable.
 */
function groupItems(
  items: PimoluTableOfContentsItem[]
): TocGroup[] {
  const groups: TocGroup[] = [];

  for (const item of items) {
    const level = item.level ?? 2;

    if (level === 3 && groups.length > 0) {
      groups[groups.length - 1].children.push(item);
    } else {
      groups.push({ item, children: [] });
    }
  }

  return groups;
}

export function TableOfContents({
  items,
  activeId,
  title = "On this page",
  onNavigate,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: PimoluTableOfContentsProps) {
  const titleId = `pimolu-toc-${useId().replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  )}`;

  const hasTitle = title != null && title !== "";
  const groups = groupItems(items);

  function renderLink(item: PimoluTableOfContentsItem) {
    return (
      <a
        href={`#${item.id}`}
        aria-current={
          activeId === item.id ? "location" : undefined
        }
        className="pimolu-table-of-contents__link"
        onClick={() => onNavigate?.(item)}
      >
        {item.label}
      </a>
    );
  }

  return (
    <nav
      {...props}
      aria-label={
        ariaLabel ??
        (hasTitle ? undefined : "On this page")
      }
      aria-labelledby={
        ariaLabelledBy ??
        (ariaLabel || !hasTitle ? undefined : titleId)
      }
      className={classes(
        "pimolu-table-of-contents",
        className
      )}
    >
      {hasTitle && (
        <p
          id={titleId}
          className="pimolu-table-of-contents__title"
        >
          {title}
        </p>
      )}

      <ol className="pimolu-table-of-contents__list">
        {groups.map((group) => (
          <li
            key={group.item.id}
            className="pimolu-table-of-contents__item"
          >
            {renderLink(group.item)}

            {group.children.length > 0 && (
              <ol className="pimolu-table-of-contents__list pimolu-table-of-contents__list--nested">
                {group.children.map((child) => (
                  <li
                    key={child.id}
                    className="pimolu-table-of-contents__item"
                  >
                    {renderLink(child)}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

TableOfContents.displayName = "PimoluTableOfContents";
