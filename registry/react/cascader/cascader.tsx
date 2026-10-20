"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  PimoluCascaderOption,
  PimoluCascaderProps,
} from "./cascader.types";

import { Portal } from "../internal/portal";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";

/* =========================================
   TREE HELPERS
========================================= */

function pathKey(path: readonly string[]): string {
  return path.join("\u0000");
}

function pathsEqual(
  left: readonly string[],
  right: readonly string[]
): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function isPathPrefix(
  prefix: readonly string[],
  path: readonly string[]
): boolean {
  return (
    prefix.length <= path.length &&
    prefix.every(
      (value, index) => value === path[index]
    )
  );
}

function findOptionAtPath(
  options: readonly PimoluCascaderOption[],
  path: readonly string[]
): PimoluCascaderOption | undefined {
  let level = options;
  let found: PimoluCascaderOption | undefined;

  for (const value of path) {
    found = level.find(
      (option) => option.value === value
    );

    if (!found) return undefined;

    level = found.children ?? [];
  }

  return found;
}

function labelsForPath(
  options: readonly PimoluCascaderOption[],
  path: readonly string[]
): string[] {
  const labels: string[] = [];
  let level = options;

  for (const value of path) {
    const found = level.find(
      (option) => option.value === value
    );

    if (!found) break;

    labels.push(found.label);
    level = found.children ?? [];
  }

  return labels;
}

interface CascaderColumn {
  parentPath: string[];
  parentLabel?: string;
  options: readonly PimoluCascaderOption[];
}

function getColumns(
  options: readonly PimoluCascaderOption[],
  expandedPath: readonly string[]
): CascaderColumn[] {
  const columns: CascaderColumn[] = [
    { parentPath: [], options },
  ];

  let level = options;

  for (
    let depth = 0;
    depth < expandedPath.length;
    depth += 1
  ) {
    const parent = level.find(
      (option) => option.value === expandedPath[depth]
    );

    if (!parent?.children?.length) break;

    const parentPath = expandedPath.slice(0, depth + 1);

    columns.push({
      parentPath,
      parentLabel: parent.label,
      options: parent.children,
    });

    level = parent.children;
  }

  return columns;
}

interface FlatOption {
  option: PimoluCascaderOption;
  path: string[];
  columnIndex: number;
}

function flattenColumns(
  columns: readonly CascaderColumn[]
): FlatOption[] {
  return columns.flatMap((column, columnIndex) =>
    column.options.map((option) => ({
      option,
      path: [...column.parentPath, option.value],
      columnIndex,
    }))
  );
}

/* =========================================
   CASCADER
========================================= */

export const Cascader = forwardRef<
  HTMLButtonElement,
  PimoluCascaderProps
