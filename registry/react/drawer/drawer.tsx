"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";


import { mergeClasses } from "../internal/merge-classes";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";

import type {
  PimoluDrawerCloseProps,
  PimoluDrawerContentProps,
  PimoluDrawerDescriptionProps,
  PimoluDrawerFooterProps,
  PimoluDrawerHeaderProps,
  PimoluDrawerProps,
  PimoluDrawerSide,
  PimoluDrawerSize,
  PimoluDrawerTitleProps,
  PimoluDrawerTriggerProps,
} from "./drawer.types";

import { getFocusable } from "../internal/focusable";
import { Portal } from "../internal/portal";
import { useBodyScrollLock } from "../internal/use-body-scroll-lock";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { useFocusTrap } from "../internal/use-focus-trap";
import { usePresence } from "../internal/use-presence";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration of drawer.css. */
const EXIT_DURATION = 180;

const SIDE_CLASSES: Record<PimoluDrawerSide, string> = {
  right: "pimolu-drawer__content--right",
  left: "pimolu-drawer__content--left",
  top: "pimolu-drawer__content--top",
  bottom: "pimolu-drawer__content--bottom",
};

const SIZE_CLASSES: Record<PimoluDrawerSize, string> = {
  sm: "pimolu-drawer__content--sm",
  md: "pimolu-drawer__content--md",
  lg: "pimolu-drawer__content--lg",
};

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
}

