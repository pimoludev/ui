import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarToggle,
} from "./navbar";

describe("Pimolu Navbar", () => {
  it("renders a banner with a named navigation", () => {
    render(
      <Navbar>
        <NavbarBrand href="/">Pimolu</NavbarBrand>

        <NavbarContent>
          <NavbarItem href="/docs" active>
            Docs
          </NavbarItem>

          <NavbarItem href="/blog">Blog</NavbarItem>
        </NavbarContent>

        <NavbarActions>
          <button type="button">Sign in</button>
        </NavbarActions>
      </Navbar>
    );

    expect(
      screen.getByRole("banner")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", { name: "Main" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Pimolu" })
    ).toHaveAttribute("href", "/");

    expect(
      screen.getByRole("link", { name: "Docs" })
    ).toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("link", { name: "Blog" })
    ).not.toHaveAttribute("aria-current");
  });

  it("accepts a custom navigation label", () => {
    render(
      <Navbar>
        <NavbarContent aria-label="Documentation">
          <NavbarItem href="/docs">Docs</NavbarItem>
        </NavbarContent>
      </Navbar>
    );

    expect(
      screen.getByRole("navigation", {
        name: "Documentation",
      })
    ).toBeInTheDocument();
  });

  it("marks sticky and bordered modes", () => {
    render(
      <Navbar sticky bordered={false}>
        <NavbarBrand href="/">Pimolu</NavbarBrand>
      </Navbar>
    );

    const header = screen.getByRole("banner");

    expect(header).toHaveAttribute(
      "data-sticky",
      "true"
    );

    expect(header).not.toHaveAttribute(
      "data-bordered"
    );
  });

  it("opens a collapsible menu and closes it after navigation", () => {
    render(
      <Navbar collapsible>
        <NavbarBrand href="/">Pimolu</NavbarBrand>
        <NavbarToggle />
        <NavbarContent id="site-navigation">
          <NavbarItem href="#docs" icon={<svg data-testid="docs-icon" />}>
            Docs
          </NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <button type="button">Sign in</button>
        </NavbarActions>
      </Navbar>
    );

    const toggle = screen.getByRole("button", { name: "Open menu" });
    const navigation = screen.getByRole("navigation", { name: "Main" });

    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-controls", navigation.id);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("banner")).toHaveAttribute("data-open", "false");
    expect(screen.getByTestId("docs-icon").parentElement).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "Close menu");
    expect(screen.getByRole("banner")).toHaveAttribute("data-open", "true");

    fireEvent.click(screen.getByRole("link", { name: "Docs" }));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and restores focus to the toggle", () => {
    render(
      <Navbar collapsible defaultOpen>
        <NavbarToggle />
        <NavbarContent>
          <NavbarItem href="#docs">Docs</NavbarItem>
        </NavbarContent>
      </Navbar>
    );

    screen.getByRole("link", { name: "Docs" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
    expect(screen.getByRole("banner")).toHaveAttribute("data-open", "false");
  });

  it("closes on an outside pointer and accepts custom icons", () => {
    render(
      <Navbar collapsible defaultOpen>
        <NavbarToggle
          icon={<span data-testid="menu-icon">Menu</span>}
          closeIcon={<span data-testid="close-icon">Close</span>}
        />
        <NavbarContent>
          <NavbarItem href="#docs">Docs</NavbarItem>
        </NavbarContent>
      </Navbar>
    );

    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveAttribute("data-open", "false");
  });

  it("supports a controlled menu state", () => {
    const onOpenChange = vi.fn();
    const content = (open: boolean) => (
      <Navbar collapsible open={open} onOpenChange={onOpenChange}>
        <NavbarToggle />
        <NavbarContent>
          <NavbarItem href="#docs">Docs</NavbarItem>
        </NavbarContent>
      </Navbar>
    );

    const { rerender } = render(content(false));
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("banner")).toHaveAttribute("data-open", "false");

    rerender(content(true));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  });

  it("defaults the items to the left and exposes center and right", () => {
    const content = (position: "left" | "center" | "right") => (
      <Navbar itemsPosition={position}>
        <NavbarBrand href="/">Pimolu</NavbarBrand>
        <NavbarContent>
          <NavbarItem href="/docs">Docs</NavbarItem>
        </NavbarContent>
        <NavbarActions>
          <button type="button">Sign in</button>
        </NavbarActions>
      </Navbar>
    );

    const { rerender } = render(content("left"));

    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-items-position",
      "left"
    );

    rerender(content("center"));
    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-items-position",
      "center"
    );

    rerender(content("right"));
    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-items-position",
      "right"
    );
  });
});
