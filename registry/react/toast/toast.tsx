"use client";

import {
  useSyncExternalStore,
} from "react";

import type {
  PimoluToastItem,
  PimoluToastOptions,
  PimoluToasterProps,
} from "./toast.types";

import { toastVariants } from "./toast.variants";
import { useRetainedItems } from "../internal/use-retained-items";
import { AnimationScope } from "../animation/animation-engine";

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

export function Toaster({
  position = "top-right",
  label = "Notifications",
}: PimoluToasterProps) {
  const items = useRetainedItems(useToasts());

  if (items.length === 0) return null;

  return (
    <AnimationScope><div
      className="pimolu-toaster"
      data-position={position}
      role="region"
      aria-label={label}
      aria-live="polite"
    >
      {items.map(({ item, closing }) => (
        <div
          key={item.id}
          className={toastVariants({
            variant: item.variant,
          })}
          data-state={closing ? "closing" : "open"}
          aria-hidden={closing || undefined}
        >
          <div className="pimolu-toast__body">
            <p className="pimolu-toast__title">
              {item.title}
            </p>

            {item.description && (
              <p className="pimolu-toast__description">
                {item.description}
              </p>
            )}
          </div>

          <div className="pimolu-toast__actions">
            {item.action && (
              <button
                type="button"
                className="pimolu-toast__action"
                disabled={closing}
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
              className="pimolu-toast__close"
              aria-label="Dismiss notification"
              disabled={closing}
              onClick={() => dismissToast(item.id)}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      ))}
    </div></AnimationScope>
  );
}
