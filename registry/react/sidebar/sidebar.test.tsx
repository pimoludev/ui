import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
} from "./sidebar";

describe("Pimolu Sidebar", () => {
  it("renders a complementary landmark and a named navigation", () => {
    render(
      <Sidebar>
        <SidebarHeader>Pimolu</SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>

            <SidebarItem href="/" active>
              Overview
            </SidebarItem>

            <SidebarItem href="/projects">
              Projects
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>v0.1.0</SidebarFooter>
      </Sidebar>
    );

    expect(
      screen.getByRole("complementary")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", {
        name: "Sidebar",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Overview" })
    ).toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("link", { name: "Projects" })
    ).not.toHaveAttribute("aria-current");

    expect(screen.getByText("Workspace")).toHaveClass(
      "pimolu-sidebar__group-label"
    );
  });

  it("accepts an icon and a custom navigation label", () => {
    render(
      <Sidebar>
        <SidebarContent aria-label="Workspace navigation">
          <SidebarItem href="/" icon={<span>★</span>}>
            Overview
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
    );

    expect(
      screen.getByRole("navigation", {
        name: "Workspace navigation",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Overview" })
    ).toBeInTheDocument();
  });

  it("marks sticky mode", () => {
    render(
      <Sidebar sticky>
        <SidebarContent>
          <SidebarItem href="/">Overview</SidebarItem>
        </SidebarContent>
      </Sidebar>
    );

    expect(
      screen.getByRole("complementary")
    ).toHaveAttribute("data-sticky", "true");
  });

  it("collapses and restores the navigation with an accessible control", () => {
    render(
      <Sidebar collapsible>
        <SidebarContent>
          <SidebarItem href="/">Overview</SidebarItem>
        </SidebarContent>
      </Sidebar>
    );

    const sidebar = screen.getByRole("complementary");
    const collapse = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(collapse).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(collapse);
    expect(sidebar).toHaveAttribute("data-collapsed", "true");
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(sidebar).not.toHaveAttribute("data-collapsed");
  });

  it("supports a controlled collapsed state and custom control labels", () => {
    const onCollapsedChange = vi.fn();
    const { rerender } = render(
      <Sidebar collapsible collapsed={false} onCollapsedChange={onCollapsedChange} collapseLabel="Hide navigation" expandLabel="Show navigation">
        <SidebarContent>Navigation</SidebarContent>
      </Sidebar>
    );

    fireEvent.click(screen.getByRole("button", { name: "Hide navigation" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("complementary")).not.toHaveAttribute("data-collapsed");

    rerender(
      <Sidebar collapsible collapsed onCollapsedChange={onCollapsedChange} collapseLabel="Hide navigation" expandLabel="Show navigation">
        <SidebarContent>Navigation</SidebarContent>
      </Sidebar>
    );
    expect(screen.getByRole("complementary")).toHaveAttribute("data-collapsed", "true");
    expect(screen.getByRole("button", { name: "Show navigation" })).toHaveAttribute("aria-expanded", "false");
  });
});
