"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import type {
  PimoluCommandItem,
  PimoluCommandPaletteProps,
  PimoluCommandProps,
} from "./command.types";

import { Dialog, DialogContent } from "../dialog/dialog";
import { filterByQuery } from "../internal/search";

/* =========================================
   HELPERS
========================================= */

function classes(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

function firstEnabledId(
  items: readonly PimoluCommandItem[]
): string | null {
  return (
    items.find((item) => !item.disabled)?.id ?? null
  );
}

function enabledIndexes(
  items: readonly PimoluCommandItem[]
): number[] {
  return items.reduce<number[]>((indexes, item, index) => {
    if (!item.disabled) indexes.push(index);

    return indexes;
  }, []);
}

interface CommandGroup {
  name?: string;
  items: Array<{
    item: PimoluCommandItem;
    index: number;
  }>;
}

function groupItems(
  items: readonly PimoluCommandItem[]
): CommandGroup[] {
  const groups: CommandGroup[] = [];
  const byName = new Map<string, CommandGroup>();

  items.forEach((item, index) => {
    const key = item.group ?? "";
    let group = byName.get(key);

    if (!group) {
      group = { name: item.group, items: [] };
      byName.set(key, group);
      groups.push(group);
    }

    group.items.push({ item, index });
  });

  return groups;
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/* =========================================
   COMMAND
========================================= */

export function Command({ classNames,
  items,
  placeholder = "Search commands...",
  emptyMessage = "No commands found.",
  "aria-label": ariaLabel = "Command menu",
  onSelect,
  className,
  autoFocus = true,
}: PimoluCommandProps) {
  const [partClasses, scopeParts] = usePartClasses("command", classNames, true);

  const generatedId = useId();

  const listboxId = `pimolu-command-${generatedId}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");

  const [activeId, setActiveId] = useState<string | null>(
    () => firstEnabledId(items)
  );

  const filteredItems = useMemo(
    () => filterByQuery(items, query),
    [items, query]
  );

  const groups = useMemo(
    () => groupItems(filteredItems),
    [filteredItems]
  );

  const activeIndex = filteredItems.findIndex(
    (item) => item.id === activeId
  );

  const activeOption =
    activeIndex >= 0 ? filteredItems[activeIndex] : undefined;

  const activeDescendant =
    activeOption && !activeOption.disabled
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  /* ======================================
     FOCUS & ACTIVE ITEM
  ====================================== */

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const active = filteredItems.find(
      (item) => item.id === activeId
    );

    if (!active || active.disabled) {
      setActiveId(firstEnabledId(filteredItems));
    }
  }, [filteredItems, activeId]);

  useEffect(() => {
    if (!activeId) return;

    const node =
      listRef.current?.querySelector<HTMLElement>(
        '[data-active="true"]'
      );

    node?.scrollIntoView?.({ block: "nearest" });
  }, [activeId, filteredItems]);

  /* ======================================
     SELECTION
  ====================================== */

  const selectItem = useCallback(
    (item: PimoluCommandItem) => {
      if (item.disabled) return;

      item.onSelect?.();
      onSelect?.(item);
    },
    [onSelect]
  );

  /* ======================================
     SEARCH & KEYBOARD
  ====================================== */

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextQuery = event.currentTarget.value;

    setQuery(nextQuery);

    setActiveId(
      firstEnabledId(
        filterByQuery(items, nextQuery)
      )
    );
  }

  function handleKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>
  ) {
    const enabled = enabledIndexes(filteredItems);

    if (enabled.length === 0) return;

    const position = enabled.indexOf(activeIndex);

    let nextIndex = -1;

    switch (event.key) {
      case "ArrowDown":
        nextIndex =
          enabled[
            position === -1
              ? 0
              : (position + 1) % enabled.length
          ];
        break;

      case "ArrowUp":
        nextIndex =
          enabled[
            position === -1
              ? enabled.length - 1
              : (position - 1 + enabled.length) %
                enabled.length
          ];
        break;

      case "Home":
        nextIndex = enabled[0];
        break;

      case "End":
        nextIndex = enabled[enabled.length - 1];
        break;

      case "Enter": {
        const item = filteredItems[activeIndex];

        if (item && !item.disabled) {
          event.preventDefault();
          selectItem(item);
        }

        return;
      }

      default:
        return;
    }

    event.preventDefault();

    if (nextIndex < 0) return;

    setActiveId(filteredItems[nextIndex].id);
  }

  /* ======================================
     RENDER
  ====================================== */

  function renderOption(
    item: PimoluCommandItem,
    index: number
  ) {
    const optionId = `${listboxId}-option-${index}`;

    const isActive =
      item.id === activeId && !item.disabled;

    return (
      <div
        key={item.id}
        id={optionId}
        role="option"
        aria-label={item.label}
        aria-selected={isActive}
        aria-disabled={item.disabled || undefined}
        aria-describedby={
          item.description
            ? `${optionId}-description`
            : undefined
        }
        data-active={isActive ? "true" : undefined}
        className={mergeClasses(classes(
          "pimolu-command__item",
          item.disabled && "pimolu-command__item--disabled"
        ), partClasses.item)}
        onMouseDown={(event) => {
          /* Keep the focus in the search field. */
          event.preventDefault();
        }}
        onMouseMove={() => {
          if (!item.disabled) setActiveId(item.id);
        }}
        onClick={() => {
          selectItem(item);
        }}
      >
        {item.icon && (
          <span
            className={mergeClasses("pimolu-command__icon", partClasses.icon)}
            aria-hidden="true"
          >
            {item.icon}
          </span>
        )}

        <span className={mergeClasses("pimolu-command__main", partClasses.main)}>
          <span className={mergeClasses("pimolu-command__label", partClasses.label)}>
            {item.label}
          </span>

          {item.description && (
            <span
              id={`${optionId}-description`}
              className={mergeClasses("pimolu-command__description", partClasses.description)}
            >
              {item.description}
            </span>
          )}
        </span>

        {item.shortcut && (
          <kbd className={mergeClasses("pimolu-command__shortcut", partClasses.shortcut)}>
            {item.shortcut}
          </kbd>
        )}
      </div>
    );
  }

  return scopeParts((
    <div
      className={mergeClasses(classes("pimolu-command", className), partClasses.root)}
    >
      <div className={mergeClasses("pimolu-command__field", partClasses.field)}>
        <span
          className={mergeClasses("pimolu-command__search-icon", partClasses.searchIcon)}
          aria-hidden="true"
        >
          <SearchIcon />
        </span>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={true}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-label={ariaLabel}
          autoComplete="off"
          spellCheck={false}
          className={mergeClasses("pimolu-command__input", partClasses.input)}
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        className={mergeClasses("pimolu-command__list", partClasses.list)}
      >
        {filteredItems.length === 0 ? (
          <p
            className={mergeClasses("pimolu-command__empty", partClasses.empty)}
            role="status"
          >
            {emptyMessage}
          </p>
        ) : (
          groups.map((group, groupIndex) => {
            if (!group.name) {
              return group.items.map(({ item, index }) =>
                renderOption(item, index)
              );
            }

            const labelId = `${listboxId}-group-${groupIndex}`;

            return (
              <div
                key={group.name}
                role="group"
                aria-labelledby={labelId}
                className={mergeClasses("pimolu-command__group", partClasses.group)}
              >
                <div
                  id={labelId}
                  className={mergeClasses("pimolu-command__group-label", partClasses.groupLabel)}
                >
                  {group.name}
                </div>

                {group.items.map(({ item, index }) =>
                  renderOption(item, index)
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  ));
}

Command.displayName = "PimoluCommand";

/* =========================================
   COMMAND PALETTE
========================================= */

export function CommandPalette({ classNames,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  items,
  label = "Command palette",
  shortcut,
  placeholder,
  emptyMessage,
  onSelect,
  className,
  autoFocus = true,
}: PimoluCommandPaletteProps) {
  const [partClasses, scopeParts] = usePartClasses("command", classNames, true);

  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const open = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  /* ======================================
     KEYBOARD SHORTCUT
  ====================================== */

  useEffect(() => {
    if (!shortcut) return;

    const key = shortcut.toLowerCase();

    function handleShortcut(
      event: globalThis.KeyboardEvent
    ) {
      if (event.defaultPrevented || event.repeat) return;

      if (!(event.ctrlKey || event.metaKey) || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== key) return;

      event.preventDefault();

      if (!open) setOpen(true);
    }

    document.addEventListener("keydown", handleShortcut);

    return () =>
      document.removeEventListener(
        "keydown",
        handleShortcut
      );
  }, [shortcut, open, setOpen]);

  /* ======================================
     RENDER
  ====================================== */

  return scopeParts((
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        role="dialog"
        aria-label={label}
        className={mergeClasses(classes(
          "pimolu-command-palette",
          className
        ), partClasses.root)}
        showCloseButton={false}
      >
        <Command
          items={items}
          placeholder={placeholder}
          emptyMessage={emptyMessage}
          aria-label={label}
          autoFocus={autoFocus}
          onSelect={(item) => {
            onSelect?.(item);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  ));
}

CommandPalette.displayName = "PimoluCommandPalette";
