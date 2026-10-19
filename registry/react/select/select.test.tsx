
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Select } from "./select";

describe("Pimolu Select", () => {
  it("renders a native combobox", () => {
    render(
      <Select label="Framework">
        <option value="react">React</option>
        <option value="angular">Angular</option>
      </Select>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    expect(field.tagName).toBe("SELECT");

    expect(field.closest(".pimolu-select")).toHaveClass(
      "pimolu-select--md",
      "pimolu-select--neutral",
      "pimolu-select--outline"
    );
  });

  it("supports an uncontrolled default value", () => {
    render(
      <Select
        label="Framework"
        defaultValue="angular"
      >
        <option value="react">React</option>
        <option value="angular">Angular</option>
      </Select>
    );

    expect(
      screen.getByRole("combobox", {
        name: "Framework",
      })
    ).toHaveValue("angular");
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();

    function Example() {
      const [framework, setFramework] =
        useState("react");

      return (
        <Select
          label="Framework"
          value={framework}
          onValueChange={setFramework}
        >
          <option value="react">React</option>
          <option value="angular">Angular</option>
        </Select>
      );
    }

    render(<Example />);

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    await user.selectOptions(field, "angular");

    expect(field).toHaveValue("angular");
  });

  it("calls both change callbacks", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Select
        label="Framework"
        defaultValue="react"
        onChange={onChange}
        onValueChange={onValueChange}
      >
        <option value="react">React</option>
        <option value="angular">Angular</option>
      </Select>
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Framework",
      }),
      "angular"
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "angular"
    );

    expect(onChange).toHaveBeenCalledOnce();
  });

  it("supports a required placeholder", async () => {
    const user = userEvent.setup();

    render(
      <Select
        label="Framework"
        placeholder="Choose..."
        required
      >
        <option value="react">React</option>
      </Select>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    }) as HTMLSelectElement;

    expect(field).toHaveValue("");
    expect(field.checkValidity()).toBe(false);

    const placeholder = screen.getByRole("option", {
      name: "Choose...",
    });

    expect(placeholder).toBeDisabled();

    await user.selectOptions(field, "react");

    expect(field.checkValidity()).toBe(true);
  });

  it("allows clearing an optional selection", async () => {
    const user = userEvent.setup();

    render(
      <Select
        label="Framework"
        placeholder="No preference"
        defaultValue="react"
      >
        <option value="react">React</option>
      </Select>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    await user.selectOptions(field, "");

    expect(field).toHaveValue("");
    expect(
      screen.getByRole("option", {
        name: "No preference",
      })
    ).not.toBeDisabled();
  });

  it("supports optgroups", () => {
    render(
      <Select label="Technology">
        <optgroup label="UI libraries">
          <option value="react">React</option>
          <option value="vue">Vue</option>
        </optgroup>

        <optgroup label="Frameworks">
          <option value="nextjs">Next.js</option>
        </optgroup>
      </Select>
    );

    expect(
      screen.getByRole("option", {
        name: "Next.js",
      })
    ).toBeInTheDocument();
  });

  it("supports native FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <Select
          label="Framework"
          name="framework"
          placeholder="Choose..."
        >
          <option value="react">React</option>
          <option value="angular">Angular</option>
        </Select>
      </form>
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Framework",
      }),
      "angular"
    );

    const form = screen.getByRole("form", {
      name: "Preferences",
    }) as HTMLFormElement;

    expect(
      new FormData(form).get("framework")
    ).toBe("angular");
  });

  it("supports native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Select
          label="Framework"
          defaultValue="react"
        >
          <option value="react">React</option>
          <option value="angular">Angular</option>
        </Select>

        <button type="reset">Reset</button>
      </form>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    await user.selectOptions(field, "angular");
    expect(field).toHaveValue("angular");

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(field).toHaveValue("react");
  });

  it("connects helper text", () => {
    render(
      <Select
        label="Framework"
        helperText="Choose your preferred framework."
      >
        <option value="react">React</option>
      </Select>
    );

    expect(
      screen.getByRole("combobox", {
        name: "Framework",
      })
    ).toHaveAccessibleDescription(
      "Choose your preferred framework."
    );
  });

  it("shows errors accessibly", () => {
    render(
      <Select
        label="Framework"
        helperText="Choose a technology."
        errorMessage="A framework is required."
      >
        <option value="react">React</option>
      </Select>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    expect(field).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(field).toHaveAccessibleDescription(
      "A framework is required."
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "A framework is required."
    );
  });

  it("preserves external descriptions", () => {
    render(
      <>
        <p id="external-hint">External hint.</p>

        <Select
          label="Framework"
          helperText="Additional details."
          aria-describedby="external-hint"
        >
          <option value="react">React</option>
        </Select>
      </>
    );

    expect(
      screen.getByRole("combobox", {
        name: "Framework",
      })
    ).toHaveAccessibleDescription(
      "External hint. Additional details."
    );
  });

  it("supports disabled state", () => {
    render(
      <Select
        label="Unavailable"
        name="unavailable"
        disabled
      >
        <option value="react">React</option>
      </Select>
    );

    expect(
      screen.getByRole("combobox", {
        name: "Unavailable",
      })
    ).toBeDisabled();
  });

  it("supports visual customization", () => {
    render(
      <Select
        label="Framework"
        size="xl"
        variant="success"
        appearance="glass"
        fullWidth
        className="custom-control"
        containerClassName="custom-container"
      >
        <option value="react">React</option>
      </Select>
    );

    const field = screen.getByRole("combobox", {
      name: "Framework",
    });

    expect(field).toHaveClass(
      "pimolu-select__control",
      "custom-control"
    );

    expect(field.closest(".pimolu-select")).toHaveClass(
      "pimolu-select--xl",
      "pimolu-select--success",
      "pimolu-select--glass",
      "pimolu-select--full-width",
      "custom-container"
    );
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLSelectElement>();

    render(
      <Select label="Framework" ref={ref}>
        <option value="react">React</option>
      </Select>
    );

    expect(ref.current?.tagName).toBe("SELECT");
  });

  it("supports aria-label without visible label", () => {
    render(
      <Select aria-label="Choose a framework">
        <option value="react">React</option>
      </Select>
    );

    expect(
      screen.getByRole("combobox", {
        name: "Choose a framework",
      })
    ).toBeInTheDocument();
  });
});
