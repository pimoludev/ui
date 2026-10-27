"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  PimoluTransferItem,
  PimoluTransferProps,
} from "./transfer.types";

import { normalizeSearch } from "../internal/search";

const DEFAULT_LIST_HEIGHT = 240;

function filterItems(
  items: readonly PimoluTransferItem[],
  query: string
): PimoluTransferItem[] {
  const search = normalizeSearch(query);

  if (!search) return [...items];

  return items.filter((item) =>
    normalizeSearch(
      [item.label, item.description ?? ""].join(" ")
    ).includes(search)
  );
}

/* =========================================
   TRANSFER
========================================= */

export function Transfer({ classNames,
  data,
  targetKeys,
  defaultTargetKeys = [],
  onChange,

  titles,
  searchable = false,
  disabled = false,
  showCount = true,
  showMoveAll = true,
  listHeight = DEFAULT_LIST_HEIGHT,

  render,
  emptyMessage = "No items.",

  className,
  style,

  "aria-label": ariaLabel,
}: PimoluTransferProps) {
  const [partClasses, scopeParts] = usePartClasses("transfer", classNames, true);

  const generatedId = useId();

  const sourceTitle = titles?.[0] ?? "Source";
  const targetTitle = titles?.[1] ?? "Target";

  const sourceTitleId = `${generatedId}-source-title`;
  const targetTitleId = `${generatedId}-target-title`;

  /* ======================================
     CONTROLLED / UNCONTROLLED TARGETS
  ====================================== */

  const isControlled = targetKeys !== undefined;

  const [internalTargets, setInternalTargets] =
    useState<string[]>(() => [...defaultTargetKeys]);

  const targets: readonly string[] = isControlled
    ? targetKeys
    : internalTargets;

  const targetSet = useMemo(
    () => new Set(targets),
    [targets]
  );

  const itemsByKey = useMemo(
    () =>
      new Map(
        data.map((item) => [item.key, item])
      ),
    [data]
  );

  const sourceItems = useMemo(
    () =>
      data.filter(
        (item) => !targetSet.has(item.key)
      ),
    [data, targetSet]
  );

  const targetItems = useMemo(
    () =>
      targets
        .map((key) => itemsByKey.get(key))
        .filter(
          (item): item is PimoluTransferItem =>
            item !== undefined
        ),
    [targets, itemsByKey]
  );

  /* ======================================
     SELECTION AND SEARCH
  ====================================== */

  const [checkedKeys, setCheckedKeys] = useState<
    string[]
  >([]);

  const [leftQuery, setLeftQuery] = useState("");
  const [rightQuery, setRightQuery] = useState("");

  const checkedSet = new Set(checkedKeys);

  const visibleSource = filterItems(
    sourceItems,
    leftQuery
  );
  const visibleTarget = filterItems(
    targetItems,
    rightQuery
  );

  const selectedSourceKeys = sourceItems
    .filter(
      (item) =>
        !item.disabled && checkedSet.has(item.key)
    )
    .map((item) => item.key);

  const selectedTargetKeys = targetItems
    .filter(
      (item) =>
        !item.disabled && checkedSet.has(item.key)
    )
    .map((item) => item.key);

  const allSourceKeys = sourceItems
    .filter((item) => !item.disabled)
    .map((item) => item.key);

  const allTargetKeys = targetItems
    .filter((item) => !item.disabled)
    .map((item) => item.key);

  /* ======================================
     OPERATIONS
  ====================================== */

  function toggleChecked(key: string) {
    setCheckedKeys((current) =>
      current.includes(key)
        ? current.filter((entry) => entry !== key)
        : [...current, key]
    );
  }

  function commit(nextTargets: string[]) {
    if (!isControlled) {
      setInternalTargets(nextTargets);
    }

    onChange?.([...nextTargets]);
  }

  function forgetChecked(keys: readonly string[]) {
    setCheckedKeys((current) =>
      current.filter((key) => !keys.includes(key))
    );
  }

  function moveToTarget(keys: readonly string[]) {
    if (disabled) return;

    const movable = keys.filter((key) => {
      const item = itemsByKey.get(key);

      return Boolean(
        item &&
          !item.disabled &&
          !targetSet.has(key)
      );
    });

    if (movable.length === 0) return;

    const nextTargets = [...targets];

    movable.forEach((key) => {
      if (!nextTargets.includes(key)) {
        nextTargets.push(key);
      }
    });

    commit(nextTargets);
    forgetChecked(movable);
  }

  function moveToSource(keys: readonly string[]) {
    if (disabled) return;

    const movable = keys.filter((key) => {
      const item = itemsByKey.get(key);

      return Boolean(
        item &&
          !item.disabled &&
          targetSet.has(key)
      );
    });

    if (movable.length === 0) return;

    commit(
      targets.filter(
        (key) => !movable.includes(key)
      )
    );

    forgetChecked(movable);
  }

  /* ======================================
     RENDERING
  ====================================== */

  function itemContent(item: PimoluTransferItem) {
    if (render) return render(item);

    return (
      <>
        <span className={mergeClasses("pimolu-transfer__item-label", partClasses.itemLabel)}>
          {item.label}
        </span>

        {item.description && (
          <span className={mergeClasses("pimolu-transfer__item-description", partClasses.itemDescription)}>
            {item.description}
          </span>
        )}
      </>
    );
  }

  function panel({
    title,
    titleId,
    items,
    visibleItems,
    query,
    onQueryChange,
    side,
  }: {
    title: string;
    titleId: string;
    items: readonly PimoluTransferItem[];
    visibleItems: readonly PimoluTransferItem[];
    query: string;
    onQueryChange: (value: string) => void;
    side: "source" | "target";
  }): ReactNode {
    const searchId = `${generatedId}-${side}-search`;

    return (
      <div
        role="group"
        aria-labelledby={titleId}
        className={mergeClasses("pimolu-transfer__panel", partClasses.panel)}
      >
        <div className={mergeClasses("pimolu-transfer__header", partClasses.header)}>
          <span
            id={titleId}
            className={mergeClasses("pimolu-transfer__title", partClasses.title)}
          >
            {title}
          </span>

          {showCount && (
            <span
              className={mergeClasses("pimolu-transfer__count", partClasses.count)}
              aria-label={`${items.length} items`}
            >
              {items.length}
            </span>
          )}
        </div>

        {searchable && (
          <div className={mergeClasses("pimolu-transfer__search", partClasses.search)}>
            <svg
              className={mergeClasses("pimolu-transfer__search-icon", partClasses.searchIcon)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              id={searchId}
              type="search"
              className={mergeClasses("pimolu-transfer__search-input", partClasses.searchInput)}
              value={query}
              disabled={disabled}
              placeholder="Search…"
              aria-label={`Search ${title}`}
              autoComplete="off"
              onChange={(event) =>
                onQueryChange(event.currentTarget.value)
              }
            />
          </div>
        )}

        <ul
          role="list"
          aria-labelledby={titleId}
          className={mergeClasses("pimolu-transfer__list", partClasses.list)}
          style={{ height: listHeight }}
        >
          {visibleItems.length === 0 ? (
            <li
              className={mergeClasses("pimolu-transfer__empty", partClasses.empty)}
              role="status"
            >
              {query
                ? `No results for “${query}”.`
                : emptyMessage}
            </li>
          ) : (
            visibleItems.map((item) => {
              const checked = checkedSet.has(item.key);
              const itemDisabled =
                disabled || item.disabled;

              return (
                <li
                  key={item.key}
                  className={mergeClasses("pimolu-transfer__row", partClasses.row)}
                >
                  <label
                    className={mergeClasses([
                      "pimolu-transfer__item",
                      itemDisabled &&
                        "pimolu-transfer__item--disabled",
                    ]
                      .filter(Boolean)
                      .join(" "), partClasses.item)}
                  >
                    <input
                      type="checkbox"
                      className={mergeClasses("pimolu-native-checkbox pimolu-transfer__checkbox", partClasses.checkbox)}
                      checked={checked}
                      disabled={itemDisabled}
                      aria-label={item.label}
                      onChange={() =>
                        toggleChecked(item.key)
                      }
                    />

                    <span className={mergeClasses("pimolu-transfer__item-content", partClasses.itemContent)}>
                      {itemContent(item)}
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  }

  const rootClassName = [
    "pimolu-transfer",
    disabled && "pimolu-transfer--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <div
      className={mergeClasses(rootClassName, partClasses.root)}
      style={style}
      role={ariaLabel ? "group" : undefined}
      aria-label={ariaLabel}
    >
      {panel({
        title: sourceTitle,
        titleId: sourceTitleId,
        items: sourceItems,
        visibleItems: visibleSource,
        query: leftQuery,
        onQueryChange: setLeftQuery,
        side: "source",
      })}

      <div
        className={mergeClasses("pimolu-transfer__controls", partClasses.controls)}
        role="group"
        aria-label="Move controls"
      >
        <div className={mergeClasses("pimolu-transfer__controls-group", partClasses.controlsGroup)}>
          <button
            type="button"
            className={mergeClasses("pimolu-transfer__move", partClasses.move)}
            aria-label="Move selected to the right"
            title="Move selected to the right"
            disabled={
              disabled ||
              selectedSourceKeys.length === 0
            }
            onClick={() =>
              moveToTarget(selectedSourceKeys)
            }
          >
            <span aria-hidden="true">→</span>
          </button>

          {showMoveAll && (
            <button
              type="button"
              className={mergeClasses("pimolu-transfer__move pimolu-transfer__move--all", partClasses.move)}
              aria-label="Move all to the right"
              title="Move all to the right"
              disabled={
                disabled || allSourceKeys.length === 0
              }
              onClick={() =>
                moveToTarget(allSourceKeys)
              }
            >
              <span aria-hidden="true">»</span>
            </button>
          )}
        </div>

        <div className={mergeClasses("pimolu-transfer__controls-group", partClasses.controlsGroup)}>
          <button
            type="button"
            className={mergeClasses("pimolu-transfer__move", partClasses.move)}
            aria-label="Move selected to the left"
            title="Move selected to the left"
            disabled={
              disabled ||
              selectedTargetKeys.length === 0
            }
            onClick={() =>
              moveToSource(selectedTargetKeys)
            }
          >
            <span aria-hidden="true">←</span>
          </button>

          {showMoveAll && (
            <button
              type="button"
              className={mergeClasses("pimolu-transfer__move pimolu-transfer__move--all", partClasses.move)}
              aria-label="Move all to the left"
              title="Move all to the left"
              disabled={
                disabled || allTargetKeys.length === 0
              }
              onClick={() =>
                moveToSource(allTargetKeys)
              }
            >
              <span aria-hidden="true">«</span>
            </button>
          )}
        </div>
      </div>

      {panel({
        title: targetTitle,
        titleId: targetTitleId,
        items: targetItems,
        visibleItems: visibleTarget,
        query: rightQuery,
        onQueryChange: setRightQuery,
        side: "target",
      })}
    </div>
  ));
}

Transfer.displayName = "PimoluTransfer";
