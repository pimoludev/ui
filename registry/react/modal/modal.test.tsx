import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./modal";

import type { PimoluModalContentProps } from "./modal.types";

afterEach(() => {
  vi.useRealTimers();
});

function Example({
  contentProps,
  onCancel,
}: {
  contentProps?: PimoluModalContentProps;
  onCancel?: () => void;
} = {}) {
  return (
    <Modal>
      <ModalTrigger>
        <button type="button">Open modal</button>
      </ModalTrigger>

      <ModalContent {...contentProps}>
        <ModalHeader>
          <ModalTitle>Publish release</ModalTitle>
          <ModalDescription>
            The release will be visible to every workspace.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <ModalClose>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </ModalClose>

          <button type="button">Publish</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function open() {
  fireEvent.click(
    screen.getByRole("button", { name: "Open modal" })
  );
}

function finishExit() {
  act(() => {
    vi.advanceTimersByTime(150);
  });
}

describe("Pimolu Modal", () => {
  it("renders nothing until the trigger is clicked", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Open modal",
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

  it("opens a panel named by its title and description", () => {
    render(<Example />);

    open();

    const trigger = screen.getByRole("button", {
      name: "Open modal",
    });

    const modal = screen.getByRole("dialog", {
      name: "Publish release",
      description:
        "The release will be visible to every workspace.",
    });

    expect(modal).toHaveAttribute("aria-modal", "true");
    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(trigger).toHaveAttribute(
      "aria-controls",
      modal.id
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
      screen.getByRole("dialog").closest(".pimolu-modal")
        ?.parentElement
    ).toBe(screen.getByTestId("scope"));
  });

  it("prefers a body control over a footer action", () => {
    render(
      <Modal>
        <ModalTrigger>
          <button type="button">Open modal</button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Settings</ModalTitle>

          <button type="button">Learn more</button>

          <ModalFooter>
            <ModalClose>
              <button type="button">Cancel</button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

    const modal = screen.getByRole("dialog");

    const cancel = screen.getByRole("button", {
      name: "Cancel",
    });

    const close = screen.getByRole("button", {
      name: "Close",
    });

    expect(modal).toHaveFocus();

    fireEvent.keyDown(modal, { key: "Tab" });

    expect(cancel).toHaveFocus();

    fireEvent.keyDown(cancel, {
      key: "Tab",
      shiftKey: true,
    });

    expect(close).toHaveFocus();
  });

  it("cycles through visible controls when the first footer action is hidden", () => {
    render(<Example />);

    open();

    screen.getByRole("button", { name: "Cancel" }).style.display =
      "none";

    const last = screen.getByRole("button", {
      name: "Close",
    });

    const first = screen.getByRole("button", {
      name: "Publish",
    });

    first.focus();
    fireEvent.keyDown(first, {
      key: "Tab",
      shiftKey: true,
    });

    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: "Tab" });

    expect(first).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Open modal",
    });

    open();

    fireEvent.keyDown(screen.getByRole("dialog"), {
      key: "Escape",
    });

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
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

    finishExit();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on an overlay pointerdown", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.pointerDown(
      document.querySelector(".pimolu-modal__overlay")!
    );

    finishExit();

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
      document.querySelector(".pimolu-modal__overlay")!
    );

    finishExit();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not close when the panel itself is pressed", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.pointerDown(screen.getByRole("dialog"));

    finishExit();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes from the corner close button", () => {
    vi.useFakeTimers();

    render(<Example />);

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Close" })
    );

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();

    expect(
      screen.getByRole("button", { name: "Open modal" })
    ).toHaveFocus();
  });

  it("closes from ModalClose and keeps its own handler", () => {
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

  it("returns focus to an external control after a trigger-less modal", () => {
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

          <Modal
            open={openState}
            onOpenChange={setOpenState}
          >
            <ModalContent>
              <ModalTitle>External</ModalTitle>
            </ModalContent>
          </Modal>
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

    finishExit();

    expect(trigger).toHaveFocus();
  });

  it("follows the open prop when controlled", () => {
    vi.useFakeTimers();

    const onOpenChange = vi.fn();

    function Controlled() {
      const [openState, setOpenState] = useState(false);

      return (
        <Modal
          open={openState}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpenState(next);
          }}
        >
          <ModalTrigger>
            <button type="button">Open modal</button>
          </ModalTrigger>

          <ModalContent>
            <ModalTitle>Settings</ModalTitle>
            <ModalFooter>
              <ModalClose>
                <button type="button">Done</button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
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

    finishExit();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not open itself while the controlled parent keeps it closed", () => {
    const onOpenChange = vi.fn();

    render(
      <Modal open={false} onOpenChange={onOpenChange}>
        <ModalTrigger>
          <button type="button">Open modal</button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Settings</ModalTitle>
        </ModalContent>
      </Modal>
    );

    open();

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens initially when defaultOpen is set", () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalTitle>Welcome</ModalTitle>
        </ModalContent>
      </Modal>
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

    finishExit();

    expect(document.body.style.overflow).toBe(initial);
  });

  it("applies the size axis and the panel class", () => {
    render(
      <Example
        contentProps={{
          size: "xl",
          className: "custom-modal",
          style: { maxWidth: "500px" },
        }}
      />
    );

    open();

    expect(screen.getByRole("dialog")).toHaveClass(
      "pimolu-modal__content",
      "pimolu-modal__content--xl",
      "custom-modal"
    );

    expect(screen.getByRole("dialog")).toHaveStyle({
      maxWidth: "500px",
    });
  });

  it("applies named part classes to the portalled surface", () => {
    render(
      <Example
        contentProps={{
          classNames: {
            root: "part-root",
            overlay: "part-overlay",
            content: "part-content",
            header: "part-header",
            title: "part-title",
            description: "part-description",
            footer: "part-footer",
            closeButton: "part-close",
          },
        }}
      />
    );

    open();

    expect(
      document.querySelector(".pimolu-modal")
    ).toHaveClass("part-root");

    expect(
      document.querySelector(".pimolu-modal__overlay")
    ).toHaveClass("part-overlay");

    expect(screen.getByRole("dialog")).toHaveClass(
      "part-content"
    );

    expect(
      document.querySelector(".pimolu-modal__header")
    ).toHaveClass("part-header");

    expect(
      screen.getByRole("heading", { name: "Publish release" })
    ).toHaveClass("part-title");

    expect(
      screen.getByText(
        "The release will be visible to every workspace."
      )
    ).toHaveClass("part-description");

    expect(
      document.querySelector(".pimolu-modal__footer")
    ).toHaveClass("part-footer");

    expect(
      screen.getByRole("button", { name: "Close" })
    ).toHaveClass("part-close");
  });

  it("uses aria-label when the panel has no title", () => {
    render(
      <Modal>
        <ModalTrigger>
          <button type="button">Open modal</button>
        </ModalTrigger>

        <ModalContent aria-label="Preferences">
          <p>Choose your preferences.</p>
        </ModalContent>
      </Modal>
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
      <Modal defaultOpen>
        <ModalContent
          aria-labelledby="custom-modal-title"
          aria-describedby="custom-modal-description"
        >
          <h2 id="custom-modal-title">Custom title</h2>
          <p id="custom-modal-description">
            Custom description.
          </p>
        </ModalContent>
      </Modal>
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
      <Modal>
        <ModalTrigger>
          <button type="button" onClick={onClick}>
            Open modal
          </button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Settings</ModalTitle>
        </ModalContent>
      </Modal>
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

describe("trigger focusability", () => {
  it("adds keyboard access to a non-focusable trigger", () => {
    render(
      <Modal>
        <ModalTrigger>
          <span>Open settings</span>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Settings</ModalTitle>
        </ModalContent>
      </Modal>
    );

    const trigger = screen.getByText("Open settings");

    expect(trigger).toHaveAttribute("tabindex", "0");
    expect(trigger).toHaveAttribute("role", "button");
  });

  it("forwards an explicit tabIndex and leaves a native button untouched", () => {
    const { unmount } = render(
      <Modal>
        <ModalTrigger tabIndex={-1}>
          <span>Open settings</span>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Settings</ModalTitle>
        </ModalContent>
      </Modal>
    );

    expect(screen.getByText("Open settings")).toHaveAttribute(
      "tabindex",
      "-1"
    );

    unmount();

    render(
      <Modal>
        <ModalTrigger>
          <button type="button">Native open</button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Settings</ModalTitle>
        </ModalContent>
      </Modal>
    );

    const native = screen.getByRole("button", {
      name: "Native open",
    });

    expect(native).not.toHaveAttribute("tabindex");
    expect(native).not.toHaveAttribute("role");
  });
});
