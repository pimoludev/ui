import {
  fireEvent,
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

function Example() {
  return (
    <NavigationMenu>
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
