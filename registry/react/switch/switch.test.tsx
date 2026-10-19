
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

import { Switch } from "./switch";

describe("Pimolu Switch", () => {
  it("renders with default properties", () => {
    render(<Switch label="Notifications" />);

    const control = screen.getByRole("switch", {
      name: "Notifications",
    });

    expect(control).not.toBeChecked();

    expect(
      control.closest(".pimolu-switch")
    ).toHaveClass(
      "pimolu-switch--md",
      "pimolu-switch--primary"
    );
  });

  it("supports defaultChecked", () => {
    render(
      <Switch label="Notifications" defaultChecked />
    );

    expect(
      screen.getByRole("switch", {
        name: "Notifications",
      })
    ).toBeChecked();
  });

  it("supports uncontrolled changes", async () => {
    const user = userEvent.setup();

    const onCheckedChange = vi.fn();
    const onChange = vi.fn();

    render(
      <Switch
        label="Notifications"
        onCheckedChange={onCheckedChange}
        onChange={onChange}
      />
    );

    const control = screen.getByRole("switch", {
      name: "Notifications",
    });

    await user.click(control);

    expect(control).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    await user.click(control);

    expect(control).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports controlled state", async () => {
    const user = userEvent.setup();

    function ControlledExample() {
      const [enabled, setEnabled] = useState(false);

      return (
        <Switch
          label="Dark mode"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      );
    }

    render(<ControlledExample />);

    const control = screen.getByRole("switch", {
      name: "Dark mode",
    });

    expect(control).not.toBeChecked();

    await user.click(control);

    expect(control).toBeChecked();

    await user.click(control);

    expect(control).not.toBeChecked();
  });

  it("supports keyboard interaction", async () => {
    const user = userEvent.setup();

    render(<Switch label="Auto updates" />);

    const control = screen.getByRole("switch", {
      name: "Auto updates",
    });

    await user.tab();

    expect(control).toHaveFocus();

    await user.keyboard(" ");

    expect(control).toBeChecked();
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        label="Disabled feature"
        disabled
        onCheckedChange={onCheckedChange}
      />
    );

    const control = screen.getByRole("switch", {
      name: "Disabled feature",
    });

    expect(control).toBeDisabled();

    await user.click(control);

    expect(control).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("supports required validation", async () => {
    const user = userEvent.setup();

    render(
      <Switch
        label="Accept settings"
        required
      />
    );

    const control = screen.getByRole("switch", {
      name: "Accept settings",
    }) as HTMLInputElement;

    expect(control).toBeRequired();
    expect(control.checkValidity()).toBe(false);

    await user.click(control);

    expect(control.checkValidity()).toBe(true);
  });

  it("supports native FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <Switch
          label="Notifications"
          name="notifications"
          value="enabled"
        />
      </form>
    );

    const control = screen.getByRole("switch", {
      name: "Notifications",
    });

    const form = screen.getByRole("form", {
      name: "Preferences",
    }) as HTMLFormElement;

    expect(
      new FormData(form).has("notifications")
    ).toBe(false);

    await user.click(control);

    expect(
      new FormData(form).get("notifications")
    ).toBe("enabled");
  });

  it("supports native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Switch
          label="Notifications"
          defaultChecked
        />

        <button type="reset">
          Reset
        </button>
      </form>
    );

    const control = screen.getByRole("switch", {
      name: "Notifications",
    });

    await user.click(control);

    expect(control).not.toBeChecked();

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(control).toBeChecked();
  });

  it("connects label and description", () => {
    render(
      <Switch
        label="Notifications"
        description="Receive important updates."
      />
    );

    const control = screen.getByRole("switch", {
      name: "Notifications",
    });

    expect(control).toHaveAccessibleDescription(
      "Receive important updates."
    );
  });

  it("preserves external aria-describedby", () => {
    render(
      <>
        <p id="custom-hint">External description.</p>

        <Switch
          label="Sync"
          description="Sync automatically."
          aria-describedby="custom-hint"
        />
      </>
    );

    const control = screen.getByRole("switch", {
      name: "Sync",
    });

    expect(control).toHaveAccessibleDescription(
      "External description. Sync automatically."
    );
  });

  it("supports aria-label without visible text", () => {
    render(
      <Switch aria-label="Enable feature" />
    );

    expect(
      screen.getByRole("switch", {
        name: "Enable feature",
      })
    ).toBeInTheDocument();
  });

  it("supports custom sizes and variants", () => {
    render(
      <Switch
        label="Status"
        size="lg"
        variant="success"
      />
    );

    expect(
      screen.getByRole("switch", {
        name: "Status",
      }).closest(".pimolu-switch")
    ).toHaveClass(
      "pimolu-switch--lg",
      "pimolu-switch--success"
    );
  });

  it("forwards its ref to the native input", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Switch
        label="Feature"
        ref={ref}
      />
    );

    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current).toHaveAttribute(
      "type",
      "checkbox"
    );
    expect(ref.current).toHaveAttribute(
      "role",
      "switch"
    );
  });
});
