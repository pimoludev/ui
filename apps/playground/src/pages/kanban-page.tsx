import { CustomizationExample } from "./kanban-customization-demo";
import { useState } from "react";

import {
  Badge,
  Kanban,
  type PimoluKanbanCard,
  type PimoluKanbanColumn,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

/* =========================================
   DATA
========================================= */

const initialColumns: PimoluKanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      {
        id: "card-icons",
        title: "Consolidate the icon set",
        description:
          "Merge the two navigation families and remove the unused glyphs.",
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
        description:
          "Explain the token rename and the codemod for legacy themes.",
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
        description:
          "Two amber badges still fail AA on the glass preset.",
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
        description:
          "Auto-resize the textarea and keep Shift + Enter as a newline.",
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
        description:
          "Control and Alt with the arrow keys, plus the move menu.",
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
        description:
          "Check light and dark, then the new board and chat pages.",
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

const triageColumns: PimoluKanbanColumn[] = [
  {
    id: "inbox",
    title: "Inbox",
    cards: [
      {
        id: "triage-1",
        title: "Billing portal shows a blank invoice",
        labels: ["Billing", "Enterprise"],
        priority: "urgent",
      },
    ],
  },
  {
    id: "triage",
    title: "Triage",
    limit: 2,
    cards: [
      {
        id: "triage-2",
        title: "Invite link expires after one use",
        labels: ["Accounts"],
        assignee: {
          id: "lucas",
          name: "Lucas Moreau",
        },
        priority: "high",
      },
      {
        id: "triage-3",
        title: "Export duplicates the last row",
        labels: ["Data"],
        assignee: {
          id: "noah",
          name: "Noah Dubois",
        },
        priority: "medium",
      },
    ],
  },
  {
    id: "resolved",
    title: "Resolved",
    cards: [],
  },
];

/* =========================================
   PAGE
========================================= */

export function KanbanPage() {
  const [columns, setColumns] =
    useState<PimoluKanbanColumn[]>(initialColumns);
  const [lastMove, setLastMove] = useState(
    "No card has moved yet."
  );
  const [selected, setSelected] = useState(
    "Select a card to open its details."
  );
  const [nextCard, setNextCard] = useState(1);

  function handleMove(
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    index: number
  ) {
    const card = columns
      .flatMap((column) => column.cards)
      .find((entry) => entry.id === cardId);

    const from = columns.find(
      (column) => column.id === fromColumnId
    );
    const to = columns.find(
      (column) => column.id === toColumnId
    );

    setLastMove(
      `${card?.title ?? cardId}: ${from?.title ?? fromColumnId} → ${
        to?.title ?? toColumnId
      }, position ${index + 1}.`
    );
  }

  function handleCardClick(
    card: PimoluKanbanCard,
    columnId: string
  ) {
    const column = columns.find(
      (entry) => entry.id === columnId
    );

    setSelected(
      `${card.title} · ${column?.title ?? columnId}`
    );
  }

  function handleAddCard(columnId: string) {
    const column = columns.find(
      (entry) => entry.id === columnId
    );

    if (
      !column ||
      (column.limit !== undefined &&
        column.cards.length >= column.limit)
    ) {
      return;
    }

    const id = `card-new-${nextCard}`;

    setNextCard((value) => value + 1);

    setColumns((current) =>
      current.map((entry) =>
        entry.id === columnId
          ? {
              ...entry,
              cards: [
                ...entry.cards,
                {
                  id,
                  title: `New task ${nextCard}`,
                  description:
                    "Describe the work, then drag the card across the board.",
                  priority: "medium",
                },
              ],
            }
          : entry
      )
    );
  }

  return (
    <>
      <PageHeader
        title="Kanban"
        hint="A data-driven board with columns, card limits, labels, assignees and priorities. Cards move by HTML5 drag and drop, by Control or Alt plus the arrow keys on a focused card, or from the per-card move menu. The board is controlled here through onColumnsChange."
      />

      <Section
        title="Sprint board"
        hint="Dragging a card crosses columns and reorders within a column. Each move is reported by onMove, cards open with onCardClick, and every column adds cards through onAddCard."
      >
        <div className="pg-stack">
          <div className="pg-row pg-row--between">
            <p className="pg-meta">{lastMove}</p>
            <p className="pg-meta">{selected}</p>
          </div>

          <Kanban
            columns={columns}
            onColumnsChange={setColumns}
            onMove={handleMove}
            onCardClick={handleCardClick}
            onAddCard={handleAddCard}
          />
        </div>
      </Section>

      <Section title="Leave a full column" hint="A full column refuses incoming cards, but its existing cards stay enabled. Focus a card and use Control/Alt with an arrow to move it out."><Kanban defaultColumns={initialColumns} /></Section>
      <Section
        title="Limits and empty columns"
        hint="Triage is full at two cards, so it refuses new drops and disables that destination in the move menu. Resolved is empty and still accepts a drop. This board is uncontrolled through defaultColumns."
      >
        <div className="pg-stack">
          <Kanban
            defaultColumns={triageColumns}
            aria-label="Support triage board"
          />

          <div className="pg-row">
            <Badge variant="warning" appearance="soft" dot>
              Triage is at its limit
            </Badge>
            <Badge appearance="outline" dot>
              Resolved is empty
            </Badge>
          </div>
        </div>
      </Section>
    <Section title="Named-part customization" hint="This example supplies classNames on the real component. Named parts keep their built-in states and can be overridden without internal selectors."><CustomizationExample /></Section>
</>
  );
}
