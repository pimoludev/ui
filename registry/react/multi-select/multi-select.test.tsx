
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

import { MultiSelect } from "./multi-select";

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
    keywords: ["JavaScript"],
  },
];

describe("Pimolu MultiSelect", () => {
  it("renders an accessible combobox", () => {
    render(
      <MultiSelect
        label="Frameworks"
        options={options}
      />
    );

    const input = screen.getByRole("combobox", {
      name: "Frameworks",
    });

    expect(input).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(input).toHaveAttribute(
      "aria-autocomplete",
      "list"
    );
  });

  it("opens a multiselect listbox", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    expect(
      screen.getByRole("listbox")
    ).toHaveAttribute(
      "aria-multiselectable",
      "true"
    );
  });

  it("supports default values", () => {
    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react", "nextjs"]}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Remove React",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Remove Next.js",
      })
    ).toBeInTheDocument();
  });

  it("supports multiple selections", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiSelect
        label="Frameworks"
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

    await user.click(
      screen.getByRole("option", {
        name: "Next.js",
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith([
      "react",
      "nextjs",
    ]);

    expect(
      screen.getByRole("button", {
        name: "Remove React",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Remove Next.js",
      })
    ).toBeInTheDocument();
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] =
        useState<string[]>(["react"]);

      return (
        <MultiSelect
          label="Frameworks"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<Example />);

    await user.click(
      screen.getByRole("combobox")
    );

    await user.click(
      screen.getByRole("option", {
        name: "Vue",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Remove Vue",
      })
    ).toBeInTheDocument();
  });

  it("filters without removing existing selections", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react"]}
      />
    );

    await user.type(
      screen.getByRole("combobox"),
      "Vue"
    );

    expect(
      screen.getByRole("option", {
        name: "Vue",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Remove React",
      })
    ).toBeInTheDocument();
  });

  it("searches using keywords", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
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

  it("searches without accents", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Languages"
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

  it("skips disabled options with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
      />
    );

    const input = screen.getByRole("combobox");

    await user.click(input);

    await user.keyboard(
      "{ArrowDown}{ArrowDown}{Enter}"
    );

    expect(
      screen.getByRole("button", {
        name: "Remove Vue",
      })
    ).toBeInTheDocument();
  });

  it("cannot select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiSelect
        label="Frameworks"
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
  });

  it("toggles a selected option off", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react"]}
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
      screen.queryByRole("button", {
        name: "Remove React",
      })
    ).toBeNull();
  });

  it("removes a tag with its button", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react", "nextjs"]}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Remove React",
      })
    );

    expect(
      screen.queryByRole("button", {
        name: "Remove React",
      })
    ).toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Remove Next.js",
      })
    ).toBeInTheDocument();
  });

  it("removes the last tag with Backspace", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react", "nextjs"]}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.keyboard("{Backspace}");

    expect(
      screen.queryByRole("button", {
        name: "Remove Next.js",
      })
    ).toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Remove React",
      })
    ).toBeInTheDocument();
  });

  it("respects maxSelected", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        maxSelected={1}
        defaultValue={["react"]}
      />
    );

    await user.click(
      screen.getByRole("combobox")
    );

    expect(
      screen.getByRole("option", {
        name: "Next.js",
      })
    ).toHaveAttribute(
      "aria-disabled",
      "true"
    );

    await user.click(
      screen.getByRole("option", {
        name: "Next.js",
      })
    );

    expect(
      screen.queryByRole("button", {
        name: "Remove Next.js",
      })
    ).toBeNull();
  });

  it("clears all selections", async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react", "nextjs"]}
        clearable
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Clear all selections",
      })
    );

    expect(
      screen.queryByRole("button", {
        name: "Remove React",
      })
    ).toBeNull();

    expect(
      screen.queryByRole("button", {
        name: "Remove Next.js",
      })
    ).toBeNull();
  });

  it("submits multiple values with FormData", () => {
    render(
      <form aria-label="Preferences">
        <MultiSelect
          name="frameworks"
          label="Frameworks"
          options={options}
          defaultValue={["react", "nextjs"]}
        />
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Preferences",
    }) as HTMLFormElement;

    expect(
      new FormData(form).getAll("frameworks")
    ).toEqual(["react", "nextjs"]);
  });

  it("validates required selections", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <MultiSelect
          name="frameworks"
          label="Frameworks"
          options={options}
          required
        />
      </form>
    );

    const input = screen.getByRole("combobox", {
      name: "Frameworks",
    }) as HTMLInputElement;

    await waitFor(() => {
      expect(input.checkValidity()).toBe(false);
    });

    await user.click(input);

    await user.click(
      screen.getByRole("option", {
        name: "React",
      })
    );

    await waitFor(() => {
      expect(input.checkValidity()).toBe(true);
    });
  });

  it("supports native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <MultiSelect
          name="frameworks"
          label="Frameworks"
          options={options}
          defaultValue={["react"]}
        />

        <button type="reset">
          Reset
        </button>
      </form>
    );

    await user.click(
      screen.getByRole("combobox")
    );

    await user.click(
      screen.getByRole("option", {
        name: "Vue",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Remove Vue",
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(
      screen.queryByRole("button", {
        name: "Remove Vue",
      })
    ).toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Remove React",
      })
    ).toBeInTheDocument();
  });

  it("closes on Escape and outside clicks", async () => {
    const user = userEvent.setup();

    render(
      <>
        <MultiSelect
          label="Frameworks"
          options={options}
        />

        <button type="button">
          Outside
        </button>
      </>
    );

    const input = screen.getByRole("combobox");

    await user.click(input);
    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();

    await user.click(input);

    await user.click(
      screen.getByRole("button", {
        name: "Outside",
      })
    );

    expect(
      screen.queryByRole("listbox")
    ).toBeNull();
  });

  it("preserves accessible descriptions", () => {
    render(
      <MultiSelect
        label="Frameworks"
        helperText="Choose your technologies."
        options={options}
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toHaveAccessibleDescription(
      /Choose your technologies/
    );
  });

  it("respects disabled state", () => {
    render(
      <MultiSelect
        label="Frameworks"
        options={options}
        defaultValue={["react"]}
        disabled
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Remove React",
      })
    ).toBeDisabled();
  });

  it("forwards its ref to the search input", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <MultiSelect
        ref={ref}
        label="Frameworks"
        options={options}
      />
    );

    expect(ref.current?.tagName).toBe("INPUT");
  });
});
