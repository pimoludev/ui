
import {
  createRef,
  useState,
} from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Combobox } from "./combobox";

const options = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  {
    value: "angular",
    label: "Angular",
    disabled: true,
  },
  {
    value: "vue",
    label: "Vue",
    keywords: ["javascript"],
  },
];

describe("Pimolu Combobox", () => {
  it("renders an accessible combobox", () => {
    render(
      <Combobox
        label="Framework"
        options={options}
      />
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    expect(field).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(field).toHaveAttribute(
      "aria-autocomplete",
      "list"
    );
  });

  it("opens the list on focus", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
      />
    );

    await user.click(
      screen.getByRole("combobox", {
        name: "Framework",
      })
    );

    expect(
      screen.getByRole("listbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox")
    ).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("filters options by their labels", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
      />
    );

    const field = screen.getByRole("combobox");

    await user.type(field, "vue");

    expect(
      screen.getByRole("option", {
        name: "Vue",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: "React",
      })
    ).toBeNull();
  });

  it("filters by keywords", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "javascript"
    );

    expect(
      screen.getByRole("option", {
        name: "Vue",
      })
    ).toBeInTheDocument();
  });

  it("ignores accents when searching", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Language"
        options={[
          {
            value: "fr",
            label: "Français",
          },
          {
            value: "en",
            label: "English",
          },
        ]}
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "francais"
    );

    expect(
      screen.getByRole("option", {
        name: "Français",
      })
    ).toBeInTheDocument();
  });

  it("selects an option with the mouse", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox
        label="Framework"
        options={options}
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.click(
      screen.getByRole("option", {
        name: "React",
      })
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveValue("React");

    expect(onValueChange).toHaveBeenCalledWith(
      "react"
    );

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("skips disabled options with the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
      />
    );

    const field = screen.getByRole("combobox");

    await user.click(field);

    // Initially React is active.
    // ArrowDown moves to Next.js.
    await user.keyboard("{ArrowDown}");

    // Angular is disabled, so next is Vue.
    await user.keyboard("{ArrowDown}{Enter}");

    expect(field).toHaveValue("Vue");
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox
        label="Framework"
        options={options}
        onValueChange={onValueChange}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.click(
      screen.getByRole("option", {
        name: "Angular",
      })
    );

    expect(onValueChange).not.toHaveBeenCalled();

    expect(
      screen.getByRole("combobox")
    ).toHaveValue("");
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] =
        useState("react");

      return (
        <Combobox
          label="Framework"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<Example />);

    const field = screen.getByRole("combobox");

    expect(field).toHaveValue("React");

    await user.click(field);

    await user.click(
      screen.getByRole("option", {
        name: "Vue",
      })
    );

    expect(field).toHaveValue("Vue");
  });

  it("supports a clear button", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
        defaultValue="react"
        clearable
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveValue("React");

    await user.click(
      screen.getByRole("button", {
        name: "Clear selection",
      })
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveValue("");
  });

  it("shows the empty message", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
        emptyMessage="Aucun résultat."
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "unknownvalue"
    );

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Aucun résultat.");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
      />
    );

    const field = screen.getByRole("combobox");

    await user.click(field);

    await user.keyboard("{Escape}");

    expect(field).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Combobox
          label="Framework"
          options={options}
        />

        <button type="button">
          Outside
        </button>
      </>
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.click(
      screen.getByRole("button", {
        name: "Outside",
      })
    );

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("submits the selected value with FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <Combobox
          label="Framework"
          name="framework"
          options={options}
        />
      </form>
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.click(
      screen.getByRole("option", {
        name: "Next.js",
      })
    );

    const form = screen.getByRole("form", {
      name: "Preferences",
    }) as HTMLFormElement;

    expect(
      new FormData(form).get("framework")
    ).toBe("nextjs");
  });

  it("validates a required selection", async () => {
    const user = userEvent.setup();

    render(
      <Combobox
        label="Framework"
        options={options}
        required
      />
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    }) as HTMLInputElement;

    await waitFor(() => {
      expect(field.checkValidity()).toBe(false);
    });

    await user.click(field);

    await user.click(
      screen.getByRole("option", {
        name: "React",
      })
    );

    await waitFor(() => {
      expect(field.checkValidity()).toBe(true);
    });
  });

  it("resets an uncontrolled selection", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Combobox
          name="framework"
          label="Framework"
          options={options}
          defaultValue="react"
        />

        <button type="reset">Reset</button>
      </form>
    );

    const field = screen.getByRole("combobox");

    await user.click(field);

    await user.click(
      screen.getByRole("option", {
        name: "Vue",
      })
    );

    expect(field).toHaveValue("Vue");

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(field).toHaveValue("React");
  });

  it("supports disabled state", async () => {
    render(
      <Combobox
        label="Framework"
        options={options}
        disabled
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toBeDisabled();

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("connects its accessible description", () => {
    render(
      <Combobox
        label="Framework"
        helperText="Select a technology."
        options={options}
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveAccessibleDescription(
      "Select a technology."
    );
  });

  it("forwards its ref to the native input", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Combobox
        ref={ref}
        label="Framework"
        options={options}
      />
    );

    expect(ref.current?.tagName).toBe("INPUT");
  });
});
