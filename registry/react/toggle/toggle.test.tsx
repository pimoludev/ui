import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from "./toggle";

describe("Pimolu Toggle", () => {
  it("toggles its pressed state on click", () => {
    const onPressedChange = vi.fn();

    render(
      <Toggle onPressedChange={onPressedChange}>
        Bold
      </Toggle>
    );

    const toggle = screen.getByRole("button", {
      name: "Bold",
    });

    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    fireEvent.click(toggle);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(toggle).toHaveAttribute("data-state", "on");

    fireEvent.click(toggle);

    expect(onPressedChange).toHaveBeenLastCalledWith(false);
    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("starts pressed when defaultPressed is set", () => {
    render(
      <Toggle defaultPressed>Bold</Toggle>
    );

    expect(
      screen.getByRole("button", { name: "Bold" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("follows the pressed prop when controlled", () => {
    const onPressedChange = vi.fn();

    const { rerender } = render(
      <Toggle
        pressed={false}
        onPressedChange={onPressedChange}
      >
        Bold
      </Toggle>
    );

    const toggle = screen.getByRole("button", {
      name: "Bold",
    });

    fireEvent.click(toggle);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    rerender(
      <Toggle
        pressed
        onPressedChange={onPressedChange}
      >
        Bold
      </Toggle>
    );

    expect(toggle).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("does not toggle when disabled", () => {
    const onPressedChange = vi.fn();

    render(
      <Toggle
        disabled
        onPressedChange={onPressedChange}
      >
        Bold
      </Toggle>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Bold" })
    );

    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("keeps the button handlers", () => {
    const onClick = vi.fn();

    render(
      <Toggle onClick={onClick}>Bold</Toggle>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Bold" })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies the variant and size classes", () => {
    render(
      <Toggle variant="outline" size="lg">
        Bold
      </Toggle>
    );

    expect(
      screen.getByRole("button", { name: "Bold" })
    ).toHaveClass(
      "pimolu-toggle",
      "pimolu-toggle--outline",
      "pimolu-toggle--lg"
    );
  });

  it("forwards a ref to the button", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Toggle ref={ref}>Bold</Toggle>);

    expect(ref.current).toBe(
      screen.getByRole("button", { name: "Bold" })
    );
  });
});
