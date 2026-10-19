import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./segmented-control";

const options = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "timeline", label: "Timeline" },
];

describe("Pimolu SegmentedControl", () => {
  it("renders a radiogroup and selects the first enabled option", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
      />
    );

    expect(
      screen.getByRole("radiogroup", { name: "View" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: "List" })
    ).toHaveAttribute("aria-checked", "true");

    expect(
      screen.getByRole("radio", { name: "Board" })
    ).toHaveAttribute("aria-checked", "false");
  });

  it("selects a value on click", () => {
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        aria-label="View"
        options={options}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(
      screen.getByRole("radio", { name: "Board" })
    );

    expect(onValueChange).toHaveBeenCalledWith("board");

    expect(
      screen.getByRole("radio", { name: "Board" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("starts from defaultValue", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
        defaultValue="timeline"
      />
    );

    expect(
      screen.getByRole("radio", { name: "Timeline" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("follows the value prop when controlled", () => {
    const onValueChange = vi.fn();

    const { rerender } = render(
      <SegmentedControl
        aria-label="View"
        options={options}
        value="list"
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(
      screen.getByRole("radio", { name: "Board" })
    );

    expect(onValueChange).toHaveBeenCalledWith("board");

    expect(
      screen.getByRole("radio", { name: "List" })
    ).toHaveAttribute("aria-checked", "true");

    rerender(
      <SegmentedControl
        aria-label="View"
        options={options}
        value="board"
        onValueChange={onValueChange}
      />
    );

    expect(
      screen.getByRole("radio", { name: "Board" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("moves and selects with the arrow keys", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
      />
    );

    const list = screen.getByRole("radio", {
      name: "List",
    });

    const board = screen.getByRole("radio", {
      name: "Board",
    });

    list.focus();

    fireEvent.keyDown(list, { key: "ArrowRight" });

    expect(board).toHaveFocus();
    expect(board).toHaveAttribute(
      "aria-checked",
      "true"
    );

    fireEvent.keyDown(board, { key: "End" });

    expect(
      screen.getByRole("radio", { name: "Timeline" })
    ).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(
      screen.getByRole("radio", { name: "Timeline" }),
      { key: "Home" }
    );

    expect(list).toHaveFocus();
  });

  it("uses vertical arrows for a vertical control", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
        orientation="vertical"
      />
    );

    const list = screen.getByRole("radio", {
      name: "List",
    });

    list.focus();

    fireEvent.keyDown(list, { key: "ArrowDown" });

    expect(
      screen.getByRole("radio", { name: "Board" })
    ).toHaveFocus();

    fireEvent.keyDown(
      screen.getByRole("radio", { name: "Board" }),
      { key: "ArrowRight" }
    );

    expect(
      screen.getByRole("radio", { name: "Board" })
    ).toHaveFocus();
  });

  it("skips disabled options", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={[
          { value: "list", label: "List" },
          {
            value: "board",
            label: "Board",
            disabled: true,
          },
          { value: "timeline", label: "Timeline" },
        ]}
      />
    );

    const list = screen.getByRole("radio", {
      name: "List",
    });

    list.focus();

    fireEvent.keyDown(list, { key: "ArrowRight" });

    expect(
      screen.getByRole("radio", { name: "Timeline" })
    ).toHaveFocus();

    fireEvent.click(
      screen.getByRole("radio", { name: "Board" })
    );

    expect(
      screen.getByRole("radio", { name: "Board" })
    ).toHaveAttribute("aria-checked", "false");
  });

  it("disables the whole control", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
        disabled
      />
    );

    expect(
      screen.getByRole("radiogroup")
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.getByRole("radio", { name: "List" })
    ).toBeDisabled();
  });

  it("applies size, full width and vertical classes", () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={options}
        size="lg"
        fullWidth
        orientation="vertical"
        className="custom-segmented"
      />
    );

    const group = screen.getByRole("radiogroup");

    expect(group).toHaveClass(
      "pimolu-segmented-control",
      "pimolu-segmented-control--lg",
      "pimolu-segmented-control--full-width",
      "pimolu-segmented-control--vertical",
      "custom-segmented"
    );

    expect(group).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("submits the value through a hidden input", () => {
    const { container } = render(
      <SegmentedControl
        aria-label="View"
        name="view"
        options={options}
        defaultValue="board"
      />
    );

    expect(
      container.querySelector('input[name="view"]')
    ).toHaveValue("board");
  });

  it("forwards a ref to the group", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <SegmentedControl
        ref={ref}
        aria-label="View"
        options={options}
      />
    );

    expect(ref.current).toBe(
      screen.getByRole("radiogroup")
    );
  });
});
