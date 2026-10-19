import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

import type { PimoluDrawerContentProps } from "./drawer.types";

afterEach(() => {
  vi.useRealTimers();
});

function Example({
  contentProps,
  onCancel,
}: {
  contentProps?: PimoluDrawerContentProps;
  onCancel?: () => void;
} = {}) {
  return (
    <Drawer>
      <DrawerTrigger>
        <button type="button">Open drawer</button>
      </DrawerTrigger>

      <DrawerContent {...contentProps}>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Refine the results.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <DrawerClose>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </DrawerClose>

          <button type="button">Apply</button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function open() {
  fireEvent.click(
    screen.getByRole("button", { name: "Open drawer" })
  );
}

function finishExit() {
  act(() => {
    vi.advanceTimersByTime(180);
  });
}

describe("Pimolu Drawer", () => {
  it("renders nothing until the trigger is clicked", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Open drawer",
    });

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

  it("opens a modal drawer named by its title and description", () => {
    render(<Example />);

    open();

    const trigger = screen.getByRole("button", {
      name: "Open drawer",
    });

    const drawer = screen.getByRole("dialog", {
      name: "Filters",
      description: "Refine the results.",
    });

    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(trigger).toHaveAttribute(
      "aria-controls",
      drawer.id
    );
  });

  it("uses aria-label when the drawer has no title", () => {
    render(
      <Drawer>
        <DrawerTrigger>
          <button type="button">Open drawer</button>
        </DrawerTrigger>

        <DrawerContent aria-label="Preferences">
          <p>Choose your preferences.</p>
        </DrawerContent>
      </Drawer>
    );

    open();

    expect(
      screen.getByRole("dialog", {
        name: "Preferences",
      })
    ).toBeInTheDocument();
  });

  it("applies the side, size and custom classes", () => {
    render(
      <Example
        contentProps={{
          side: "left",
          size: "lg",
          className: "custom-drawer",
        }}
      />
    );

    open();

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveClass(
      "pimolu-drawer__content",
      "pimolu-drawer__content--left",
      "pimolu-drawer__content--lg",
      "custom-drawer"
    );

    expect(
      drawer.closest(".pimolu-drawer")
    ).toHaveAttribute("data-side", "left");
  });

  it("follows the open prop when controlled", () => {
    vi.useFakeTimers();

    const onOpenChange = vi.fn();

    function Controlled() {
      const [openState, setOpenState] =
        useState(false);

      return (
        <Drawer
          open={openState}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpenState(next);
          }}
        >
          <DrawerTrigger>
            <button type="button">Open drawer</button>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
    }

    render(<Controlled />);

    open();

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Close" })
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Open drawer",
    });

    open();

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("keeps the drawer open when Escape and overlay dismissal are off", () => {
    vi.useFakeTimers();

    render(
      <Example
        contentProps={{
          closeOnEscape: false,
          closeOnOverlayClick: false,
        }}
      />
    );

    open();

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    fireEvent.pointerDown(
      document.querySelector(
        ".pimolu-drawer__overlay"
      )!
    );

    finishExit();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on an overlay pointerdown", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.pointerDown(
      document.querySelector(
        ".pimolu-drawer__overlay"
      )!
    );

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not close when the panel itself is pressed", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.pointerDown(screen.getByRole("dialog"));

    finishExit();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes from DrawerClose and keeps its own handler", () => {
    vi.useFakeTimers();

    const onCancel = vi.fn();

    render(<Example onCancel={onCancel} />);

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("prefers a body control over a footer action", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Settings</DrawerTitle>

          <button type="button">Learn more</button>

          <DrawerFooter>
            <DrawerClose>
              <button type="button">Cancel</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(
      screen.getByRole("button", { name: "Learn more" })
    ).toHaveFocus();
  });

  it("traps Tab inside the drawer", () => {
    render(<Example />);

    open();

    const drawer = screen.getByRole("dialog");

    const cancel = screen.getByRole("button", {
      name: "Cancel",
    });

    const close = screen.getByRole("button", {
      name: "Close",
    });

    expect(drawer).toHaveFocus();

    fireEvent.keyDown(drawer, { key: "Tab" });

    expect(cancel).toHaveFocus();

    fireEvent.keyDown(cancel, {
      key: "Tab",
      shiftKey: true,
    });

    expect(close).toHaveFocus();
  });

  it("locks the body scroll while open and restores it after the exit", () => {
    vi.useFakeTimers();

    const initial = document.body.style.overflow;

    render(<Example />);

    open();

    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(
      screen.getByRole("button", { name: "Close" })
    );

    finishExit();

    expect(document.body.style.overflow).toBe(initial);
  });

  it("mounts the drawer in the trigger's nearest style scope", () => {
    render(
      <div data-pimolu-style="glass" data-testid="scope">
        <Example />
      </div>
    );

    open();

    expect(
      screen
        .getByRole("dialog")
        .closest(".pimolu-drawer")?.parentElement
    ).toBe(screen.getByTestId("scope"));
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
      render(<Example />);

      open();

      fireEvent.click(
        screen.getByRole("button", { name: "Close" })
      );

      expect(screen.queryByRole("dialog")).toBeNull();
    } finally {
      window.matchMedia = original;
    }
  });
});
