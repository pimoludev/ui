"use client";

import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";

import { Avatar } from "../avatar/avatar";
import { Badge } from "../badge/badge";

import type {
  PimoluKanbanCard,
  PimoluKanbanColumn,
  PimoluKanbanLabels,
  PimoluKanbanProps,
} from "./kanban.types";

/* =========================================
   LABELS
========================================= */

const defaultLabels: PimoluKanbanLabels = {
  board: "Kanban board",
  instructions:
    "Drag a card to move it, or focus a card and press Control or Alt with the arrow keys. The move menu offers the same actions.",
  addCard: "Add card",
  addCardTo: (columnTitle) => `Add card to ${columnTitle}`,
  emptyColumn: "No cards yet",
  card: (cardTitle, columnTitle) =>
    `${cardTitle}, in ${columnTitle}`,
  count: (count, limit) =>
    limit === undefined
      ? count === 1
        ? "1 card"
        : `${count} cards`
      : `${count} of ${limit} ${
          limit === 1 ? "card" : "cards"
        }`,
  full: "Full",
  move: (cardTitle) => `Move ${cardTitle}`,
  moveUp: "Move up",
  moveDown: "Move down",
  moveTo: (columnTitle) => `Move to ${columnTitle}`,
  moved: (cardTitle, columnTitle, position) =>
    `Moved ${cardTitle} to ${columnTitle}, position ${position}.`,
};

/* =========================================
   HELPERS
========================================= */

interface DragState {
  cardId: string;
  fromColumnId: string;
}

interface DropTarget {
  columnId: string;
  index: number;
}

interface MoveOutcome {
  columns: PimoluKanbanColumn[];
  index: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-") || "column";
}

function priorityVariant(
  priority: NonNullable<PimoluKanbanCard["priority"]>
) {
  switch (priority) {
    case "low":
      return "neutral" as const;
    case "medium":
      return "primary" as const;
    case "high":
      return "warning" as const;
    case "urgent":
      return "danger" as const;
  }
}

function isColumnFull(column: PimoluKanbanColumn) {
  return (
    column.limit !== undefined &&
    column.cards.length >= column.limit
  );
}

function canDropInto(
  dragState: DragState | null,
  column: PimoluKanbanColumn
) {
  if (!dragState) {
    return false;
  }

  if (dragState.fromColumnId === column.id) {
    return true;
  }

  return !isColumnFull(column);
}

/**
 * Pure move helper. `targetIndex` uses the drop-indicator coordinate space:
 * the insertion index in the destination list before the dragged card is
 * removed from its source list.
 */
function moveCardInColumns(
  columns: readonly PimoluKanbanColumn[],
  cardId: string,
  fromColumnId: string,
  toColumnId: string,
  targetIndex: number
): MoveOutcome | null {
  const fromIndex = columns.findIndex(
    (column) => column.id === fromColumnId
  );
  const toIndex = columns.findIndex(
    (column) => column.id === toColumnId
  );

  if (fromIndex < 0 || toIndex < 0) {
    return null;
  }

  const fromCards = [...columns[fromIndex].cards];
  const cardIndex = fromCards.findIndex(
    (card) => card.id === cardId
  );

  if (cardIndex < 0) {
    return null;
  }

  if (fromIndex === toIndex) {
    const [card] = fromCards.splice(cardIndex, 1);

    const finalIndex = clamp(
      targetIndex > cardIndex ? targetIndex - 1 : targetIndex,
      0,
      fromCards.length
    );

    fromCards.splice(finalIndex, 0, card);

    return {
      columns: columns.map((column, index) =>
        index === fromIndex
          ? { ...column, cards: fromCards }
          : column
      ),
      index: finalIndex,
    };
  }

  if (isColumnFull(columns[toIndex])) {
    return null;
  }

  const [card] = fromCards.splice(cardIndex, 1);
  const toCards = [...columns[toIndex].cards];
  const finalIndex = clamp(targetIndex, 0, toCards.length);

  toCards.splice(finalIndex, 0, card);

  return {
    columns: columns.map((column, index) => {
      if (index === fromIndex) {
        return { ...column, cards: fromCards };
      }

      if (index === toIndex) {
        return { ...column, cards: toCards };
      }

      return column;
    }),
    index: finalIndex,
  };
}

