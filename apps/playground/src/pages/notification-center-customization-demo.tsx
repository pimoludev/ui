"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  type PimoluNotification,
  NotificationCenter,
  CardContent,
  Button
} from "@pimolu/react";
import { useState } from "react";

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

export function CustomizationExample() {
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
      if(notification.id === "mention") {
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

      if(notification.id === "billing") {
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
      {
        (<>
          <Card>
            <CardHeader>
              <div
                className="pg-row pg-row--between"
                style={{ flexWrap: "wrap" }}
              >
                <div>
                  <CardTitle>Acme workspace</CardTitle>
                  <CardDescription>
                    Notifications stay local to this demo; the component has no
                    global store.
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
                    classNames={{
                      root: "custom-notification-center-root",
                      title: "custom-notification-center-title"
                    }}
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
        </>)
      }
      <style>
        {
          `
.custom-notification-center-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-notification-center-title {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
