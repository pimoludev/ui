"use client";

import { useSyncExternalStore } from "react";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
import { Spinner } from "../spinner/spinner";
import type {
  PimoluToastItem, PimoluToastOptions, PimoluToastPromiseOptions,
  PimoluToastUpdate, PimoluToasterProps,
} from "./toast.types";
import { toastVariants } from "./toast.variants";

let toasts: PimoluToastItem[] = [];
const serverSnapshot: PimoluToastItem[] = [];
let counter = 0;
const listeners = new Set<() => void>();
type Timer = {
  handle?: ReturnType<typeof setTimeout>;
  remaining: number;
  started: number;
  pauses: Set<string>;
};
const timers = new Map<string, Timer>();

function emit() { listeners.forEach((listener) => listener()); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function getSnapshot() { return toasts; }
function getServerSnapshot() { return serverSnapshot; }

function startTimer(id: string, timer: Timer) {
  if (timer.pauses.size || !Number.isFinite(timer.remaining) || timer.remaining <= 0) return;
  timer.started = Date.now();
  timer.handle = setTimeout(() => dismissToast(id), timer.remaining);
}

function resetTimer(item: PimoluToastItem) {
  const previous = timers.get(item.id);
  clearTimeout(previous?.handle);
  const timer: Timer = {
    remaining: item.variant === "loading" ? 0 : (item.duration ?? 5000),
    started: Date.now(),
    pauses: previous?.pauses ?? new Set(),
  };
  if (item.pauseOnHover === false) timer.pauses.delete("pointer");
  if (item.pauseOnFocus === false) timer.pauses.delete("focus");
  timers.set(item.id, timer);
  startTimer(item.id, timer);
}

function pauseTimer(id: string, reason: string) {
  const timer = timers.get(id);
  if (!timer || timer.pauses.has(reason)) return;
  if (!timer.pauses.size && timer.handle !== undefined) {
    clearTimeout(timer.handle);
    timer.handle = undefined;
    timer.remaining = Math.max(1, timer.remaining - (Date.now() - timer.started));
  }
  timer.pauses.add(reason);
}

function resumeTimer(id: string, reason: string) {
  const timer = timers.get(id);
  if (!timer?.pauses.delete(reason)) return;
  startTimer(id, timer);
}

export function dismissToast(id: string) {
  const item = toasts.find((entry) => entry.id === id);
  if (!item) return;
  clearTimeout(timers.get(id)?.handle);
  timers.delete(id);
  toasts = toasts.filter((entry) => entry.id !== id);
  emit();
  item.onDismiss?.(id);
}

export function dismissAllToasts() {
  const removed = toasts;
  timers.forEach((timer) => clearTimeout(timer.handle));
  timers.clear();
  toasts = [];
  emit();
  removed.forEach((item) => item.onDismiss?.(item.id));
}

/** Updates an existing notification in place and restarts its dismissal delay. */
export function updateToast(id: string, options: PimoluToastUpdate): string {
  const current = toasts.find((item) => item.id === id);
  if (!current) return id;
  const item = { ...current, ...options, id };
  toasts = toasts.map((entry) => entry.id === id ? item : entry);
  resetTimer(item);
  emit();
  return id;
}

function createToast(options: PimoluToastOptions): string {
  const id = options.id ?? `pimolu-toast-${++counter}`;
  // A stable id represents one notification, including repeated submissions.
  if (toasts.some((item) => item.id === id)) return updateToast(id, options);
  const item: PimoluToastItem = { duration: 5000, variant: "default", ...options, id };
  toasts = [...toasts, item];
  resetTimer(item);
  emit();
  return id;
}

type ShortcutOptions = Omit<PimoluToastOptions, "title" | "variant">;
function showPromise<T>(
  promise: Promise<T> | (() => Promise<T>),
  options: PimoluToastPromiseOptions<T>,
): string {
  const { loading, success, error, ...shared } = options;
  const id = createToast({ ...shared, title: loading, variant: "loading" });
  const pending = toasts.find((item) => item.id === id);
  // Dismissed or manually updated notifications must never be resurrected.
  const isPending = () => toasts.find((item) => item.id === id) === pending;
  const result = typeof promise === "function" ? Promise.resolve().then(promise) : promise;
  void result.then(
    (value) => {
      if (isPending()) updateToast(id, {
        title: typeof success === "function" ? success(value) : success,
        variant: "success",
      });
    },
    (reason: unknown) => {
      if (isPending()) updateToast(id, {
        title: typeof error === "function" ? error(reason) : error,
        variant: "danger",
      });
    },
  ).catch(() => {
    // A throwing message formatter must not leave a permanent loading toast.
    if (isPending()) updateToast(id, { title: "Unable to complete the operation.", variant: "danger" });
  });
  return id;
}

export const toast = Object.assign(createToast, {
  success: (title: PimoluToastOptions["title"], options?: ShortcutOptions) =>
    createToast({ ...options, title, variant: "success" }),
  error: (title: PimoluToastOptions["title"], options?: ShortcutOptions) =>
    createToast({ ...options, title, variant: "danger" }),
  warning: (title: PimoluToastOptions["title"], options?: ShortcutOptions) =>
    createToast({ ...options, title, variant: "warning" }),
  info: (title: PimoluToastOptions["title"], options?: ShortcutOptions) =>
    createToast({ ...options, title, variant: "info" }),
  loading: (title: PimoluToastOptions["title"], options?: ShortcutOptions) =>
    createToast({ ...options, title, variant: "loading" }),
  update: updateToast,
  dismiss: (id?: string) => id === undefined ? dismissAllToasts() : dismissToast(id),
  promise: showPromise,
});

export function useToast() {
  return { toast, dismiss: dismissToast, update: updateToast };
}
export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function ToastIcon({ variant }: { variant: PimoluToastItem["variant"] }) {
  if (variant === "loading") return <Spinner size="sm" decorative />;
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      {variant === "success" ? <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>
        : variant === "warning" ? <><path d="m12 3 10 18H2Z" /><path d="M12 9v4m0 4h.01" /></>
        : variant === "danger" ? <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>
        : <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>}
    </svg>
  );
}

