"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
export function Popconfirm({ classNames,
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
  const [partClasses, scopeParts] = usePartClasses("popconfirm", classNames, true);

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
      className={mergeClasses("pimolu-popconfirm", partClasses.root)}
      data-variant={variant}
    >
      <div className={mergeClasses("pimolu-popconfirm__header", partClasses.header)}>
        <span
          className={mergeClasses("pimolu-popconfirm__icon", partClasses.icon)}
          aria-hidden="true"
        >
          {icon ?? <WarningIcon />}
        </span>

        <div className={mergeClasses("pimolu-popconfirm__body", partClasses.body)}>
          <h2
            id={titleId}
            className={mergeClasses("pimolu-popconfirm__title", partClasses.title)}
          >
            {title}
          </h2>

          {description != null && (
            <p className={mergeClasses("pimolu-popconfirm__description", partClasses.description)}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className={mergeClasses("pimolu-popconfirm__actions", partClasses.actions)}>
        <button
          type="button"
          className={mergeClasses("pimolu-popconfirm__button pimolu-popconfirm__button--cancel", partClasses.button)}
          onClick={() => {
            onCancel?.();
            closeFromAction();
          }}
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          className={mergeClasses("pimolu-popconfirm__button pimolu-popconfirm__button--confirm", partClasses.button)}
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

  return scopeParts((
    <Popover
      content={content}
      labelledBy={titleId}
      open={isOpen}
      onOpenChange={requestOpen}
      placement={placement}
      offset={offset}
      disabled={disabled}
      className={mergeClasses([
        "pimolu-popconfirm__panel",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.panel)}
    >
      {trigger}
    </Popover>
  ));
}

Popconfirm.displayName = "PimoluPopconfirm";