>(function Cascader(
  {
    id,
    options,

    value,
    defaultValue = [],

    onChange,

    label,
    placeholder = "Select an option",
    helperText,
    emptyMessage = "No options available.",

    clearable = true,
    disabled = false,
    fullWidth = false,

    className,
    style,

    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  },
  forwardedRef
) {
  /* ======================================
     IDS AND REFS
  ====================================== */

  const generatedId = useId();
  const triggerId = id ?? `pimolu-cascader-${generatedId}`;
  const labelId = `${triggerId}-label`;
  const listboxId = `${triggerId}-listbox`;

  const messageId = helperText
    ? `${triggerId}-message`
    : undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

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
    string[]
  >(() => [...defaultValue]);

  const selectedPath: readonly string[] = isControlled
    ? value
    : internalValue;

  /* ======================================
     PANEL STATE
  ====================================== */

  const [isOpen, setIsOpen] = useState(false);
  const [expandedPath, setExpandedPath] = useState<
    string[]
  >([]);
  const [activePath, setActivePath] = useState<
    string[] | null
  >(null);

  const columns = getColumns(options, expandedPath);
  const flatOptions = flattenColumns(columns);

  const selectedLabels = labelsForPath(
    options,
    selectedPath
  );

  const displayLabel =
    selectedLabels.length > 0
      ? selectedLabels.join(" / ")
      : selectedPath.join(" / ");

  const activeIndex = activePath
    ? flatOptions.findIndex((entry) =>
        pathsEqual(entry.path, activePath)
      )
    : -1;

  const activeOption =
    activeIndex >= 0
      ? flatOptions[activeIndex]
      : undefined;

  const flatIndexByKey = new Map(
    flatOptions.map((entry, index) => [
      pathKey(entry.path),
      index,
    ])
  );

  /* ======================================
     HELPERS
  ====================================== */

  function firstEnabledPath(
    entries: readonly FlatOption[]
  ): string[] | null {
    return (
      entries.find((entry) => !entry.option.disabled)
        ?.path ?? null
    );
  }

  function openMenu() {
    if (disabled) return;

    const initialExpanded =
      selectedPath.length > 0
        ? [...selectedPath.slice(0, -1)]
        : [];

    setExpandedPath(initialExpanded);

    const initialActive =
      selectedPath.length > 0 &&
      findOptionAtPath(options, selectedPath)
        ? [...selectedPath]
        : firstEnabledPath(
            flattenColumns(
              getColumns(options, initialExpanded)
            )
          );

    setActivePath(initialActive);
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    setActivePath(null);
  }

  function commit(
    nextPath: string[],
    option?: PimoluCascaderOption
  ) {
    if (!isControlled) {
      setInternalValue(nextPath);
    }

    onChange?.([...nextPath], option);

    setIsOpen(false);
    setActivePath(null);

    triggerRef.current?.focus();
  }

  function selectOption(entry: FlatOption) {
    if (entry.option.disabled) return;
    if (entry.option.children?.length) return;

    commit(entry.path, entry.option);
  }

  function moveActive(step: number) {
    const enabled = flatOptions.filter(
      (entry) => !entry.option.disabled
    );

    if (enabled.length === 0) return;

    const position = enabled.findIndex((entry) =>
      pathsEqual(entry.path, activePath ?? [])
    );

    const nextPosition =
      position < 0
        ? step > 0
          ? 0
          : enabled.length - 1
        : (position + step + enabled.length) %
          enabled.length;

    const next = enabled[nextPosition];

    setActivePath(next.path);

    /* Columns only show the branch that owns the active option. */
    setExpandedPath(next.path.slice(0, -1));
  }

  function clearSelection() {
    if (disabled) return;

    commit([]);
  }

  /* ======================================
     KEYBOARD
  ====================================== */

  function handleTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    if (disabled) return;

    const { key } = event;

    if (key === "Escape") {
      if (!isOpen) return;

      event.preventDefault();
      closeMenu();
      return;
    }

    if (key === "Tab") {
      if (isOpen) closeMenu();
      return;
    }

    if (
      key === "ArrowDown" ||
      key === "ArrowUp"
    ) {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      moveActive(key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (key === "Home" || key === "End") {
      if (!isOpen) return;

      event.preventDefault();

      const enabled = flatOptions.filter(
        (entry) => !entry.option.disabled
      );

      if (enabled.length === 0) return;

      setActivePath(
        key === "Home"
          ? enabled[0].path
          : enabled[enabled.length - 1].path
      );

      return;
    }

    if (key === "ArrowRight") {
      if (!isOpen || !activeOption) return;

      event.preventDefault();

      if (activeOption.option.children?.length) {
        setExpandedPath(activeOption.path);

        const child = activeOption.option.children.find(
          (option) => !option.disabled
        );

        setActivePath(
          child
            ? [...activeOption.path, child.value]
            : activeOption.path
        );
      }

      return;
    }

    if (key === "ArrowLeft") {
      if (!isOpen || !activeOption) return;

      event.preventDefault();

      if (activeOption.columnIndex > 0) {
        const parentPath = activeOption.path.slice(0, -1);

        setExpandedPath(parentPath.slice(0, -1));
        setActivePath(parentPath);
      }

      return;
    }

    if (key === "Enter" || key === " ") {
      if (!isOpen) {
        if (key === "Enter" || key === " ") {
          event.preventDefault();
          openMenu();
        }

        return;
      }

      if (!activeOption) return;

      event.preventDefault();

      if (activeOption.option.children?.length) {
        setExpandedPath(activeOption.path);

        const child =
          activeOption.option.children.find(
            (option) => !option.disabled
          );

        setActivePath(
          child
            ? [...activeOption.path, child.value]
            : activeOption.path
        );

        return;
      }

      selectOption(activeOption);
    }
  }

  /* ======================================
     SHARED BEHAVIOURS
  ====================================== */

  const { style: popupStyle } = useAnchoredPosition(
    fieldRef,
    listboxRef,
    isOpen && !disabled,
    {
      gap: 6,
      maxHeight: 340,
      maxWidth: 680,
      matchWidth: false,
      placement: "bottom",
    }
  );

  useDismissableLayer({
    open: isOpen && !disabled,
    target: [rootRef, listboxRef],
    onDismiss: closeMenu,
  });

  /* Keep the highlighted option visible when columns grow. */
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    listboxRef.current
      ?.querySelector<HTMLElement>(
        '[data-active="true"]'
      )
      ?.scrollIntoView?.({ block: "nearest" });
  }, [isOpen, activeIndex, expandedPath]);

  /* ======================================
     ACCESSIBILITY AND CLASSES
  ====================================== */

  const describedBy =
    [
      ariaDescribedBy,
      messageId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const labelledBy =
    [
      ariaLabelledBy,
      label ? labelId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const rootClassName = [
    "pimolu-cascader",
    fullWidth && "pimolu-cascader--full-width",
    disabled && "pimolu-cascader--disabled",
    isOpen && "pimolu-cascader--open",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const activeDescendant =
    isOpen && activeIndex >= 0
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={style}
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-cascader__label"
        >
          {label}
        </span>
      )}

      <div
        ref={fieldRef}
        className="pimolu-cascader__field"
      >
        <button
          ref={assignRef}
          id={triggerId}
          type="button"
          className="pimolu-cascader__trigger"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={
            isOpen ? listboxId : undefined
          }
          aria-activedescendant={activeDescendant}
          aria-labelledby={labelledBy}
          aria-label={
            labelledBy ? undefined : ariaLabel
          }
          aria-describedby={describedBy}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={() => {
            if (isOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          <span
            className={
              displayLabel
                ? "pimolu-cascader__value"
                : "pimolu-cascader__value pimolu-cascader__value--placeholder"
            }
            title={
              displayLabel.length > 0
                ? displayLabel
                : undefined
            }
          >
            {displayLabel || placeholder}
          </span>
        </button>

        {clearable &&
          selectedPath.length > 0 &&
          !disabled && (
            <button
              type="button"
              className="pimolu-cascader__clear"
              aria-label="Clear selection"
              onClick={clearSelection}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}

        <span
          className="pimolu-cascader__chevron"
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
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={labelledBy}
              aria-label={
                labelledBy ? undefined : ariaLabel
              }
              className="pimolu-cascader__panel"
              style={popupStyle}
            >
              {flatOptions.length === 0 ? (
                <p
                  className="pimolu-cascader__empty"
                  role="status"
                >
                  {emptyMessage}
                </p>
              ) : (
                columns.map((column, columnIndex) => {
                  const groupLabel =
                    columnIndex === 0
                      ? label ??
                        ariaLabel ??
                        "Options"
                      : column.parentLabel ??
                        "Options";

                  return (
                    <div
                      key={pathKey(column.parentPath)}
                      role="group"
                      aria-label={groupLabel}
                      className="pimolu-cascader__column"
                    >
                      <div
                        className="pimolu-cascader__column-label"
                        aria-hidden="true"
                      >
                        {groupLabel}
                      </div>

                      {column.options.map((option) => {
                        const path = [
                          ...column.parentPath,
                          option.value,
                        ];

                        const flatIndex =
                          flatIndexByKey.get(
                            pathKey(path)
                          );

                        const selected =
                          pathsEqual(
                            selectedPath,
                            path
                          );

                        const active =
                          flatIndex !== undefined &&
                          flatIndex === activeIndex;

                        const hasChildren =
                          Boolean(option.children?.length);

                        return (
                          <div
                            key={option.value}
                            id={
                              flatIndex !== undefined
                                ? `${listboxId}-option-${flatIndex}`
                                : undefined
                            }
                            role="option"
                            aria-selected={selected}
                            aria-disabled={
                              option.disabled || undefined
                            }
                            aria-haspopup={
                              hasChildren
                                ? "listbox"
                                : undefined
                            }
                            aria-expanded={
                              hasChildren
                                ? isPathPrefix(
                                    path,
                                    expandedPath
                                  )
                                : undefined
                            }
                            data-active={
                              active ? "true" : undefined
                            }
                            data-expanded={
                              hasChildren &&
                              isPathPrefix(
                                path,
                                expandedPath
                              )
                                ? "true"
                                : undefined
                            }
                            className={[
                              "pimolu-cascader__option",
                              selected &&
                                "pimolu-cascader__option--selected",
                              option.disabled &&
                                "pimolu-cascader__option--disabled",
                            ]
                              .filter(Boolean)
                              .join(" ")}

                            onMouseDown={(event) => {
                              event.preventDefault();
                            }}
                            onPointerEnter={() => {
                              if (option.disabled) return;

                              setActivePath(path);

                              if (hasChildren) {
                                setExpandedPath(path);
                              } else {
                                setExpandedPath(
                                  column.parentPath
                                );
                              }
                            }}
                            onClick={() => {
                              if (option.disabled) return;

                              setActivePath(path);

                              if (hasChildren) {
                                setExpandedPath(path);
                                return;
                              }

                              commit(path, option);
                            }}
                          >
                            <span className="pimolu-cascader__option-label">
                              {option.label}
                            </span>

                            {selected && (
                              <span
                                className="pimolu-cascader__check"
                                aria-hidden="true"
                              >
                                ✓
                              </span>
                            )}

                            {hasChildren && (
                              <span
                                className="pimolu-cascader__option-chevron"
                                aria-hidden="true"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                >
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </Portal>
        )}
      </div>

      {helperText && (
        <p
          id={messageId}
          className="pimolu-cascader__helper"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Cascader.displayName = "PimoluCascader";
