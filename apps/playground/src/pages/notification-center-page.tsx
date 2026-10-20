import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  NotificationCenter,
  type PimoluNotification,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function MentionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v3" />
      <path d="m5.6 5.6 2.1 2.1" />
      <path d="M3 12h3" />
      <path d="M12 21a6 6 0 0 0 6-6c0-3-6-9-6-9S6 12 6 15a6 6 0 0 0 6 6Z" />
    </svg>
  );
}

const initialNotifications: PimoluNotification[] = [
  {
    id: "mention",
    title: "Ada mentioned you in Q3 report",
    description:
      "“Can you review the revenue section before Friday?”",
    time: "8 min ago",
    read: false,
    icon: <MentionIcon />,
  },
  {
    id: "billing",
    title: "Payment received",
    description:
      "Invoice #1042 for $4,800 was paid by Acme GmbH.",
    time: "42 min ago",
    read: false,
    icon: <BillingIcon />,
  },
  {
    id: "system",
    title: "Scheduled maintenance",
    description:
      "The reporting API will be read-only on Sunday from 02:00 to 04:00 UTC.",
    time: "Yesterday",
    read: true,
    icon: <SystemIcon />,
  },
  {
    id: "digest",
    title: "Your weekly digest is ready",
    description:
      "12 projects changed, 4 mentions and 2 reviews are waiting.",
    time: "Monday",
    read: true,
    icon: <SystemIcon />,
  },
];

export function NotificationCenterPage() {
  const [outcome, setOutcome] = useState(
    "No notification action yet"
  );

  const [panelOpen, setPanelOpen] = useState(false);

  const [notifications, setNotifications] = useState<
    PimoluNotification[]
  >(initialNotifications);

  function markRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );

    setOutcome(`Marked ${id} as read`);
  }

  function markAllRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    setOutcome("Marked every notification as read");
  }

  function dismiss(id: string) {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );

    setOutcome(`Dismissed ${id}`);
  }

  const notificationsWithActions: PimoluNotification[] =
    notifications.map((notification) => {
      if (notification.id === "mention") {
        return {
          ...notification,
          action: {
            label: "Open report",
            onClick: () => {
              markRead("mention");
              setOutcome("Opened the Q3 report");
            },
          },
        };
      }

      if (notification.id === "billing") {
        return {
          ...notification,
          action: {
            label: "View invoice",
            onClick: () => {
              markRead("billing");
              setOutcome("Opened invoice #1042");
            },
          },
        };
      }

      return notification;
    });

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <>
      <PageHeader
        title="NotificationCenter"
        hint="A bell trigger with an unread badge and a portalled notification panel. The list is controlled by the page: onRead, onReadAll and onDismiss report intent. Tabs, inline actions and the empty state are optional. Styles come from @pimolu/web-styles/notification-center.css."
      />

      <Section
        title="Workspace inbox"
        hint="The panel opens under the bell. Opening a notification reports it as read without closing the panel; Mark all as read and the per-item dismiss controls update the page state."
      >
        <Card>
          <CardHeader>
            <div
              className="pg-row pg-row--between"
              style={{ flexWrap: "wrap" }}
            >
              <div>
                <CardTitle>Acme workspace</CardTitle>
                <CardDescription>
                  Notifications stay local to this demo; the
                  component has no global store.
                </CardDescription>
              </div>

              <div className="pg-row">
                <Badge variant="primary">
                  {unreadCount} unread
                </Badge>

                <NotificationCenter
                  notifications={notificationsWithActions}
                  onRead={markRead}
                  onReadAll={markAllRead}
                  onDismiss={dismiss}
                  showTabs
                  open={panelOpen}
                  onOpenChange={setPanelOpen}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="pg-stack">
              <div className="pg-row pg-row--between">
                <span>Last action</span>
                <span className="pg-meta">{outcome}</span>
              </div>

              <div className="pg-row">
                <Button
                  size="sm"
                  appearance="outline"
                  onClick={() => setPanelOpen(true)}
                >
                  Open from the page
                </Button>

                <Button
                  size="sm"
                  appearance="ghost"
                  onClick={() => {
                    setNotifications(initialNotifications);
                    setOutcome("Demo notifications reset");
                  }}
                >
                  Reset notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Without tabs"
        hint="Tabs are opt-in. The same panel works with a single list, a custom empty label and a placed action button."
      >
        <div className="pg-row">
          <NotificationCenter
            notifications={notificationsWithActions}
            onRead={markRead}
            onReadAll={markAllRead}
            onDismiss={dismiss}
            showTabs={false}
            triggerLabel="Inbox"
            title="Inbox"
            emptyLabel="You're all caught up. New mentions and payments will appear here."
            readAllLabel="Clear unread"
            dismissLabel="Remove notification"
          />

          <NotificationCenter
            notifications={[]}
            triggerLabel="Archive"
            title="Archive"
            emptyState={
              <div className="pg-stack">
                <Badge variant="neutral">Empty</Badge>
                <span>Nothing archived this month.</span>
              </div>
            }
          />
        </div>
      </Section>

      <Section
        title="Keyboard and semantics"
        hint="The bell is a dialog trigger; the panel is named Notifications. Escape and outside clicks close it, the tab list supports ArrowLeft and ArrowRight, and every notification action is a native button."
      >
        <div className="pg-stack">
          <p className="pg-copy">
            <strong>Tab</strong> moves from the bell into the
            panel. The filter tabs use arrow keys. The title of an
            unread item is a button that reports it as read; the
            dismiss button and the inline action stay separate
            controls.
          </p>

          <p className="pg-meta">
            Last outcome: {outcome}
          </p>
        </div>
      </Section>
    </>
  );
}
