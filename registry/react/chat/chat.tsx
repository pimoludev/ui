"use client";
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Avatar } from "../avatar/avatar";

import type {
  PimoluChatAttachment,
  PimoluChatLabels,
  PimoluChatMessage,
  PimoluChatProps,
} from "./chat.types";

/* =========================================
   LABELS
========================================= */

const defaultLabels: PimoluChatLabels = {
  conversation: "Conversation",
  messages: "Messages",
  message: "Message",
  placeholder: "Write a message…",
  send: "Send message",
  attach: "Attach file",
  empty: "No messages yet",
  emptyDescription:
    "Send the first message to start the conversation.",
  loading: "Loading messages…",
  typing: (names) =>
    `${names} ${
      names.includes(" and ") ? "are" : "is"
    } typing…`,
  you: "You",
  sending: "Sending",
  sent: "Sent",
  failed: "Not sent",
  attachment: (name) => `Attachment: ${name}`,
};

/* =========================================
   HELPERS
========================================= */

function joinNames(names: readonly string[]) {
  if (names.length === 0) {
    return "";
  }

  if (names.length === 1) {
    return names[0];
  }

  return `${names.slice(0, -1).join(", ")} and ${
    names[names.length - 1]
  }`;
}

function formatDate(value: string) {
  const normalized = /^\d{4}-\d{2}-\d{2}$/u.test(value)
    ? `${value}T00:00:00`
    : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return value;
  }
}

function formatSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = units[0];

  for (let index = 1; index < units.length; index += 1) {
    if (value < 1024) {
      break;
    }

    value /= 1024;
    unit = units[index];
  }

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${unit}`;
}

/* =========================================
   ICONS
========================================= */

function SendIcon() {
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
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4Z" />
    </svg>
  );
}

function PaperclipIcon() {
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
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 0 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 8v5M12 17h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

/* =========================================
   MESSAGE
========================================= */

interface ChatMessageViewProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"chat">;

  message: PimoluChatMessage;
  own: boolean;
  labels: PimoluChatLabels;
}

function ChatMessageView({ classNames,
  message,
  own,
  labels,
}: ChatMessageViewProps) {
  const [partClasses, scopeParts] = usePartClasses("chat", classNames, false);

  const status = message.status;

  return scopeParts((
    <li
      className={mergeClasses([
        "pimolu-chat__message",
        own && "pimolu-chat__message--own",
      ]
        .filter(Boolean)
        .join(" "), partClasses.message)}
      data-own={own ? "true" : "false"}
      data-status={status}
    >
      {!own && (
        <Avatar
          className={mergeClasses("pimolu-chat__avatar", partClasses.avatar)}
          name={message.author.name}
          src={message.author.avatar}
          size="sm"
          aria-hidden="true"
        />
      )}

      <div className={mergeClasses("pimolu-chat__content", partClasses.content)}>
        <div className={mergeClasses("pimolu-chat__meta", partClasses.meta)}>
          <span className={mergeClasses("pimolu-chat__author", partClasses.author)}>
            {own ? labels.you : message.author.name}
          </span>

          <time className={mergeClasses("pimolu-chat__time", partClasses.time)}>
            {message.time}
          </time>

          {status && (
            <span
              className={mergeClasses(`pimolu-chat__status pimolu-chat__status--${status}`, partClasses.status)}
              data-status={status}
            >
              {status === "sending" && (
                <span
                  className={mergeClasses("pimolu-chat__status-spinner", partClasses.statusSpinner)}
                  aria-hidden="true"
                />
              )}

              {status === "sent" && <CheckIcon />}
              {status === "error" && <AlertIcon />}

              <span
                className={mergeClasses(status === "error"
                    ? "pimolu-chat__status-text"
                    : "pimolu-chat__sr", partClasses.statusText)}
              >
                {status === "sending"
                  ? labels.sending
                  : status === "sent"
                    ? labels.sent
                    : labels.failed}
              </span>
            </span>
          )}
        </div>

        <div className={mergeClasses("pimolu-chat__bubble", partClasses.bubble)}>
          {message.body}
        </div>

        {message.attachments &&
          message.attachments.length > 0 && (
            <ul className={mergeClasses("pimolu-chat__attachments", partClasses.attachments)}>
              {message.attachments.map(
                (attachment: PimoluChatAttachment) => (
                  <li
                    key={attachment.id}
                    className={mergeClasses("pimolu-chat__attachment", partClasses.attachment)}
                  >
                    <span
                      className={mergeClasses("pimolu-chat__attachment-icon", partClasses.attachmentIcon)}
                      aria-hidden="true"
                    >
                      <FileIcon />
                    </span>

                    {attachment.href ? (
                      <a
                        className={mergeClasses("pimolu-chat__attachment-name", partClasses.attachmentName)}
                        href={attachment.href}
                        aria-label={labels.attachment(
                          attachment.name
                        )}
                      >
                        {attachment.name}
                      </a>
                    ) : (
                      <span className={mergeClasses("pimolu-chat__attachment-name", partClasses.attachmentName)}>
                        {attachment.name}
                      </span>
                    )}

                    {attachment.size !== undefined && (
                      <span className={mergeClasses("pimolu-chat__attachment-size", partClasses.attachmentSize)}>
                        {formatSize(attachment.size)}
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          )}
      </div>
    </li>
  ));
}

/* =========================================
   CHAT
========================================= */

export function Chat({ classNames,
  messages,
  currentUserId,
  onSend,
  placeholder,
  disabled = false,
  loading = false,
  header,
  emptyState,
  typingUsers = [],
  onAttach,
  sendOnEnter = true,
  maxLength,
  labels: labelOverrides,
  className,
  "aria-label": ariaLabel,
  ...props
}: PimoluChatProps) {
  const [partClasses, scopeParts] = usePartClasses("chat", classNames, true);

  const labels: PimoluChatLabels = {
    ...defaultLabels,
    ...labelOverrides,
  };

  const [draft, setDraft] = useState("");

  const listRef = useRef<HTMLOListElement>(null);
  const inputId = `pimolu-chat-${useId()}`;

  const lastMessageId =
    messages.length > 0
      ? messages[messages.length - 1]?.id
      : undefined;

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    list.scrollTop = list.scrollHeight;
  }, [
    messages.length,
    lastMessageId,
    typingUsers.length,
    loading,
  ]);

  function send() {
    const body = draft.trim();

    if (!body || disabled || loading) {
      return;
    }

    onSend(body);
    setDraft("");
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      !sendOnEnter ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    send();
  }

  const classes = ["pimolu-chat", className]
    .filter(Boolean)
    .join(" ");

  const rendered: ReactNode[] = [];
  let previousDate: string | undefined;

  messages.forEach((message) => {
    if (
      message.date &&
      message.date !== previousDate
    ) {
      const label =
        message.dateLabel ?? formatDate(message.date);

      rendered.push(
        <li
          key={`date-${message.date}-${message.id}`}
          className={mergeClasses("pimolu-chat__date", partClasses.date)}
          role="separator"
          aria-label={label}
        >
          <span>{label}</span>
        </li>
      );

      previousDate = message.date;
    }

    rendered.push(
      <ChatMessageView
        key={message.id}
        message={message}
        own={
          message.own ??
          message.author.id === currentUserId
        }
        labels={labels}
      />
    );
  });

  const typingLabel =
    typingUsers.length > 0
      ? labels.typing(joinNames(typingUsers))
      : "";

  return scopeParts((
    <div
      {...props}
      className={mergeClasses(classes, partClasses.root)}
      role={props.role ?? "region"}
      aria-label={ariaLabel ?? labels.conversation}
      aria-busy={loading || undefined}
      data-pimolu-chat=""
      data-disabled={disabled ? "true" : undefined}
    >
      {header != null && (
        <div className={mergeClasses("pimolu-chat__header", partClasses.header)}>
          {header}
        </div>
      )}

      <div className={mergeClasses("pimolu-chat__body", partClasses.body)}>
        {loading ? (
          <div
            className={mergeClasses("pimolu-chat__loading", partClasses.loading)}
            role="status"
            aria-live="polite"
          >
            <span
              className={mergeClasses("pimolu-chat__spinner", partClasses.spinner)}
              aria-hidden="true"
            />

            <span>{labels.loading}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className={mergeClasses("pimolu-chat__empty", partClasses.empty)}>
            {emptyState ?? (
              <>
                <span
                  className={mergeClasses("pimolu-chat__empty-icon", partClasses.emptyIcon)}
                  aria-hidden="true"
                >
                  <EmptyIcon />
                </span>

                <p className={mergeClasses("pimolu-chat__empty-title", partClasses.emptyTitle)}>
                  {labels.empty}
                </p>

                <p className={mergeClasses("pimolu-chat__empty-description", partClasses.emptyDescription)}>
                  {labels.emptyDescription}
                </p>
              </>
            )}
          </div>
        ) : (
          <ol
            ref={listRef}
            className={mergeClasses("pimolu-chat__log", partClasses.log)}
            role="log"
            aria-label={labels.messages}
            aria-live="polite"
            aria-relevant="additions"
          >
            {rendered}
          </ol>
        )}

        {!loading && typingUsers.length > 0 && (
          <div
            className={mergeClasses("pimolu-chat__typing", partClasses.typing)}
            role="status"
            aria-live="polite"
          >
            <span
              className={mergeClasses("pimolu-chat__typing-dots", partClasses.typingDots)}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>

            <span>{typingLabel}</span>
          </div>
        )}
      </div>

      <form
        className={mergeClasses("pimolu-chat__composer", partClasses.composer)}
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <label
          className={mergeClasses("pimolu-chat__sr", partClasses.sr)}
          htmlFor={inputId}
        >
          {labels.message}
        </label>

        {onAttach && (
          <button
            type="button"
            className={mergeClasses("pimolu-chat__attach", partClasses.attach)}
            aria-label={labels.attach}
            title={labels.attach}
            disabled={disabled || loading}
            onClick={onAttach}
          >
            <PaperclipIcon />
          </button>
        )}

        <textarea
          id={inputId}
          className={mergeClasses("pimolu-chat__input", partClasses.input)}
          rows={1}
          value={draft}
          placeholder={placeholder ?? labels.placeholder}
          disabled={disabled || loading}
          maxLength={maxLength}
          onChange={(event) =>
            setDraft(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          className={mergeClasses("pimolu-chat__send", partClasses.send)}
          aria-label={labels.send}
          title={labels.send}
          disabled={
            disabled ||
            loading ||
            draft.trim().length === 0
          }
        >
          <SendIcon />
        </button>
      </form>
    </div>
  ));
}
