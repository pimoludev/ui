"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type {
  PimoluToolbarButtonProps,
  PimoluToolbarGroupProps,
  PimoluToolbarLinkProps,
  PimoluToolbarOrientation,
  PimoluToolbarProps,
  PimoluToolbarSeparatorProps,
  PimoluToolbarToggleGroupProps,
  PimoluToolbarToggleItemProps,
} from "./toolbar.types";

/* =========================================
   CONTEXT
======================================== */

interface ToolbarContextValue {
  orientation: PimoluToolbarOrientation;
  disabled: boolean;
}

const ToolbarContext =
  createContext<ToolbarContextValue | null>(null);

function useToolbar(component: string) {
  const context = useContext(ToolbarContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Toolbar>.`
    );
  }

  return context;
}

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

function isToolbarItem(node: EventTarget | null): node is HTMLElement {
  return (
    node instanceof HTMLElement &&
    node.hasAttribute("data-pimolu-toolbar-item")
  );
}

function getEnabledItems(root: HTMLElement | null) {
  return Array.from(
    root?.querySelectorAll<HTMLElement>(
      "[data-pimolu-toolbar-item]"
    ) ?? []
  ).filter(
    (item) =>
      !item.hasAttribute("disabled") &&
      item.getAttribute("aria-disabled") !== "true"
  );
}

function setActiveItem(
  items: HTMLElement[],
  active: HTMLElement
) {
  items.forEach((item) => {
    item.tabIndex = item === active ? 0 : -1;
  });
}

/* =========================================
   ROOT
======================================== */

export function Toolbar({ classNames,
  children,
  orientation = "horizontal",
  label,
  disabled = false,
  "aria-label": ariaLabel,
  className,
  ...props
}: PimoluToolbarProps) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", classNames, true);

  const rootRef = useRef<HTMLDivElement | null>(null);

  /*
   * A toolbar is one tab stop. Every item carries data-pimolu-toolbar-item,
   * so roving works across groups and separators without keeping a registry.
   */
  useEffect(() => {
    const items = getEnabledItems(rootRef.current);

    if (items.length === 0) return;

    const focused = items.find(
      (item) => item === document.activeElement
    );

    const current =
      focused ??
      items.find((item) => item.tabIndex === 0) ??
      items[0];

    setActiveItem(items, current);
  });

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (!isToolbarItem(event.target)) return;

    const items = getEnabledItems(rootRef.current);

    if (items.includes(event.target)) {
      setActiveItem(items, event.target);
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (!isToolbarItem(event.target)) return;

    const items = getEnabledItems(rootRef.current);
    const index = items.indexOf(event.target);

    if (index < 0) return;

    const vertical = orientation === "vertical";

    const forward = vertical ? "ArrowDown" : "ArrowRight";
    const backward = vertical ? "ArrowUp" : "ArrowLeft";

    let nextIndex: number | null = null;

    if (event.key === forward) {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === backward) {
      nextIndex =
        (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();

    const next = items[nextIndex];

    setActiveItem(items, next);
    next.focus();
  }

  return scopeParts((
    <ToolbarContext.Provider value={{ orientation, disabled }}>
      <div
        {...props}
        ref={rootRef}
        role="toolbar"
        aria-label={ariaLabel ?? label ?? "Toolbar"}
        aria-orientation={orientation}
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        className={mergeClasses(classes("pimolu-toolbar", className), partClasses.root)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </ToolbarContext.Provider>
  ));
}

Toolbar.displayName = "PimoluToolbar";

/* =========================================
   GROUP
======================================== */

export function ToolbarGroup({ classNames,
  children,
  className,
  ...props
}: PimoluToolbarGroupProps) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", classNames, false);

  return scopeParts((
    <div
      {...props}
      role="group"
      className={mergeClasses(classes(
        "pimolu-toolbar__group",
        className
      ), partClasses.group, classNames?.root)}
    >
      {children}
    </div>
  ));
}

ToolbarGroup.displayName = "PimoluToolbarGroup";

/* =========================================
   BUTTON
======================================== */

export function ToolbarButton({ classNames,
  children,
  className,
  type,
  disabled,
  tabIndex,
  ...props
}: PimoluToolbarButtonProps) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", classNames, false);

  const toolbar = useToolbar("ToolbarButton");

  return scopeParts((
    <button
      {...props}
      type={type ?? "button"}
      disabled={disabled || toolbar.disabled}
      data-pimolu-toolbar-item=""
      tabIndex={tabIndex ?? -1}
      className={mergeClasses(classes(
        "pimolu-toolbar__button",
        className
      ), partClasses.button, classNames?.root)}
    >
      {children}
    </button>
  ));
}

ToolbarButton.displayName = "PimoluToolbarButton";

/* =========================================
   LINK
======================================== */

export function ToolbarLink({ classNames,
  children,
  className,
  current = false,
  tabIndex,
  onClick,
  "aria-disabled": ariaDisabled,
  ...props
}: PimoluToolbarLinkProps) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", classNames, false);

  const toolbar = useToolbar("ToolbarLink");

  const disabled =
    toolbar.disabled || ariaDisabled === "true";

  return scopeParts((
    <a
      {...props}
      data-pimolu-toolbar-item=""
      tabIndex={disabled ? -1 : tabIndex ?? -1}
      aria-disabled={disabled || undefined}
      aria-current={current ? "page" : undefined}
      className={mergeClasses(classes(
        "pimolu-toolbar__link",
        className
      ), partClasses.link, classNames?.root)}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    >
      {children}
    </a>
  ));
}

ToolbarLink.displayName = "PimoluToolbarLink";

/* =========================================
   SEPARATOR
========================================= */

export function ToolbarSeparator({ classNames,
  className,
  ...props
}: PimoluToolbarSeparatorProps) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", classNames, false);

  const toolbar = useToolbar("ToolbarSeparator");

  return scopeParts((
    <div
      {...props}
      role="separator"
      aria-orientation={
        toolbar.orientation === "horizontal"
          ? "vertical"
          : "horizontal"
      }
      className={mergeClasses(classes(
        "pimolu-toolbar__separator",
        className
      ), partClasses.separator, classNames?.root)}
    />
  ));
}

ToolbarSeparator.displayName = "PimoluToolbarSeparator";

/* =========================================
   TOGGLE GROUP
========================================= */

interface ToolbarToggleContextValue {
  disabled: boolean;
  selected: (value: string) => boolean;
  toggle: (value: string) => void;
}

const ToolbarToggleContext =
  createContext<ToolbarToggleContextValue | null>(null);

function useToolbarToggle(component: string) {
  const context = useContext(ToolbarToggleContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <ToolbarToggleGroup>.`
    );
  }

  return context;
}

