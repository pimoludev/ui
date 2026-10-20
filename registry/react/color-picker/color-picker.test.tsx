import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ColorPicker } from "./color-picker";

afterEach(() => {
  vi.useRealTimers();
});

function getTrigger(name: string) {
  return screen.getByRole("button", { name });
}

function open(name = "Brand color #5B55E7") {
  fireEvent.click(getTrigger(name));
}

describe("Pimolu ColorPicker", () => {
  it("renders the default color and opens a named dialog", () => {
    render(<ColorPicker label="Brand color" />);

    const trigger = getTrigger("Brand color #5B55E7");

    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    open();

    expect(
      screen.getByRole("dialog", {
        name: "Brand color picker",
      })
    ).toHaveClass("pimolu-color-picker__panel");

    expect(
      screen.getByLabelText("Pick a color")
    ).toHaveValue("#5b55e7");

    expect(
      screen.getByLabelText("Hex color")
    ).toHaveValue("#5B55E7");

    expect(
      screen.getAllByRole("button", {
        name: /^Use color/,
      })
    ).toHaveLength(24);
  });

  it("selects a preset, normalizes it and returns focus", () => {
    vi.useFakeTimers();

    const onValueChange = vi.fn();

    render(
      <ColorPicker
        label="Brand color"
        presets={["#112233", "#abcdef"]}
        onValueChange={onValueChange}
      />
    );

    open();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Use color #112233",
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith(
      "#112233"
    );

    const trigger = getTrigger("Brand color #112233");

    expect(trigger).toHaveFocus();

    /* The closing panel still exposes the normalized preset name. */
    expect(
      screen.getByRole("button", {
        name: "Use color #ABCDEF",
      })
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("follows the value prop when controlled", () => {
    const onValueChange = vi.fn();

    const { rerender } = render(
      <ColorPicker
        label="Accent"
        value="#000000"
        presets={["#FFFFFF"]}
        onValueChange={onValueChange}
      />
    );

    open("Accent #000000");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Use color #FFFFFF",
      })
    );

    expect(onValueChange).toHaveBeenCalledWith("#FFFFFF");

    /* The parent has not accepted the change yet. */
    expect(
      getTrigger("Accent #000000")
    ).toBeInTheDocument();

    rerender(
      <ColorPicker
        label="Accent"
        value="#FFFFFF"
        presets={["#FFFFFF"]}
        onValueChange={onValueChange}
      />
    );

    expect(
      getTrigger("Accent #FFFFFF")
    ).toBeInTheDocument();
  });

  it("normalizes a three-digit hex value typed on Enter", () => {
    const onValueChange = vi.fn();

    render(
      <ColorPicker
        label="Accent"
        onValueChange={onValueChange}
      />
    );

    open("Accent #5B55E7");

    const hex = screen.getByLabelText("Hex color");

    fireEvent.change(hex, {
      target: { value: "#abc" },
    });

    /* Short values commit on Enter or blur, not on every keystroke. */
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.keyDown(hex, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith("#AABBCC");

    expect(
      getTrigger("Accent #AABBCC")
    ).toBeInTheDocument();

    expect(hex).toHaveValue("#AABBCC");
  });

  it("rejects an invalid hex value and clears the error when fixed", () => {
    const onValueChange = vi.fn();

    render(
      <ColorPicker
        label="Accent"
        onValueChange={onValueChange}
      />
    );

    open("Accent #5B55E7");

    const hex = screen.getByLabelText("Hex color");

    fireEvent.change(hex, {
      target: { value: "not-a-color" },
    });

    fireEvent.keyDown(hex, { key: "Enter" });

    expect(onValueChange).not.toHaveBeenCalled();

    expect(hex).toHaveAttribute("aria-invalid", "true");

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Use a 3- or 6-digit hex color, for example #5B55E7."
    );

    fireEvent.change(hex, {
      target: { value: "#123456" },
    });

    expect(onValueChange).toHaveBeenCalledWith("#123456");

    expect(
      screen.queryByRole("alert")
    ).toBeNull();
  });

  it("normalizes the native color input", () => {
    const onValueChange = vi.fn();

    render(
      <ColorPicker
        label="Accent"
        onValueChange={onValueChange}
      />
    );

    open("Accent #5B55E7");

    fireEvent.change(
      screen.getByLabelText("Pick a color"),
      { target: { value: "#ff8800" } }
    );

    expect(onValueChange).toHaveBeenCalledWith("#FF8800");

    expect(
      getTrigger("Accent #FF8800")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Hex color")
    ).toHaveValue("#FF8800");
  });

  it("closes on Escape or an outside pointerdown and returns focus on Escape", () => {
    vi.useFakeTimers();

    render(<ColorPicker label="Accent" />);

    const trigger = getTrigger("Accent #5B55E7");

    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", {
        name: "Accent picker",
      })
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveFocus();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", {
        name: "Accent picker",
      })
    ).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("never opens while disabled", () => {
    render(<ColorPicker label="Accent" disabled />);

    const trigger = getTrigger("Accent #5B55E7");

    expect(trigger).toBeDisabled();

    fireEvent.click(trigger);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens read-only without allowing changes", () => {
    const onValueChange = vi.fn();

    render(
      <ColorPicker
        label="Accent"
        readOnly
        presets={["#FFFFFF"]}
        onValueChange={onValueChange}
      />
    );

    const trigger = getTrigger("Accent #5B55E7");

    expect(trigger).toHaveAttribute(
      "aria-readonly",
      "true"
    );

    open("Accent #5B55E7");

    const preset = screen.getByRole("button", {
      name: "Use color #FFFFFF",
    });

    expect(preset).toBeDisabled();

    expect(
      screen.getByLabelText("Pick a color")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Hex color")
    ).toHaveAttribute("readonly");

    fireEvent.click(preset);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("exposes the size, the external error and custom presets", () => {
    const { container } = render(
      <ColorPicker
        label="Accent"
        size="lg"
        error="Choose a brand color."
        presets={["#123456", "not-a-color"]}
      />
    );

    expect(
      container.querySelector(".pimolu-color-picker")
    ).toHaveClass(
      "pimolu-color-picker--lg",
      "pimolu-color-picker--invalid"
    );

    const trigger = getTrigger("Accent #5B55E7");

    expect(trigger).toHaveAttribute("aria-invalid", "true");

    expect(
      screen.getByText("Choose a brand color.")
    ).toHaveAttribute("role", "alert");

    fireEvent.click(trigger);

    expect(
      screen.getAllByRole("button", {
        name: /^Use color/,
      })
    ).toHaveLength(1);
  });
});
