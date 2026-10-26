
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { TreeSelect } from "./tree-select";

const locations = [
  {
    value: "eu",
    label: "Europe",
    children: [
      {
        value: "fr",
        label: "France",
        children: [
          { value: "paris", label: "Paris" },
          { value: "lyon", label: "Lyon" },
        ],
      },
      {
        value: "de",
        label: "Germany",
        children: [
          { value: "berlin", label: "Berlin" },
          { value: "munich", label: "Munich" },
        ],
      },
    ],
  },
  {
    value: "na",
    label: "North America",
    children: [
      {
        value: "ca",
        label: "Canada",
        children: [
          { value: "montreal", label: "Montréal" },
        ],
      },
    ],
  },
  {
    value: "asia",
    label: "Asia",
  },
];

describe("Pimolu TreeSelect", () => {
  it("does not move the active node at touch contact before a tap is completed", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TreeSelect label="Destination" options={locations} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const active = trigger.getAttribute("aria-activedescendant");
    const asia = screen.getByRole("treeitem", { name: "Asia" });
    await user.pointer({ keys: "[TouchA>]", target: asia });
    expect(trigger).toHaveAttribute("aria-activedescendant", active);
    expect(onValueChange).not.toHaveBeenCalled();
    await user.pointer({ keys: "[/TouchA]", target: asia });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("asia", { value: "asia", label: "Asia" });
  });

  it("renders an accessible trigger", () => {
    render(
      <TreeSelect
        label="Destination"
        options={locations}
        placeholder="Choose a place"
      />
    );

    const trigger = screen.getByRole("combobox", {
      name: "Destination",
    });

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveTextContent("Choose a place");
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "tree"
    );
  });

  it("expands branches and selects a nested option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        onValueChange={onValueChange}
      />
    );

    const trigger = screen.getByRole("combobox", {
      name: "Destination",
    });

    await user.click(trigger);

    expect(
      screen.getByRole("tree")
    ).toBeInTheDocument();

    /* The tree opens with the first branch highlighted. */
    await user.keyboard("{ArrowRight}{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith(
      "de",
      expect.objectContaining({
        value: "de",
        label: "Germany",
      })
    );

    expect(trigger).toHaveTextContent("Germany");
    expect(trigger).toHaveFocus();
    expect(
      screen.queryByRole("tree")
    ).toBeNull();
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        value="berlin"
        onValueChange={onValueChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent("Berlin");

    await user.click(trigger);

    expect(
      screen.getByRole("treeitem", {
        name: "Berlin",
      })
    ).toHaveAttribute("aria-selected", "true");

    await user.click(
      screen.getByRole("treeitem", {
        name: "Munich",
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "munich",
      expect.objectContaining({
        value: "munich",
      })
    );

    /* The parent has not echoed the new value yet. */
    expect(trigger).toHaveTextContent("Berlin");
  });

  it("expands the ancestors of a default value", async () => {
    const user = userEvent.setup();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        defaultValue="paris"
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent("Paris");

    await user.click(trigger);

    expect(
      screen.getByRole("treeitem", {
        name: "Paris",
      })
    ).toHaveAttribute("aria-selected", "true");

    expect(
      screen.getByRole("treeitem", {
        name: "Europe",
      })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("navigates with arrows, Home and End", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.keyboard(
      "{End}{Home}{ArrowDown}{ArrowDown}{Enter}"
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "asia",
      expect.objectContaining({
        value: "asia",
      })
    );
  });

  it("closes on Escape and returns focus", async () => {
    const user = userEvent.setup();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
      />
    );

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);

    expect(
      screen.getByRole("tree")
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("tree")
    ).toBeNull();

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("clears the selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        defaultValue="berlin"
        onValueChange={onValueChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent("Berlin");

    await user.click(
      screen.getByRole("button", {
        name: "Clear selection",
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(
      undefined,
      undefined
    );

    expect(trigger).toHaveTextContent(
      "Select an option"
    );
    expect(trigger).toHaveFocus();
  });

  it("filters the tree when searchable", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        searchable
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    const search = screen.getByRole("searchbox", {
      name: "Search options",
    });

    await user.type(search, "ber");

    expect(
      screen.getByRole("treeitem", {
        name: "Europe",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("treeitem", {
        name: "France",
      })
    ).toBeNull();

    await user.click(
      screen.getByRole("treeitem", {
        name: "Berlin",
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "berlin",
      expect.objectContaining({
        value: "berlin",
      })
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveTextContent("Berlin");
  });

  it("supports typeahead on the trigger", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeSelect
        label="Destination"
        options={locations}
        onValueChange={onValueChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);
    await user.click(trigger);

    await user.keyboard("ber{Enter}");

    expect(onValueChange).toHaveBeenCalledWith(
      "berlin",
      expect.objectContaining({
        value: "berlin",
      })
    );

    expect(trigger).toHaveTextContent("Berlin");
  });

  it("shows the disabled and error states", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <TreeSelect
        label="Destination"
        options={locations}
        disabled
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(
      screen.queryByRole("tree")
    ).toBeNull();

    rerender(
      <TreeSelect
        label="Destination"
        options={locations}
        error="Choose a destination first."
      />
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Choose a destination first."
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveAttribute("aria-invalid", "true");
  });
});
