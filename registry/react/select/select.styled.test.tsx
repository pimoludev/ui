
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
  it("does not highlight or select options during a cancelled touch gesture", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select label="Framework" onValueChange={onValueChange}>{options}</Select>);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const active = trigger.getAttribute("aria-activedescendant");
    const vue = screen.getByRole("option", { name: "Vue" });
    const svelte = screen.getByRole("option", { name: "Svelte" });
    await user.pointer({ keys: "[TouchA>]", target: vue });
    await user.pointer({ pointerName: "TouchA", target: svelte });
    fireEvent.pointerCancel(svelte);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-activedescendant", active);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("retains mouse hover and click selection without committing on right click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select label="Framework" onValueChange={onValueChange}>{options}</Select>);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const vue = screen.getByRole("option", { name: "Vue" });
    await user.hover(vue);
    expect(trigger).toHaveAttribute("aria-activedescendant", vue.id);
    await user.pointer({ keys: "[MouseRight]", target: vue });
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(vue);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("vue");
    expect(trigger).toHaveFocus();
  });

  it("keeps a touch contact open until a completed tap selects exactly once", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select label="Framework" onValueChange={onValueChange}>{options}</Select>);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const option = screen.getByRole("option", { name: "Vue" });

    await user.pointer({ keys: "[TouchA>]", target: option });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).not.toHaveBeenCalled();
    await user.pointer({ keys: "[/TouchA]", target: option });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("vue");
    expect(trigger).toHaveTextContent("Vue");
    expect(trigger).toHaveFocus();
  });

  it("mounts the listbox in the trigger's nearest theme scope", async () => {
    render(
      <>
        <div data-pimolu-theme="light" data-testid="other-theme" />
        <div data-pimolu-theme="dark" data-testid="own-theme">
          <Select label="Framework">{options}</Select>
        </div>
      </>
    );

    await userEvent.setup().click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox").parentElement).toBe(
      screen.getByTestId("own-theme")
    );
  });

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

  it("forwards shared accessibility and data attributes to the styled trigger", () => {
    render(
      <Select
        label="Framework"
        aria-description="Choose a framework"
        data-testid="framework-trigger"
      >
        {options}
      </Select>
    );

    expect(screen.getByTestId("framework-trigger")).toHaveAttribute(
      "aria-description",
      "Choose a framework"
    );
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

  it("selects an option on a completed click", async () => {
    const onValueChange = vi.fn();

    render(
      <Select label="Framework" onValueChange={onValueChange}>
        {options}
      </Select>
    );

    await userEvent
      .setup()
      .click(screen.getByRole("combobox"));

    fireEvent.click(
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

    fireEvent.click(
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

    fireEvent.click(
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

    fireEvent.click(
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

    fireEvent.click(
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

  it("reads the options of an optgroup", async () => {
    const user = userEvent.setup();

    render(
      <Select label="Framework" defaultValue="react">
        <optgroup label="UI libraries">
          <option value="react">React</option>
          <option value="vue">Vue</option>
        </optgroup>

        <optgroup label="Frameworks">
          <option value="nextjs">Next.js</option>
        </optgroup>
      </Select>
    );

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveTextContent("React");

    await user.click(trigger);

    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByText("UI libraries")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("option", { name: "Next.js" })
    );

    expect(trigger).toHaveTextContent("Next.js");
  });

  it("reads the options wrapped in a fragment", async () => {
    const user = userEvent.setup();

    render(
      <Select label="Framework">
        <>
          <option value="react">React</option>
          <option value="vue">Vue</option>
        </>
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveTextContent(
      "React"
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("keeps the active option in view", async () => {
    const scrollIntoView = vi.fn();

    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}");

    expect(scrollIntoView).toHaveBeenLastCalledWith({
      block: "nearest",
    });
  });

  it("anchors the listbox under the trigger, above it when there is no room", async () => {
    const user = userEvent.setup();

    render(<Select label="Framework">{options}</Select>);

    const trigger = screen.getByRole("combobox");

    /* A trigger at the bottom of the viewport: nothing fits below. */
    trigger.getBoundingClientRect = () =>
      ({
        top: 700,
        bottom: 740,
        left: 40,
        right: 240,
        width: 200,
        height: 40,
        x: 40,
        y: 700,
        toJSON: () => ({}),
      }) as DOMRect;

    await user.click(trigger);

    const listbox = screen.getByRole("listbox");

    expect(listbox.style.position).toBe("fixed");

    /* Anchored by its bottom edge just above the trigger — not by a top
       value computed from the viewport origin. */
    expect(listbox.style.bottom).toBe(
      `${window.innerHeight - 700 + 4}px`
    );

    expect(listbox.style.top).toBe("");
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
