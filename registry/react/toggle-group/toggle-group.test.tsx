import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "./toggle-group";

describe("Pimolu ToggleGroup", () => {
  it("selects one value at a time in single mode", () => {
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="single"
        defaultValue="left"
        aria-label="Alignment"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="left">
          Left
        </ToggleGroupItem>

        <ToggleGroupItem value="center">
          Center
        </ToggleGroupItem>
      </ToggleGroup>
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
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(center).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    /* Clicking the selected value keeps it selected. */
    fireEvent.click(center);

    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("follows the value prop in single mode", () => {
    const onValueChange = vi.fn();

    const { rerender } = render(
      <ToggleGroup
        value="left"
        aria-label="Alignment"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="left">
          Left
        </ToggleGroupItem>

        <ToggleGroupItem value="center">
          Center
        </ToggleGroupItem>
      </ToggleGroup>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Center" })
    );

    expect(onValueChange).toHaveBeenCalledWith("center");

    expect(
      screen.getByRole("button", { name: "Left" })
    ).toHaveAttribute("aria-pressed", "true");

    rerender(
      <ToggleGroup
        value="center"
        aria-label="Alignment"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="left">
          Left
        </ToggleGroupItem>

        <ToggleGroupItem value="center">
          Center
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(
      screen.getByRole("button", { name: "Center" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles any number of values in multiple mode", () => {
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        defaultValue={["bold"]}
        aria-label="Formatting"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="bold">
          Bold
        </ToggleGroupItem>

        <ToggleGroupItem value="italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const bold = screen.getByRole("button", {
      name: "Bold",
    });

    const italic = screen.getByRole("button", {
      name: "Italic",
    });

    expect(bold).toHaveAttribute("aria-pressed", "true");

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

  it("disables the whole group or one item", () => {
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        disabled
        aria-label="Formatting"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="bold">
          Bold
        </ToggleGroupItem>
      </ToggleGroup>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Bold" })
    );

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Bold" })
    ).toBeDisabled();
  });

  it("disables a single item on its own", () => {
    render(
      <ToggleGroup type="multiple" aria-label="Formatting">
        <ToggleGroupItem value="bold" disabled>
          Bold
        </ToggleGroupItem>

        <ToggleGroupItem value="italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(
      screen.getByRole("button", { name: "Bold" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Italic" })
    ).not.toBeDisabled();
  });

  it("applies the group variant and size to the items", () => {
    render(
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="lg"
        aria-label="Formatting"
      >
        <ToggleGroupItem value="bold">
          Bold
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(
      screen.getByRole("button", { name: "Bold" })
    ).toHaveClass(
      "pimolu-toggle",
      "pimolu-toggle--outline",
      "pimolu-toggle--lg",
      "pimolu-toggle-group__item"
    );
  });

  it("marks the orientation and names the group", () => {
    render(
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        aria-label="Formatting"
      >
        <ToggleGroupItem value="bold">
          Bold
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const group = screen.getByRole("group", {
      name: "Formatting",
    });

    expect(group).toHaveAttribute(
      "data-orientation",
      "vertical"
    );

    expect(group).toHaveClass(
      "pimolu-toggle-group--vertical"
    );
  });
});
