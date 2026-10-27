"use client";

import { useState } from "react";
import { Kanban, type PimoluKanbanColumn, type PimoluKanbanCard } from "@pimolu/react";

const initialColumns: PimoluKanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      {
        id: "card-icons",
        title: "Consolidate the icon set",
        description: "Merge the two navigation families and remove the unused glyphs.",
        labels: ["Design system", "Icons"],
        assignee: {
          id: "maya",
          name: "Maya Chen",
        },
        priority: "low",
      },
      {
        id: "card-docs",
        title: "Write the migration guide",
        description: "Explain the token rename and the codemod for legacy themes.",
        labels: ["Docs"],
        assignee: {
          id: "noah",
          name: "Noah Dubois",
        },
        priority: "medium",
      },
    ],
  },
  {
    id: "todo",
    title: "To do",
    limit: 3,
    cards: [
      {
        id: "card-contrast",
        title: "Fix the dark-mode contrast audit",
        description: "Two amber badges still fail AA on the glass preset.",
        labels: [
          "Accessibility",
          {
            label: "Release blocker",
            variant: "danger",
          },
        ],
        assignee: {
          id: "sofia",
          name: "Sofia Rossi",
        },
        priority: "urgent",
      },
      {
        id: "card-chat",
        title: "Polish the chat composer",
        description: "Auto-resize the textarea and keep Shift + Enter as a newline.",
        labels: ["Components"],
        assignee: {
          id: "lucas",
          name: "Lucas Moreau",
        },
        priority: "high",
      },
      {
        id: "card-kanban",
        title: "Add keyboard card moves",
        description: "Control and Alt with the arrow keys, plus the move menu.",
        labels: ["Components", "A11y"],
        assignee: {
          id: "maya",
          name: "Maya Chen",
        },
        priority: "medium",
      },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    limit: 2,
    cards: [
      {
        id: "card-playground",
        title: "Review the six presets",
        description: "Check light and dark, then the new board and chat pages.",
        labels: ["Playground"],
        assignee: {
          id: "sofia",
          name: "Sofia Rossi",
        },
        priority: "high",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "card-tokens",
        title: "Publish the semantic aliases",
        labels: ["Tokens"],
        assignee: {
          id: "noah",
          name: "Noah Dubois",
        },
        priority: "medium",
      },
      {
        id: "card-release",
        title: "Cut the 0.9 preview",
        labels: ["Release"],
        assignee: {
          id: "lucas",
          name: "Lucas Moreau",
        },
        priority: "low",
      },
    ],
  },
];

export function DemoExample() {
  const [columns, setColumns] = useState<PimoluKanbanColumn[]>(initialColumns);
  const [lastMove, setLastMove] = useState("No card has moved yet.");
  const [selected, setSelected] = useState("Select a card to open its details.");
  const [nextCard, setNextCard] = useState(1);
  function handleMove(cardId: string, fromColumnId: string, toColumnId: string, index: number) {
    const card = columns
      .flatMap((column) => column.cards)
      .find((entry) => entry.id === cardId);
    const from = columns.find((column) => column.id === fromColumnId);
    const to = columns.find((column) => column.id === toColumnId);
    setLastMove(`${card?.title ?? cardId}: ${from?.title ?? fromColumnId} → ${to?.title ?? toColumnId}, position ${index + 1}.`);
  }
  function handleCardClick(card: PimoluKanbanCard, columnId: string) {
    const column = columns.find((entry) => entry.id === columnId);
    setSelected(`${card.title} · ${column?.title ?? columnId}`);
  }
  function handleAddCard(columnId: string) {
    const column = columns.find((entry) => entry.id === columnId);
    if(!column ||
      (column.limit !== undefined &&
        column.cards.length >= column.limit)) {
      return;
    }
    const id = `card-new-${nextCard}`;
    setNextCard((value) => value + 1);
    setColumns((current) => current.map((entry) => entry.id === columnId
      ? {
        ...entry,
        cards: [
          ...entry.cards,
          {
            id,
            title: `New task ${nextCard}`,
            description: "Describe the work, then drag the card across the board.",
            priority: "medium",
          },
        ],
      }
      : entry));
  }
  return (
    <div className="grid gap-6">
      {
        (<>
          <div className="grid gap-5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0 justify-between">
              <p className="text-sm text-muted leading-relaxed">{lastMove}</p>
              <p className="text-sm text-muted leading-relaxed">{selected}</p>
            </div>
            <Kanban
              columns={columns}
              onColumnsChange={setColumns}
              onMove={handleMove}
              onCardClick={handleCardClick}
              onAddCard={handleAddCard}
              classNames={{
                root: "custom-kanban-root",
                item: "custom-kanban-item"
              }}
            />
          </div>
        </>)
      }
      <style>
        {
          `
.custom-kanban-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-kanban-item {
  font-weight: 600;
}
`
        }
      </style>
    </div>
  );
}
