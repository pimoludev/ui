
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
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Pimolu Checkbox", () => {
  it("renders with default properties", () => {
    render(<Checkbox label="Notifications" />);

    const checkbox = screen.getByRole("checkbox", {
      name: "Notifications",
    });

    expect(checkbox).not.toBeChecked();

    expect(
      checkbox.closest(".pimolu-checkbox")
    ).toHaveClass(
      "pimolu-checkbox--md",
      "pimolu-checkbox--primary"
    );
  });

  it("supports defaultChecked", () => {
    render(
      <Checkbox label="Updates" defaultChecked />
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Updates",
      })
    ).toBeChecked();
  });

  it("supports uncontrolled changes", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Terms"
        onChange={onChange}
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Terms",
    });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports controlled state", async () => {
    const user = userEvent.setup();

    function Example() {
      const [checked, setChecked] = useState(false);

      return (
        <Checkbox
          label="Controlled"
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    }

    render(<Example />);

    const checkbox = screen.getByRole("checkbox", {
      name: "Controlled",
    });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it("supports indeterminate state", () => {
    render(
      <Checkbox
        label="Select all"
        indeterminate
      />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Select all",
    }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.checked).toBe(false);
  });

  it("leaves mixed state after a controlled change", async () => {
    const user = userEvent.setup();

    function Example() {
      const [mixed, setMixed] = useState(true);
      const [checked, setChecked] = useState(false);

      return (
        <Checkbox
          label="Select all"
          indeterminate={mixed}
          checked={checked}
          onCheckedChange={(next) => {
            setMixed(false);
            setChecked(next);
          }}
        />
      );
    }

    render(<Example />);

    const checkbox = screen.getByRole("checkbox", {
      name: "Select all",
    }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);

    await user.click(checkbox);

    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox).toBeChecked();
  });

  it("supports keyboard interaction", async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Enable sync" />);

    const checkbox = screen.getByRole("checkbox", {
      name: "Enable sync",
    });

    await user.tab();

    expect(checkbox).toHaveFocus();

    await user.keyboard(" ");

    expect(checkbox).toBeChecked();
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Unavailable"
        disabled
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Unavailable",
    });

    expect(checkbox).toBeDisabled();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("supports required validation", async () => {
    const user = userEvent.setup();

    render(
      <Checkbox label="Accept terms" required />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Accept terms",
    }) as HTMLInputElement;

    expect(checkbox.checkValidity()).toBe(false);

    await user.click(checkbox);

    expect(checkbox.checkValidity()).toBe(true);
  });

  it("supports native FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <Checkbox
          label="Updates"
          name="updates"
          value="enabled"
        />
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Preferences",
    }) as HTMLFormElement;

    expect(new FormData(form).has("updates")).toBe(false);

    await user.click(
      screen.getByRole("checkbox", {
        name: "Updates",
      })
    );

    expect(new FormData(form).get("updates")).toBe("enabled");
  });

  it("supports native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Checkbox
          label="Updates"
          defaultChecked
        />

        <button type="reset">Reset</button>
      </form>
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Updates",
    });

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(checkbox).toBeChecked();
  });

  it("connects label and description", () => {
    render(
      <Checkbox
        label="Analytics"
        description="Help improve Pimolu."
      />
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Analytics",
      })
    ).toHaveAccessibleDescription(
      "Help improve Pimolu."
    );
  });

  it("supports aria-label without visible text", () => {
    render(
      <Checkbox aria-label="Select row" />
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Select row",
      })
    ).toBeInTheDocument();
  });

  it("applies custom size and variant", () => {
    render(
      <Checkbox
        label="Feature"
        size="lg"
        variant="success"
      />
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Feature",
      }).closest(".pimolu-checkbox")
    ).toHaveClass(
      "pimolu-checkbox--lg",
      "pimolu-checkbox--success"
    );
  });

  it("forwards its ref to the native input", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Checkbox label="Feature" ref={ref} />
    );

    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("checkbox");
  });
});
