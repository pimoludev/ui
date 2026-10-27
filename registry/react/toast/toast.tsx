"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useSyncExternalStore,
} from "react";

import type {
  PimoluToastItem,
  PimoluToastOptions,
  PimoluToasterProps,
} from "./toast.types";

import { toastVariants } from "./toast.variants";

/* =========================================
   STORE
========================================= */

let toasts: PimoluToastItem[] = [];
let counter = 0;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

function getServerSnapshot() {
  return toasts;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

export function dismissAllToasts() {
  toasts = [];
  emit();
}

export function toast(options: PimoluToastOptions): string {
  const id = options.id ?? `pimolu-toast-${++counter}`;

  const item: PimoluToastItem = {
    duration: 5000,
    variant: "default",
    ...options,
    id,
  };

  toasts = [...toasts, item];
  emit();

  if (item.duration && item.duration > 0) {
    setTimeout(() => dismissToast(id), item.duration);
  }

  return id;
}

export function useToast() {
  return { toast, dismiss: dismissToast };
}

export function useToasts() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}

/* =========================================
   TOASTER
========================================= */

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
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

function ToastItem({ item }: { item: PimoluToastItem }) {
  const [partClasses, scopeParts] = usePartClasses("toast", item.classNames, false);
  return scopeParts(
<div
          key={item.id}
          className={mergeClasses(toastVariants({
            variant: item.variant,
          }), partClasses.toast, item.classNames?.root)}
          data-state="open"
        >
          <div className={mergeClasses("pimolu-toast__body", partClasses.body)}>
            <p className={mergeClasses("pimolu-toast__title", partClasses.title)}>
              {item.title}
            </p>

            {item.description && (
              <p className={mergeClasses("pimolu-toast__description", partClasses.description)}>
                {item.description}
              </p>
            )}
          </div>

          <div className={mergeClasses("pimolu-toast__actions", partClasses.actions)}>
            {item.action && (
              <button
                type="button"
                className={mergeClasses("pimolu-toast__action", partClasses.action)}
                onClick={() => {
                  item.action?.onClick();
                  dismissToast(item.id);
                }}
              >
                {item.action.label}
              </button>
            )}

            <button
              type="button"
              className={mergeClasses("pimolu-toast__close", partClasses.close)}
              aria-label="Dismiss notification"
              onClick={() => dismissToast(item.id)}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
  );
}

export function Toaster({ classNames,
  position = "top-right",
  label = "Notifications",
}: PimoluToasterProps) {
  const [partClasses, scopeParts] = usePartClasses("toast", classNames, true);

  const items = useToasts();

  if (items.length === 0) return scopeParts(null);

  return scopeParts((
    <div
      className={mergeClasses("pimolu-toaster", partClasses.root)}
      data-position={position}
      role="region"
      aria-label={label}
      aria-live="polite"
    >
      {items.map((item) => <ToastItem key={item.id} item={item} />)}
    </div>
  ));
}
