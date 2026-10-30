import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PimoluNavbarMenuProps } from "./navbar.types";
import { Navbar, NavbarActions, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarToggle } from "./navbar";

let width: number;
let resize: ResizeObserverCallback;

function Example({ menu = {}, open, onOpenChange }: {
  menu?: Partial<PimoluNavbarMenuProps>;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}) {
  return (
    <Navbar collapsible open={open} onOpenChange={onOpenChange}>
      <NavbarBrand href="#home">Atlas</NavbarBrand>
      <NavbarToggle />
      <NavbarMenu label="Workspace" animated={false} {...menu}>
        <NavbarContent aria-label="Sections">
          <NavbarItem href="#projects">Projects</NavbarItem>
          <NavbarItem href="#team">Team</NavbarItem>
        </NavbarContent>
        <NavbarActions><button type="button">Create project</button></NavbarActions>
      </NavbarMenu>
    </Navbar>
  );
}

describe("NavbarMenu", () => {
  beforeEach(() => {
    width = 390;
    const rect = HTMLElement.prototype.getBoundingClientRect;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return this.classList.contains("pimolu-navbar")
        ? { x: 0, y: 0, top: 0, left: 0, right: width, bottom: 64, width, height: 64, toJSON: () => ({}) }
        : rect.call(this);
    });
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe() {}
      disconnect() {}
      unobserve() {}
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(["left", "right", "top", "bottom"] as const)("opens from %s with one named navigation and modal trigger association", async (side) => {
    render(<Example menu={{ side }} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("link", { name: "Projects" })).not.toBeInTheDocument();
    fireEvent.click(toggle);
    const panel = await screen.findByRole("dialog", { name: "Workspace" });
    expect(panel).toHaveAttribute("data-side", side);
    expect(toggle).toHaveAttribute("aria-controls", panel.id);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("navigation", { name: "Sections" })).toHaveLength(1);
    expect(within(panel).getByRole("button", { name: "Create project" })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("traps Tab, closes on Escape and restores the toggle without an instant-mode exit delay", async () => {
    render(<Example />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    const panel = await screen.findByRole("dialog", { name: "Workspace" });
    const first = within(panel).getByRole("link", { name: "Projects" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(within(panel).getByRole("button", { name: "Close menu" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("keeps portalled interactions inside the menu and closes after link activation", async () => {
    render(<Example />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const panel = await screen.findByRole("dialog");
    const link = within(panel).getByRole("link", { name: "Team" });
    fireEvent.pointerDown(link);
    expect(panel).toBeInTheDocument();
    fireEvent.click(link);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exposes fullscreen, size and custom dimensions without leaking props into the header", async () => {
    render(<Example menu={{ side: "bottom", size: "lg", fullScreen: true, style: { height: "80dvh" } }} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const panel = await screen.findByRole("dialog");
    expect(panel).toHaveClass("pimolu-navbar__menu-panel--full", "pimolu-drawer__content--lg");
    expect(panel.style.height).toBe("80dvh");
    expect(screen.getByRole("banner")).not.toHaveAttribute("fullScreen");
    expect(panel).toHaveClass("pimolu-navbar__menu-layer--instant");
  });

  it("keeps the animated exit mounted and cleans up its scroll lock", async () => {
    render(<Example menu={{ animated: true }} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const panel = await screen.findByRole("dialog");
    fireEvent.click(within(panel).getByRole("button", { name: "Close menu" }));
    expect(panel).toHaveAttribute("data-state", "closing");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("honors reduced motion for an animated menu's exit", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    window.matchMedia = vi.fn(() => ({ matches: true } as MediaQueryList));
    render(<Example menu={{ animated: true }} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const panel = await screen.findByRole("dialog");
    fireEvent.click(within(panel).getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("restores one inline navigation when its container becomes wide", async () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("dialog");
    act(() => { width = 1100; resize([], {} as ResizeObserver); });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Projects" })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Open menu" })).not.toHaveAttribute("aria-haspopup");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(document.body.style.overflow).not.toBe("hidden");
    act(() => { width = 390; resize([], {} as ResizeObserver); });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps controlled state ownership and forwards scoped classes into the portal", async () => {
    const change = vi.fn();
    const menu = { classNames: { menuPanel: "custom-panel", menuTitle: "custom-title", menuOverlay: "custom-scrim" } };
    const { rerender } = render(<Example menu={menu} open={false} onOpenChange={change} />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(<Example menu={menu} open onOpenChange={change} />);
    const panel = await screen.findByRole("dialog");
    expect(panel).toHaveClass("custom-panel");
    expect(within(panel).getByRole("heading", { name: "Workspace" })).toHaveClass("custom-title");
    const overlay = document.querySelector(".custom-scrim")!;
    fireEvent.pointerDown(overlay);
    expect(change).toHaveBeenLastCalledWith(false);
  });
});
