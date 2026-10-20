import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./menubar";

function Example({
  onNew = () => {},
}: {
  onNew?: () => void;
} = {}) {
  return (
    <Menubar aria-label="Main">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>

        <MenubarContent>
          <MenubarLabel>Project</MenubarLabel>
          <MenubarItem onSelect={onNew}>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Print</MenubarItem>
          <MenubarItem>Export</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>

        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>

        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function openFileMenu() {
  fireEvent.click(
    screen.getByRole("menuitem", { name: "File" })
  );

  return screen.getByRole("menu");
}

describe("Pimolu Menubar", () => {
  it("renders a menubar with one roving tab stop", () => {
    render(<Example />);

    expect(
      screen.getByRole("menubar", { name: "Main" })
    ).toBeInTheDocument();

    const file = screen.getByRole("menuitem", {
      name: "File",
    });

    const edit = screen.getByRole("menuitem", {
      name: "Edit",
    });

    expect(file).toHaveAttribute("aria-haspopup", "menu");
    expect(file).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(file).toHaveAttribute("tabindex", "0");
    expect(edit).toHaveAttribute("tabindex", "-1");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens a portalled menu and exposes its items", () => {
    render(<Example />);

    const file = screen.getByRole("menuitem", {
      name: "File",
    });

    const menu = openFileMenu();
    const inside = within(menu);

    expect(file).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(file).toHaveAttribute(
      "aria-controls",
      menu.id
    );
    expect(menu).toHaveAccessibleName("File");
    expect(inside.getByText("Project")).toBeInTheDocument();

    expect(
      inside.getByRole("menuitem", { name: "New" })
    ).toBeInTheDocument();

    expect(
      inside.getByRole("separator")
    ).toBeInTheDocument();

    expect(
      inside.getByRole("menuitem", { name: "Print" })
    ).toBeDisabled();
  });

  it("opens the menu with ArrowDown and focuses the first item", () => {
    render(<Example />);

    fireEvent.keyDown(
      screen.getByRole("menuitem", { name: "File" }),
      { key: "ArrowDown" }
    );

    expect(
      screen.getByRole("menuitem", { name: "New" })
    ).toHaveFocus();
  });

  it("moves between top-level triggers with the arrows, Home and End", () => {
    render(<Example />);

    const file = screen.getByRole("menuitem", {
      name: "File",
    });

    const edit = screen.getByRole("menuitem", {
      name: "Edit",
    });

    const help = screen.getByRole("menuitem", {
      name: "Help",
    });

    file.focus();

    fireEvent.keyDown(file, { key: "ArrowRight" });
    expect(edit).toHaveFocus();
    expect(edit).toHaveAttribute("tabindex", "0");
    expect(file).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(edit, { key: "ArrowLeft" });
    expect(file).toHaveFocus();

    fireEvent.keyDown(file, { key: "End" });
    expect(help).toHaveFocus();

    fireEvent.keyDown(help, { key: "Home" });
    expect(file).toHaveFocus();

    fireEvent.keyDown(file, { key: "ArrowLeft" });
    expect(help).toHaveFocus();
  });

  it("reverses horizontal arrow navigation in RTL", () => {
    render(
      <div dir="rtl">
        <Example />
      </div>
    );

    const file = screen.getByRole("menuitem", {
      name: "File",
    });
    const edit = screen.getByRole("menuitem", {
      name: "Edit",
    });
    const help = screen.getByRole("menuitem", {
      name: "Help",
    });

    file.focus();
    fireEvent.keyDown(file, { key: "ArrowLeft" });
    expect(edit).toHaveFocus();

    fireEvent.keyDown(edit, { key: "ArrowRight" });
    expect(file).toHaveFocus();

    fireEvent.keyDown(file, { key: "ArrowRight" });
    expect(help).toHaveFocus();
  });

  it("moves through enabled items and skips disabled ones", () => {
    render(<Example />);

    openFileMenu();

    const newItem = screen.getByRole("menuitem", {
      name: "New",
    });

    const open = screen.getByRole("menuitem", {
      name: "Open",
    });

    const exportItem = screen.getByRole("menuitem", {
      name: "Export",
    });

    expect(newItem).toHaveFocus();

    fireEvent.keyDown(newItem, { key: "ArrowDown" });
    expect(open).toHaveFocus();

    fireEvent.keyDown(open, { key: "ArrowDown" });
    expect(exportItem).toHaveFocus();

    fireEvent.keyDown(exportItem, { key: "ArrowDown" });
    expect(newItem).toHaveFocus();

    fireEvent.keyDown(newItem, { key: "ArrowUp" });
    expect(exportItem).toHaveFocus();

    fireEvent.keyDown(exportItem, { key: "Home" });
    expect(newItem).toHaveFocus();

    fireEvent.keyDown(newItem, { key: "End" });
    expect(exportItem).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<Example />);

    const file = screen.getByRole("menuitem", {
      name: "File",
    });

    openFileMenu();

    fireEvent.keyDown(screen.getByRole("menu"), {
      key: "Escape",
    });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(file).toHaveFocus();
  });

  it("closes on an outside pointerdown", () => {
    render(<Example />);

    openFileMenu();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("selects an item, closes the menu and restores focus", () => {
    const onNew = vi.fn();

    render(<Example onNew={onNew} />);

    const file = screen.getByRole("menuitem", {
      name: "File",
    });

    openFileMenu();

    fireEvent.click(
      screen.getByRole("menuitem", { name: "New" })
    );

    expect(onNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(file).toHaveFocus();
  });

  it("portals the panel into the trigger's theme scope", () => {
    render(
      <div data-pimolu-style="glass" data-testid="own-style">
        <Menubar aria-label="Scoped">
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>

            <MenubarContent>
              <MenubarItem>Zoom</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    );

    fireEvent.click(
      screen.getByRole("menuitem", { name: "View" })
    );

    expect(
      screen.getByRole("menu").parentElement
    ).toBe(screen.getByTestId("own-style"));
  });
});
