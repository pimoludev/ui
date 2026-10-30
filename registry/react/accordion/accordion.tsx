"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { usePresence } from "../internal/use-presence";


import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

import type {
  PimoluAccordionContentProps,
  PimoluAccordionItemProps,
  PimoluAccordionProps,
  PimoluAccordionTriggerProps,
} from "./accordion.types";

import { accordionVariants } from "./accordion.variants";

import type { PimoluAccordionVariant } from "./accordion.variants";

function slug(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-") || "item";
}

function Chevron({ classNames }: { classNames?: PimoluClassNames<"accordion"> } = {}) {
  const [partClasses, scopeParts] = usePartClasses("accordion", classNames, false);

  return scopeParts((
    <svg
      className={mergeClasses("pimolu-accordion__chevron", partClasses.chevron)}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ));
}

/* =========================================
   CONTEXT
========================================= */

interface AccordionContextValue {
  animated: boolean;
  baseId: string;
  variant: PimoluAccordionVariant;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  rootRef: RefObject<HTMLDivElement | null>;
}

const AccordionContext =
  createContext<AccordionContextValue | null>(null);

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

function useAccordion(component: string) {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Accordion>.`
    );
  }

  return context;
}

function useAccordionItem(component: string) {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <AccordionItem>.`
    );
  }

  return context;
}

/* =========================================
   ROOT
========================================= */

export function Accordion(props: PimoluAccordionProps) {
  const [partClasses, scopeParts] = usePartClasses("accordion", props.classNames, true);

  const { classNames,
    children,
    variant = "default",
    animated = true,
    collapsible = false,
    className,
  } = props;

  const multiple = props.type === "multiple";

  const controlledValue = props.value;

  const [singleValue, setSingleValue] = useState<
    string | undefined
  >(
    multiple
      ? undefined
      : (props.defaultValue as string | undefined)
  );

  const [multipleValue, setMultipleValue] = useState<
    string[]
  >(
    multiple
      ? (props.defaultValue as string[] | undefined) ?? []
      : []
  );

  const value: string | string[] | undefined =
    controlledValue !== undefined
      ? controlledValue
      : multiple
        ? multipleValue
        : singleValue;

  const baseId = `pimolu-accordion-${useId()}`;

  const rootRef = useRef<HTMLDivElement | null>(null);

  function isOpen(item: string) {
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
          | ((value: string[]) => void)
          | undefined
      )?.(next);

      return;
    }

    if (value === item && !collapsible) return;

    const next = value === item ? undefined : item;

    if (controlledValue === undefined) {
      setSingleValue(next);
    }

    (
      props.onValueChange as
        | ((value: string | undefined) => void)
        | undefined
    )?.(next);
  }

  return scopeParts((
    <AccordionContext.Provider
      value={{
        animated,
        baseId,
        variant,
        isOpen,
        toggle,
        rootRef,
      }}
    >
      <div
        ref={rootRef}
        data-animated={animated}
        className={mergeClasses(accordionVariants(
          { variant },
          className
        ), partClasses.root)}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  ));
}

/* =========================================
   ITEM
========================================= */

export function AccordionItem({ classNames,
  value,
  disabled = false,
  children,
  className,
}: PimoluAccordionItemProps) {
  const [partClasses, scopeParts] = usePartClasses("accordion", classNames, false);

  const root = useAccordion("AccordionItem");

  const open = root.isOpen(value);

  const triggerId = `${root.baseId}-trigger-${slug(value)}`;
  const contentId = `${root.baseId}-content-${slug(value)}`;

  return scopeParts((
    <AccordionItemContext.Provider
      value={{
        value,
        open,
        disabled,
        triggerId,
        contentId,
      }}
    >
      <div
        className={mergeClasses([
          "pimolu-accordion__item",
          className,
        ]
          .filter(Boolean)
          .join(" "), partClasses.item, classNames?.root)}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  ));
}

/* =========================================
   TRIGGER
========================================= */

export function AccordionTrigger({ classNames,
  children,
  className,
}: PimoluAccordionTriggerProps) {
  const [partClasses, scopeParts] = usePartClasses("accordion", classNames, false);

  const root = useAccordion("AccordionTrigger");
  const item = useAccordionItem("AccordionTrigger");

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    const container = root.rootRef.current;

    if (!container) return;

    const triggers = Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        '[data-accordion-trigger]:not([disabled])'
      )
    );

    if (triggers.length === 0) return;

    const index = triggers.indexOf(event.currentTarget);

    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex =
        index < 0 ? 0 : (index + 1) % triggers.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        index < 0
          ? triggers.length - 1
          : (index - 1 + triggers.length) %
            triggers.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = triggers.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    triggers[nextIndex]?.focus();
  }

  return scopeParts((
    <button
      type="button"
      id={item.triggerId}
      data-accordion-trigger
      aria-expanded={item.open}
      aria-controls={item.contentId}
      disabled={item.disabled}
      data-state={item.open ? "open" : "closed"}
      className={mergeClasses([
        "pimolu-accordion__trigger",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.trigger, classNames?.root)}
      onClick={() => root.toggle(item.value)}
      onKeyDown={handleKeyDown}
    >
      <span className={mergeClasses("pimolu-accordion__label", partClasses.label)}>
        {children}
      </span>

      <Chevron />
    </button>
  ));
}

/* =========================================
   CONTENT
========================================= */

export function AccordionContent({ classNames,
  children,
  className,
}: PimoluAccordionContentProps) {
  const [partClasses, scopeParts] = usePartClasses("accordion", classNames, false);

  const item = useAccordionItem("AccordionContent");
  const root = useAccordion("AccordionContent");
  const { rendered } = usePresence(item.open, root.animated ? 220 : 0);
  const closing = root.animated && rendered && !item.open;

  return scopeParts((
    <div
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      hidden={!item.open}
      aria-hidden={!item.open || undefined}
      inert={!item.open || undefined}
      data-state={item.open ? "open" : closing ? "closing" : "closed"}
      className={mergeClasses([
        "pimolu-accordion__content",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.content, classNames?.root)}
    >
      <div className="pimolu-accordion__content-clip">
        <div className={mergeClasses("pimolu-accordion__content-inner", partClasses.contentInner)}>
          {children}
        </div>
      </div>
    </div>
  ));
}