function contentClasses(
  side: PimoluDrawerSide,
  size: PimoluDrawerSize,
  className: string | undefined
) {
  return [
    "pimolu-drawer__content",
    SIDE_CLASSES[side],
    SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* =========================================
   CONTEXT
========================================= */

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;

  contentId: string;

  titleId: string | null;
  descriptionId: string | null;

  setTitleId: Dispatch<
    SetStateAction<string | null>
  >;
  setDescriptionId: Dispatch<
    SetStateAction<string | null>
  >;

  /** Element placed in the app tree, used to find the theme scope. */
  scopeRef: RefObject<HTMLSpanElement | null>;

  triggerRef: RefObject<HTMLElement | null>;
}

const DrawerContext =
  createContext<DrawerContextValue | null>(null);

function useDrawer(component: string) {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Drawer>.`
    );
  }

  return context;
}

/* =========================================
   ROOT
========================================= */

export function Drawer({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PimoluDrawerProps) {
  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const open = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  const contentId = `pimolu-drawer-${useId()}`;

  const scopeRef = useRef<HTMLSpanElement | null>(
    null
  );

  const triggerRef = useRef<HTMLElement | null>(null);

  const [titleId, setTitleId] = useState<
    string | null
  >(null);

  const [descriptionId, setDescriptionId] =
    useState<string | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const value = useMemo<DrawerContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      titleId,
      descriptionId,
      setTitleId,
      setDescriptionId,
      scopeRef,
      triggerRef,
    }),
    [
      open,
      setOpen,
      contentId,
      titleId,
      descriptionId,
    ]
  );

  return (
    <DrawerContext.Provider value={value}>
      {/*
       * Kept in the application tree so the panel can be portalled into the
       * nearest theme scope, even when the drawer has no trigger.
       */}
      <span ref={scopeRef} hidden />

      {children}
    </DrawerContext.Provider>
  );
}

/* =========================================
   TRIGGER
========================================= */

interface TriggerProps {
  ref?: unknown;
  onClick?: (event: MouseEvent) => void;
}

export function DrawerTrigger({
  children,
}: PimoluDrawerTriggerProps) {
  const { open, setOpen, contentId, triggerRef } =
    useDrawer("DrawerTrigger");

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<
    Record<string, unknown>
  >;

  const props = trigger.props as TriggerProps;

  function assignRef(node: HTMLElement | null) {
    triggerRef.current = node;

    const childRef = props.ref;

    if (typeof childRef === "function") {
      (childRef as (node: HTMLElement | null) => void)(
        node
      );
    } else if (
      childRef &&
      typeof childRef === "object" &&
      "current" in childRef
    ) {
      (childRef as { current: HTMLElement | null }).current =
        node;
    }
  }

  return cloneElement(trigger, {
    ref: assignRef,

    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? contentId : undefined,

    "data-state": open ? "open" : "closed",

    onClick: (event: MouseEvent) => {
      props.onClick?.(event);

      if (event.defaultPrevented) return;

      setOpen(!open);
    },
  });
}

/* =========================================
   CONTENT
========================================= */

interface DrawerSurfaceProps {
  contentRef: RefObject<HTMLDivElement | null>;

  id: string;

  open: boolean;
  state: "open" | "closing";

  side: PimoluDrawerSide;
  size: PimoluDrawerSize;
  className?: string;
  style?: PimoluDrawerContentProps["style"];
  classNames?: PimoluClassNames<"drawer">;

  showCloseButton: boolean;
  closeLabel: string;

  labelledBy?: string;
  describedBy?: string;
  ariaLabel?: string;

  triggerRef: RefObject<HTMLElement | null>;

  onClose: () => void;

  children?: ReactNode;
}

/**
 * Mounted only once the portal host exists, so the focus trap can move focus
 * into a panel that is actually in the document.
 */
function DrawerSurface({
  contentRef,
  id,
  open,
  state,
  side,
  size,
  className,
  classNames,
  style,
  showCloseButton,
  closeLabel,
  labelledBy,
  describedBy,
  ariaLabel,
  triggerRef,
  onClose,
  children,
}: DrawerSurfaceProps) {
  const [partClasses, scopeParts] = usePartClasses("drawer", classNames, false);

  useFocusTrap({
    active: open,
    containerRef: contentRef,
    returnFocusRef: triggerRef,
    initialFocus: "container",
  });

  useEffect(() => {
    if (!open) return;

    const content = contentRef.current;

    if (!content) return;

    /*
     * Footer actions are often destructive and sit at the bottom of a long
     * drawer: focusing one would scroll the panel away from its title. Prefer
     * a control in the body, then the panel itself; the close button and the
     * footer stay a Tab away.
     */
    const preferred = getFocusable(content).find(
      (element) =>
        !element.closest(".pimolu-drawer__footer") &&
        !element.classList.contains(
          "pimolu-drawer__close"
        )
    );

    (preferred ?? content).focus();
  }, [open, contentRef]);

  return scopeParts((
    <div
      ref={contentRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      tabIndex={-1}
      className={mergeClasses(contentClasses(side, size, className), partClasses.root)}
      style={style}
      data-state={state}
      data-side={side}
      data-close-button={
        showCloseButton ? "true" : undefined
      }
    >
      {children}

      {showCloseButton && (
        <button
          type="button"
          className={mergeClasses("pimolu-drawer__close", partClasses.closeButton)}
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  ));
}

export function DrawerContent({
  children,

  side = "right",
  size = "md",

  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeLabel = "Close",

  className,
  classNames,
  style,

  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: PimoluDrawerContentProps) {
  const [partClasses, scopeParts] = usePartClasses("drawer", classNames, true);

  const {
    open,
    setOpen,
    contentId,
    titleId,
    descriptionId,
    scopeRef,
    triggerRef,
  } = useDrawer("DrawerContent");

  const contentRef = useRef<HTMLDivElement | null>(
    null
  );

  /* The panel stays mounted while it animates out. */
  const { rendered, state } = usePresence(
    open,
    EXIT_DURATION
  );

  useBodyScrollLock(rendered);

  /*
   * The overlay is outside the panel, so the shared outside-pointer listener
   * handles both an overlay press and Escape with the same configuration.
   */
  useDismissableLayer({
    open,
    target: contentRef,
    onDismiss: () => setOpen(false),
    closeOnOutside: closeOnOverlayClick,
    closeOnEscape,
  });

  if (!rendered) return scopeParts(null);

  const labelledBy =
    ariaLabelledBy ?? titleId ?? undefined;

  const describedBy =
    ariaDescribedBy ?? descriptionId ?? undefined;

  return scopeParts((
    <Portal anchorRef={scopeRef}>
      <div
        className={mergeClasses("pimolu-drawer", partClasses.root)}
        data-state={state}
        data-side={side}
      >
        <div
          className={mergeClasses("pimolu-drawer__overlay", partClasses.overlay)}
          data-state={state}
        />

        <DrawerSurface
          contentRef={contentRef}
          id={contentId}
          open={open}
          state={state}
          side={side}
          size={size}
          className={mergeClasses(className, partClasses.content)}
          classNames={classNames}
          style={style}
          showCloseButton={showCloseButton}
          closeLabel={closeLabel}
          labelledBy={labelledBy}
          describedBy={describedBy}
          ariaLabel={ariaLabel}
          triggerRef={triggerRef}
          onClose={() => setOpen(false)}
        >
          {children}
        </DrawerSurface>
      </div>
    </Portal>
  ));
}

/* =========================================
   HEADER & FOOTER
========================================= */

export function DrawerHeader({ classNames,
  children,
  className,
}: PimoluDrawerHeaderProps) {
  const [partClasses, scopeParts] = usePartClasses("drawer", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-drawer__header",
        className
      ), partClasses.header, classNames?.root)}
    >
      {children}
    </div>
  ));
}

export function DrawerFooter({ classNames,
  children,
  className,
}: PimoluDrawerFooterProps) {
  const [partClasses, scopeParts] = usePartClasses("drawer", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-drawer__footer",
        className
      ), partClasses.footer, classNames?.root)}
    >
      {children}
    </div>
  ));
}

/* =========================================
   TITLE & DESCRIPTION
========================================= */

export function DrawerTitle({ classNames,
  children,
  id,
  className,
}: PimoluDrawerTitleProps) {
  const [partClasses, scopeParts] = usePartClasses("drawer", classNames, false);

  const { setTitleId } = useDrawer("DrawerTitle");

  const generatedId = useId();

  const titleId =
    id ?? `pimolu-drawer-title-${generatedId}`;

  useEffect(() => {
    setTitleId(titleId);

    return () =>
      setTitleId((current) =>
        current === titleId ? null : current
      );
  }, [setTitleId, titleId]);

  return scopeParts((
    <h2
      id={titleId}
      className={mergeClasses(classes(
        "pimolu-drawer__title",
        className
      ), partClasses.title, classNames?.root)}
    >
      {children}
    </h2>
  ));
}

export function DrawerDescription({ classNames,
  children,
  id,
  className,
}: PimoluDrawerDescriptionProps) {
  const [partClasses, scopeParts] = usePartClasses("drawer", classNames, false);

  const { setDescriptionId } =
    useDrawer("DrawerDescription");

  const generatedId = useId();

  const descriptionId =
    id ?? `pimolu-drawer-description-${generatedId}`;

  useEffect(() => {
    setDescriptionId(descriptionId);

    return () =>
      setDescriptionId((current) =>
        current === descriptionId ? null : current
      );
  }, [setDescriptionId, descriptionId]);

  return scopeParts((
    <p
      id={descriptionId}
      className={mergeClasses(classes(
        "pimolu-drawer__description",
        className
      ), partClasses.description, classNames?.root)}
    >
      {children}
    </p>
  ));
}

/* =========================================
   CLOSE
========================================= */

interface CloseTriggerProps {
  onClick?: (event: MouseEvent) => void;
}

export function DrawerClose({
  children,
}: PimoluDrawerCloseProps) {
  const { setOpen } = useDrawer("DrawerClose");

  if (!isValidElement(children)) return children;

  const trigger = children as ReactElement<
    Record<string, unknown>
  >;

  const props = trigger.props as CloseTriggerProps;

  return cloneElement(trigger, {
    onClick: (event: MouseEvent) => {
      props.onClick?.(event);

      if (event.defaultPrevented) return;

      setOpen(false);
    },
  });
}
