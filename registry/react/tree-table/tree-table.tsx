"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { Checkbox } from "../checkbox/checkbox";
import { EmptyState } from "../empty-state/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import type {
  PimoluTreeTableAlign,
  PimoluTreeTableColumn,
  PimoluTreeTableLabels,
  PimoluTreeTableNode,
  PimoluTreeTableProps,
} from "./tree-table.types";

/* =========================================
   DEFAULTS
========================================= */

const DEFAULT_LABELS: PimoluTreeTableLabels = {
  expand: (label) => `Expand ${label}`,
  collapse: (label) => `Collapse ${label}`,
  selectRow: (label) => `Select ${label}`,
  selectAll: "Select all visible rows",
  empty: "No rows to display.",
};

/* =========================================
   HELPERS
========================================= */

function nodeToText(node: ReactNode): string {
  if (
    node === null ||
    node === undefined ||
    typeof node === "boolean"
  ) {
    return "";
  }

  if (
    typeof node === "string" ||
    typeof node === "number"
  ) {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node
      .map(nodeToText)
      .filter(Boolean)
      .join(" ");
  }

  if (typeof node === "object" && "props" in node) {
    return nodeToText(
      (
        node as {
          props?: { children?: ReactNode };
        }
      ).props?.children
    );
  }

  return "";
}

function getAlignClass(
  prefix: "head" | "cell",
  align: PimoluTreeTableAlign | undefined
) {
  return `pimolu-tree-table__${prefix}--${align ?? "start"}`;
}

interface FlatNode<T extends PimoluTreeTableNode> {
  node: T;
  id: string;
  level: number;
  parentId?: string;
  hasChildren: boolean;
}

function flattenVisible<T extends PimoluTreeTableNode>(
  nodes: readonly T[],
  expanded: ReadonlySet<string>,
  getNodeId: (node: T) => string,
  level = 1,
  parentId?: string
): FlatNode<T>[] {
  const rows: FlatNode<T>[] = [];

  for (const node of nodes) {
    const id = getNodeId(node);
    const children = (node.children ?? []) as readonly T[];

    rows.push({
      node,
      id,
      level,
      parentId,
      hasChildren: children.length > 0,
    });

    if (children.length > 0 && expanded.has(id)) {
      rows.push(
        ...flattenVisible(
          children,
          expanded,
          getNodeId,
          level + 1,
          id
        )
      );
    }
  }

  return rows;
}

function collectNodeIds<T extends PimoluTreeTableNode>(
  nodes: readonly T[],
  getNodeId: (node: T) => string
): string[] {
  const ids: string[] = [];

  function walk(items: readonly T[]) {
    for (const node of items) {
      ids.push(getNodeId(node));

      const children = (node.children ??
        []) as readonly T[];

      if (children.length > 0) {
        walk(children);
      }
    }
  }

  walk(nodes);

  return ids;
}

function collectParentIds<T extends PimoluTreeTableNode>(
  nodes: readonly T[],
  getNodeId: (node: T) => string
): string[] {
  const ids: string[] = [];

  function walk(items: readonly T[]) {
    for (const node of items) {
      const children = (node.children ??
        []) as readonly T[];

      if (children.length > 0) {
        ids.push(getNodeId(node));
        walk(children);
      }
    }
  }

  walk(nodes);

  return ids;
}

function getDefaultNodeId(
  node: PimoluTreeTableNode
): string {
  return node.id;
}

function getColumnLabel<T extends PimoluTreeTableNode>(
  column: PimoluTreeTableColumn<T>
): string {
  return (
    column.label?.trim() ||
    nodeToText(column.header).trim() ||
    column.id
  );
}

function getColumnContent<T extends PimoluTreeTableNode>(
  node: T,
  column: PimoluTreeTableColumn<T>,
  isTreeColumn: boolean
): ReactNode {
  if (column.cell) {
    return column.cell(node);
  }

  if (isTreeColumn && node.label !== undefined) {
    return node.label;
  }

  const raw = (
    node as unknown as Record<string, unknown>
  )[column.id];

  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return raw;
  }

  return null;
}

/* =========================================
   TREE TABLE
========================================= */

