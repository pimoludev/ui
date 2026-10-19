"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import type {
  PimoluTreeItem,
  PimoluTreeViewProps,
} from "./tree-view.types";

interface FlatNode {
  item: PimoluTreeItem;
  level: number;
  parentId?: string;
}

function flatten(
  items: readonly PimoluTreeItem[],
  expanded: Set<string>,
  level = 1,
  parentId?: string
): FlatNode[] {
  const nodes: FlatNode[] = [];

  for (const item of items) {
    nodes.push({ item, level, parentId });

    if (
      item.children?.length &&
      expanded.has(item.id)
    ) {
      nodes.push(
        ...flatten(
          item.children,
          expanded,
          level + 1,
          item.id
        )
      );
    }
  }

  return nodes;
}

function Chevron() {
  return (
    <svg
      className="pimolu-tree__chevron"
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

export function TreeView({
  items,
  expandedIds: controlledExpanded,
  defaultExpandedIds = [],
  onExpandedChange,
  selectedId: controlledSelected,
  defaultSelectedId,
  onSelectedChange,
  "aria-label": ariaLabel,
  className,
}: PimoluTreeViewProps) {
  const isExpandedControlled =
    controlledExpanded !== undefined;

  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState<string[]>([...defaultExpandedIds]);

  const expandedIds = isExpandedControlled
    ? [...controlledExpanded]
    : uncontrolledExpanded;

  const expanded = new Set(expandedIds);

  const isSelectedControlled =
    controlledSelected !== undefined;

  const [uncontrolledSelected, setUncontrolledSelected] =
    useState<string | undefined>(defaultSelectedId);

  const selectedId = isSelectedControlled
    ? controlledSelected
    : uncontrolledSelected;

  const visible = flatten(items, expanded);

  const [focusedId, setFocusedId] = useState<
    string | undefined
  >(selectedId ?? visible[0]?.item.id);

  const refs = useRef(new Map<string, HTMLLIElement>());

  useEffect(() => {
    if (
      focusedId &&
      visible.some((node) => node.item.id === focusedId)
    ) {
      return;
    }

    const next =
      selectedId &&
      visible.some((node) => node.item.id === selectedId)
        ? selectedId
        : visible.find((node) => !node.item.disabled)
            ?.item.id;

    if (next) {
      setFocusedId(next);
    }
  }, [visible, focusedId, selectedId]);

  function updateExpanded(next: string[]) {
    if (!isExpandedControlled) {
      setUncontrolledExpanded(next);
    }

    onExpandedChange?.(next);
  }

  function setExpanded(id: string, open: boolean) {
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

  function select(id: string | undefined) {
    if (!isSelectedControlled) {
      setUncontrolledSelected(id);
    }

    onSelectedChange?.(id);
  }

  function focusNode(id: string) {
    setFocusedId(id);
    refs.current.get(id)?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLUListElement>
  ) {
    const nodes = visible.filter(
      (node) => !node.item.disabled
    );

    if (nodes.length === 0) return;

    const target =
      event.target instanceof HTMLElement
        ? event.target.closest<HTMLElement>(
            '[role="treeitem"]'
          )
        : null;

    const currentId =
      target?.dataset.id ??
      focusedId ??
      nodes[0].item.id;
    const index = nodes.findIndex(
      (node) => node.item.id === currentId
    );

    const current = visible.find(
      (node) => node.item.id === currentId
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusNode(nodes[(index + 1) % nodes.length].item.id);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusNode(
        nodes[
          (index - 1 + nodes.length) % nodes.length
        ].item.id
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusNode(nodes[0].item.id);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusNode(nodes[nodes.length - 1].item.id);
      return;
    }

    if (!current) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (current.item.children?.length) {
        if (!expanded.has(current.item.id)) {
          setExpanded(current.item.id, true);
          return;
        }

        const child = current.item.children.find(
          (item) => !item.disabled
        );

        if (child) {
          focusNode(child.id);
        }
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (
        current.item.children?.length &&
        expanded.has(current.item.id)
      ) {
        setExpanded(current.item.id, false);
        return;
      }

      if (current.parentId) {
        focusNode(current.parentId);
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(current.item.id);
    }
  }

  return (
    <ul
      role="tree"
      aria-label={ariaLabel}
      className={[
        "pimolu-tree",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onKeyDown={handleKeyDown}
    >
      {visible.map((node) => {
        const { item, level } = node;
        const open = expanded.has(item.id);
        const hasChildren = Boolean(item.children?.length);
        const selected = item.id === selectedId;

        return (
          <li
            key={item.id}
            ref={(element) => {
              if (element) {
                refs.current.set(item.id, element);
              } else {
                refs.current.delete(item.id);
              }
            }}
            role="treeitem"
            aria-level={level}
            aria-expanded={
              hasChildren ? open : undefined
            }
            aria-selected={selected}
            aria-disabled={item.disabled || undefined}
            data-id={item.id}
            data-state={
              item.disabled
                ? "disabled"
                : selected
                  ? "selected"
                  : "default"
            }
            tabIndex={
              focusedId === item.id ? 0 : -1
            }
            style={
              {
                "--pimolu-tree-level": level,
              } as CSSProperties
            }
            className="pimolu-tree__item"
            onFocus={() => setFocusedId(item.id)}
            onClick={() => {
              if (item.disabled) return;

              select(item.id);

              if (hasChildren) {
                setExpanded(item.id, !open);
              }
            }}
          >
            <span
              className="pimolu-tree__chevron-slot"
              aria-hidden="true"
            >
              {hasChildren && <Chevron />}
            </span>

            <span className="pimolu-tree__label">
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
