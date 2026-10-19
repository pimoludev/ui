import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";

afterEach(() => {
  vi.useRealTimers();
});

function closeMenu() {
  act(() => {
    vi.advanceTimersByTime(120);
  });
}

interface ExampleProps {
  onSelect?: () => void;
}

function Example({ onSelect }: ExampleProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <button type="button">Note</button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>

        <ContextMenuItem disabled>Archive</ContextMenuItem>

        <ContextMenuItem onSelect={onSelect}>
          Rename
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem>Duplicate</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function openMenu(x = 200, y = 150) {
  fireEvent.contextMenu(
    screen.getByRole("button", { name: "Note" }),
    { clientX: x, clientY: y }
  );
}

describe("Pimolu ContextMenu", () => {
  it("opens at the pointer position with the menu semantics", () => {
    render(<Example />);

    expect(screen.queryByRole("menu")).toBeNull();

    const trigger = screen.getByRole("button", {
      name: "Note",
    });

    expect(trigger).toHaveAttribute("aria-haspopup", "menu");

    openMenu();

    const menu = screen.getByRole("menu");

    expect(menu.style.position).toBe("fixed");
    expect(menu.style.left).toBe("200px");
    expect(menu.style.top).toBe("150px");

    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: "Archive" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("focuses the first enabled item", () => {
    render(<Example />);

    openMenu();

    expect(
      screen.getByRole("menuitem", { name: "Rename" })
    ).toHaveFocus();

    expect(
      screen.getByRole("menuitem", { name: "Archive" })
    ).not.toHaveFocus();
  });

  it("selects an item, closes, and returns focus", () => {
    vi.useFakeTimers();

    const onSelect = vi.fn();

    render(<Example onSelect={onSelect} />);

    openMenu();

    fireEvent.click(
      screen.getByRole("menuitem", { name: "Rename" })
    );

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Note" })
    ).toHaveFocus();

    closeMenu();

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("selects the focused item with Enter", () => {
    vi.useFakeTimers();

    const onSelect = vi.fn();

    render(<Example onSelect={onSelect} />);

    openMenu();

    fireEvent.keyDown(
      screen.getByRole("menuitem", { name: "Rename" }),
      { key: "Enter" }
    );

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Note" })
    ).toHaveFocus();

    closeMenu();

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    render(<Example />);

    openMenu();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: "Note" })
    ).toHaveFocus();

    closeMenu();

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on an outside pointerdown", () => {
    vi.useFakeTimers();

    render(<Example />);

    openMenu();

    fireEvent.pointerDown(document.body);

    closeMenu();

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("moves through enabled items and clamps to the viewport", () => {
    render(<Example />);

    openMenu();

    const rename = screen.getByRole("menuitem", {
      name: "Rename",
    });

    const duplicate = screen.getByRole("menuitem", {
      name: "Duplicate",
    });

    fireEvent.keyDown(rename, { key: "ArrowDown" });
    expect(duplicate).toHaveFocus();

    fireEvent.keyDown(duplicate, { key: "ArrowDown" });
    expect(rename).toHaveFocus();

    fireEvent.keyDown(rename, { key: "ArrowUp" });
    expect(duplicate).toHaveFocus();

    fireEvent.keyDown(duplicate, { key: "Home" });
    expect(rename).toHaveFocus();

    fireEvent.keyDown(rename, { key: "End" });
    expect(duplicate).toHaveFocus();

    /* A second contextmenu while open repositions the same panel. */
    openMenu(5000, 5000);

    const menu = screen.getByRole("menu");

    expect(menu.style.left).toBe(
      `${window.innerWidth - 8}px`
    );

    expect(menu.style.top).toBe(
      `${window.innerHeight - 8}px`
    );
  });
});
