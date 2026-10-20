import type { ReactNode } from "react";

import type { PimoluPopoverPlacement } from "../popover/popover.types";

export interface PimoluNotificationAction {
  label: ReactNode;
  onClick: () => void;
}

export interface PimoluNotification {
  id: string;

  title: ReactNode;

  description?: ReactNode;

  /** Human-readable time, rendered as-is (for example "12 min ago"). */
  time?: ReactNode;

  /** Unread when omitted. */
  read?: boolean;

  /** Optional leading glyph. It is decorative. */
  icon?: ReactNode;

  /** Optional inline action, such as "View invoice". */
  action?: PimoluNotificationAction;
}

export type PimoluNotificationTab = "all" | "unread";

export interface PimoluNotificationCenterProps {
  notifications: PimoluNotification[];

  /** Marks one notification as read. */
  onRead?: (id: string) => void;

  /** Marks every notification as read. */
  onReadAll?: () => void;

  /** Removes one notification. Hides the dismiss button when omitted. */
  onDismiss?: (id: string) => void;

  /** Controlled open state. Omit to let the component own it. */
  open?: boolean;

  /** Initial open state when uncontrolled. Defaults to false. */
  defaultOpen?: boolean;

  /** Called whenever the panel asks to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Preferred side of the trigger. Defaults to "bottom". */
  placement?: PimoluPopoverPlacement;

  /** Show the All / Unread filter tabs. Defaults to false. */
  showTabs?: boolean;

  /** Initial tab when tabs are enabled. Defaults to "all". */
  defaultTab?: PimoluNotificationTab;

  /** Accessible name of the bell. Defaults to "Notifications". */
  triggerLabel?: string;

  /** Heading of the panel. Defaults to "Notifications". */
  title?: string;

  /** Label of the mark-all action. Defaults to "Mark all as read". */
  readAllLabel?: string;

  /** Accessible name of the tab list. Defaults to "Notification filters". */
  tabsLabel?: string;

  /** Accessible name of a dismiss button. Defaults to "Dismiss notification". */
  dismissLabel?: string;

  /** Replaces the default empty message. */
  emptyLabel?: ReactNode;

  /** Replaces the whole empty state. */
  emptyState?: ReactNode;

  /** Class applied to the popover panel. */
  className?: string;
}
