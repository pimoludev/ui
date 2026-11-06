import {
  fireEvent,
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";

function Example({ openOnHover = false }: { openOnHover?: boolean } = {}) {
  return (
    <NavigationMenu openOnHover={openOnHover}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>
            Products
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <NavigationMenuLink href="/one">
              One
            </NavigationMenuLink>

            <NavigationMenuLink href="/two" active>
              Two
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("Pimolu NavigationMenu", () => {
  it("opens and closes a menu", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Products",
    });

    expect(
      screen.getByRole("navigation", { name: "Main" })
    ).toBeInTheDocument();

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(
      screen.queryByRole("link", { name: "One" })
    ).toBeNull();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    expect(
      screen.getByRole("link", { name: "One" })
    ).toBeVisible();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    expect(
      screen.queryByRole("link", { name: "One" })
    ).toBeNull();
  });

  it("wires trigger and content ids and the active link", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Products",
    });

    fireEvent.click(trigger);

    const content = document.getElementById(
      trigger.getAttribute("aria-controls") ?? ""
    );

    expect(content).not.toBeNull();
    expect(content).toHaveAttribute(
      "aria-labelledby",
      trigger.id
    );

    expect(
      screen.getByRole("link", { name: "Two" })
    ).toHaveAttribute("aria-current", "page");
  });

  it("closes on Escape", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Products",
    });

    fireEvent.click(trigger);
    screen.getByRole("link", { name: "One" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByRole("link", { name: "One" })
    ).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("uses an explicit aria-label ahead of the label alias", () => {
    render(
      <NavigationMenu label="Main" aria-label="Documentation">
        <NavigationMenuList>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>Content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation", { name: "Documentation" })).toBeInTheDocument();
  });

  it("closes on an outside pointerdown", () => {
    render(<Example />);

    fireEvent.click(
      screen.getByRole("button", { name: "Products" })
    );

    fireEvent.pointerDown(document.body);

    expect(
      screen.queryByRole("link", { name: "One" })
    ).toBeNull();
  });

  it("closes after a link click and keeps its handler", () => {
    const onClick = vi.fn();

    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>
              Products
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <NavigationMenuLink
                href="/one"
                onClick={onClick}
              >
                One
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Products" })
    );

    fireEvent.click(
      screen.getByRole("link", { name: "One" })
    );

    expect(onClick).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole("link", { name: "One" })
    ).toBeNull();
  });

  it("opens with ArrowDown and focuses the first link", async () => {
    render(<Example />);

    const trigger = screen.getByRole("button", {
      name: "Products",
    });

    trigger.focus();

    fireEvent.keyDown(trigger, {
      key: "ArrowDown",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "One" })
      ).toHaveFocus();
    });
  });
});


function pointer(node: Element, type: "over" | "out", pointerType = "mouse") {
  const event = new MouseEvent(`pointer${type}`, { bubbles: true, relatedTarget: document.body });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(node, event);
}

describe("NavigationMenu optional hover", () => {
  it("does not open disabled triggers, including a trigger disabled during the delay", () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(<fieldset disabled><Example openOnHover /></fieldset>);
      const trigger = screen.getByRole("button", { name: "Products" });
      pointer(trigger, "over");
      act(() => vi.advanceTimersByTime(150));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      rerender(<fieldset><Example openOnHover /></fieldset>);
      pointer(trigger, "over");
      rerender(<fieldset disabled><Example openOnHover /></fieldset>);
      act(() => vi.advanceTimersByTime(150));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    } finally { vi.useRealTimers(); }
  });

  it("keeps the click-only default and ignores touch hover", () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(<Example />);
      const trigger = screen.getByRole("button", { name: "Products" });
      pointer(trigger, "over");
      act(() => vi.advanceTimersByTime(150));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      rerender(<Example openOnHover />);
      pointer(trigger, "over", "touch");
      act(() => vi.advanceTimersByTime(150));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    } finally { vi.useRealTimers(); }
  });

  it("opens without moving focus and keeps the panel while the pointer crosses the gap", () => {
    vi.useFakeTimers();
    try {
      render(<><button>Elsewhere</button><Example openOnHover /></>);
      const outside = screen.getByRole("button", { name: "Elsewhere" });
      outside.focus();
      const trigger = screen.getByRole("button", { name: "Products" });
      pointer(trigger, "over");
      act(() => vi.advanceTimersByTime(100));
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(outside).toHaveFocus();
      const root = screen.getByRole("navigation", { name: "Main" });
      pointer(root, "out");
      act(() => vi.advanceTimersByTime(100));
      pointer(screen.getByRole("link", { name: "One" }), "over");
      act(() => vi.advanceTimersByTime(250));
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      pointer(root, "out");
      act(() => vi.advanceTimersByTime(180));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    } finally { vi.useRealTimers(); }
  });

  it("cancels a pending hover when disabled or unmounted", () => {
    vi.useFakeTimers();
    try {
      const { rerender, unmount } = render(<Example openOnHover />);
      const trigger = screen.getByRole("button", { name: "Products" });
      pointer(trigger, "over");
      rerender(<Example openOnHover={false} />);
      act(() => vi.advanceTimersByTime(150));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      rerender(<Example openOnHover />);
      pointer(trigger, "over");
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally { vi.useRealTimers(); }
  });

  it("keeps ArrowDown and Escape focus behavior and closes when focus leaves", async () => {
    render(<><Example openOnHover /><button>Outside</button></>);
    const trigger = screen.getByRole("button", { name: "Products" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() => expect(screen.getByRole("link", { name: "One" })).toHaveFocus());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    fireEvent.blur(trigger, { relatedTarget: screen.getByRole("button", { name: "Outside" }) });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
