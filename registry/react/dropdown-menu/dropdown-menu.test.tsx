import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function closeMenu() {
  act(() => {
    vi.advanceTimersByTime(120);
  });
}

function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button type="button">Actions</button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Project</DropdownMenuLabel>

        <DropdownMenuItem>Rename</DropdownMenuItem>

        <DropdownMenuItem onSelect={() => {}}>
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("Pimolu DropdownMenu", () => {
  it("focuses the first enabled command after the portal mounts", async () => {
    render(<DropdownMenu><DropdownMenuTrigger><button>Open commands</button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem disabled>Unavailable</DropdownMenuItem><DropdownMenuItem>Available</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
    fireEvent.click(screen.getByRole("button", { name: "Open commands" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: /^Available$/ })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /^Available$/ }), { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open commands" })).toHaveFocus();
  });
  it.each([
    [0, "end", "ltr", 8],
    [300, "end", "ltr", 116],
    [980, "start", "ltr", 792],
    [300, "start", "ltr", 300],
    [300, "start", "rtl", 116],
    [300, "end", "rtl", 300],
  ] as const)("keeps align=%s/%s (%s) inside the viewport", async (left, align, direction, expected) => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => new DOMRect(left, 40, 40, 32));
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("role") === "menu" ? 224 : 40;
    });
    render(<DropdownMenu defaultOpen><DropdownMenuTrigger><button style={{ direction }}>Actions</button></DropdownMenuTrigger><DropdownMenuContent align={align}><DropdownMenuItem>Save</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
    await waitFor(() => expect(screen.getByRole("menu").style.left).toBe(`${expected}px`));
  });

  it("opens a menu with its items", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Actions",
    });

    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "menu"
    );

    fireEvent.click(trigger);

    expect(
      screen.getByRole("menu")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: "Rename" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", { name: "Archive" })
    ).toBeDisabled();
  });

  it("selects an item and closes the menu", () => {
    vi.useFakeTimers();
    const onSelect = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button type="button">Actions</button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>
            Rename
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", {
      name: "Actions",
    });

    fireEvent.click(trigger);

    fireEvent.click(
      screen.getByRole("menuitem", { name: "Rename" })
    );

    expect(onSelect).toHaveBeenCalledTimes(1);
    closeMenu();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Actions",
    });

    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByRole("menu"), {
      key: "Escape",
    });

    closeMenu();

    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes on an outside pointerdown", () => {
    vi.useFakeTimers();
    render(<Example />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions" })
    );

    fireEvent.pointerDown(document.body);

    closeMenu();

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("moves through enabled items with the arrows", () => {
    render(<Example />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions" })
    );

    const rename = screen.getByRole("menuitem", {
      name: "Rename",
    });

    const duplicate = screen.getByRole("menuitem", {
      name: "Duplicate",
    });

    rename.focus();

    fireEvent.keyDown(rename, { key: "ArrowDown" });

    expect(duplicate).toHaveFocus();

    fireEvent.keyDown(duplicate, { key: "ArrowDown" });

    expect(rename).toHaveFocus();
  });
});
