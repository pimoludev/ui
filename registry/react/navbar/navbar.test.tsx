import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
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
});
