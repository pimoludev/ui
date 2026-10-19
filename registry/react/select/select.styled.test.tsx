
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./select";

/* The API is a list of <option> children, so the test spreads literal
   elements: a wrapper component would hide them from the parser. */
const options = [
  <option key="react" value="react">
    React
  </option>,
  <option key="vue" value="vue">
    Vue
  </option>,
  <option key="angular" value="angular" disabled>
    Angular
  </option>,
  <option key="svelte" value="svelte">
    Svelte
  </option>,
];

describe("Pimolu Select (styled)", () => {
  it("renders a combobox trigger with a native fallback in the form", () => {
    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox", {
      name: "Framework",
    });

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "listbox"
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    /* The native control stays for submission, out of the a11y tree. */
    const native = document.querySelector("select") as HTMLSelectElement;

    expect(native).toHaveValue("react");
    expect(native).toHaveAttribute("aria-hidden", "true");
  });

  it("opens the listbox on click", async () => {
    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox");

    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("selects an option on pointer down", async () => {
    const onValueChange = vi.fn();

    render(
      <Select label="Framework" onValueChange={onValueChange}>
        {options}
      </Select>
    );

    await userEvent
      .setup()
      .click(screen.getByRole("combobox"));

    fireEvent.pointerDown(
      screen.getByRole("option", { name: "Vue" })
    );

    expect(onValueChange).toHaveBeenLastCalledWith("vue");

    /* Closed again, label updated, focus back on the trigger. */
    expect(screen.queryByRole("listbox")).toBeNull();

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Vue");
    expect(trigger).toHaveFocus();
  });

  it("supports controlled selection", async () => {
    const onValueChange = vi.fn();

    render(
      <Select
        label="Framework"
        value="svelte"
        onValueChange={onValueChange}
      >
        {options}
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Svelte"
    );

    await userEvent.setup().click(screen.getByRole("combobox"));

    fireEvent.pointerDown(
      screen.getByRole("option", { name: "React" })
    );

    expect(onValueChange).toHaveBeenLastCalledWith("react");

    /* Controlled: the parent owns the value, so the label stays. */
    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Svelte"
    );
  });

  it("navigates with the keyboard", async () => {
    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);

    /* Opens on the selection, then moves to the next option. */
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Vue"
    );

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("skips disabled options", async () => {
    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);

    /* React → Vue → Angular (disabled, skipped) → Svelte. */
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(trigger).toHaveTextContent("Svelte");
  });

  it("moves the active option with a first letter", async () => {
    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);
    await user.keyboard("v");
    await user.keyboard("{Enter}");

    expect(trigger).toHaveTextContent("Vue");
  });

  it("closes on Escape without changing the value", async () => {
    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox");

    await user.click(trigger);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("React");
  });

  it("shows the placeholder until a choice is made", async () => {
    const user = userEvent.setup();

    render(
      <Select label="Framework" placeholder="Choose one">
        {options}
      </Select>
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent("Choose one");

    await user.click(trigger);

    fireEvent.pointerDown(
      screen.getByRole("option", { name: "React" })
    );

    expect(trigger).toHaveTextContent("React");
  });

  it("submits the selected value", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Settings">
        <Select label="Framework" name="framework">
          {options}
        </Select>
      </form>
    );

    await user.click(screen.getByRole("combobox"));

    fireEvent.pointerDown(
      screen.getByRole("option", { name: "Vue" })
    );

    const form = screen.getByRole("form", {
      name: "Settings",
    }) as HTMLFormElement;

    expect(new FormData(form).get("framework")).toBe("vue");
  });

  it("follows a native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Settings">
        <Select label="Framework" defaultValue="vue">
          {options}
        </Select>

        <button type="reset">Reset</button>
      </form>
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent("Vue");

    await user.click(trigger);

    fireEvent.pointerDown(
      screen.getByRole("option", { name: "Svelte" })
    );

    expect(trigger).toHaveTextContent("Svelte");

    await user.click(
      screen.getByRole("button", { name: "Reset" })
    );

    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Vue"
    );
  });

  it("keeps the native control behind the native prop", () => {
    render(
      <Select native label="Framework">
        {options}
      </Select>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    expect(field.tagName).toBe("SELECT");
  });
});
