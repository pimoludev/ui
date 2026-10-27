"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useId,
  useState,
  type KeyboardEvent,
} from "react";

import type {
  PimoluNotificationCenterProps,
  PimoluNotificationTab,
} from "./notification-center.types";

import { Popover } from "../popover/popover";

function BellIcon() {
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
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

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

/**
 * A bell trigger, an unread badge and a portalled panel. The list is fully
 * controlled: the component reports intent and never owns the notifications.
 */
export function NotificationCenter({ classNames,
  notifications,
  onRead,
  onReadAll,
  onDismiss,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  showTabs = false,
  defaultTab = "all",
  triggerLabel = "Notifications",
  title = "Notifications",
  readAllLabel = "Mark all as read",
  tabsLabel = "Notification filters",
  dismissLabel = "Dismiss notification",
  emptyLabel,
  emptyState,
  className,
}: PimoluNotificationCenterProps) {
  const [partClasses, scopeParts] = usePartClasses("notification-center", classNames, true);

  const isControlled = controlledOpen !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] =
    useState(defaultOpen);

  const isOpen = isControlled
    ? controlledOpen
    : uncontrolledOpen;

  const [tab, setTab] =
    useState<PimoluNotificationTab>(defaultTab);

  const baseId = useId();

  const panelId = `pimolu-notification-center-${baseId}-panel`;

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const visible =
    showTabs && tab === "unread"
      ? notifications.filter(
          (notification) => !notification.read
        )
      : notifications;

  const countLabel = `${unreadCount} unread`;

  function handleOpenChange(next: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="tab"]'
      )
    );

    const current = tabs.indexOf(
      document.activeElement as HTMLElement
    );

    if (current < 0) return;

    let next: number | null = null;

    if (event.key === "ArrowRight") {
      next = (current + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      next =
        (current - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    }

    if (next === null) return;

    event.preventDefault();

    const target = tabs[next];
    const nextTab =
      target.dataset.tab as
        | PimoluNotificationTab
        | undefined;

    if (nextTab) {
      setTab(nextTab);
    }

    target.focus();
  }

  const panel = (
    <div className={mergeClasses("pimolu-notification-center", partClasses.root)}>
      <div className={mergeClasses("pimolu-notification-center__header", partClasses.header)}>
        <div className={mergeClasses("pimolu-notification-center__heading", partClasses.heading)}>
          <h2 className={mergeClasses("pimolu-notification-center__title", partClasses.title)}>
            {title}
          </h2>

          <p className={mergeClasses("pimolu-notification-center__count", partClasses.count)}>
            {countLabel}
          </p>
        </div>

        {onReadAll && (
          <button
            type="button"
            className={mergeClasses("pimolu-notification-center__read-all", partClasses.readAll)}
            disabled={unreadCount === 0}
            onClick={onReadAll}
          >
            {readAllLabel}
          </button>
        )}
      </div>

      {showTabs && (
        <div
          role="tablist"
          aria-label={tabsLabel}
          className={mergeClasses("pimolu-notification-center__tabs", partClasses.tabs)}
          onKeyDown={handleTabKeyDown}
        >
          <button
            type="button"
            role="tab"
            id={`pimolu-notification-center-${baseId}-tab-all`}
            data-tab="all"
            aria-selected={tab === "all"}
            aria-controls={panelId}
            tabIndex={tab === "all" ? 0 : -1}
            className={mergeClasses("pimolu-notification-center__tab", partClasses.tab)}
            onClick={() => setTab("all")}
          >
            All
            <span
              className={mergeClasses("pimolu-notification-center__tab-count", partClasses.tabCount)}
              aria-hidden="true"
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            id={`pimolu-notification-center-${baseId}-tab-unread`}
            data-tab="unread"
            aria-selected={tab === "unread"}
            aria-controls={panelId}
            tabIndex={tab === "unread" ? 0 : -1}
            className={mergeClasses("pimolu-notification-center__tab", partClasses.tab)}
            onClick={() => setTab("unread")}
          >
            Unread
            <span
              className={mergeClasses("pimolu-notification-center__tab-count", partClasses.tabCount)}
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          </button>
        </div>
      )}

      <div
        id={panelId}
        role={showTabs ? "tabpanel" : undefined}
        aria-labelledby={
          showTabs
            ? `pimolu-notification-center-${baseId}-tab-${tab}`
            : undefined
        }
        className={mergeClasses("pimolu-notification-center__body", partClasses.body)}
      >
        {visible.length === 0 ? (
          <div className={mergeClasses("pimolu-notification-center__empty", partClasses.empty)}>
            {emptyState ?? (
              <>
                <BellIcon />

                <p className={mergeClasses("pimolu-notification-center__empty-text", partClasses.emptyText)}>
                  {emptyLabel ??
                    (notifications.length === 0
                      ? "No notifications yet."
                      : "You're all caught up.")}
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className={mergeClasses("pimolu-notification-center__list", partClasses.list)}>
            {visible.map((notification) => {
              const read = notification.read ?? false;

              return (
                <li
                  key={notification.id}
                  className={mergeClasses("pimolu-notification-center__item", partClasses.item)}
                  data-read={read ? "true" : "false"}
                >
                  {notification.icon != null && (
                    <span
                      className={mergeClasses("pimolu-notification-center__icon", partClasses.icon)}
                      aria-hidden="true"
                    >
                      {notification.icon}
                    </span>
                  )}

                  <div className={mergeClasses("pimolu-notification-center__content", partClasses.content)}>
                    {onRead ? (
                      <button
                        type="button"
                        className={mergeClasses("pimolu-notification-center__item-title pimolu-notification-center__item-title--button", partClasses.itemTitle)}
                        onClick={() =>
                          onRead(notification.id)
                        }
                      >
                        {notification.title}
                      </button>
                    ) : (
                      <p className={mergeClasses("pimolu-notification-center__item-title", partClasses.itemTitle)}>
                        {notification.title}
                      </p>
                    )}

                    {notification.description != null && (
                      <p className={mergeClasses("pimolu-notification-center__description", partClasses.description)}>
                        {notification.description}
                      </p>
                    )}

                    <div className={mergeClasses("pimolu-notification-center__meta", partClasses.meta)}>
                      {notification.time != null && (
                        <span className={mergeClasses("pimolu-notification-center__time", partClasses.time)}>
                          {notification.time}
                        </span>
                      )}

                      {notification.action && (
                        <button
                          type="button"
                          className={mergeClasses("pimolu-notification-center__action", partClasses.action)}
                          onClick={
                            notification.action.onClick
                          }
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>

                  {onDismiss && (
                    <button
                      type="button"
                      className={mergeClasses("pimolu-notification-center__dismiss", partClasses.dismiss)}
                      aria-label={dismissLabel}
                      onClick={() =>
                        onDismiss(notification.id)
                      }
                    >
                      <CloseIcon />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  return scopeParts((
    <Popover
      content={panel}
      label={title}
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement={placement}
      padding="none"
      className={mergeClasses([
        "pimolu-notification-center__panel",
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.panel)}
    >
      <button
        type="button"
        className={mergeClasses("pimolu-notification-center__trigger", partClasses.trigger)}
        aria-label={
          unreadCount > 0
            ? `${triggerLabel}, ${countLabel}`
            : triggerLabel
        }
      >
        <BellIcon />

        {unreadCount > 0 && (
          <span
            className={mergeClasses("pimolu-notification-center__badge", partClasses.badge)}
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </Popover>
  ));
}

NotificationCenter.displayName =
  "PimoluNotificationCenter";
