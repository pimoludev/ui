import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Popover } from "./popover";

afterEach(() => {
  vi.useRealTimers();
});

function open(name = "Open") {
  fireEvent.click(
    screen.getByRole("button", { name })
  );
}

describe("Pimolu Popover", () => {
  it("renders nothing until the trigger is clicked", () => {
    render(
      <Popover content="Panel content" label="Details">
        <button type="button">Open</button>
      </Popover>
    );

    const trigger = screen.getByRole("button");

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(trigger).not.toHaveAttribute("aria-controls");
  });

  it("opens on click with a dialog role and an accessible name", () => {
    render(
      <Popover content="Panel content" label="Details">
        <button type="button">Open</button>
      </Popover>
    );

    open();

    const trigger = screen.getByRole("button");
    const panel = screen.getByRole("dialog", {
      name: "Details",
    });

    expect(panel).toHaveTextContent("Panel content");
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(trigger).toHaveAttribute(
      "aria-controls",
      panel.id
    );
  });

  it("is named by a heading when labelledBy is used", () => {
    render(
      <Popover
        content={
          <h2 id="popover-heading">Notifications</h2>
        }
        labelledBy="popover-heading"
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    expect(
      screen.getByRole("dialog", {
        name: "Notifications",
      })
    ).toBeInTheDocument();
  });

  it("mounts the panel in the trigger's nearest style scope", () => {
    render(
      <>
        <div data-pimolu-style="cartoon" />

        <div data-pimolu-style="glass" data-testid="own-style">
          <Popover content="Panel content" label="Details">
            <button type="button">Open</button>
          </Popover>
        </div>
      </>
    );

    open();

    expect(
      screen.getByRole("dialog").parentElement
    ).toBe(screen.getByTestId("own-style"));
  });

  it("toggles closed on a second click and unmounts after the exit", () => {
    vi.useFakeTimers();

    render(
      <Popover content="Panel content" label="Details">
        <button type="button">Open</button>
      </Popover>
    );

    open();

    /* The panel stays mounted while it animates out. */
    open();

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-state",
      "closing"
    );

    expect(
      screen.getByRole("button")
    ).toHaveAttribute("aria-expanded", "false");

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens initially when defaultOpen is set", () => {
    render(
      <Popover
        content="Panel content"
        label="Details"
        defaultOpen
      >
        <button type="button">Open</button>
      </Popover>
    );

    expect(
      screen.getByRole("dialog", { name: "Details" })
    ).toBeInTheDocument();
  });

  it("follows the open prop when controlled", () => {
    const onOpenChange = vi.fn();

    function Controlled() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <Popover
          content="Panel content"
          label="Details"
          open={isOpen}
          onOpenChange={(next) => {
            onOpenChange(next);
            setIsOpen(next);
          }}
        >
          <button type="button">Open</button>
        </Popover>
      );
    }

    render(<Controlled />);

    open();

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    open();

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("does not open itself while the controlled parent keeps it closed", () => {
    const onOpenChange = vi.fn();

    render(
      <Popover
        content="Panel content"
        label="Details"
        open={false}
        onOpenChange={onOpenChange}
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    render(
      <Popover content={<button type="button">Action</button>} label="Details">
        <button type="button">Open</button>
      </Popover>
    );

    open();

    const trigger = screen.getByRole("button", {
      name: "Open",
    });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveFocus();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on an outside pointerdown", () => {
    vi.useFakeTimers();

    render(
      <div>
        <Popover content="Panel content" label="Details">
          <button type="button">Open</button>
        </Popover>

        <button type="button">Outside</button>
      </div>
    );

    open();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Outside" })
    );

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stays open when clicking inside the panel", () => {
    vi.useFakeTimers();

    render(
      <Popover
        content={<button type="button">Action</button>}
        label="Details"
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Action" })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes after an inside click when closeOnSelect is set", () => {
    vi.useFakeTimers();

    render(
      <Popover
        content={<button type="button">Archive</button>}
        label="Actions"
        closeOnSelect
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Archive" })
    );

    expect(
      screen.getByRole("button", { name: "Open" })
    ).toHaveFocus();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("moves focus to the first focusable element in the panel", () => {
    render(
      <Popover
        content={
          <>
            <p>Choose one</p>
            <button type="button">First</button>
            <button type="button">Second</button>
          </>
        }
        label="Details"
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    expect(
      screen.getByRole("button", { name: "First" })
    ).toHaveFocus();
  });

  it("focuses the panel itself when it holds nothing focusable", () => {
    render(
      <Popover content="Nothing to focus" label="Details">
        <button type="button">Open</button>
      </Popover>
    );

    open();

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("closes when focus moves outside the trigger and panel", () => {
    vi.useFakeTimers();

    render(
      <div>
        <Popover content="Panel content" label="Details">
          <button type="button">Open</button>
        </Popover>

        <button type="button">Outside</button>
      </div>
    );

    open();

    act(() => {
      screen
        .getByRole("button", { name: "Outside" })
        .focus();
    });

    expect(
      screen.getByRole("button", { name: "Open" })
    ).toHaveAttribute("aria-expanded", "false");

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("anchors below by default and flips above without room", () => {
    render(
      <Popover content="Panel content" label="Details">
        <button type="button">Open</button>
      </Popover>
    );

    const trigger = screen.getByRole("button");

    /*
     * jsdom has no layout: the trigger is 100 x 40, planted 24px above the
     * bottom of the 768px viewport.
     */
    trigger.getBoundingClientRect = () =>
      ({
        top: 700,
        bottom: 740,
        left: 100,
        right: 200,
        width: 100,
        height: 40,
        x: 100,
        y: 700,
        toJSON: () => ({}),
      }) as DOMRect;

    open();

    const panel = screen.getByRole("dialog");

    expect(panel).toHaveAttribute("data-side", "top");
    expect(panel.style.bottom).toBe("76px");
    expect(panel.style.top).toBe("");
  });

  it("matches the trigger width when asked", () => {
    render(
      <Popover
        content="Panel content"
        label="Details"
        matchWidth
      >
        <button type="button">Open</button>
      </Popover>
    );

    const trigger = screen.getByRole("button");

    trigger.getBoundingClientRect = () =>
      ({
        top: 100,
        bottom: 140,
        left: 50,
        right: 270,
        width: 220,
        height: 40,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;

    open();

    expect(screen.getByRole("dialog").style.width).toBe(
      "220px"
    );

    expect(screen.getByRole("dialog")).toHaveClass(
      "pimolu-popover--match-width"
    );
  });

  it("never opens when disabled", () => {
    render(
      <Popover
        content="Panel content"
        label="Details"
        disabled
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the handlers of the trigger", () => {
    const onClick = vi.fn();

    render(
      <Popover content="Panel content" label="Details">
        <button type="button" onClick={onClick}>
          Open
        </button>
      </Popover>
    );

    open();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("applies the padding axis and the panel class", () => {
    render(
      <Popover
        content="Panel content"
        label="Details"
        padding="sm"
        className="custom-panel"
      >
        <button type="button">Open</button>
      </Popover>
    );

    open();

    const panel = screen.getByRole("dialog");

    expect(panel).toHaveClass(
      "pimolu-popover",
      "pimolu-popover--padding-sm",
      "custom-panel"
    );
  });

  it("closes immediately when motion is reduced", () => {
    const original = window.matchMedia;

    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as typeof window.matchMedia;

    try {
      render(
        <Popover content="Panel content" label="Details">
          <button type="button">Open</button>
        </Popover>
      );

      open();

      /* No closing phase to wait for. */
      open();

      expect(screen.queryByRole("dialog")).toBeNull();
    } finally {
      window.matchMedia = original;
    }
  });
});
