import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./segmented-control";

const options = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "timeline", label: "Timeline" },
];

describe("SegmentedControl sliding surface", () => {
  afterEach(() => vi.restoreAllMocks());
  function layout() {
    const boxes: Record<string, number[]> = { list: [4, 4, 64, 32], board: [68, 4, 96, 32], timeline: [164, 4, 128, 32] };
    for (const [i, key] of (["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"] as const).entries()) {
      vi.spyOn(HTMLElement.prototype, key, "get").mockImplementation(function(this: HTMLElement) { return boxes[this.dataset.value ?? ""]?.[i] ?? 0; });
    }
    return boxes;
  }
  it("tracks unequal radio sizes while preserving form value and keyboard focus", () => {
    layout();
    const { container } = render(<SegmentedControl options={options} name="view" classNames={{ indicator: "custom-marker" }} />);
    const marker = container.querySelector<HTMLElement>(".pimolu-segmented-control__indicator")!;
    expect(marker).toHaveClass("custom-marker");
    expect(marker).toHaveAttribute("aria-hidden", "true");
    expect(marker.style.width).toBe("64px");
    screen.getByRole("radio", { name: "List" }).focus();
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "End" });
    expect(screen.getByRole("radio", { name: "Timeline" })).toHaveFocus();
    expect(marker.style.transform).toBe("translate3d(164px, 4px, 0)");
    expect(marker.style.width).toBe("128px");
    expect(container.querySelector('input[name="view"]')).toHaveValue("timeline");
  });
  it("keeps animation and scrollbar controls explicit without forwarding unknown DOM props", () => {
    layout();
    const { rerender } = render(<SegmentedControl options={options} animated={false} scrollable />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("data-animated", "false");
    expect(group).toHaveAttribute("data-scrollable", "true");
    expect(group).not.toHaveAttribute("data-show-scrollbar");
    expect(group).not.toHaveAttribute("animated");
    expect(group).not.toHaveAttribute("scrollable");
    rerender(<SegmentedControl options={options} showScrollbar animated scrollable />);
    expect(group).toHaveAttribute("data-show-scrollbar", "true");
    expect(group).not.toHaveAttribute("data-animated");
  });
  it("remeasures vertical placement and does not move for a rejected controlled choice", () => {
    const boxes = layout(), onValueChange = vi.fn();
    const { container, rerender } = render(<SegmentedControl options={options} value="list" orientation="vertical" onValueChange={onValueChange} />);
    const marker = container.querySelector<HTMLElement>(".pimolu-segmented-control__indicator")!;
    fireEvent.click(screen.getByRole("radio", { name: "Board" }));
    expect(onValueChange).toHaveBeenCalledWith("board");
    expect(marker.style.width).toBe("64px");
    boxes.board = [4, 40, 160, 36];
    rerender(<SegmentedControl options={options} value="board" orientation="vertical" />);
    expect(marker.style.transform).toBe("translate3d(4px, 40px, 0)");
    boxes.board[2] = 180;
    fireEvent(window, new Event("resize"));
    expect(marker.style.width).toBe("180px");
    rerender(<SegmentedControl options={options} value="missing" />);
    expect(marker).toHaveAttribute("hidden");
  });
});

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
