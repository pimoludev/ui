"use client";

import { usePresence } from "../internal/use-presence";
import { usePimoluAnimationEngine } from "../animation/animation-engine";

import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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

import { forwardRef } from "react";
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

function focusDialogSurface(content: HTMLDivElement) {
  const preferred = getFocusable(content).find((element) =>
    !element.closest(".pimolu-dialog__footer") &&
    !element.classList.contains("pimolu-dialog__close")
  );
  (preferred ?? content).focus();
}

function DialogSurface({
  contentRef,
  id,
  state,
  size,
  className,
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
  const engine = usePimoluAnimationEngine();
  useLayoutEffect(() => {
    const content = contentRef.current;

    if (!content) return;
    // A retained Motion panel may still be inert from its cancelled exit.
    if (engine) content.inert = false;

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
    focusDialogSurface(content);

    return () => {
      const target = triggerRef.current ?? previous;

      if (target?.isConnected) {
        target.focus();
      }
    };
  }, [contentRef, triggerRef, engine]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!engine || state !== "open" || !content) return;
    content.inert = false;
    if (!content.contains(document.activeElement)) focusDialogSurface(content);
  }, [engine, state, contentRef]);

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

  return (
    <div
      ref={contentRef}
      id={id}
      role={role}
      aria-modal="true"
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      tabIndex={-1}
      className={dialogVariants({ size }, className)}
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
          className="pimolu-dialog__close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
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

  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: PimoluDialogContentProps) {
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

  const { rendered, state } = usePresence(open, EXIT_DURATION);

  useBodyScrollLock(rendered);

  if (!rendered) return null;

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

  return (
    <Portal anchorRef={scopeRef}>
      <div
        className="pimolu-dialog"
        data-state={state}
      >
        <div
          className="pimolu-dialog__overlay"
          data-state={state}
          onPointerDown={handleOverlayPointerDown}
        />

        <DialogSurface
          contentRef={contentRef}
          id={contentId}
          state={state}
          size={size}
          className={className}
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
  );
}

/* =========================================
   HEADER & FOOTER
========================================= */

export const DialogHeader = forwardRef<HTMLDivElement, PimoluDialogHeaderProps>(function DialogHeader({
  style: motionStyle,
  children,
  className,
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      className={classes(
        "pimolu-dialog__header",
        className
      )}
    >
      {children}
    </div>
  );
});

DialogHeader.displayName = "PimoluDialogHeader";

export const DialogFooter = forwardRef<HTMLDivElement, PimoluDialogFooterProps>(function DialogFooter({
  style: motionStyle,
  children,
  className,
}, ref) {
  return (
    <div ref={ref} style={motionStyle}
      className={classes(
        "pimolu-dialog__footer",
        className
      )}
    >
      {children}
    </div>
  );
});

DialogFooter.displayName = "PimoluDialogFooter";

/* =========================================
   TITLE & DESCRIPTION
========================================= */

export const DialogTitle = forwardRef<HTMLHeadingElement, PimoluDialogTitleProps>(function DialogTitle({
  style: motionStyle,
  children,
  id,
  className,
}, ref) {
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

  return (
    <h2 ref={ref} style={motionStyle}
      id={titleId}
      className={classes(
        "pimolu-dialog__title",
        className
      )}
    >
      {children}
    </h2>
  );
});

DialogTitle.displayName = "PimoluDialogTitle";

export const DialogDescription = forwardRef<HTMLParagraphElement, PimoluDialogDescriptionProps>(function DialogDescription({
  style: motionStyle,
  children,
  id,
  className,
}, ref) {
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

  return (
    <p ref={ref} style={motionStyle}
      id={descriptionId}
      className={classes(
        "pimolu-dialog__description",
        className
      )}
    >
      {children}
    </p>
  );
});

DialogDescription.displayName = "PimoluDialogDescription";

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
