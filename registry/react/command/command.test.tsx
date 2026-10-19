import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Command, CommandPalette } from "./command";

import type { PimoluCommandItem } from "./command.types";

const items: PimoluCommandItem[] = [
  {
    id: "settings",
    label: "Open settings",
    description: "Change preferences",
    group: "Navigation",
    keywords: ["preferences", "config"],
    shortcut: "Ctrl+,",
  },
  {
    id: "new-file",
    label: "New file",
    group: "Files",
    keywords: ["create", "document"],
  },
  {
    id: "save",
    label: "Save file",
    group: "Files",
    keywords: ["write"],
  },
  {
    id: "delete",
    label: "Delete file",
    group: "Files",
    keywords: ["remove"],
    disabled: true,
  },
];

function getSearchInput(name = "Command menu") {
  return screen.getByRole("combobox", { name });
}

describe("Pimolu Command", () => {
  it("filters the list by query", () => {
    render(<Command items={items} />);

    fireEvent.change(getSearchInput(), {
      target: { value: "SAVE" },
    });

    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(1);
    expect(options[0]).toHaveAccessibleName("Save file");
  });

  it("matches keywords case-insensitively", () => {
    render(<Command items={items} />);

    fireEvent.change(getSearchInput(), {
      target: { value: "CREATE" },
    });

    expect(
      screen.getByRole("option", { name: "New file" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: "Open settings",
      })
    ).toBeNull();
  });

  it("moves the active option with the keyboard and selects with Enter", () => {
    const itemSelect = vi.fn();
    const onSelect = vi.fn();

    const commands: PimoluCommandItem[] = [
      { id: "first", label: "First command" },
      {
        id: "second",
        label: "Second command",
        onSelect: itemSelect,
      },
      { id: "third", label: "Third command" },
    ];

    render(
      <Command items={commands} onSelect={onSelect} />
    );

    const input = getSearchInput();
    const options = screen.getAllByRole("option");

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[0].id
    );

    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[1].id
    );

    fireEvent.keyDown(input, { key: "End" });

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[2].id
    );

    fireEvent.keyDown(input, { key: "Home" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(itemSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(commands[1]);

    expect(
      itemSelect.mock.invocationCallOrder[0]
    ).toBeLessThan(
      onSelect.mock.invocationCallOrder[0]
    );
  });

  it("skips disabled commands when navigating and clicking", () => {
    const onSelect = vi.fn();

    const commands: PimoluCommandItem[] = [
      { id: "one", label: "First command" },
      {
        id: "two",
        label: "Disabled command",
        disabled: true,
      },
      { id: "three", label: "Third command" },
    ];

    render(
      <Command items={commands} onSelect={onSelect} />
    );

    const input = getSearchInput();

    const disabled = screen.getByRole("option", {
      name: "Disabled command",
    });

    expect(disabled).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    fireEvent.click(disabled);

    expect(onSelect).not.toHaveBeenCalled();

    const options = screen.getAllByRole("option");

    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[2].id
    );

    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[0].id
    );
  });

  it("shows the empty state when nothing matches", () => {
    render(
      <Command items={items} emptyMessage="Nothing here." />
    );

    fireEvent.change(getSearchInput(), {
      target: { value: "zzzz" },
    });

    expect(screen.queryAllByRole("option")).toHaveLength(0);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nothing here."
    );
  });

  it("wires the combobox, listbox and active option accessibly", () => {
    render(
      <Command items={items} aria-label="Search commands" />
    );

    const input = getSearchInput("Search commands");

    const listbox = screen.getByRole("listbox", {
      name: "Search commands",
    });

    const options = screen.getAllByRole("option");

    expect(input).toHaveFocus();
    expect(input).toHaveAttribute(
      "aria-autocomplete",
      "list"
    );
    expect(input).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(input).toHaveAttribute(
      "aria-controls",
      listbox.id
    );
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[0].id
    );

    expect(options[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );

    expect(options[1]).toHaveAttribute(
      "aria-selected",
      "false"
    );

    expect(
      screen.getByRole("group", { name: "Navigation" })
    ).toBeInTheDocument();
  });
});

describe("Pimolu Command Palette", () => {
  it("opens and closes a controlled palette", async () => {
    function ControlledPalette() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
          >
            Open palette
          </button>

          <CommandPalette
            open={open}
            onOpenChange={setOpen}
            items={items}
          />
        </>
      );
    }

    render(<ControlledPalette />);

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open palette",
      })
    );

    const dialog = screen.getByRole("dialog", {
      name: "Command palette",
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");

    expect(
      getSearchInput("Command palette")
    ).toHaveFocus();

    fireEvent.keyDown(getSearchInput("Command palette"), {
      key: "Escape",
    });

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog")
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens with the Cmd/Ctrl shortcut", () => {
    render(
      <CommandPalette items={items} shortcut="k" />
    );

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(document, {
      key: "k",
      ctrlKey: true,
    });

    expect(
      screen.getByRole("dialog", {
        name: "Command palette",
      })
    ).toBeInTheDocument();
  });

  it("closes after a selection and calls both handlers in order", async () => {
    const itemSelect = vi.fn();
    const onSelect = vi.fn();

    const commands: PimoluCommandItem[] = [
      {
        id: "settings",
        label: "Open settings",
        onSelect: itemSelect,
      },
    ];

    render(
      <CommandPalette
        defaultOpen
        items={commands}
        onSelect={onSelect}
      />
    );

    fireEvent.click(
      screen.getByRole("option", {
        name: "Open settings",
      })
    );

    expect(itemSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(commands[0]);

    expect(
      itemSelect.mock.invocationCallOrder[0]
    ).toBeLessThan(
      onSelect.mock.invocationCallOrder[0]
    );

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("dialog")
    );
  });
});
