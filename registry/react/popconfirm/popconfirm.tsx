"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type Ref,
} from "react";

import type { PimoluPopconfirmProps } from "./popconfirm.types";

import { Popover } from "../popover/popover";

function assignNode<T>(
  ref: Ref<T> | undefined,
  node: T | null
) {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref && typeof ref === "object") {
    (ref as { current: T | null }).current = node;
  }
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

/**
 * Anchored confirmation built on Popover. The panel is a dialog named by its
 * title; the cancel action is first in DOM order, so it receives focus first
 * and a destructive confirmation never starts on the irreversible button.
 */
export function Popconfirm({
  children,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  offset = 8,
  disabled = false,
  icon,
  className,
}: PimoluPopconfirmProps) {
  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const isOpen = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  const triggerRef = useRef<HTMLElement | null>(null);

  /** True when the panel was closed by one of its own actions. */
  const resolved = useRef(false);

  const titleId = `pimolu-popconfirm-title-${useId()}`;

  function requestOpen(next: boolean) {
    if (next) {
      resolved.current = false;
    }

    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);

    if (!next && !resolved.current) {
      onCancel?.();
    }

    resolved.current = false;
  }

  function closeFromAction() {
    resolved.current = true;
    requestOpen(false);
    triggerRef.current?.focus();
  }

  /*
   * Popover owns the cloning. Attaching our own ref first lets us keep a
   * handle on the trigger for the focus return without changing the API.
   */
  const trigger = isValidElement(children)
    ? cloneElement(
        children as ReactElement<Record<string, unknown>>,
        {
          ref: (node: HTMLElement | null) => {
            triggerRef.current = node;

            const childRef = (
              children as ReactElement<{
                ref?: Ref<HTMLElement>;
              }>
            ).props.ref;

            assignNode(childRef, node);
          },
        }
      )
    : children;

  const content = (
    <div
      className="pimolu-popconfirm"
      data-variant={variant}
    >
      <div className="pimolu-popconfirm__header">
        <span
          className="pimolu-popconfirm__icon"
          aria-hidden="true"
        >
          {icon ?? <WarningIcon />}
        </span>

        <div className="pimolu-popconfirm__body">
          <h2
            id={titleId}
            className="pimolu-popconfirm__title"
          >
            {title}
          </h2>

          {description != null && (
            <p className="pimolu-popconfirm__description">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="pimolu-popconfirm__actions">
        <button
          type="button"
          className="pimolu-popconfirm__button pimolu-popconfirm__button--cancel"
          onClick={() => {
            onCancel?.();
            closeFromAction();
          }}
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          className="pimolu-popconfirm__button pimolu-popconfirm__button--confirm"
          onClick={() => {
            onConfirm?.();
            closeFromAction();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      labelledBy={titleId}
      open={isOpen}
      onOpenChange={requestOpen}
      placement={placement}
      offset={offset}
      disabled={disabled}
      className={[
        "pimolu-popconfirm__panel",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {trigger}
    </Popover>
  );
}

Popconfirm.displayName = "PimoluPopconfirm";
