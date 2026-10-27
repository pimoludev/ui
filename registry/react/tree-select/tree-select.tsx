"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import type {
  PimoluTreeSelectOption,
  PimoluTreeSelectProps,
} from "./tree-select.types";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";

/* =========================================
   TREE HELPERS
========================================= */

interface FlatNode {
  option: PimoluTreeSelectOption;
  level: number;
  parentValue?: string;
  /** Values from the root to this node, inclusive. */
  path: string[];
}

function flattenTree(
  options: readonly PimoluTreeSelectOption[],
  isExpanded: (value: string) => boolean,
  forceExpand = false,
  level = 1,
  path: string[] = []
): FlatNode[] {
  const nodes: FlatNode[] = [];

  for (const option of options) {
    const optionPath = [...path, option.value];

    nodes.push({
      option,
      level,
      parentValue: path[path.length - 1],
      path: optionPath,
    });

    if (
      option.children?.length &&
      (forceExpand || isExpanded(option.value))
    ) {
      nodes.push(
        ...flattenTree(
          option.children,
          isExpanded,
          forceExpand,
          level + 1,
          optionPath
        )
      );
    }
  }

  return nodes;
}

function findPath(
  options: readonly PimoluTreeSelectOption[],
  value: string,
  path: string[] = []
): string[] | null {
  for (const option of options) {
    const optionPath = [...path, option.value];

    if (option.value === value) {
      return optionPath;
    }

    if (option.children?.length) {
      const found = findPath(
        option.children,
        value,
        optionPath
      );

      if (found) return found;
    }
  }

  return null;
}

/** Keep matching nodes and the ancestors that lead to them. */
function filterOptions(
  options: readonly PimoluTreeSelectOption[],
  query: string
): PimoluTreeSelectOption[] {
  return options.flatMap((option) => {
    if (option.label.toLowerCase().includes(query)) {
      return [option];
    }

    if (!option.children?.length) {
      return [];
    }

    const children = filterOptions(
      option.children,
      query
    );

    return children.length > 0
      ? [{ ...option, children }]
      : [];
  });
}

function firstEnabled(
  nodes: readonly FlatNode[]
): FlatNode | undefined {
  return nodes.find((node) => !node.option.disabled);
}

function findTypeaheadMatch(
  nodes: readonly FlatNode[],
  query: string,
  activeValue: string | null
): FlatNode | undefined {
  const start = nodes.findIndex(
    (node) => node.option.value === activeValue
  );

  const ordered =
    start >= 0
      ? [...nodes.slice(start + 1), ...nodes.slice(0, start + 1)]
      : nodes;

  return ordered.find(
    (node) =>
      !node.option.disabled &&
      node.option.label.toLowerCase().startsWith(query)
  );
}

/* =========================================
   TREE SELECT
========================================= */

export const TreeSelect = forwardRef<
  HTMLButtonElement,
  PimoluTreeSelectProps
