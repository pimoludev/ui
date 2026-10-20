import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* =========================================
   DATA
========================================= */

/** Author of a message. */
export interface PimoluChatAuthor {
  id: string;
  name: string;
  avatar?: string;
}

/** Delivery state of an outgoing message. */
export type PimoluChatMessageStatus =
  | "sending"
  | "sent"
  | "error";

/** A file attached to a message. */
export interface PimoluChatAttachment {
  id: string;
  name: string;
  /** When provided, the attachment is rendered as a link. */
  href?: string;
  /** Size in bytes. */
  size?: number;
}

/** A single message in the conversation. */
export interface PimoluChatMessage {
  /** Stable message id. */
  id: string;

  /** Message author. */
  author: PimoluChatAuthor;

  /** Message content. Newlines are preserved. */
  body: ReactNode;

  /** Display time, for example "09:42". */
  time: string;

  /**
   * Optional ISO date used to group messages under date separators.
   * Messages without a date never open a separator.
   */
  date?: string;

  /** Explicit separator label for this message's date. */
  dateLabel?: string;

  /**
   * Marks an outgoing message. Defaults to comparing the author id with
   * `currentUserId`.
   */
  own?: boolean;

  /** Delivery state, shown next to outgoing messages. */
  status?: PimoluChatMessageStatus;

  /** Attached files. */
  attachments?: readonly PimoluChatAttachment[];
}

/* =========================================
   LABELS
========================================= */

/** Localisable labels used by the Chat chrome. */
export interface PimoluChatLabels {
  /** Accessible name of the conversation region. */
  conversation: string;

  /** Accessible name of the message log. */
  messages: string;

  /** Accessible label of the composer. */
  message: string;

  /** Default composer placeholder. */
  placeholder: string;

  /** Accessible name of the send button. */
  send: string;

  /** Accessible name of the attachment button. */
  attach: string;

  /** Empty-state title. */
  empty: string;

  /** Empty-state description. */
  emptyDescription: string;

  /** Announced while the conversation loads. */
  loading: string;

  /** Typing indicator; receives the joined author names. */
  typing: (names: string) => string;

  /** Author label for outgoing messages. */
  you: string;

  /** Accessible status label. */
  sending: string;

  /** Accessible status label. */
  sent: string;

  /** Visible status label. */
  failed: string;

  /** Accessible name of an attachment. */
  attachment: (name: string) => string;
}

/* =========================================
   PROPS
========================================= */

export interface PimoluChatProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  /** Conversation messages, oldest first. Never mutated. */
  messages: readonly PimoluChatMessage[];

  /** Id used to identify outgoing messages. */
  currentUserId: string;

  /** Called with the trimmed composer value. */
  onSend: (body: string) => void;

  /** Overrides the default composer placeholder. */
  placeholder?: string;

  /** Disables the whole composer. */
  disabled?: boolean;

  /** Replaces the message area with a loading state. */
  loading?: boolean;

  /** Custom header content, for example a channel name and presence. */
  header?: ReactNode;

  /** Replaces the default empty state. */
  emptyState?: ReactNode;

  /** Names shown in the typing indicator. Empty hides it. */
  typingUsers?: readonly string[];

  /** Shows an attachment button when provided. */
  onAttach?: () => void;

  /**
   * When true (default), Enter sends and Shift + Enter inserts a newline.
   * When false, only the send button submits.
   */
  sendOnEnter?: boolean;

  /** Native textarea maxlength. */
  maxLength?: number;

  /** Overrides the built-in accessible labels. */
  labels?: Partial<PimoluChatLabels>;
}
