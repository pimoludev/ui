import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  useState,
  type ComponentProps,
} from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Popconfirm } from "./popconfirm";

afterEach(() => {
  vi.useRealTimers();
});

function Example(
  props: Partial<ComponentProps<typeof Popconfirm>> = {}
) {
  return (
    <div>
      <Popconfirm
        title="Delete project?"
        description="This action cannot be undone."
        onConfirm={() => {}}
        {...props}
      >
        <button type="button">Delete project</button>
      </Popconfirm>

      <button type="button">Outside</button>
    </div>
  );
}

function open() {
  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete project",
    })
  );
}

function finishClose() {
  act(() => {
    vi.advanceTimersByTime(120);
  });
}

describe("Pimolu Popconfirm", () => {
  it("renders a dialog trigger that is closed initially", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Delete project",
    });

    expect(trigger).toHaveAttribute(
      "aria-haspopup",
      "dialog"
    );

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens a dialog named by its title and focuses Cancel first", () => {
    render(<Example />);

    open();

    expect(
      screen.getByRole("dialog", {
        name: "Delete project?",
      })
    ).toHaveTextContent("This action cannot be undone.");

    expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toHaveFocus();
  });

  it("confirms, closes and returns focus to the trigger", () => {
    vi.useFakeTimers();

    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <Example
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Confirm" })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();

    expect(
      screen.getByRole("button", {
        name: "Delete project",
      })
    ).toHaveFocus();

    finishClose();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("cancels exactly once and returns focus to the trigger", () => {
    vi.useFakeTimers();

    const onCancel = vi.fn();

    render(<Example onCancel={onCancel} />);

    open();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("button", {
        name: "Delete project",
      })
    ).toHaveFocus();

    finishClose();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the destructive variant and custom labels", () => {
    render(
      <Example
        variant="destructive"
        confirmLabel="Delete"
        cancelLabel="Keep"
      />
    );

    open();

    const panel = screen
      .getByRole("dialog")
      .querySelector(".pimolu-popconfirm");

    expect(panel).toHaveAttribute(
      "data-variant",
      "destructive"
    );

    expect(
      screen.getByRole("button", { name: "Delete" })
    ).toHaveClass(
      "pimolu-popconfirm__button--confirm"
    );

    expect(
      screen.getByRole("button", { name: "Keep" })
    ).toBeInTheDocument();
  });

  it("follows a controlled open state", () => {
    vi.useFakeTimers();

    const onOpenChange = vi.fn();

    function Controlled() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <Example
          open={isOpen}
          onOpenChange={(next) => {
            onOpenChange(next);
            setIsOpen(next);
          }}
        />
      );
    }

    render(<Controlled />);

    open();

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    finishClose();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("cancels on Escape and returns focus to the trigger", () => {
    vi.useFakeTimers();

    const onCancel = vi.fn();

    render(<Example onCancel={onCancel} />);

    open();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onCancel).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("button", {
        name: "Delete project",
      })
    ).toHaveFocus();

    finishClose();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("cancels on an outside pointerdown", () => {
    vi.useFakeTimers();

    const onCancel = vi.fn();

    render(<Example onCancel={onCancel} />);

    open();

    fireEvent.pointerDown(
      screen.getByRole("button", { name: "Outside" })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);

    finishClose();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("never opens when disabled", () => {
    render(<Example disabled />);

    open();

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
