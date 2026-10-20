import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Kanban } from "./kanban";
import type { PimoluKanbanColumn } from "./kanban.types";

const columns: PimoluKanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    limit: 3,
    cards: [
      {
        id: "card-1",
        title: "Design tokens",
        description: "Document the semantic aliases.",
        labels: [
          "Design",
          { label: "Urgent", variant: "danger" },
        ],
        assignee: {
          id: "user-1",
          name: "Maya Chen",
        },
        priority: "high",
      },
      {
        id: "card-2",
        title: "Audit contrast",
        labels: ["Accessibility"],
        priority: "medium",
      },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    cards: [
      {
        id: "card-3",
        title: "Ship chat",
        assignee: {
          id: "user-2",
          name: "Lucas Moreau",
        },
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    limit: 1,
    cards: [
      {
        id: "card-4",
        title: "Plan sprint",
        priority: "low",
      },
    ],
  },
];

function createDataTransfer() {
  const store: Record<string, string> = {};

  return {
    dropEffect: "none",
    effectAllowed: "all",
    setData: vi.fn((type: string, value: string) => {
      store[type] = value;
    }),
    getData: vi.fn((type: string) => store[type] ?? ""),
    setDragImage: vi.fn(),
    types: [] as string[],
  } as unknown as DataTransfer;
}

function cardGroup(title: string, column: string) {
  return screen.getByRole("group", {
    name: `${title}, in ${column}`,
  });
}

describe("Pimolu Kanban", () => {
  it("renders columns, cards, counts, labels and assignees", () => {
    render(<Kanban defaultColumns={columns} />);

    expect(
      screen.getByRole("region", {
        name: "Kanban board",
      })
    ).toHaveAccessibleDescription(/Drag a card to move it/);

    expect(
      screen.getByRole("heading", {
        name: /To do/,
      })
    ).toBeInTheDocument();

    expect(screen.getByText("2 of 3 cards")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Done/,
      })
    ).toHaveTextContent("1 of 1 card");

    expect(
      cardGroup("Design tokens", "To do")
    ).toBeInTheDocument();

    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Maya Chen" })
    ).toBeInTheDocument();
  });

  it("shows a drop indicator and moves a card between columns", () => {
    const onMove = vi.fn();

    render(
      <Kanban
        defaultColumns={columns}
        onMove={onMove}
      />
    );

    const dataTransfer = createDataTransfer();
    const card = cardGroup("Design tokens", "To do");
    const target = screen.getByRole("list", {
      name: /In progress/,
    });

    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(target, { dataTransfer });

    expect(
      document.querySelectorAll(
        ".pimolu-kanban__drop-indicator"
      )
    ).toHaveLength(1);

    fireEvent.drop(target, { dataTransfer });

    expect(onMove).toHaveBeenCalledWith(
      "card-1",
      "todo",
      "doing",
      1
    );

    expect(
      within(target).getByText("Design tokens")
    ).toBeInTheDocument();

    expect(
      document.querySelectorAll(
        ".pimolu-kanban__drop-indicator"
      )
    ).toHaveLength(0);
  });

  it("keeps a controlled board in sync through onColumnsChange", () => {
    const onColumnsChange = vi.fn();

    render(
      <Kanban
        columns={columns}
        onColumnsChange={onColumnsChange}
      />
    );

    const dataTransfer = createDataTransfer();
    const target = screen.getByRole("list", {
      name: /In progress/,
    });

    fireEvent.dragStart(
      cardGroup("Design tokens", "To do"),
      { dataTransfer }
    );
    fireEvent.dragOver(target, { dataTransfer });
    fireEvent.drop(target, { dataTransfer });

    expect(onColumnsChange).toHaveBeenCalledTimes(1);

    const next = onColumnsChange.mock
      .calls[0]?.[0] as PimoluKanbanColumn[];

    expect(
      next
        .find((column) => column.id === "doing")
        ?.cards.map((card) => card.id)
    ).toEqual(["card-3", "card-1"]);

    /* A controlled board waits for the parent to publish the new snapshot. */
    expect(
      cardGroup("Design tokens", "To do")
    ).toBeInTheDocument();
  });

  it("moves a focused card with Control + arrow keys and announces it", () => {
    const onMove = vi.fn();

    render(
      <Kanban defaultColumns={columns} onMove={onMove} />
    );

    const card = cardGroup("Design tokens", "To do");

    card.focus();
    fireEvent.keyDown(card, {
      key: "ArrowRight",
      ctrlKey: true,
    });

    expect(onMove).toHaveBeenCalledWith(
      "card-1",
      "todo",
      "doing",
      0
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Moved Design tokens to In progress, position 1."
    );

    expect(
      screen.getByRole("group", {
        name: "Design tokens, in In progress",
      })
    ).toBeInTheDocument();
  });

  it("reorders a card inside its column with Alt + ArrowUp", () => {
    const onMove = vi.fn();

    render(
      <Kanban defaultColumns={columns} onMove={onMove} />
    );

    const card = cardGroup("Audit contrast", "To do");

    card.focus();
    fireEvent.keyDown(card, {
      key: "ArrowUp",
      altKey: true,
    });

    expect(onMove).toHaveBeenCalledWith(
      "card-2",
      "todo",
      "todo",
      0
    );

    const list = screen.getByRole("list", {
      name: /To do/,
    });
    const cards = within(list).getAllByRole("group");

    expect(cards[0]).toHaveAccessibleName(
      "Audit contrast, in To do"
    );
  });

  it("blocks drops into a full column and disables the menu target", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();

    render(
      <Kanban defaultColumns={columns} onMove={onMove} />
    );

    const dataTransfer = createDataTransfer();
    const card = cardGroup("Design tokens", "To do");
    const done = screen.getByRole("list", {
      name: /Done/,
    });

    expect(done).toHaveAttribute("aria-disabled", "true");

    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(done, { dataTransfer });
    fireEvent.drop(done, { dataTransfer });

    expect(onMove).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", {
        name: "Move Design tokens",
      })
    );

    expect(
      screen.getByRole("menuitem", {
        name: /Move to Done/,
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("menuitem", {
        name: "Move up",
      })
    ).toBeDisabled();
  });

  it("renders an empty column and appends to it on drop", () => {
    const onMove = vi.fn();

    const board: PimoluKanbanColumn[] = [
      columns[0],
      {
        id: "backlog",
        title: "Backlog",
        cards: [],
      },
    ];

    render(
      <Kanban defaultColumns={board} onMove={onMove} />
    );

    expect(
      screen.getByText("No cards yet")
    ).toBeInTheDocument();

    const dataTransfer = createDataTransfer();
    const target = screen.getByRole("list", {
      name: /Backlog/,
    });

    fireEvent.dragStart(
      cardGroup("Design tokens", "To do"),
      { dataTransfer }
    );
    fireEvent.dragOver(target, { dataTransfer });
    fireEvent.drop(target, { dataTransfer });

    expect(onMove).toHaveBeenCalledWith(
      "card-1",
      "todo",
      "backlog",
      0
    );

    expect(
      within(target).getByText("Design tokens")
    ).toBeInTheDocument();
  });

  it("exposes add-card buttons and calls onAddCard", async () => {
    const user = userEvent.setup();
    const onAddCard = vi.fn();

    render(
      <Kanban
        defaultColumns={columns}
        onAddCard={onAddCard}
      />
    );

    const add = screen.getByRole("button", {
      name: "Add card to To do",
    });

    expect(add).toHaveTextContent("Add card");
    expect(add).toHaveAccessibleName("Add card to To do");

    expect(
      screen.getByRole("button", {
        name: "Add card to Done",
      })
    ).toBeDisabled();

    await user.click(add);

    expect(onAddCard).toHaveBeenCalledWith("todo");
  });

  it("activates a card from its title button and from the keyboard", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();

    render(
      <Kanban
        defaultColumns={columns}
        onCardClick={onCardClick}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Design tokens",
      })
    );

    expect(onCardClick).toHaveBeenCalledWith(
      columns[0].cards[0],
      "todo"
    );

    onCardClick.mockClear();

    const second = cardGroup("Audit contrast", "To do");

    second.focus();
    fireEvent.keyDown(second, { key: "Enter" });

    expect(onCardClick).toHaveBeenCalledWith(
      columns[0].cards[1],
      "todo"
    );
  });

  it("offers the same move through the card menu", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();

    render(
      <Kanban
        defaultColumns={columns}
        onMove={onMove}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Move Design tokens",
      })
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Move to In progress",
      })
    );

    expect(onMove).toHaveBeenCalledWith(
      "card-1",
      "todo",
      "doing",
      1
    );

    expect(
      screen.getByRole("group", {
        name: "Design tokens, in In progress",
      })
    ).toBeInTheDocument();
  });
});
