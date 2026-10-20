import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PimoluNotification } from "./notification-center.types";

import { NotificationCenter } from "./notification-center";

afterEach(() => {
  vi.useRealTimers();
});

function makeNotifications(): PimoluNotification[] {
  return [
    {
      id: "mention",
      title: "Ada mentioned you",
      description: "In the Q3 report",
      time: "5 min ago",
      read: false,
    },
    {
      id: "payment",
      title: "Payment received",
      description: "Invoice #1042 was paid",
      time: "1 h ago",
      read: true,
      action: {
        label: "View invoice",
        onClick: vi.fn(),
      },
    },
    {
      id: "digest",
      title: "Weekly digest",
      time: "Yesterday",
      read: false,
    },
  ];
}

function open(triggerName = "Notifications, 2 unread") {
  fireEvent.click(
    screen.getByRole("button", {
      name: triggerName,
    })
  );
}

describe("Pimolu NotificationCenter", () => {
  it("renders a bell with the unread count and no panel", () => {
    render(
      <NotificationCenter
        notifications={makeNotifications()}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });

    expect(
      within(trigger).getByText("2")
    ).toBeInTheDocument();

    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens a panel with the title, unread count and notifications", () => {
    render(
      <NotificationCenter
        notifications={makeNotifications()}
      />
    );

    open();

    const panel = screen.getByRole("dialog", {
      name: "Notifications",
    });

    expect(panel).toHaveTextContent("2 unread");
    expect(panel).toHaveTextContent("Ada mentioned you");
    expect(panel).toHaveTextContent("Payment received");
    expect(panel).toHaveTextContent("5 min ago");
  });

  it("reports a notification as read without closing the panel", () => {
    const onRead = vi.fn();

    render(
      <NotificationCenter
        notifications={makeNotifications()}
        onRead={onRead}
      />
    );

    open();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Ada mentioned you",
      })
    );

    expect(onRead).toHaveBeenCalledWith("mention");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("marks all as read and disables the action when nothing is unread", () => {
    const onReadAll = vi.fn();

    const { rerender } = render(
      <NotificationCenter
        notifications={makeNotifications()}
        onReadAll={onReadAll}
      />
    );

    open();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mark all as read",
      })
    );

    expect(onReadAll).toHaveBeenCalledTimes(1);

    rerender(
      <NotificationCenter
        notifications={makeNotifications().map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )}
        onReadAll={onReadAll}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Mark all as read",
      })
    ).toBeDisabled();
  });

  it("dismisses a notification by id", () => {
    const onDismiss = vi.fn();

    render(
      <NotificationCenter
        notifications={makeNotifications()}
        onDismiss={onDismiss}
      />
    );

    open();

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Dismiss notification",
      })[0]
    );

    expect(onDismiss).toHaveBeenCalledWith("mention");
  });

  it("shows an empty state when there is nothing to list", () => {
    render(
      <NotificationCenter notifications={[]} />
    );

    expect(
      screen.getByRole("button", {
        name: "Notifications",
      })
    ).not.toHaveTextContent("0");

    open("Notifications");

    expect(
      screen.getByRole("dialog")
    ).toHaveTextContent("No notifications yet.");
  });

  it("filters the unread tab and supports arrow navigation", () => {
    render(
      <NotificationCenter
        notifications={makeNotifications()}
        showTabs
      />
    );

    open();

    const unreadTab = screen.getByRole("tab", {
      name: /Unread/,
    });

    const allTab = screen.getByRole("tab", {
      name: /All/,
    });

    expect(allTab).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.click(unreadTab);

    expect(unreadTab).toHaveAttribute(
      "aria-selected",
      "true"
    );

    expect(
      screen.getByText("Ada mentioned you")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Payment received")
    ).toBeNull();

    unreadTab.focus();

    fireEvent.keyDown(unreadTab, {
      key: "ArrowLeft",
    });

    expect(allTab).toHaveAttribute(
      "aria-selected",
      "true"
    );

    expect(allTab).toHaveFocus();
  });

  it("runs the inline action of a notification", () => {
    const notifications = makeNotifications();
    const action = vi.fn();

    notifications[1] = {
      ...notifications[1],
      action: { label: "View invoice", onClick: action },
    };

    render(
      <NotificationCenter notifications={notifications} />
    );

    open();

    fireEvent.click(
      screen.getByRole("button", {
        name: "View invoice",
      })
    );

    expect(action).toHaveBeenCalledTimes(1);
  });

  it("follows a controlled open state", () => {
    vi.useFakeTimers();

    const onOpenChange = vi.fn();

    function Controlled() {
      const [isOpen, setIsOpen] = useState(true);

      return (
        <div>
          <NotificationCenter
            notifications={makeNotifications()}
            open={isOpen}
            onOpenChange={(next) => {
              onOpenChange(next);
              setIsOpen(next);
            }}
          />

          <button type="button">Outside</button>
        </div>
      );
    }

    render(<Controlled />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Outside" })
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
