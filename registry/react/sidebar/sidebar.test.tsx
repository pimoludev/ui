import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
