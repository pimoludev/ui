import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

afterEach(() => {
  vi.useRealTimers();
});

function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <button type="button">Delete</button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <button type="button">Cancel</button>
          </AlertDialogCancel>

          <AlertDialogAction>
            <button type="button">Delete</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("Pimolu AlertDialog", () => {
  it("renders an alertdialog", () => {
    render(<Example />);

    fireEvent.click(
      screen.getByRole("button", { name: "Delete" })
    );

    expect(
      screen.getByRole("alertdialog", {
        name: "Delete project?",
      })
    ).toBeInTheDocument();
  });

  it("does not close on overlay click or Escape", () => {
    render(<Example />);

    fireEvent.click(
      screen.getByRole("button", { name: "Delete" })
    );

    fireEvent.pointerDown(
      document.querySelector(".pimolu-dialog__overlay")!
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.getByRole("alertdialog")
    ).toBeInTheDocument();
  });

  it("closes from an explicit action", () => {
    vi.useFakeTimers();

    render(<Example />);

    fireEvent.click(
      screen.getByRole("button", { name: "Delete" })
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(
      screen.queryByRole("alertdialog")
    ).toBeNull();
  });
});
