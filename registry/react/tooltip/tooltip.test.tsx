
import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "./tooltip";

afterEach(() => {
  vi.useRealTimers();
});

function open() {
  act(() => {
    vi.advanceTimersByTime(500);
  });
}

describe("Pimolu Tooltip", () => {
  it("renders nothing until the trigger is hovered", () => {
    render(
      <Tooltip content="Saved two minutes ago">
        <button type="button">Save</button>
      </Tooltip>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByRole("tooltip")).toBeNull();

    expect(screen.getByRole("button")).not.toHaveAttribute(
      "aria-describedby"
    );
  });

  it("opens after the delay on hover", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved two minutes ago">
        <button type="button">Save</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByRole("button"));

    expect(screen.queryByRole("tooltip")).toBeNull();

    open();

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Saved two minutes ago"
    );

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-describedby",
      screen.getByRole("tooltip").id
    );
  });

  it("closes on mouse leave", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved two minutes ago">
        <button type="button">Save</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    open();
    fireEvent.mouseLeave(trigger);

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens on keyboard focus", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved two minutes ago">
        <button type="button">Save</button>
      </Tooltip>
    );

    fireEvent.focus(screen.getByRole("button"));
    open();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on Escape", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved two minutes ago">
        <button type="button">Save</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");

    fireEvent.mouseEnter(trigger);
    open();

    fireEvent.keyDown(trigger, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("renders the bubble outside the trigger container", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved">
        <button type="button">Save</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByRole("button"));
    open();

    const bubble = screen.getByRole("tooltip");

    expect(bubble.parentElement).toBe(document.body);
    expect(bubble.style.position).toBe("fixed");
  });

  it("anchors above by default and below when there is no room", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved">
        <button type="button">Save</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");

    /* 40px from the top: nothing fits above. */
    trigger.getBoundingClientRect = () =>
      ({
        top: 40,
        bottom: 80,
        left: 100,
        right: 200,
        width: 100,
        height: 40,
        x: 100,
        y: 40,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.mouseEnter(trigger);
    open();

    const bubble = screen.getByRole("tooltip");

    expect(bubble.style.bottom).toBe("");
    expect(bubble.style.top).toBe("88px");
  });

  it("never opens when disabled", () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Saved" disabled>
        <button type="button">Save</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByRole("button"));
    open();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("keeps the handlers of the trigger", () => {
    vi.useFakeTimers();

    const onMouseEnter = vi.fn();

    render(
      <Tooltip content="Saved">
        <button type="button" onMouseEnter={onMouseEnter}>
          Save
        </button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByRole("button"));

    expect(onMouseEnter).toHaveBeenCalled();
  });
});
