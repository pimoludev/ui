import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Toaster,
  dismissAllToasts,
  toast,
} from "./toast";

afterEach(() => {
  dismissAllToasts();
  vi.useRealTimers();
});

describe("Pimolu Toast", () => {
  it("adds a toast to the live region", () => {
    render(<Toaster />);

    act(() => {
      toast({
        title: "Saved",
        description: "The project is up to date.",
      });
    });

    expect(
      screen.getByRole("region", {
        name: "Notifications",
      })
    ).toHaveAttribute("aria-live", "polite");

    expect(screen.getByText("Saved")).toBeInTheDocument();

    expect(
      screen.getByText("The project is up to date.")
    ).toBeInTheDocument();
  });

  it("applies the variant class", () => {
    render(<Toaster />);

    act(() => {
      toast({
        title: "Deploy failed",
        variant: "danger",
      });
    });

    expect(
      screen.getByText("Deploy failed").closest(
        ".pimolu-toast"
      )
    ).toHaveClass(
      "pimolu-toast",
      "pimolu-toast--danger"
    );
  });

  it("auto-dismisses after the duration", () => {
    vi.useFakeTimers();

    render(<Toaster />);

    act(() => {
      toast({ title: "Saved", duration: 1000 });
    });

    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("dismisses from the close button", () => {
    render(<Toaster />);

    act(() => {
      toast({ title: "Saved", duration: 0 });
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Dismiss notification",
      })
    );

    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("runs an action before dismissing", () => {
    const onClick = vi.fn();

    render(<Toaster />);

    act(() => {
      toast({
        title: "Archived",
        duration: 0,
        action: { label: "Undo", onClick },
      });
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Undo" })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Archived")).toBeNull();
  });
});
