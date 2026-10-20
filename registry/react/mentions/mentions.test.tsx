
import { useState } from "react";

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

import { Mentions } from "./mentions";

const people = [
  {
    id: "alice",
    label: "Alice",
    description: "Product designer",
  },
  {
    id: "bob",
    label: "Bob",
    description: "Front-end engineer",
  },
  {
    id: "charlie",
    label: "Charlie",
    description: "Engineering manager",
  },
  {
    id: "dana",
    label: "Dana",
    description: "Data analyst",
  },
];

describe("Pimolu Mentions", () => {
  it("renders an accessible textarea", () => {
    render(
      <Mentions
        label="Message"
        options={people}
      />
    );

    const field = screen.getByRole("combobox", {
      name: "Message",
    });

    expect(field.tagName).toBe("TEXTAREA");
    expect(field).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(field).toHaveAttribute(
      "aria-autocomplete",
      "list"
    );
    expect(field).not.toHaveAttribute(
      "aria-activedescendant"
    );
  });

  it("opens only when the trigger is typed", async () => {
    const user = userEvent.setup();

    render(
      <Mentions
        label="Message"
        options={people}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "Hello team");

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();

    await user.type(field, " @a");

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: /Alice/,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: /Bob/,
      })
    ).toBeNull();
  });

  it("filters suggestions case-insensitively", async () => {
    const user = userEvent.setup();

    render(
      <Mentions
        label="Message"
        options={[
          {
            id: "fr",
            label: "Français",
          },
          {
            id: "en",
            label: "English",
          },
        ]}
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "@FRANCAIS"
    );

    expect(
      screen.getByRole("option", {
        name: /Français/,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: /English/,
      })
    ).toBeNull();
  });

  it("selects with ArrowDown and Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Mentions
        label="Message"
        options={people}
        onSelect={onSelect}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "Hello @");

    await user.keyboard("{ArrowDown}{Enter}");

    expect(field).toHaveValue("Hello @Bob ");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "bob",
        label: "Bob",
      })
    );

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("selects with Tab", async () => {
    const user = userEvent.setup();

    render(
      <Mentions
        label="Message"
        options={people}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "@");

    await user.keyboard("{Tab}");

    expect(field).toHaveValue("@Alice ");
  });

  it("closes on Escape without inserting", async () => {
    const user = userEvent.setup();

    render(
      <Mentions
        label="Message"
        options={people}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "@a");

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();

    expect(field).toHaveValue("@a");
    expect(field).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("supports several mentions in one text", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Mentions
        label="Message"
        options={people}
        onSelect={onSelect}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "Hi @Ali");
    await user.keyboard("{Enter}");

    await user.type(field, "and @Bo");
    await user.keyboard("{Enter}");

    expect(field).toHaveValue(
      "Hi @Alice and @Bob "
    );

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: "alice" })
    );
    expect(onSelect).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: "bob" })
    );
  });

  it("offers to create an unknown mention", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Mentions
        label="Message"
        options={people}
        allowCreate
        onSelect={onSelect}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "@newperson");

    await user.click(
      screen.getByRole("option", {
        name: /newperson/,
      })
    );

    expect(field).toHaveValue("@newperson ");
    expect(onSelect).toHaveBeenCalledWith({
      id: "newperson",
      label: "newperson",
    });
  });

  it("limits the number of suggestions", async () => {
    const user = userEvent.setup();

    render(
      <Mentions
        label="Message"
        options={people}
        maxSuggestions={2}
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "@"
    );

    expect(
      screen.getAllByRole("option")
    ).toHaveLength(2);
  });

  it("supports a custom trigger and a controlled value", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = useState("");

      return (
        <Mentions
          label="Channel"
          options={people}
          trigger="#"
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<Example />);

    const field = screen.getByRole("combobox");

    await user.type(field, "Go to #cha");

    await user.click(
      screen.getByRole("option", {
        name: /Charlie/,
      })
    );

    expect(field).toHaveValue(
      "Go to #Charlie "
    );
  });

  it("does not open for an email address", async () => {
    const user = userEvent.setup();

    render(
      <Mentions
        label="Message"
        options={people}
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "hello@alice"
    );

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("supports the disabled state", () => {
    render(
      <Mentions
        label="Message"
        options={people}
        disabled
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toBeDisabled();
  });
});
