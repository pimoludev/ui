import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  Toaster,
  dismissAllToasts,
  toast,
  updateToast,
  dismissToast,
} from "./toast";
import { toastVariantMap } from "./toast.variants";

afterEach(() => {
  dismissAllToasts();
  vi.useRealTimers();
});

describe("Toast loading, customization and lifecycle", () => {
  beforeEach(() => { vi.useFakeTimers(); });

  function notify(options: Parameters<typeof toast>[0]) {
    let id = "";
    act(() => { id = toast(options); });
    return id;
  }

  function advance(milliseconds: number) {
    act(() => { vi.advanceTimersByTime(milliseconds); });
  }

  it("mounts the empty live region before any notifications", () => {
    render(<Toaster />);
    expect(screen.getByRole("region", { name: "Notifications" })).toBeEmptyDOMElement();
  });

  it.each(Object.keys(toastVariantMap.variant) as Array<keyof typeof toastVariantMap.variant>)(
    "renders the decorative icon for %s", (variant) => {
      const { container } = render(<Toaster classNames={{ icon: "global-icon" }} />);
      notify({ title: "Status", variant });
      const icon = container.querySelector(".pimolu-toast__icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon).toHaveClass("global-icon");
      expect(container.querySelector(`.pimolu-toast--${variant}`)).toBeInTheDocument();
    },
  );

  it("replaces or hides icons without removing the message or built-in classes", () => {
    const { container } = render(<Toaster classNames={{ icon: "global-icon" }} />);
    const id = notify({ title: "Custom", icon: <span>Mailbox</span>, classNames: { icon: "local-icon" } });
    expect(screen.getByText("Mailbox").parentElement).toHaveClass("pimolu-toast__icon", "local-icon");
    expect(screen.getByText("Mailbox").parentElement).not.toHaveClass("global-icon");
    act(() => toast.update(id, { icon: null }));
    expect(container.querySelector(".pimolu-toast__icon")).toBeNull();
    act(() => toast.update(id, { icon: false }));
    expect(container.querySelector(".pimolu-toast__icon")).toBeNull();
    act(() => toast.update(id, { icon: undefined }));
    expect(container.querySelector(".pimolu-toast__icon svg")).toBeInTheDocument();
  });

  it("keeps loading visible, marks it busy and blocks its action until updated", () => {
    const onClick = vi.fn();
    const { container } = render(<Toaster />);
    let id = "";
    act(() => { id = toast.loading("Uploading", { duration: 1000, action: { label: "Open", onClick } }); });
    expect(screen.getByText("Uploading").closest(".pimolu-toast")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".pimolu-spinner")).toHaveAttribute("aria-hidden", "true");
    const action = screen.getByRole("button", { name: "Open" });
    expect(action).toBeDisabled();
    fireEvent.click(action);
    expect(onClick).not.toHaveBeenCalled();
    advance(60000);
    expect(screen.getByText("Uploading")).toBeInTheDocument();
    act(() => toast.update(id, { title: "Uploaded", variant: "success" }));
    expect(action).toBeEnabled();
    expect(screen.getByText("Uploaded").closest(".pimolu-toast")).not.toHaveAttribute("aria-busy");
    advance(999);
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Uploaded")).toBeNull();
  });

  it("updates repeated ids in place and clears the previous auto-dismiss timer", () => {
    const { container } = render(<Toaster />);
    const id = notify({ id: "save", title: "Saving", duration: 1000 });
    const element = screen.getByText("Saving").closest(".pimolu-toast");
    advance(600);
    expect(notify({ id, title: "Saved", duration: 2000 })).toBe(id);
    expect(container.querySelectorAll(".pimolu-toast")).toHaveLength(1);
    expect(screen.getByText("Saved").closest(".pimolu-toast")).toBe(element);
    advance(1999);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("does not recreate a notification when updating a missing id", () => {
    render(<Toaster />);
    act(() => expect(updateToast("missing", { title: "Gone" })).toBe("missing"));
    expect(screen.queryByText("Gone")).toBeNull();
  });

  it("pauses the remaining delay across overlapping pointer and keyboard interaction", () => {
    render(<Toaster />);
    notify({ title: "Read me", duration: 1000 });
    const card = screen.getByText("Read me").closest(".pimolu-toast")!;
    const close = screen.getByRole("button", { name: "Dismiss notification" });
    advance(300);
    fireEvent.pointerOver(card);
    act(() => close.focus());
    advance(10000);
    fireEvent.pointerOut(card);
    advance(10000);
    expect(screen.getByText("Read me")).toBeInTheDocument();
    act(() => close.blur());
    advance(699);
    expect(screen.getByText("Read me")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Read me")).toBeNull();
  });

  it("keeps the timer paused when focus moves between action and close", () => {
    render(<Toaster />);
    notify({ title: "Archived", duration: 1000, action: { label: "Undo", onClick: vi.fn() } });
    const undo = screen.getByRole("button", { name: "Undo" });
    const close = screen.getByRole("button", { name: "Dismiss notification" });
    act(() => undo.focus());
    advance(5000);
    act(() => close.focus());
    advance(5000);
    expect(screen.getByText("Archived")).toBeInTheDocument();
    act(() => close.blur());
    advance(1000);
    expect(screen.queryByText("Archived")).toBeNull();
  });

  it("can independently disable hover and focus pause", () => {
    render(<Toaster />);
    notify({ title: "Brief", duration: 1000, pauseOnHover: false, pauseOnFocus: false });
    fireEvent.pointerOver(screen.getByText("Brief").closest(".pimolu-toast")!);
    act(() => screen.getByRole("button", { name: "Dismiss notification" }).focus());
    advance(1000);
    expect(screen.queryByText("Brief")).toBeNull();
  });

  it("removes a pause when its setting is disabled during an update", () => {
    render(<Toaster />);
    const id = notify({ title: "Brief", duration: 1000 });
    fireEvent.pointerOver(screen.getByText("Brief").closest(".pimolu-toast")!);
    act(() => toast.update(id, { pauseOnHover: false }));
    advance(1000);
    expect(screen.queryByText("Brief")).toBeNull();
  });

  it("supports translated and hidden dismiss controls and calls dismissal once", () => {
    const onDismiss = vi.fn();
    render(<Toaster />);
    const id = notify({ title: "Saved", duration: 1000, dismissible: false, onDismiss });
    expect(screen.queryByRole("button")).toBeNull();
    act(() => toast.update(id, { dismissible: true, dismissLabel: "Fermer la notification" }));
    fireEvent.click(screen.getByRole("button", { name: "Fermer la notification" }));
    act(() => dismissToast(id));
    advance(1000);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(id);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears every timer and calls every callback when dismissing all", () => {
    const onDismiss = vi.fn();
    render(<Toaster />);
    notify({ title: "One", onDismiss });
    notify({ title: "Two", onDismiss });
    act(() => toast.dismiss());
    expect(screen.queryByText("One")).toBeNull();
    expect(onDismiss).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["success", "error", "warning", "info", "loading"] as const)(
    "exposes the %s shortcut", (shortcut) => {
      render(<Toaster />);
      act(() => toast[shortcut]("Shortcut", { description: "Details", duration: 0 }));
      expect(screen.getByText("Shortcut").closest(".pimolu-toast")).toHaveClass(
        `pimolu-toast--${shortcut === "error" ? "danger" : shortcut}`,
      );
      expect(screen.getByText("Details")).toBeInTheDocument();
    },
  );

  it("replaces loading with the resolved result and starts the normal delay", async () => {
    render(<Toaster />);
    let resolve!: (value: string) => void;
    const promise = new Promise<string>((done) => { resolve = done; });
    let id = "";
    act(() => { id = toast.promise(promise, { loading: "Exporting", success: (name) => `${name} ready`, error: "Failed" }); });
    const card = screen.getByText("Exporting").closest(".pimolu-toast");
    advance(10000);
    await act(async () => { resolve("Report"); });
    expect(screen.getByText("Report ready").closest(".pimolu-toast")).toBe(card);
    expect(card).toHaveClass("pimolu-toast--success");
    expect(typeof id).toBe("string");
    advance(5000);
    expect(screen.queryByText("Report ready")).toBeNull();
  });

  it("reports a rejected promise with its error formatter", async () => {
    render(<Toaster />);
    await act(async () => {
      toast.promise(Promise.reject(new Error("Offline")), {
        loading: "Connecting", success: "Connected",
        error: (error) => error instanceof Error ? error.message : "Failed",
      });
    });
    expect(screen.getByText("Offline").closest(".pimolu-toast")).toHaveClass("pimolu-toast--danger");
  });

  it("handles a synchronously throwing factory and throwing message formatter", async () => {
    render(<Toaster />);
    await act(async () => {
      toast.promise(() => { throw new Error("Factory error"); }, {
        loading: "Working", success: "Done", error: "Factory failed",
      });
    });
    expect(screen.getByText("Factory failed")).toBeInTheDocument();
    await act(async () => {
      toast.promise(Promise.resolve("Done"), {
        loading: "Working", success: () => { throw new Error("Formatter error"); }, error: "Failed",
      });
    });
    expect(screen.getByText("Unable to complete the operation.")).toBeInTheDocument();
  });

  it.each(["dismiss", "update", "reuse"])("ignores a late result after %s", async (operation) => {
    render(<Toaster />);
    let resolve!: (value: string) => void;
    const promise = new Promise<string>((done) => { resolve = done; });
    let id = "";
    act(() => { id = toast.promise(promise, { loading: "Working", success: "Late result", error: "Failed" }); });
    act(() => {
      if (operation === "dismiss") toast.dismiss(id);
      if (operation === "update") toast.update(id, { title: "Manual update", variant: "info" });
      if (operation === "reuse") { toast.dismiss(id); toast.success("New task", { id }); }
    });
    await act(async () => { resolve("Done"); });
    expect(screen.queryByText("Late result")).toBeNull();
    if (operation === "update") expect(screen.getByText("Manual update")).toBeInTheDocument();
    if (operation === "reuse") expect(screen.getByText("New task")).toBeInTheDocument();
  });
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