function cloneColumns(
  columns: readonly PimoluKanbanColumn[]
): PimoluKanbanColumn[] {
  return columns.map((column) => ({
    ...column,
    cards: [...column.cards],
  }));
}

/* =========================================
   ICONS
========================================= */

function GripIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function ChevronIcon({
  direction,
}: {
  direction: "up" | "down";
}) {
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
      <path
        d={direction === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}
      />
    </svg>
  );
}

function PlusIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* =========================================
   CARD
========================================= */

interface KanbanCardViewProps {
  card: PimoluKanbanCard;
  column: PimoluKanbanColumn;
  index: number;
  columns: readonly PimoluKanbanColumn[];
  labels: PimoluKanbanLabels;
  dragging: boolean;
  onCardClick?: (
    card: PimoluKanbanCard,
    columnId: string
  ) => void;
  onMoveWithin: (direction: "up" | "down") => void;
  onMoveTo: (columnId: string) => void;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    cardId: string,
    columnId: string
  ) => void;
  onDragEnd: () => void;
  onDragOverCard: (
    event: DragEvent<HTMLDivElement>,
    column: PimoluKanbanColumn,
    index: number
  ) => void;
  onCardKeyDown: (
    event: KeyboardEvent<HTMLDivElement>,
    card: PimoluKanbanCard,
    column: PimoluKanbanColumn,
    index: number
  ) => void;
}

