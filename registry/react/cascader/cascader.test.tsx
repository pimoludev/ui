
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

import { Cascader } from "./cascader";

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
        value: "us",
        label: "United States",
        children: [
          { value: "nyc", label: "New York" },
        ],
      },
    ],
  },
];

describe("Pimolu Cascader", () => {
  it("renders an accessible trigger", () => {
    render(
      <Cascader
        label="Destination"
        options={locations}
        placeholder="Choose a place"
      />
    );

    const trigger = screen.getByRole("combobox", {
      name: "Destination",
    });

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveTextContent(
      "Choose a place"
    );
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("opens the first column on click", async () => {
    const user = userEvent.setup();

    render(
      <Cascader
        label="Destination"
        options={locations}
      />
    );

    await user.click(
      screen.getByRole("combobox", {
        name: "Destination",
      })
    );

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Europe",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "North America",
      })
    ).toBeInTheDocument();
  });

  it("expands levels and selects a leaf", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Cascader
        label="Destination"
        options={locations}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);

    await user.click(
      screen.getByRole("option", {
        name: "Europe",
      })
    );

    expect(
      screen.getByRole("group", {
        name: "Europe",
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("option", {
        name: "France",
      })
    );

    await user.click(
      screen.getByRole("option", {
        name: "Paris",
      })
    );

    expect(trigger).toHaveTextContent(
      "Europe / France / Paris"
    );

    expect(onChange).toHaveBeenCalledWith(
      ["eu", "fr", "paris"],
      expect.objectContaining({
        value: "paris",
        label: "Paris",
      })
    );

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Cascader
        label="Destination"
        options={locations}
        value={["eu", "de", "berlin"]}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent(
      "Europe / Germany / Berlin"
    );

    await user.click(trigger);

    expect(
      screen.getByRole("option", {
        name: "Berlin",
      })
    ).toHaveAttribute("aria-selected", "true");

    await user.click(
      screen.getByRole("option", {
        name: "Munich",
      })
    );

    expect(onChange).toHaveBeenCalledWith(
      ["eu", "de", "munich"],
      expect.objectContaining({
        value: "munich",
      })
    );

    /* The parent has not echoed the new value yet. */
    expect(trigger).toHaveTextContent(
      "Europe / Germany / Berlin"
    );
  });

  it("supports an uncontrolled default value", () => {
    render(
      <Cascader
        label="Destination"
        options={locations}
        defaultValue={["na", "us", "nyc"]}
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveTextContent(
      "North America / United States / New York"
    );
  });

  it("navigates columns with the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Cascader
        label="Destination"
        options={locations}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);

    await user.keyboard(
      "{ArrowRight}{ArrowRight}{Enter}"
    );

    expect(onChange).toHaveBeenCalledWith(
      ["eu", "fr", "paris"],
      expect.objectContaining({
        value: "paris",
      })
    );

    expect(trigger).toHaveTextContent(
      "Europe / France / Paris"
    );
  });

  it("collapses a column with ArrowLeft", async () => {
    const user = userEvent.setup();

    render(
      <Cascader
        label="Destination"
        options={locations}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.keyboard("{ArrowRight}{ArrowRight}");

    expect(
      screen.getByRole("option", {
        name: "Paris",
      })
    ).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");

    expect(
      screen.queryByRole("option", {
        name: "Paris",
      })
    ).toBeNull();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();

    render(
      <Cascader
        label="Destination"
        options={locations}
      />
    );

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("clears the selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Cascader
        label="Destination"
        options={locations}
        defaultValue={["eu", "fr", "lyon"]}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent(
      "Europe / France / Lyon"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Clear selection",
      })
    );

    expect(trigger).toHaveTextContent(
      "Select an option"
    );

    expect(onChange).toHaveBeenCalledWith(
      [],
      undefined
    );
  });

  it("expands a branch on hover", async () => {
    const user = userEvent.setup();

    render(
      <Cascader
        label="Destination"
        options={locations}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.hover(
      screen.getByRole("option", {
        name: "Europe",
      })
    );

    expect(
      screen.getByRole("option", {
        name: "Germany",
      })
    ).toBeInTheDocument();
  });

  it("supports the disabled state", async () => {
    const user = userEvent.setup();

    render(
      <Cascader
        label="Destination"
        options={locations}
        disabled
      />
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });
});