>(function TreeSelect(
  { classNames,
    id,
    options,

    value,
    defaultValue,

    onValueChange,

    placeholder = "Select an option",
    label,
    error,

    disabled = false,
    clearable = true,
    searchable = false,

    emptyMessage = "No options available.",
    fullWidth = false,

    className,
    style,

    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  },
  forwardedRef
) {
  const [partClasses, scopeParts] = usePartClasses("tree-select", classNames, true);

  /* ======================================
     IDS AND REFS
  ====================================== */

  const generatedId = useId();
  const triggerId =
    id ?? `pimolu-tree-select-${generatedId}`;
  const labelId = `${triggerId}-label`;
  const treeId = `${triggerId}-tree`;
  const searchId = `${triggerId}-search`;
  const errorId = error ? `${triggerId}-error` : undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const typeaheadRef = useRef({
    text: "",
    time: 0,
  });

  const assignRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  /* ======================================
     CONTROLLED / UNCONTROLLED VALUE
  ====================================== */

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<
    string | undefined
  >(defaultValue);

  const currentValue = isControlled
    ? value
    : internalValue;

  /* ======================================
     PANEL STATE
  ====================================== */

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeValue, setActiveValue] = useState<
    string | null
  >(null);

  const [expandedValues, setExpandedValues] = useState<
    Set<string>
  >(() => {
    const path =
      defaultValue !== undefined
        ? findPath(options, defaultValue)
        : null;

    return new Set(path?.slice(0, -1) ?? []);
  });

  const allNodes = flattenTree(options, () => true);

  const selectedNode =
    currentValue !== undefined
      ? allNodes.find(
          (node) => node.option.value === currentValue
        )
      : undefined;

  const displayLabel =
    selectedNode?.option.label ??
    currentValue ??
    placeholder;

  const searching =
    searchable && query.trim().length > 0;

  const visibleOptions = searching
    ? filterOptions(options, query.trim().toLowerCase())
    : options;

  const visibleNodes = flattenTree(
    visibleOptions,
    (optionValue) =>
      expandedValues.has(optionValue),
    searching
  );

  const activeIndex = visibleNodes.findIndex(
    (node) => node.option.value === activeValue
  );

  const activeNode =
    activeIndex >= 0 ? visibleNodes[activeIndex] : undefined;

  /* ======================================
     HELPERS
  ====================================== */

  const closePanel = useCallback(
    (restoreFocus = false) => {
      setIsOpen(false);
      setQuery("");
      setActiveValue(null);
      typeaheadRef.current = { text: "", time: 0 };

      if (restoreFocus) {
        triggerRef.current?.focus();
      }
    },
    []
  );

  const openPanel = useCallback(() => {
    if (disabled) return;

    typeaheadRef.current = { text: "", time: 0 };

    const path =
      currentValue !== undefined
        ? findPath(options, currentValue)
        : null;

    if (path) {
      setExpandedValues((previous) => {
        const next = new Set(previous);

        path.slice(0, -1).forEach((entry) =>
          next.add(entry)
        );

        return next;
      });
    }

    const selected =
      currentValue !== undefined
        ? allNodes.find(
            (node) =>
              node.option.value === currentValue
          )
        : undefined;

    setQuery("");

    setActiveValue(
      selected && !selected.option.disabled
        ? selected.option.value
        : firstEnabled(allNodes)?.option.value ?? null
    );

    setIsOpen(true);
  }, [disabled, currentValue, options, allNodes]);

  function toggleExpanded(
    optionValue: string,
    expand?: boolean
  ) {
    setExpandedValues((previous) => {
      const next = new Set(previous);

      const shouldExpand =
        expand ?? !next.has(optionValue);

      if (shouldExpand) {
        next.add(optionValue);
      } else {
        next.delete(optionValue);
      }

      return next;
    });
  }

  function selectOption(option: PimoluTreeSelectOption) {
    if (option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }

    onValueChange?.(option.value, option);
    closePanel(true);
  }

  function clearSelection() {
    if (disabled) return;

    if (!isControlled) {
      setInternalValue(undefined);
    }

    onValueChange?.(undefined, undefined);
    closePanel(true);
  }

  function moveActive(step: 1 | -1) {
    const enabled = visibleNodes.filter(
      (node) => !node.option.disabled
    );

    if (enabled.length === 0) return;

    const index = enabled.findIndex(
      (node) => node.option.value === activeValue
    );

    const nextIndex =
      index < 0
        ? step > 0
          ? 0
          : enabled.length - 1
        : (index + step + enabled.length) %
          enabled.length;

    setActiveValue(enabled[nextIndex].option.value);
  }

  /* ======================================
     KEYBOARD
  ====================================== */

  function handleNavigation(
    event: KeyboardEvent<HTMLElement>,
    allowSpaceSelection: boolean
  ): boolean {
    if (disabled) return false;

    const { key } = event;

    if (key === "Tab") {
      if (isOpen) closePanel(false);
      return false;
    }

    if (key === "Escape") {
      if (!isOpen) return false;

      event.preventDefault();
      closePanel(true);
      return true;
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openPanel();
        return true;
      }

      moveActive(key === "ArrowDown" ? 1 : -1);
      return true;
    }

    if (key === "ArrowRight") {
      event.preventDefault();

      if (!isOpen) {
        openPanel();
        return true;
      }

      if (!activeNode) return true;

      const expanded =
        searching ||
        expandedValues.has(activeNode.option.value);

      if (activeNode.option.children?.length) {
        if (!expanded) {
          toggleExpanded(activeNode.option.value, true);
        }

        const child = activeNode.option.children.find(
          (option) => !option.disabled
        );

        if (child) {
          setActiveValue(child.value);
        }
      }

      return true;
    }

    if (key === "ArrowLeft") {
      if (!isOpen) return false;

      event.preventDefault();

      if (!activeNode) return true;

      const expanded =
        searching ||
        expandedValues.has(activeNode.option.value);

      if (
        activeNode.option.children?.length &&
        expanded &&
        !searching
      ) {
        toggleExpanded(activeNode.option.value, false);
        return true;
      }

      if (activeNode.parentValue !== undefined) {
        setActiveValue(activeNode.parentValue);
      }

      return true;
    }

    if (key === "Home" || key === "End") {
      if (!isOpen) return false;

      event.preventDefault();

      const enabled = visibleNodes.filter(
        (node) => !node.option.disabled
      );

      if (enabled.length === 0) return true;

      setActiveValue(
        key === "Home"
          ? enabled[0].option.value
          : enabled[enabled.length - 1].option.value
      );

      return true;
    }

    const activates =
      key === "Enter" ||
      (key === " " && allowSpaceSelection);

    if (activates) {
      event.preventDefault();

      if (!isOpen) {
        openPanel();
        return true;
      }

      if (activeNode) {
        selectOption(activeNode.option);
      }

      return true;
    }

    return false;
  }

  function handleTypeahead(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    const { key } = event;

    if (
      key.length !== 1 ||
      key === " " ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    const now = Date.now();
    const previous = typeaheadRef.current;

    const text =
      now - previous.time < 600
        ? previous.text + key
        : key;

    typeaheadRef.current = { text, time: now };

    const queryText = text.toLowerCase();

    const match =
      findTypeaheadMatch(
        allNodes,
        queryText,
        activeValue
      ) ??
      findTypeaheadMatch(
        allNodes,
        key.toLowerCase(),
        activeValue
      );

    if (!match) return;

    event.preventDefault();

    setExpandedValues((previousExpanded) => {
      const next = new Set(previousExpanded);

      match.path.slice(0, -1).forEach((entry) =>
        next.add(entry)
      );

      return next;
    });

    setActiveValue(match.option.value);

    if (!isOpen) {
      setIsOpen(true);
    }
  }

  function handleTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    if (handleNavigation(event, true)) return;

    handleTypeahead(event);
  }

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    handleNavigation(event, false);
  }

  function handleSearchChange(next: string) {
    setQuery(next);

    const normalized = next.trim().toLowerCase();

    const filtered = normalized
      ? filterOptions(options, normalized)
      : options;

    const nodes = flattenTree(
      filtered,
      () => false,
      Boolean(normalized)
    );

    setActiveValue(
      firstEnabled(nodes)?.option.value ?? null
    );
  }

  /* ======================================
     SHARED BEHAVIOURS
  ====================================== */

  const { style: popupStyle } = useAnchoredPosition(
    fieldRef,
    panelRef,
    isOpen && !disabled,
    {
      gap: 6,
      maxHeight: 340,
      maxWidth: 480,
      matchWidth: true,
      placement: "bottom",
    }
  );

  useDismissableLayer({
    open: isOpen && !disabled,
    target: [rootRef, panelRef],
    onDismiss: () => closePanel(false),
    closeOnEscape: false,
  });

  /* Keep the highlighted node visible while the tree scrolls. */
  useEffect(() => {
    if (!isOpen || !activeValue) return;

    panelRef.current
      ?.querySelector<HTMLElement>(
        '[data-active="true"]'
      )
      ?.scrollIntoView?.({ block: "nearest" });
  }, [isOpen, activeValue, query, expandedValues]);

  /* ======================================
     ACCESSIBILITY AND CLASSES
  ====================================== */

  const describedBy =
    [ariaDescribedBy, errorId]
      .filter(Boolean)
      .join(" ") || undefined;

  const labelledBy =
    [ariaLabelledBy, label ? labelId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const rootClassName = [
    "pimolu-tree-select",
    fullWidth && "pimolu-tree-select--full-width",
    disabled && "pimolu-tree-select--disabled",
    isOpen && "pimolu-tree-select--open",
    error && "pimolu-tree-select--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const optionId = (index: number) =>
    `${treeId}-option-${index}`;

  const activeDescendant =
    isOpen && activeIndex >= 0
      ? optionId(activeIndex)
      : undefined;

  return scopeParts((
    <div
      ref={rootRef}
      className={mergeClasses(rootClassName, partClasses.root)}
      style={style}
    >
      {label && (
        <span
          id={labelId}
          className={mergeClasses("pimolu-tree-select__label", partClasses.label)}
        >
          {label}
        </span>
      )}

      <div
        ref={fieldRef}
        className={mergeClasses("pimolu-tree-select__field", partClasses.field)}
      >
        <button
          ref={assignRef}
          id={triggerId}
          type="button"
          className={mergeClasses("pimolu-tree-select__trigger", partClasses.trigger)}
          role="combobox"
          aria-haspopup="tree"
          aria-expanded={isOpen}
          aria-controls={isOpen ? treeId : undefined}
          aria-activedescendant={activeDescendant}
          aria-labelledby={labelledBy}
          aria-label={
            labelledBy ? undefined : ariaLabel
          }
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={() => {
            if (isOpen) {
              closePanel(false);
            } else {
              openPanel();
            }
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          <span
            className={mergeClasses(selectedNode
                ? "pimolu-tree-select__value"
                : "pimolu-tree-select__value pimolu-tree-select__value--placeholder", partClasses.value)}
            title={
              selectedNode
                ? selectedNode.option.label
                : undefined
            }
          >
            {displayLabel}
          </span>
        </button>

        {clearable &&
          currentValue !== undefined &&
          !disabled && (
            <button
              type="button"
              className={mergeClasses("pimolu-tree-select__clear", partClasses.clear)}
              aria-label="Clear selection"
              onClick={clearSelection}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}

        <span
          className={mergeClasses("pimolu-tree-select__chevron", partClasses.chevron)}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>

        {isOpen && !disabled && (
          <Portal anchorRef={fieldRef}>
            <div
              ref={panelRef}
              className={mergeClasses("pimolu-tree-select__panel", partClasses.panel)}
              style={popupStyle}
            >
              {searchable && (
                <div className={mergeClasses("pimolu-tree-select__search", partClasses.search)}>
                  <svg
                    className={mergeClasses("pimolu-tree-select__search-icon", partClasses.searchIcon)}
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
                    className={mergeClasses("pimolu-tree-select__search-input", partClasses.searchInput)}
                    role="searchbox"
                    aria-label="Search options"
                    aria-controls={treeId}
                    aria-activedescendant={activeDescendant}
                    placeholder="Search options"
                    autoFocus
                    value={query}
                    onChange={(event) =>
                      handleSearchChange(
                        event.currentTarget.value
                      )
                    }
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
              )}

              <div
                id={treeId}
                role="tree"
                aria-labelledby={labelledBy}
                aria-label={
                  labelledBy
                    ? undefined
                    : ariaLabel ?? "Options"
                }
                aria-multiselectable={false}
                className={mergeClasses("pimolu-tree-select__tree", partClasses.tree)}
              >
                {visibleNodes.length === 0 ? (
                  <p
                    className={mergeClasses("pimolu-tree-select__empty", partClasses.empty)}
                    role="status"
                  >
                    {emptyMessage}
                  </p>
                ) : (
                  visibleNodes.map((node, index) => {
                    const {
                      option,
                      level,
                      path,
                    } = node;

                    const hasChildren = Boolean(
                      option.children?.length
                    );

                    const selected =
                      option.value === currentValue;

                    const expanded =
                      hasChildren &&
                      (searching ||
                        expandedValues.has(
                          option.value
                        ));

                    return (
                      <div
                        key={path.join("/")}
                        id={optionId(index)}
                        role="treeitem"
                        aria-level={level}
                        aria-expanded={
                          hasChildren
                            ? expanded
                            : undefined
                        }
                        aria-selected={selected}
                        aria-disabled={
                          option.disabled || undefined
                        }
                        data-active={
                          index === activeIndex
                            ? "true"
                            : undefined
                        }
                        data-value={option.value}
                        style={
                          {
                            "--pimolu-tree-select-level":
                              level,
                          } as CSSProperties
                        }
                        className={mergeClasses([
                          "pimolu-tree-select__option",
                          selected &&
                            "pimolu-tree-select__option--selected",
                          option.disabled &&
                            "pimolu-tree-select__option--disabled",
                        ]
                          .filter(Boolean)
                          .join(" "), partClasses.option)}
                        onMouseDown={(event) => {
                          event.preventDefault();
                        }}
                        onPointerEnter={(event) => {
                          if (event.pointerType !== "mouse" || option.disabled) return;

                          setActiveValue(option.value);
                        }}
                        onClick={() =>
                          selectOption(option)
                        }
                      >
                        <span
                          className={mergeClasses("pimolu-tree-select__toggle", partClasses.toggle)}
                          aria-hidden="true"
                          onPointerDown={(event) => {
                            if (!hasChildren || event.pointerType !== "mouse") return;

                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onClick={(event) => {
                            if (
                              option.disabled ||
                              !hasChildren
                            ) {
                              return;
                            }

                            event.preventDefault();
                            event.stopPropagation();

                            setActiveValue(option.value);
                            toggleExpanded(option.value);
                          }}
                        >
                          {hasChildren && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          )}
                        </span>

                        <span className={mergeClasses("pimolu-tree-select__option-label", partClasses.optionLabel)}>
                          {option.label}
                        </span>

                        {selected && (
                          <span
                            className={mergeClasses("pimolu-tree-select__check", partClasses.check)}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Portal>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className={mergeClasses("pimolu-tree-select__error", partClasses.error)}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  ));
});

TreeSelect.displayName = "PimoluTreeSelect";
