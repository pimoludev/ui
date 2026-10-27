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
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";

import type {
  PimoluDialogCloseProps,
  PimoluDialogContentProps,
  PimoluDialogDescriptionProps,
  PimoluDialogFooterProps,
  PimoluDialogHeaderProps,
  PimoluDialogProps,
  PimoluDialogTitleProps,
  PimoluDialogTriggerProps,
} from "./dialog.types";

import { dialogVariants } from "./dialog.variants";

import { getFocusable } from "../internal/focusable";
import { Portal } from "../internal/portal";
import { useBodyScrollLock } from "../internal/use-body-scroll-lock";

/* =========================================
   HELPERS
========================================= */

/** Must match the exit animation duration of dialog.css. */
const EXIT_DURATION = 150;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
  );
}

function classes(
  base: string,
  className: string | undefined
) {
  return [base, className].filter(Boolean).join(" ");
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

interface DialogContextValue {
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

const DialogContext =
  createContext<DialogContextValue | null>(null);

function useDialog(component: string) {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Dialog>.`
    );
  }

  return context;
}

/* =========================================
   ROOT
========================================= */

export function Dialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PimoluDialogProps) {
  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const open = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  const contentId = `pimolu-dialog-${useId()}`;

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

  const value = useMemo<DialogContextValue>(
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
    <DialogContext.Provider value={value}>
      {/*
       * Kept in the application tree so the panel can be portalled into the
       * nearest theme scope, even when the dialog has no trigger.
       */}
      <span ref={scopeRef} hidden />

      {children}
    </DialogContext.Provider>
  );
}

/* =========================================
   TRIGGER
========================================= */

interface TriggerProps {
  ref?: unknown;
  onClick?: (event: MouseEvent) => void;
}

export function DialogTrigger({
  children,
}: PimoluDialogTriggerProps) {
  const { open, setOpen, contentId, triggerRef } =
    useDialog("DialogTrigger");

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

interface DialogSurfaceProps {
  contentRef: RefObject<HTMLDivElement | null>;

  id: string;
  state: "open" | "closing";

  size: NonNullable<PimoluDialogContentProps["size"]>;
  className?: string;
  style?: PimoluDialogContentProps["style"];
  classNames?: PimoluClassNames<"dialog">;

  closeOnEscape: boolean;
  showCloseButton: boolean;
  closeLabel: string;
  role: "dialog" | "alertdialog";

  labelledBy?: string;
  describedBy?: string;
  ariaLabel?: string;

  triggerRef: RefObject<HTMLElement | null>;

  onClose: () => void;

  children?: ReactNode;
}

function DialogSurface({
  contentRef,
  id,
  state,
  size,
  className,
  classNames,
  style,
  closeOnEscape,
  showCloseButton,
  closeLabel,
  role,
  labelledBy,
  describedBy,
  ariaLabel,
  triggerRef,
  onClose,
  children,
}: DialogSurfaceProps) {
  const [partClasses, scopeParts] = usePartClasses("dialog", classNames, false);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    /*
     * Footer actions are often destructive and sit at the bottom of a long
     * panel: focusing one would scroll the dialog away from its title. Prefer
     * a control in the body, then the panel itself; the close button and the
     * footer stay a Tab away.
     */
    const preferred = getFocusable(content).find(
      (element) =>
        !element.closest(".pimolu-dialog__footer") &&
        !element.classList.contains(
          "pimolu-dialog__close"
        )
    );

    (preferred ?? content).focus();

    return () => {
      const target = triggerRef.current ?? previous;

      if (target?.isConnected) {
        target.focus();
      }
    };
  }, [contentRef, triggerRef]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === "Escape") {
      if (!closeOnEscape) return;

      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const content = contentRef.current;

    if (!content) return;

    const focusable = getFocusable(content);

    if (focusable.length === 0) {
      event.preventDefault();
      content.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const active = document.activeElement;

    if (active === content) {
      event.preventDefault();

      (event.shiftKey ? last : first).focus();

      return;
    }

    if (event.shiftKey) {
      if (active === first || !content.contains(active)) {
        event.preventDefault();
        last.focus();
      }

      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return scopeParts((
    <div
      ref={contentRef}
      id={id}
      role={role}
      aria-modal="true"
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      tabIndex={-1}
      className={mergeClasses(dialogVariants({ size }, className), partClasses.content)}
      style={style}
      data-state={state}
      data-close-button={
        showCloseButton ? "true" : undefined
      }
      onKeyDown={handleKeyDown}
    >
      {children}

      {showCloseButton && (
        <button
          type="button"
          className={mergeClasses("pimolu-dialog__close", partClasses.closeButton)}
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  ));
}

export function DialogContent({
  children,

  size = "md",

  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeLabel = "Close",
  role = "dialog",

  className,
  classNames,
  style,

  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: PimoluDialogContentProps) {
  const [partClasses, scopeParts] = usePartClasses("dialog", classNames, true);

  const {
    open,
    setOpen,
    contentId,
    titleId,
    descriptionId,
    scopeRef,
    triggerRef,
  } = useDialog("DialogContent");

  const contentRef = useRef<HTMLDivElement | null>(
    null
  );

  /* The panel stays mounted while it animates out. */
  const [rendered, setRendered] = useState(open);

  const [state, setState] = useState<
    "open" | "closing"
  >("open");

  const closeTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  function cancelCloseTimer() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  useEffect(() => {
    if (open) {
      cancelCloseTimer();
      setRendered(true);
      setState("open");
      return;
    }

    if (!rendered) return;

    if (prefersReducedMotion()) {
      setRendered(false);
      return;
    }

    setState("closing");

    closeTimer.current = setTimeout(() => {
      setRendered(false);
      closeTimer.current = null;
    }, EXIT_DURATION);

    return cancelCloseTimer;
  }, [open, rendered]);

  useBodyScrollLock(rendered);

  if (!rendered) return scopeParts(null);

  const labelledBy =
    ariaLabelledBy ?? titleId ?? undefined;

  const describedBy =
    ariaDescribedBy ?? descriptionId ?? undefined;

  function handleOverlayPointerDown(
    event: PointerEvent<HTMLDivElement>
  ) {
    if (!closeOnOverlayClick) return;

    if (event.target !== event.currentTarget) return;

    setOpen(false);
  }

  return scopeParts((
    <Portal anchorRef={scopeRef}>
      <div
        className={mergeClasses("pimolu-dialog", partClasses.root)}
        data-state={state}
      >
        <div
          className={mergeClasses("pimolu-dialog__overlay", partClasses.overlay)}
          data-state={state}
          onPointerDown={handleOverlayPointerDown}
        />

        <DialogSurface
          contentRef={contentRef}
          id={contentId}
          state={state}
          size={size}
          className={mergeClasses(className, partClasses.content)}
          classNames={classNames}
          style={style}
          closeOnEscape={closeOnEscape}
          showCloseButton={showCloseButton}
          closeLabel={closeLabel}
          role={role}
          labelledBy={labelledBy}
          describedBy={describedBy}
          ariaLabel={ariaLabel}
          triggerRef={triggerRef}
          onClose={() => setOpen(false)}
        >
          {children}
        </DialogSurface>
      </div>
    </Portal>
  ));
}

/* =========================================
   HEADER & FOOTER
========================================= */

export function DialogHeader({ classNames,
  children,
  className,
}: PimoluDialogHeaderProps) {
  const [partClasses, scopeParts] = usePartClasses("dialog", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-dialog__header",
        className
      ), partClasses.header, classNames?.root)}
    >
      {children}
    </div>
  ));
}

export function DialogFooter({ classNames,
  children,
  className,
}: PimoluDialogFooterProps) {
  const [partClasses, scopeParts] = usePartClasses("dialog", classNames, false);

  return scopeParts((
    <div
      className={mergeClasses(classes(
        "pimolu-dialog__footer",
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

export function DialogTitle({ classNames,
  children,
  id,
  className,
}: PimoluDialogTitleProps) {
  const [partClasses, scopeParts] = usePartClasses("dialog", classNames, false);

  const { setTitleId } = useDialog("DialogTitle");

  const generatedId = useId();

  const titleId =
    id ?? `pimolu-dialog-title-${generatedId}`;

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
        "pimolu-dialog__title",
        className
      ), partClasses.title, classNames?.root)}
    >
      {children}
    </h2>
  ));
}

export function DialogDescription({ classNames,
  children,
  id,
  className,
}: PimoluDialogDescriptionProps) {
  const [partClasses, scopeParts] = usePartClasses("dialog", classNames, false);

  const { setDescriptionId } =
    useDialog("DialogDescription");

  const generatedId = useId();

  const descriptionId =
    id ?? `pimolu-dialog-description-${generatedId}`;

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
        "pimolu-dialog__description",
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

export function DialogClose({
  children,
}: PimoluDialogCloseProps) {
  const { setOpen } = useDialog("DialogClose");

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