export function TreeTable<T extends PimoluTreeTableNode>({
  nodes,
  columns,
  getNodeId,
  getNodeLabel,

  caption,
  ariaLabel,

  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  defaultExpandAll = false,
  onExpandedChange,

  selectable = false,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds,
  onSelectionChange,

  density = "md",
  labels,
  emptyState,
  className,
  rowClassName,
}: PimoluTreeTableProps<T>) {
  const text = { ...DEFAULT_LABELS, ...labels };

  const resolveNodeId =
    getNodeId ?? getDefaultNodeId;

  /* --- Expansion ---------------------------------------------------- */

  const [internalExpandedIds, setInternalExpandedIds] =
    useState<string[]>(() => {
      const initial = new Set(defaultExpandedIds ?? []);

      if (defaultExpandAll) {
        collectParentIds(nodes, resolveNodeId).forEach(
          (id) => initial.add(id)
        );
      }

      return [...initial];
    });

  const isExpandedControlled =
    controlledExpandedIds !== undefined;

  const expandedIds = isExpandedControlled
    ? [...controlledExpandedIds]
    : internalExpandedIds;

  const expanded = useMemo(
    () => new Set(expandedIds),
    [expandedIds]
  );

  /* --- Selection ---------------------------------------------------- */

  const [internalSelectedIds, setInternalSelectedIds] =
    useState<string[]>(() => [
      ...(defaultSelectedIds ?? []),
    ]);

  const isSelectionControlled =
    controlledSelectedIds !== undefined;

  const selectedIds = isSelectionControlled
    ? [...controlledSelectedIds]
    : internalSelectedIds;

  const selected = useMemo(
    () => new Set(selectedIds),
    [selectedIds]
  );

  const allNodeIds = useMemo(
    () => collectNodeIds(nodes, resolveNodeId),
    [nodes, resolveNodeId]
  );

  /* --- Visible rows and focus --------------------------------------- */

  const visibleRows = useMemo(
    () =>
      flattenVisible(
        nodes,
        expanded,
        resolveNodeId
      ),
    [nodes, expanded, resolveNodeId]
  );

  const [focusedId, setFocusedId] = useState<
    string | undefined
  >(
    () =>
      selectedIds[0] ??
      nodes.find((node) => !node.disabled)?.id
  );

  const rowRefs = useRef(
    new Map<string, HTMLTableRowElement>()
  );

  useEffect(() => {
    if (
      focusedId &&
      visibleRows.some((row) => row.id === focusedId)
    ) {
      return;
    }

    const selectedVisible = selectedIds.find((id) =>
      visibleRows.some((row) => row.id === id)
    );

    const next =
      selectedVisible ??
      visibleRows.find((row) => !row.node.disabled)
        ?.id;

    if (next && next !== focusedId) {
      setFocusedId(next);
    }
  }, [visibleRows, focusedId, selectedIds]);

  /* --- Labels ------------------------------------------------------- */

  function getNodeLabelText(node: T): string {
    if (getNodeLabel) return getNodeLabel(node);

    const treeColumn = columns[0];

    if (treeColumn) {
      const content = nodeToText(
        getColumnContent(node, treeColumn, true)
      ).trim();

      if (content) return content;
    }

    return resolveNodeId(node);
  }

  /* --- Commits ------------------------------------------------------ */

  function updateExpanded(next: string[]) {
    if (!isExpandedControlled) {
      setInternalExpandedIds(next);
    }

    onExpandedChange?.(next);
  }

  function setExpansion(id: string, open: boolean) {
    if (open) {
      if (!expanded.has(id)) {
        updateExpanded([...expandedIds, id]);
      }

      return;
    }

    updateExpanded(
      expandedIds.filter((entry) => entry !== id)
    );
  }

  function toggleExpansion(id: string) {
    setExpansion(id, !expanded.has(id));
  }

  function commitSelection(next: Set<string>) {
    const known = new Set(allNodeIds);

    const ordered = [
      ...allNodeIds.filter((id) => next.has(id)),
      ...[...next].filter((id) => !known.has(id)),
    ];

    if (!isSelectionControlled) {
      setInternalSelectedIds(ordered);
    }

    onSelectionChange?.(ordered);
  }

  function toggleSelection(id: string) {
    const node = visibleRows.find(
      (row) => row.id === id
    )?.node;

    if (node?.disabled) return;

    const next = new Set(selected);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    commitSelection(next);
  }

  function selectedVisibleCount() {
    return visibleRows.filter(
      (row) =>
        !row.node.disabled && selected.has(row.id)
    ).length;
  }

  function selectableVisibleRows() {
    return visibleRows.filter(
      (row) => !row.node.disabled
    );
  }

  function toggleVisibleSelection(checked: boolean) {
    const next = new Set(selected);

    selectableVisibleRows().forEach((row) => {
      if (checked) {
        next.add(row.id);
      } else {
        next.delete(row.id);
      }
    });

    commitSelection(next);
  }

  /* --- Keyboard ----------------------------------------------------- */

  function focusRow(id: string) {
    setFocusedId(id);
    rowRefs.current.get(id)?.focus();
  }

  function handleKeyDown(
    event: ReactKeyboardEvent<HTMLTableElement>
  ) {
    const target = event.target;

    /*
     * Buttons and form controls own their keys: Space must toggle the
     * checkbox and Enter must activate the expander natively.
     */

    if (
      target instanceof HTMLElement &&
      (target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      return;
    }

    if (visibleRows.length === 0) return;

    const navigable = visibleRows.filter(
      (row) => !row.node.disabled
    );

    if (navigable.length === 0) return;

    const rowElement =
      target instanceof HTMLElement
        ? target.closest<HTMLElement>(
            "[data-tree-row-id]"
          )
        : null;

    const currentId =
      rowElement?.dataset.treeRowId ??
      focusedId ??
      navigable[0].id;

    const current = visibleRows.find(
      (row) => row.id === currentId
    );

    const index = navigable.findIndex(
      (row) => row.id === currentId
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();

      const next =
        index < 0
          ? navigable[0]
          : navigable[
              Math.min(index + 1, navigable.length - 1)
            ];

      if (next) focusRow(next.id);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      const next =
        navigable[
          index < 0 ? 0 : Math.max(index - 1, 0)
        ];

      if (next) focusRow(next.id);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusRow(navigable[0].id);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusRow(navigable[navigable.length - 1].id);
      return;
    }

    if (!current) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (!current.hasChildren) return;

      if (!expanded.has(current.id)) {
        setExpansion(current.id, true);
        return;
      }

      const firstChild = visibleRows.find(
        (row) =>
          row.parentId === current.id &&
          !row.node.disabled
      );

      if (firstChild) {
        focusRow(firstChild.id);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (
        current.hasChildren &&
        expanded.has(current.id)
      ) {
        setExpansion(current.id, false);
        return;
      }

      if (current.parentId) {
        focusRow(current.parentId);
      }

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (current.hasChildren) {
        toggleExpansion(current.id);
      } else if (selectable) {
        toggleSelection(current.id);
      }

      return;
    }

    if (event.key === " ") {
      event.preventDefault();

      if (selectable) {
        toggleSelection(current.id);
      } else if (current.hasChildren) {
        toggleExpansion(current.id);
      }
    }
  }

  /* --- Rendering ---------------------------------------------------- */

  const columnCount =
    columns.length + (selectable ? 1 : 0);

  const selectedVisible = selectedVisibleCount();
  const selectableVisible = selectableVisibleRows();

  const allVisibleSelected =
    selectableVisible.length > 0 &&
    selectedVisible === selectableVisible.length;

  const someVisibleSelected =
    selectedVisible > 0 && !allVisibleSelected;

  return (
    <div
      className={[
        "pimolu-tree-table",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Table
        role="treegrid"
        caption={caption}
        aria-label={ariaLabel}
        aria-multiselectable={
          selectable || undefined
        }
        density={density}
        containerClassName="pimolu-tree-table__table-wrapper"
        className="pimolu-tree-table__table"
        onKeyDown={handleKeyDown}
      >
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead
                scope="col"
                className="pimolu-tree-table__select-cell"
              >
                <Checkbox
                  aria-label={text.selectAll}
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected}
                  disabled={selectableVisible.length === 0}
                  onCheckedChange={
                    toggleVisibleSelection
                  }
                />
              </TableHead>
            )}

            {columns.map((column) => (
              <TableHead
                key={column.id}
                scope="col"
                aria-label={getColumnLabel(column)}
                style={
                  column.width !== undefined
                    ? { width: column.width }
                    : undefined
                }
                className={[
                  "pimolu-tree-table__head",
                  getAlignClass("head", column.align),
                ].join(" ")}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(columnCount, 1)}
                className="pimolu-tree-table__empty"
              >
                {emptyState ?? (
                  <EmptyState
                    size="sm"
                    title={text.empty}
                  />
                )}
              </TableCell>
            </TableRow>
          ) : (
            visibleRows.map((row) => {
              const { node, id, level, hasChildren } =
                row;

              const label = getNodeLabelText(node);
              const isExpanded = expanded.has(id);
              const isSelected = selected.has(id);
              const isDisabled = Boolean(node.disabled);

              return (
                <TableRow
                  key={id}
                  ref={(element) => {
                    if (element) {
                      rowRefs.current.set(id, element);
                    } else {
                      rowRefs.current.delete(id);
                    }
                  }}
                  aria-level={level}
                  aria-expanded={
                    hasChildren
                      ? isExpanded
                      : undefined
                  }
                  aria-selected={
                    selectable
                      ? isSelected
                      : undefined
                  }
                  aria-disabled={
                    isDisabled || undefined
                  }
                  tabIndex={
                    focusedId === id ? 0 : -1
                  }
                  data-tree-row-id={id}
                  data-state={
                    isDisabled
                      ? "disabled"
                      : isSelected
                        ? "selected"
                        : "default"
                  }
                  className={
                    [
                      "pimolu-tree-table__row",
                      isSelected &&
                        "pimolu-tree-table__row--selected",
                      isDisabled &&
                        "pimolu-tree-table__row--disabled",
                      rowClassName?.(node, level),
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  onClick={() => {
                    if (isDisabled || !selectable) {
                      return;
                    }

                    toggleSelection(id);
                  }}
                  onFocus={() => setFocusedId(id)}
                >
                  {selectable && (
                    <TableCell
                      className="pimolu-tree-table__select-cell"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <Checkbox
                        aria-label={
                          text.selectRow(label)
                        }
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={() =>
                          toggleSelection(id)
                        }
                      />
                    </TableCell>
                  )}

                  {columns.map((column, columnIndex) => {
                    const isTreeColumn =
                      columnIndex === 0;

                    const content = getColumnContent(
                      node,
                      column,
                      isTreeColumn
                    );

                    const style: CSSProperties =
                      column.width !== undefined
                        ? { width: column.width }
                        : {};

                    return (
                      <TableCell
                        key={column.id}
                        style={
                          Object.keys(style).length > 0
                            ? style
                            : undefined
                        }
                        className={[
                          "pimolu-tree-table__cell",
                          isTreeColumn &&
                            "pimolu-tree-table__tree-cell",
                          getAlignClass(
                            "cell",
                            column.align
                          ),
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {isTreeColumn ? (
                          <span className="pimolu-tree-table__tree-content">
                            <span
                              className="pimolu-tree-table__guides"
                              aria-hidden="true"
                            >
                              {Array.from(
                                { length: Math.max(0, level - 1) },
                                (_, guideIndex) => (
                                  <span
                                    key={guideIndex}
                                    className="pimolu-tree-table__guide"
                                  />
                                )
                              )}
                            </span>

                            {hasChildren ? (
                              <button
                                type="button"
                                className="pimolu-tree-table__expander"
                                aria-label={
                                  isExpanded
                                    ? text.collapse(label)
                                    : text.expand(label)
                                }
                                aria-expanded={isExpanded}
                                disabled={isDisabled}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleExpansion(id);
                                }}
                              >
                                <Chevron />
                              </button>
                            ) : (
                              <span
                                className="pimolu-tree-table__expander-spacer"
                                aria-hidden="true"
                              />
                            )}

                            <span className="pimolu-tree-table__label">
                              {content}
                            </span>
                          </span>
                        ) : (
                          content
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

TreeTable.displayName = "PimoluTreeTable";

/* =========================================
   ICONS
========================================= */

function Chevron() {
  return (
    <svg
      className="pimolu-tree-table__chevron"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
