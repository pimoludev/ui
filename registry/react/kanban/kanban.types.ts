import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type { PimoluBadgeVariant } from "../badge/badge.variants";

/* =========================================
   DATA
========================================= */

/** Visual urgency attached to a card. */
export type PimoluKanbanPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

/** Optional owner of a card. */
export interface PimoluKanbanAssignee {
  id: string;
  name: string;
  avatar?: string;
}

/**
 * A label rendered as a small Badge.
 *
 * Plain strings are accepted as a shortcut for a neutral outline label.
 */
export type PimoluKanbanLabel =
  | string
  | {
      label: string;
      variant?: PimoluBadgeVariant;
    };

/** A single card. */
export interface PimoluKanbanCard {
  /** Stable card id, used by moves and callbacks. */
  id: string;

  /** Visible title. */
  title: string;

  /** Optional supporting text. */
  description?: ReactNode;

  /** Category labels. */
  labels?: readonly PimoluKanbanLabel[];

  /** Card owner. */
  assignee?: PimoluKanbanAssignee;

  /** Urgency shown as a Badge. */
  priority?: PimoluKanbanPriority;
}

/** A column and the cards it currently holds. */
export interface PimoluKanbanColumn {
  /** Stable column id. */
  id: string;

  /** Visible heading. */
  title: string;

  /** Maximum number of cards accepted by the column. */
  limit?: number;

  /** Ordered cards. Never mutated by the component. */
  cards: readonly PimoluKanbanCard[];
}

/* =========================================
   LABELS
========================================= */

/** Localisable labels and announcements. */
export interface PimoluKanbanLabels {
  /** Accessible name of the board region. */
  board: string;

  /** Keyboard instructions exposed through aria-describedby. */
  instructions: string;

  /** Visible text of the add-card button. */
  addCard: string;

  /** Accessible name of the add-card button in a given column. */
  addCardTo: (columnTitle: string) => string;

  /** Shown inside a column without cards. */
  emptyColumn: string;

  /** Accessible name of a card. */
  card: (cardTitle: string, columnTitle: string) => string;

  /** Visible card counter, for example "3 of 5 cards". */
  count: (count: number, limit?: number) => string;

  /** Badge shown when a column reached its limit. */
  full: string;

  /** Accessible name of the move menu trigger. */
  move: (cardTitle: string) => string;

  /** Move menu entry. */
  moveUp: string;

  /** Move menu entry. */
  moveDown: string;

  /** Move menu entry pointing at another column. */
  moveTo: (columnTitle: string) => string;

  /** Live announcement after a successful move. */
  moved: (
    cardTitle: string,
    columnTitle: string,
    position: number
  ) => string;
}

/* =========================================
   PROPS
========================================= */

export interface PimoluKanbanProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Controlled columns. When provided, the component renders this snapshot
   * verbatim; update it from `onMove` or `onColumnsChange`.
   */
  columns?: readonly PimoluKanbanColumn[];

  /** Initial columns when the board is uncontrolled. */
  defaultColumns?: readonly PimoluKanbanColumn[];

  /** Called with the next columns after any valid move. */
  onColumnsChange?: (columns: PimoluKanbanColumn[]) => void;

  /**
   * Called after a valid drag, drop, keyboard or menu move.
   *
   * `index` is the zero-based position of the card in the destination
   * column, once the move is applied.
   */
  onMove?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    index: number
  ) => void;

  /** Called when a card body/title is activated. */
  onCardClick?: (
    card: PimoluKanbanCard,
    columnId: string
  ) => void;

  /** Adds an "Add card" button to every column when provided. */
  onAddCard?: (columnId: string) => void;

  /** Overrides the built-in accessible labels. */
  labels?: Partial<PimoluKanbanLabels>;
}
