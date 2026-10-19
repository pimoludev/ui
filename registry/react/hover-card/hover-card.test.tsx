import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./hover-card";
import type { PimoluHoverCardPlacement } from "./hover-card.types";

afterEach(() => {
  vi.useRealTimers();
});

interface ExampleProps {
  placement?: PimoluHoverCardPlacement;
  openDelay?: number;
  closeDelay?: number;
}

function Example({
  placement,
  openDelay,
  closeDelay,
}: ExampleProps = {}) {
  return (
    <HoverCard
      placement={placement}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <HoverCardTrigger>
        <button type="button">Ada Lovelace</button>
      </HoverCardTrigger>

      <HoverCardContent label="Profile">
        <p>Mathematician</p>
        <a href="#profile">View profile</a>
      </HoverCardContent>
    </HoverCard>
  );
}

function openCard() {
  fireEvent.mouseEnter(
    screen.getByRole("button", {
      name: "Ada Lovelace",
    })
  );

  act(() => {
    vi.advanceTimersByTime(300);
  });
}

function endExit() {
  act(() => {
    vi.advanceTimersByTime(120);
  });
}

describe("Pimolu HoverCard", () => {
  it("opens after the open delay and links the trigger to the dialog", () => {
    vi.useFakeTimers();

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();

    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(trigger).not.toHaveAttribute("aria-controls");

    fireEvent.mouseEnter(trigger);

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    const panel = screen.getByRole("dialog", {
      name: "Profile",
    });

    expect(panel).toHaveTextContent("Mathematician");
    expect(panel).toHaveAttribute("data-state", "open");

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    expect(trigger).toHaveAttribute(
      "aria-controls",
      panel.id
    );
  });

  it("opens on focus after the delay without moving focus", () => {
    vi.useFakeTimers();

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    act(() => {
      trigger.focus();
    });

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(
      screen.getByRole("dialog", {
        name: "Profile",
      })
    ).toBeInTheDocument();

    expect(trigger).toHaveFocus();
  });

  it("closes after the close delay when the pointer leaves", () => {
    vi.useFakeTimers();

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    openCard();

    const panel = screen.getByRole("dialog", {
      name: "Profile",
    });

    fireEvent.mouseLeave(trigger);

    act(() => {
      vi.advanceTimersByTime(149);
    });

    expect(panel).toHaveAttribute("data-state", "open");

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(panel).toHaveAttribute(
      "data-state",
      "closing"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    endExit();

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("stays open while the pointer is inside the panel", () => {
    vi.useFakeTimers();

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    openCard();

    const panel = screen.getByRole("dialog", {
      name: "Profile",
    });

    fireEvent.mouseLeave(trigger);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.mouseEnter(panel);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(panel).toHaveAttribute("data-state", "open");

    fireEvent.mouseLeave(panel);

    act(() => {
      vi.advanceTimersByTime(149);
    });

    expect(panel).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(panel).toHaveAttribute(
      "data-state",
      "closing"
    );

    endExit();

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    render(
      <HoverCard>
        <HoverCardTrigger>
          <button type="button">Ada Lovelace</button>
        </HoverCardTrigger>

        <HoverCardContent label="Profile">
          <button type="button">View profile</button>
        </HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    fireEvent.mouseEnter(trigger);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const action = screen.getByRole("button", {
      name: "View profile",
    });

    act(() => {
      action.focus();
    });

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveFocus();

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    endExit();

    expect(
      screen.queryByRole("dialog")
    ).toBeNull();
  });

  it("is named by a heading when labelledBy is used", () => {
    vi.useFakeTimers();

    render(
      <HoverCard>
        <HoverCardTrigger>
          <button type="button">Open profile</button>
        </HoverCardTrigger>

        <HoverCardContent labelledBy="hover-card-title">
          <h2 id="hover-card-title">Ada Lovelace</h2>
          <p>Mathematician</p>
        </HoverCardContent>
      </HoverCard>
    );

    fireEvent.mouseEnter(
      screen.getByRole("button", {
        name: "Open profile",
      })
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(
      screen.getByRole("dialog", {
        name: "Ada Lovelace",
      })
    ).toBeInTheDocument();
  });

  it("anchors on the requested side and portals the panel", () => {
    vi.useFakeTimers();

    render(<Example placement="right" />);

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    /*
     * jsdom has no layout: the trigger is 140 x 40, in the middle of the
     * 1024 x 768 viewport, with room on every side.
     */
    trigger.getBoundingClientRect = () =>
      ({
        top: 300,
        bottom: 340,
        left: 100,
        right: 240,
        width: 140,
        height: 40,
        x: 100,
        y: 300,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.mouseEnter(trigger);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const panel = screen.getByRole("dialog", {
      name: "Profile",
    });

    expect(panel).toHaveAttribute("data-side", "right");
    expect(panel.parentElement).toBe(document.body);
    expect(panel.style.position).toBe("fixed");
  });

  it("preserves the ref and handlers of the trigger", () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();

    render(
      <HoverCard>
        <HoverCardTrigger>
          <button
            ref={ref}
            type="button"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
          >
            Ada Lovelace
          </button>
        </HoverCardTrigger>

        <HoverCardContent label="Profile">
          <p>Mathematician</p>
        </HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByRole("button", {
      name: "Ada Lovelace",
    });

    expect(ref.current).toBe(trigger);

    fireEvent.mouseEnter(trigger);
    fireEvent.click(trigger);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