export function ToolbarToggleGroup(
  props: PimoluToolbarToggleGroupProps
) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", props.classNames, false);

  const toolbar = useToolbar("ToolbarToggleGroup");

  const { classNames,
    children,
    disabled = false,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  } = props;

  const multiple = props.type === "multiple";

  const controlledValue = props.value;

  const [singleValue, setSingleValue] = useState(
    multiple
      ? ""
      : (props.defaultValue as string | undefined) ?? ""
  );

  const [multipleValue, setMultipleValue] = useState<
    string[]
  >(
    multiple
      ? (props.defaultValue as string[] | undefined) ?? []
      : []
  );

  const value: string | string[] =
    controlledValue !== undefined
      ? controlledValue
      : multiple
        ? multipleValue
        : singleValue;

  const groupDisabled = disabled || toolbar.disabled;

  function selected(item: string) {
    return multiple
      ? (value as string[]).includes(item)
      : value === item;
  }

  function toggle(item: string) {
    if (multiple) {
      const current = (value as string[]) ?? [];

      const next = current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item];

      if (controlledValue === undefined) {
        setMultipleValue(next);
      }

      (
        props.onValueChange as
          | ((next: string[]) => void)
          | undefined
      )?.(next);

      return;
    }

    if (value === item) return;

    if (controlledValue === undefined) {
      setSingleValue(item);
    }

    (
      props.onValueChange as
        | ((next: string) => void)
        | undefined
    )?.(item);
  }

  return scopeParts((
    <ToolbarToggleContext.Provider
      value={{
        disabled: groupDisabled,
        selected,
        toggle,
      }}
    >
      <div
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-orientation={toolbar.orientation}
        className={mergeClasses(classes(
          "pimolu-toolbar__toggle-group",
          className
        ), partClasses.toggleGroup, props.classNames?.root)}
      >
        {children}
      </div>
    </ToolbarToggleContext.Provider>
  ));
}

ToolbarToggleGroup.displayName = "PimoluToolbarToggleGroup";

export function ToolbarToggleItem({ classNames,
  value,
  children,
  className,
  disabled,
  onClick,
  ...props
}: PimoluToolbarToggleItemProps) {
  const [partClasses, scopeParts] = usePartClasses("toolbar", classNames, false);

  const group = useToolbarToggle("ToolbarToggleItem");

  const pressed = group.selected(value);

  return scopeParts((
    <button
      {...props}
      type="button"
      aria-pressed={pressed}
      disabled={disabled || group.disabled}
      data-pimolu-toolbar-item=""
      tabIndex={-1}
      data-state={pressed ? "on" : "off"}
      className={mergeClasses(classes(
        "pimolu-toolbar__button",
        "pimolu-toolbar__toggle",
        className
      ), partClasses.button, classNames?.root)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) return;

        group.toggle(value);
      }}
    >
      {children}
    </button>
  ));
}

ToolbarToggleItem.displayName = "PimoluToolbarToggleItem";