function KanbanCardView({
  card,
  column,
  index,
  columns,
  labels,
  dragging,
  onCardClick,
  onMoveWithin,
  onMoveTo,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onCardKeyDown,
}: KanbanCardViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const moveRootRef = useRef<HTMLDivElement>(null);
  const moveTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const focusFirstItemRef = useRef(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        !moveRootRef.current?.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !focusFirstItemRef.current) {
      return;
    }

    focusFirstItemRef.current = false;

    menuRef.current
      ?.querySelector<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)'
      )
      ?.focus();
  }, [menuOpen]);

  function closeMenu(restoreFocus = false) {
    setMenuOpen(false);

    if (restoreFocus) {
      moveTriggerRef.current?.focus();
    }
  }

  function handleMenuKeyDown(
    event: KeyboardEvent<HTMLUListElement>
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    event.preventDefault();

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)'
      ) ?? []
    );

    if (items.length === 0) {
      return;
    }

    const current = items.indexOf(
      document.activeElement as HTMLButtonElement
    );
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next =
      (current + step + items.length) % items.length;

    items[next]?.focus();
  }

  const canMoveUp = index > 0;
  const canMoveDown = index < column.cards.length - 1;

  return (
    <li className="pimolu-kanban__item">
      <div
        className={[
          "pimolu-kanban__card",
          dragging && "pimolu-kanban__card--dragging",
        ]
          .filter(Boolean)
          .join(" ")}
        role="group"
        tabIndex={0}
        aria-label={labels.card(card.title, column.title)}
        data-pimolu-kanban-card={card.id}
        data-dragging={dragging ? "true" : undefined}
        draggable
        onDragStart={(event) =>
          onDragStart(event, card.id, column.id)
        }
        onDragEnd={onDragEnd}
        onDragOver={(event) =>
          onDragOverCard(event, column, index)
        }
        onKeyDown={(event) => {
          onCardKeyDown(event, card, column, index);

          if (
            !event.defaultPrevented &&
            onCardClick &&
            event.target === event.currentTarget &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            onCardClick(card, column.id);
          }
        }}
        onClick={(event) => {
          if (
            event.target !== event.currentTarget &&
            (event.target as HTMLElement).closest("button")
          ) {
            return;
          }

          onCardClick?.(card, column.id);
        }}
      >
        <div className="pimolu-kanban__card-top">
          <span
            className="pimolu-kanban__grip"
            aria-hidden="true"
          >
            <GripIcon />
          </span>

          {card.priority && (
            <Badge
              className="pimolu-kanban__priority"
              size="sm"
              variant={priorityVariant(card.priority)}
              appearance="soft"
            >
              {card.priority}
            </Badge>
          )}
        </div>

        {card.labels && card.labels.length > 0 && (
          <div className="pimolu-kanban__labels">
            {card.labels.map((label, labelIndex) => {
              const text =
                typeof label === "string"
                  ? label
                  : label.label;
              const variant =
                typeof label === "string"
                  ? "neutral"
                  : (label.variant ?? "neutral");

              return (
                <Badge
                  key={`${text}-${labelIndex}`}
                  size="sm"
                  appearance="outline"
                  variant={variant}
                  radius="full"
                >
                  {text}
                </Badge>
              );
            })}
          </div>
        )}

        {onCardClick ? (
          <button
            type="button"
            className="pimolu-kanban__card-title pimolu-kanban__card-title--button"
            onClick={(event) => {
              event.stopPropagation();
              onCardClick(card, column.id);
            }}
          >
            {card.title}
          </button>
        ) : (
          <span className="pimolu-kanban__card-title">
            {card.title}
          </span>
        )}

        {card.description != null && (
          <div className="pimolu-kanban__card-description">
            {card.description}
          </div>
        )}

        <div className="pimolu-kanban__card-footer">
          <div className="pimolu-kanban__card-meta">
            {card.assignee && (
              <Avatar
                name={card.assignee.name}
                src={card.assignee.avatar}
                size="xs"
                title={card.assignee.name}
              />
            )}
          </div>

          <div
            className="pimolu-kanban__move"
            ref={moveRootRef}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={moveTriggerRef}
              type="button"
              className="pimolu-kanban__move-trigger"
              aria-label={labels.move(card.title)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  focusFirstItemRef.current = true;
                  setMenuOpen(true);
                }

                if (event.key === "Escape") {
                  closeMenu();
                }
              }}
            >
              <GripIcon />
            </button>

            {menuOpen && (
              <ul
                ref={menuRef}
                className="pimolu-kanban__move-menu"
                role="menu"
                aria-label={labels.move(card.title)}
                onKeyDown={handleMenuKeyDown}
              >
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="pimolu-kanban__move-item"
                    disabled={!canMoveUp}
                    onClick={() => {
                      closeMenu();
                      onMoveWithin("up");
                    }}
                  >
                    <ChevronIcon direction="up" />
                    <span>{labels.moveUp}</span>
                  </button>
                </li>

                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="pimolu-kanban__move-item"
                    disabled={!canMoveDown}
                    onClick={() => {
                      closeMenu();
                      onMoveWithin("down");
                    }}
                  >
                    <ChevronIcon direction="down" />
                    <span>{labels.moveDown}</span>
                  </button>
                </li>

                <li role="none">
                  <span
                    className="pimolu-kanban__move-separator"
                    role="separator"
                  />
                </li>

                {columns.map((target) => {
                  const disabled =
                    target.id === column.id ||
                    isColumnFull(target);

                  return (
                    <li key={target.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className="pimolu-kanban__move-item"
                        disabled={disabled}
                        onClick={() => {
                          closeMenu();
                          onMoveTo(target.id);
                        }}
                      >
                        <span>{labels.moveTo(target.title)}</span>
                        {isColumnFull(target) && (
                          <span className="pimolu-kanban__move-full">
                            {labels.full}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/* =========================================
   BOARD
========================================= */

import { forwardRef } from "react";
import { useMergedRefs } from "../internal/use-merged-refs";
export const Kanban = forwardRef<HTMLDivElement, PimoluKanbanProps>(function Kanban({
  style: motionStyle,
  columns: controlledColumns,
  defaultColumns,
  onColumnsChange,
  onMove,
  onCardClick,
  onAddCard,
  labels: labelOverrides,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const labels: PimoluKanbanLabels = {
    ...defaultLabels,
    ...labelOverrides,
  };

  const isControlled = controlledColumns !== undefined;

  const [internalColumns, setInternalColumns] = useState<
    PimoluKanbanColumn[]
  >(() => cloneColumns(defaultColumns ?? []));

  const boardColumns =
    controlledColumns ?? internalColumns;

  const baseId = `pimolu-kanban-${useId()}`;
  const instructionsId = `${baseId}-instructions`;

  const rootRef = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] =
    useState<DragState | null>(null);
  const [dropTarget, setDropTarget] =
    useState<DropTarget | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [pendingFocus, setPendingFocus] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!pendingFocus) {
      return;
    }

    const cards = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-pimolu-kanban-card]"
      ) ?? []
    );

    const target = cards.find(
      (element) =>
        element.dataset.pimoluKanbanCard === pendingFocus
    );

    target?.focus();
    setPendingFocus(null);
  }, [pendingFocus, boardColumns]);

  function applyMove(
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    targetIndex: number,
    restoreFocus: boolean
  ) {
    const sourceColumn = boardColumns.find(
      (column) => column.id === fromColumnId
    );
    const sourceCard = sourceColumn?.cards.find(
      (card) => card.id === cardId
    );

    if (!sourceColumn || !sourceCard) {
      return false;
    }

    const outcome = moveCardInColumns(
      boardColumns,
      cardId,
      fromColumnId,
      toColumnId,
      targetIndex
    );

    if (!outcome) {
      return false;
    }

    if (!isControlled) {
      setInternalColumns(outcome.columns);
    }

    onColumnsChange?.(outcome.columns);
    onMove?.(
      cardId,
      fromColumnId,
      toColumnId,
      outcome.index
    );

    const destination = outcome.columns.find(
      (column) => column.id === toColumnId
    );

    setAnnouncement(
      labels.moved(
        sourceCard.title,
        destination?.title ?? toColumnId,
        outcome.index + 1
      )
    );

    setDropTarget(null);
    setDragState(null);

    if (restoreFocus) {
      setPendingFocus(cardId);
    }

    return true;
  }

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    cardId: string,
    columnId: string
  ) {
    setDragState({ cardId, fromColumnId: columnId });
    setDropTarget(null);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", cardId);
    }
  }

  function handleDragEnd() {
    setDragState(null);
    setDropTarget(null);
  }

  function handleColumnDragOver(
    event: DragEvent<HTMLOListElement | HTMLDivElement>,
    column: PimoluKanbanColumn,
    index?: number
  ) {
    if (!dragState) {
      return;
    }

    if (!canDropInto(dragState, column)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "none";
      }

      setDropTarget(null);
      return;
    }

    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    const nextIndex = index ?? column.cards.length;

    setDropTarget((current) =>
      current?.columnId === column.id &&
      current.index === nextIndex
        ? current
        : { columnId: column.id, index: nextIndex }
    );
  }

  function handleDragOverCard(
    event: DragEvent<HTMLDivElement>,
    column: PimoluKanbanColumn,
    index: number
  ) {
    event.stopPropagation();

    const bounds =
      event.currentTarget.getBoundingClientRect();
    const after =
      event.clientY > bounds.top + bounds.height / 2;

    handleColumnDragOver(
      event,
      column,
      index + (after ? 1 : 0)
    );
  }

  function handleDrop(
    event: DragEvent<HTMLOListElement>,
    column: PimoluKanbanColumn
  ) {
    event.preventDefault();

    if (!dragState || !canDropInto(dragState, column)) {
      setDragState(null);
      setDropTarget(null);
      return;
    }

    const index =
      dropTarget?.columnId === column.id
        ? dropTarget.index
        : column.cards.length;

    applyMove(
      dragState.cardId,
      dragState.fromColumnId,
      column.id,
      index,
      false
    );

    setDragState(null);
    setDropTarget(null);
  }

  function handleCardKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    card: PimoluKanbanCard,
    column: PimoluKanbanColumn,
    index: number
  ) {
    if (
      (event.target as HTMLElement).closest(
        '[role="menu"]'
      )
    ) {
      return;
    }

    if (!event.ctrlKey && !event.altKey) {
      return;
    }

    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    ) {
      return;
    }

    const columnIndex = boardColumns.findIndex(
      (entry) => entry.id === column.id
    );

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const offset = event.key === "ArrowLeft" ? -1 : 1;
      const targetColumn =
        boardColumns[columnIndex + offset];

      if (!targetColumn) {
        return;
      }

      event.preventDefault();

      applyMove(
        card.id,
        column.id,
        targetColumn.id,
        index,
        true
      );

      return;
    }

    if (event.key === "ArrowUp") {
      if (index === 0) {
        return;
      }

      event.preventDefault();
      applyMove(card.id, column.id, column.id, index - 1, true);
      return;
    }

    if (index >= column.cards.length - 1) {
      return;
    }

    event.preventDefault();
    applyMove(
      card.id,
      column.id,
      column.id,
      index + 2,
      true
    );
  }

  const classes = ["pimolu-kanban", className]
    .filter(Boolean)
    .join(" ");

  const mergedMotionRef = useMergedRefs(ref, rootRef);

  return (
    <div style={motionStyle}
      {...props}
      ref={mergedMotionRef}
      role={props.role ?? "region"}
      aria-label={ariaLabel ?? labels.board}
      aria-describedby={
        [instructionsId, ariaDescribedBy]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={classes}
      data-pimolu-kanban=""
    >
      <p
        id={instructionsId}
        className="pimolu-kanban__sr"
      >
        {labels.instructions}
      </p>

      {boardColumns.map((column) => {
        const headingId = `${baseId}-${toId(
          column.id
        )}-heading`;

        const full = isColumnFull(column);
        const activeDrop =
          dropTarget?.columnId === column.id;
        const dropIndex = activeDrop
          ? clamp(dropTarget.index, 0, column.cards.length)
          : -1;

        return (
          <section
            key={column.id}
            className={[
              "pimolu-kanban__column",
              activeDrop && "pimolu-kanban__column--drop",
              full && "pimolu-kanban__column--full",
            ]
              .filter(Boolean)
              .join(" ")}
            data-column-id={column.id}
            data-full={full ? "true" : undefined}
            data-drop-target={
              activeDrop ? "true" : undefined
            }
          >
            <header className="pimolu-kanban__column-header">
              <h3
                id={headingId}
                className="pimolu-kanban__column-title"
              >
                <span>{column.title}</span>

                <span className="pimolu-kanban__count">
                  {labels.count(
                    column.cards.length,
                    column.limit
                  )}
                </span>
              </h3>

              {full && (
                <Badge
                  size="sm"
                  variant="warning"
                  appearance="soft"
                  aria-hidden="true"
                >
                  {labels.full}
                </Badge>
              )}
            </header>

            <ol
              className="pimolu-kanban__list"
              aria-labelledby={headingId}
              data-full={full || undefined}
              onDragOver={(event) =>
                handleColumnDragOver(event, column)
              }
              onDragLeave={(event) => {
                const next = event.relatedTarget as Node | null;

                if (
                  !next ||
                  !event.currentTarget.contains(next)
                ) {
                  setDropTarget(null);
                }
              }}
              onDrop={(event) => handleDrop(event, column)}
            >
              {column.cards.map((card, index) => (
                <Fragment key={card.id}>
                  {activeDrop && dropIndex === index && (
                    <li
                      className="pimolu-kanban__drop-indicator"
                      aria-hidden="true"
                    />
                  )}

                  <KanbanCardView
                    card={card}
                    column={column}
                    index={index}
                    columns={boardColumns}
                    labels={labels}
                    dragging={
                      dragState?.cardId === card.id
                    }
                    onCardClick={onCardClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOverCard={handleDragOverCard}
                    onCardKeyDown={handleCardKeyDown}
                    onMoveWithin={(direction) =>
                      applyMove(
                        card.id,
                        column.id,
                        column.id,
                        direction === "up"
                          ? index - 1
                          : index + 2,
                        true
                      )
                    }
                    onMoveTo={(columnId) =>
                      applyMove(
                        card.id,
                        column.id,
                        columnId,
                        boardColumns.find(
                          (entry) => entry.id === columnId
                        )?.cards.length ?? 0,
                        true
                      )
                    }
                  />
                </Fragment>
              ))}

              {activeDrop &&
                dropIndex === column.cards.length && (
                  <li
                    className="pimolu-kanban__drop-indicator"
                    aria-hidden="true"
                  />
                )}

              {column.cards.length === 0 &&
                !activeDrop && (
                  <li className="pimolu-kanban__empty">
                    {labels.emptyColumn}
                  </li>
                )}
            </ol>

            {onAddCard && (
              <div className="pimolu-kanban__column-footer">
                <button
                  type="button"
                  className="pimolu-kanban__add"
                  aria-label={labels.addCardTo(column.title)}
                  disabled={full}
                  onClick={() => onAddCard(column.id)}
                >
                  <PlusIcon />
                  <span>{labels.addCard}</span>
                </button>
              </div>
            )}
          </section>
        );
      })}

      <div
        className="pimolu-kanban__announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
    </div>
  );
});

Kanban.displayName = "PimoluKanban";
