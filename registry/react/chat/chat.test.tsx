import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Chat } from "./chat";
import type { PimoluChatMessage } from "./chat.types";

const maya = {
  id: "me",
  name: "Maya Chen",
};

const lucas = {
  id: "user-2",
  name: "Lucas Moreau",
};

const messages: PimoluChatMessage[] = [
  {
    id: "m1",
    author: lucas,
    body: "Morning! The tokens are ready.",
    time: "09:12",
    date: "2026-10-19",
    dateLabel: "Yesterday",
  },
  {
    id: "m2",
    author: maya,
    body: "Great, I will review them.",
    time: "09:14",
    date: "2026-10-19",
    status: "sent",
  },
  {
    id: "m3",
    author: lucas,
    body: "Thanks!",
    time: "09:20",
    date: "2026-10-20",
    dateLabel: "Today",
    attachments: [
      {
        id: "a1",
        name: "tokens.pdf",
        href: "/files/tokens.pdf",
        size: 24576,
      },
    ],
  },
  {
    id: "m4",
    author: maya,
    body: "Looks good.",
    time: "09:22",
    date: "2026-10-20",
    status: "sending",
  },
];

describe("Pimolu Chat", () => {
  it("renders the log, messages, dates, attachments and statuses", () => {
    render(
      <Chat
        messages={messages}
        currentUserId="me"
        onSend={() => {}}
      />
    );

    expect(
      screen.getByRole("region", {
        name: "Conversation",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("log", { name: "Messages" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Morning! The tokens are ready.")
    ).toBeInTheDocument();

    expect(screen.getByText("09:12")).toBeInTheDocument();
    expect(screen.getAllByText("Lucas Moreau")).toHaveLength(2);

    expect(
      screen.getByRole("separator", { name: "Yesterday" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("separator", { name: "Today" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Attachment: tokens.pdf",
      })
    ).toHaveAttribute("href", "/files/tokens.pdf");

    expect(screen.getByText("24 KB")).toBeInTheDocument();
    expect(screen.getByText("Sent")).toBeInTheDocument();
    expect(screen.getByText("Sending")).toBeInTheDocument();
  });

  it("sends on Enter and clears the composer", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={onSend}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Message",
    });

    await user.type(input, "Hello team{enter}");

    expect(onSend).toHaveBeenCalledWith("Hello team");
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("");
  });

  it("sends on the send button and trims the body", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={onSend}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Message",
    });
    const send = screen.getByRole("button", {
      name: "Send message",
    });

    expect(send).toBeDisabled();

    await user.type(input, "  Hello team  ");

    expect(send).toBeEnabled();

    await user.click(send);

    expect(onSend).toHaveBeenCalledWith("Hello team");
    expect(input).toHaveValue("");
  });

  it("inserts a newline with Shift + Enter without sending", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={onSend}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Message",
    });

    await user.type(
      input,
      "Line one{Shift>}{Enter}{/Shift}Line two"
    );

    expect(onSend).not.toHaveBeenCalled();
    expect(input).toHaveValue("Line one\nLine two");
  });

  it("disables the composer when requested", () => {
    const onSend = vi.fn();

    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={onSend}
        disabled
      />
    );

    expect(
      screen.getByRole("textbox", { name: "Message" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Send message",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("region", {
        name: "Conversation",
      })
    ).toHaveAttribute("data-disabled", "true");

    expect(onSend).not.toHaveBeenCalled();
  });

  it("renders a default empty state without a log", () => {
    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={() => {}}
      />
    );

    expect(
      screen.getByText("No messages yet")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Send the first message to start the conversation."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("log")
    ).not.toBeInTheDocument();
  });

  it("scrolls the log to the newest message", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      Element.prototype,
      "scrollHeight"
    );

    Object.defineProperty(Element.prototype, "scrollHeight", {
      configurable: true,
      get: () => 640,
    });

    try {
      const { rerender } = render(
        <Chat
          messages={[messages[0]]}
          currentUserId="me"
          onSend={() => {}}
        />
      );

      const log = screen.getByRole("log");

      expect(log.scrollTop).toBe(640);

      rerender(
        <Chat
          messages={messages}
          currentUserId="me"
          onSend={() => {}}
        />
      );

      expect(log.scrollTop).toBe(640);
    } finally {
      if (descriptor) {
        Object.defineProperty(
          Element.prototype,
          "scrollHeight",
          descriptor
        );
      }
    }
  });

  it("shows a typing indicator with grammatical labels", () => {
    const { rerender } = render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={() => {}}
        typingUsers={["Lucas Moreau"]}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Lucas Moreau is typing…"
    );

    rerender(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={() => {}}
        typingUsers={["Lucas Moreau", "Sofia Rossi"]}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Lucas Moreau and Sofia Rossi are typing…"
    );
  });

  it("marks outgoing messages and exposes their status", () => {
    render(
      <Chat
        messages={messages}
        currentUserId="me"
        onSend={() => {}}
      />
    );

    const ownMessage = screen
      .getByText("Great, I will review them.")
      .closest("li");
    const otherMessage = screen
      .getByText("Morning! The tokens are ready.")
      .closest("li");

    expect(ownMessage).toHaveAttribute("data-own", "true");
    expect(ownMessage).toHaveAttribute(
      "data-status",
      "sent"
    );

    expect(
      within(ownMessage as HTMLElement).getByText("You")
    ).toBeInTheDocument();

    expect(
      within(ownMessage as HTMLElement).getByText("Sent")
    ).toBeInTheDocument();

    expect(otherMessage).toHaveAttribute(
      "data-own",
      "false"
    );

    expect(
      within(otherMessage as HTMLElement).getByText(
        "Lucas Moreau"
      )
    ).toBeInTheDocument();
  });

  it("renders a header slot and the optional attachment action", async () => {
    const user = userEvent.setup();
    const onAttach = vi.fn();

    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={() => {}}
        onAttach={onAttach}
        header={<span>Support · 3 online</span>}
      />
    );

    expect(
      screen.getByText("Support · 3 online")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Attach file",
      })
    );

    expect(onAttach).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state and blocks the composer", () => {
    render(
      <Chat
        messages={[]}
        currentUserId="me"
        onSend={() => {}}
        loading
      />
    );

    expect(
      screen.getByRole("region", {
        name: "Conversation",
      })
    ).toHaveAttribute("aria-busy", "true");

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Loading messages…");

    expect(
      screen.getByRole("textbox", { name: "Message" })
    ).toBeDisabled();

    expect(
      screen.queryByText("No messages yet")
    ).not.toBeInTheDocument();
  });
});
