import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

import type { PimoluDialogContentProps } from "./dialog.types";

afterEach(() => {
  vi.useRealTimers();
});

function Example({
  contentProps,
  onCancel,
}: {
  contentProps?: PimoluDialogContentProps;
  onCancel?: () => void;
} = {}) {
  return (
    <Dialog>
      <DialogTrigger>
        <button type="button">Open</button>
      </DialogTrigger>

      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </DialogClose>

          <button type="button">Delete</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function open() {
  fireEvent.click(
    screen.getByRole("button", { name: "Open" })
  );
}

function closeWithTimers() {
  act(() => {
    vi.advanceTimersByTime(150);
  });
}

describe("Pimolu Dialog", () => {
  it("renders nothing until the trigger is clicked", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Open",
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

  it("opens a modal dialog named by its title and description", () => {
    render(<Example />);

    open();

    const trigger = screen.getByRole("button", {
      name: "Open",
    });

    const dialog = screen.getByRole("dialog", {
      name: "Delete project",
      description: "This action cannot be undone.",
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(trigger).toHaveAttribute(
      "aria-controls",
      dialog.id
    );
  });

  it("mounts the panel in the trigger's nearest style scope", () => {
    render(
      <div data-pimolu-style="glass" data-testid="scope">
        <Example />
      </div>
    );

    open();

    expect(
      screen.getByRole("dialog").closest(".pimolu-dialog")
        ?.parentElement
    ).toBe(screen.getByTestId("scope"));
  });

  it("prefers a body control over a footer action", () => {
    render(
      <Dialog>
        <DialogTrigger>
          <button type="button">Open</button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Settings</DialogTitle>

          <button type="button">Learn more</button>

          <DialogFooter>
            <DialogClose>
              <button type="button">Cancel</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    open();

    expect(
      screen.getByRole("button", { name: "Learn more" })
    ).toHaveFocus();
  });

  it("focuses the panel when only the footer and corner button exist", () => {
    render(<Example />);

    open();

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("focuses the panel when the footer is the only focusable content", () => {
    render(
      <Example contentProps={{ showCloseButton: false }} />
    );

    open();

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("traps Tab at both ends of the panel", () => {
    render(<Example />);

    open();

    const dialog = screen.getByRole("dialog");

    const cancel = screen.getByRole("button", {
      name: "Cancel",
    });

    const close = screen.getByRole("button", {
      name: "Close",
    });

    expect(dialog).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });

    expect(cancel).toHaveFocus();

    fireEvent.keyDown(cancel, {
      key: "Tab",
      shiftKey: true,
    });

    expect(close).toHaveFocus();
  });

  it("returns focus to an external control after a trigger-less dialog", () => {
    vi.useFakeTimers();

    function External() {
      const [openState, setOpenState] =
        useState(false);

      return (
        <>
          <button
            type="button"
            onClick={() => setOpenState(true)}
          >
            Open outside
          </button>

          <Dialog
            open={openState}
            onOpenChange={setOpenState}
          >
            <DialogContent>
              <DialogTitle>External</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    render(<External />);

    const trigger = screen.getByRole("button", {
      name: "Open outside",
    });

    trigger.focus();

    fireEvent.click(trigger);

    fireEvent.click(
      screen.getByRole("button", { name: "Close" })
    );

    closeWithTimers();

    expect(trigger).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    closeWithTimers();

    expect(screen.queryByRole("dialog")).toBeNull();

    expect(
      screen.getByRole("button", { name: "Open" })
    ).toHaveFocus();
  });

  it("keeps the panel open on Escape when asked", () => {
    vi.useFakeTimers();

    render(
      <Example contentProps={{ closeOnEscape: false }} />
    );

    open();

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    closeWithTimers();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on an overlay pointerdown", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.pointerDown(
      document.querySelector(".pimolu-dialog__overlay")!
    );

    closeWithTimers();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the panel open when overlay dismissal is off", () => {
    vi.useFakeTimers();

    render(
      <Example
        contentProps={{ closeOnOverlayClick: false }}
      />
    );

    open();

    fireEvent.pointerDown(
      document.querySelector(".pimolu-dialog__overlay")!
    );

    closeWithTimers();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not close when the panel itself is pressed", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.pointerDown(screen.getByRole("dialog"));

    closeWithTimers();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes from the corner close button", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Close" })
    );

    closeWithTimers();

    expect(screen.queryByRole("dialog")).toBeNull();

    expect(
      screen.getByRole("button", { name: "Open" })
    ).toHaveFocus();
  });

  it("closes from DialogClose and keeps its own handler", () => {
    vi.useFakeTimers();

    const onCancel = vi.fn();

    render(<Example onCancel={onCancel} />);

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);

    closeWithTimers();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("follows the open prop when controlled", () => {
    vi.useFakeTimers();

    const onOpenChange = vi.fn();

    function Controlled() {
      const [openState, setOpenState] = useState(false);

      return (
        <Dialog
          open={openState}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpenState(next);
          }}
        >
          <DialogTrigger>
            <button type="button">Open</button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Settings</DialogTitle>
            <DialogFooter>
              <DialogClose>
                <button type="button">Done</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    render(<Controlled />);

    open();

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Done" })
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    closeWithTimers();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not open itself while the controlled parent keeps it closed", () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>
          <button type="button">Open</button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    open();

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens initially when defaultOpen is set", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Welcome</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.getByRole("dialog", { name: "Welcome" })
    ).toBeInTheDocument();
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

    closeWithTimers();

    expect(document.body.style.overflow).toBe(initial);
  });

  it("applies the size axis and the panel class", () => {
    render(
      <Example
        contentProps={{
          size: "lg",
          className: "custom-dialog",
        }}
      />
    );

    open();

    expect(screen.getByRole("dialog")).toHaveClass(
      "pimolu-dialog__content",
      "pimolu-dialog__content--lg",
      "custom-dialog"
    );
  });

  it("uses aria-label when the panel has no title", () => {
    render(
      <Dialog>
        <DialogTrigger>
          <button type="button">Open</button>
        </DialogTrigger>

        <DialogContent aria-label="Preferences">
          <p>Choose your preferences.</p>
        </DialogContent>
      </Dialog>
    );

    open();

    expect(
      screen.getByRole("dialog", {
        name: "Preferences",
      })
    ).toBeInTheDocument();
  });

  it("lets explicit labelling overrides point at existing elements", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent
          aria-labelledby="custom-dialog-title"
          aria-describedby="custom-dialog-description"
        >
          <h2 id="custom-dialog-title">Custom title</h2>
          <p id="custom-dialog-description">
            Custom description.
          </p>
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.getByRole("dialog", {
        name: "Custom title",
        description: "Custom description.",
      })
    ).toBeInTheDocument();
  });

  it("names the corner close button", () => {
    render(
      <Example contentProps={{ closeLabel: "Fermer" }} />
    );

    open();

    expect(
      screen.getByRole("button", { name: "Fermer" })
    ).toBeInTheDocument();
  });

  it("keeps the trigger handlers", () => {
    const onClick = vi.fn();

    render(
      <Dialog>
        <DialogTrigger>
          <button type="button" onClick={onClick}>
            Open
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    open();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
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
