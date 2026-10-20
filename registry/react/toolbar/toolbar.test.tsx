import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "./toolbar";

function Example({
  orientation = "horizontal",
  disabled = false,
}: {
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
} = {}) {
  return (
    <Toolbar
      aria-label="Formatting"
      orientation={orientation}
      disabled={disabled}
    >
      <ToolbarGroup aria-label="History">
        <ToolbarButton>Undo</ToolbarButton>
        <ToolbarButton>Redo</ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarToggleGroup
        type="multiple"
        aria-label="Text formatting"
        defaultValue={["bold"]}
      >
        <ToolbarToggleItem value="bold">
          Bold
        </ToolbarToggleItem>

        <ToolbarToggleItem value="italic">
          Italic
        </ToolbarToggleItem>
      </ToolbarToggleGroup>

      <ToolbarSeparator />

      <ToolbarButton disabled>Share</ToolbarButton>

      <ToolbarLink href="#/toolbar" current>
        Help
      </ToolbarLink>
    </Toolbar>
  );
}

describe("Pimolu Toolbar", () => {
  it("renders a named toolbar on the horizontal axis", () => {
    render(<Example />);

    const toolbar = screen.getByRole("toolbar", {
      name: "Formatting",
    });

    expect(toolbar).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );

    expect(toolbar).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });

  it("exposes groups and flips the separator axis with orientation", () => {
    const { rerender } = render(<Example />);

    expect(
      screen.getByRole("group", { name: "History" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: "Text formatting",
      })
    ).toBeInTheDocument();

    const horizontalSeparators =
      screen.getAllByRole("separator");

    expect(horizontalSeparators).toHaveLength(2);

    horizontalSeparators.forEach((separator) => {
      expect(separator).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });

    rerender(<Example orientation="vertical" />);

    expect(
      screen.getByRole("toolbar")
    ).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );

    screen.getAllByRole("separator").forEach((separator) => {
      expect(separator).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });
  });

  it("keeps one tab stop and roves with the horizontal arrows", () => {
    render(<Example />);

    const undo = screen.getByRole("button", {
      name: "Undo",
    });

    const redo = screen.getByRole("button", {
      name: "Redo",
    });

    const bold = screen.getByRole("button", {
      name: "Bold",
    });

    expect(undo).toHaveAttribute("tabindex", "0");
    expect(redo).toHaveAttribute("tabindex", "-1");

    undo.focus();

    fireEvent.keyDown(undo, { key: "ArrowRight" });
    expect(redo).toHaveFocus();

    fireEvent.keyDown(redo, { key: "ArrowRight" });
    expect(bold).toHaveFocus();

    fireEvent.keyDown(bold, { key: "ArrowLeft" });
    expect(redo).toHaveFocus();

    fireEvent.keyDown(redo, { key: "End" });
    expect(
      screen.getByRole("link", { name: "Help" })
    ).toHaveFocus();

    fireEvent.keyDown(
      screen.getByRole("link", { name: "Help" }),
      { key: "Home" }
    );

    expect(undo).toHaveFocus();
  });

  it("round-trips with the vertical arrows and ignores the horizontal ones", () => {
    render(<Example orientation="vertical" />);

    const undo = screen.getByRole("button", {
      name: "Undo",
    });

    const redo = screen.getByRole("button", {
      name: "Redo",
    });

    undo.focus();

    fireEvent.keyDown(undo, { key: "ArrowDown" });
    expect(redo).toHaveFocus();

    fireEvent.keyDown(redo, { key: "ArrowRight" });
    expect(redo).toHaveFocus();

    fireEvent.keyDown(redo, { key: "ArrowUp" });
    expect(undo).toHaveFocus();
  });

  it("skips disabled controls when roving", () => {
    render(<Example />);

    const italic = screen.getByRole("button", {
      name: "Italic",
    });

    italic.focus();

    fireEvent.keyDown(italic, {
      key: "ArrowRight",
    });

    expect(
      screen.getByRole("link", { name: "Help" })
    ).toHaveFocus();

    fireEvent.keyDown(
      screen.getByRole("link", { name: "Help" }),
      { key: "ArrowRight" }
    );

    expect(
      screen.getByRole("button", { name: "Undo" })
    ).toHaveFocus();
  });

  it("disables every control from the root", () => {
    render(<Example disabled />);

    expect(
      screen.getByRole("button", { name: "Undo" })
    ).toBeDisabled();

    expect(
      screen.getByRole("link", { name: "Help" })
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.getByRole("link", { name: "Help" })
    ).toHaveAttribute("tabindex", "-1");
  });

  it("keeps a current link marked and prevents disabled link activation", () => {
    const onClick = vi.fn();

    render(
      <Toolbar aria-label="Links">
        <ToolbarLink href="#/current" current>
          Current
        </ToolbarLink>

        <ToolbarLink
          href="#/disabled"
          aria-disabled="true"
          onClick={onClick}
        >
          Disabled
        </ToolbarLink>
      </Toolbar>
    );

    expect(
      screen.getByRole("link", { name: "Current" })
    ).toHaveAttribute("aria-current", "page");

    fireEvent.click(
      screen.getByRole("link", { name: "Disabled" })
    );

    expect(onClick).not.toHaveBeenCalled();
  });

  it("toggles a single value and reports it", () => {
    const onValueChange = vi.fn();

    render(
      <Toolbar aria-label="Alignment">
        <ToolbarToggleGroup
          type="single"
          aria-label="Alignment group"
          defaultValue="left"
          onValueChange={onValueChange}
        >
          <ToolbarToggleItem value="left">
            Left
          </ToolbarToggleItem>

          <ToolbarToggleItem value="center">
            Center
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    );

    const left = screen.getByRole("button", {
      name: "Left",
    });

    const center = screen.getByRole("button", {
      name: "Center",
    });

    expect(left).toHaveAttribute("aria-pressed", "true");
    expect(center).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    fireEvent.click(center);

    expect(onValueChange).toHaveBeenCalledWith("center");
    expect(center).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    fireEvent.click(center);

    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("toggles any number of values in multiple mode", () => {
    const onValueChange = vi.fn();

    render(
      <Toolbar aria-label="Formatting">
        <ToolbarToggleGroup
          type="multiple"
          aria-label="Text formatting"
          defaultValue={["bold"]}
          onValueChange={onValueChange}
        >
          <ToolbarToggleItem value="bold">
            Bold
          </ToolbarToggleItem>

          <ToolbarToggleItem value="italic">
            Italic
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    );

    const bold = screen.getByRole("button", {
      name: "Bold",
    });

    const italic = screen.getByRole("button", {
      name: "Italic",
    });

    fireEvent.click(italic);

    expect(onValueChange).toHaveBeenLastCalledWith([
      "bold",
      "italic",
    ]);

    expect(italic).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    fireEvent.click(bold);

    expect(onValueChange).toHaveBeenLastCalledWith([
      "italic",
    ]);

    expect(bold).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