function ToastItem({ item }: { item: PimoluToastItem }) {
  const [partClasses, scopeParts] = usePartClasses("toast", item.classNames, false);
  const icon = item.icon === undefined ? <ToastIcon variant={item.variant} /> : item.icon;
  return scopeParts(
    <div className={mergeClasses(toastVariants({ variant: item.variant }), partClasses.toast, item.classNames?.root)}
      data-state="open" data-variant={item.variant} aria-atomic="true"
      aria-busy={item.variant === "loading" || undefined}
      onPointerEnter={() => { if (item.pauseOnHover !== false) pauseTimer(item.id, "pointer"); }}
      onPointerLeave={() => resumeTimer(item.id, "pointer")}
      onPointerCancel={() => resumeTimer(item.id, "pointer")}
      onFocusCapture={() => { if (item.pauseOnFocus !== false) pauseTimer(item.id, "focus"); }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) resumeTimer(item.id, "focus");
      }}>
      {icon != null && icon !== false && (
        <span className={mergeClasses("pimolu-toast__icon", partClasses.icon)} aria-hidden="true">{icon}</span>
      )}
      <div className={mergeClasses("pimolu-toast__body", partClasses.body)}>
        <p className={mergeClasses("pimolu-toast__title", partClasses.title)}>{item.title}</p>
        {item.description != null && (
          <p className={mergeClasses("pimolu-toast__description", partClasses.description)}>{item.description}</p>
        )}
      </div>
      {(item.action || item.dismissible !== false) && (
        <div className={mergeClasses("pimolu-toast__actions", partClasses.actions)}>
          {item.action && (
            <button type="button" className={mergeClasses("pimolu-toast__action", partClasses.action)}
              disabled={item.variant === "loading"}
              onClick={() => { item.action?.onClick(); dismissToast(item.id); }}>
              {item.action.label}
            </button>
          )}
          {item.dismissible !== false && (
            <button type="button" className={mergeClasses("pimolu-toast__close", partClasses.close)}
              aria-label={item.dismissLabel ?? "Dismiss notification"} onClick={() => dismissToast(item.id)}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>,
  );
}

export function Toaster({ classNames, position = "top-right", label = "Notifications" }: PimoluToasterProps) {
  const [partClasses, scopeParts] = usePartClasses("toast", classNames, true);
  const items = useToasts();
  // Mount the empty region before inserting messages so assistive technology can observe additions.
  return scopeParts(
    <div className={mergeClasses("pimolu-toaster", partClasses.root)} data-position={position}
      role="region" aria-label={label} aria-live="polite" aria-relevant="additions text">
      {items.map((item) => <ToastItem key={item.id} item={item} />)}
    </div>,
  );
}
