import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardLayout } from "./dashboard-layout";

describe("Pimolu DashboardLayout", () => {
  it("renders the sidebar, navbar, content and aside regions", () => {
    render(
      <DashboardLayout
        sidebar={<nav aria-label="Projects">Projects</nav>}
        navbar={<header>Topbar</header>}
        aside={<p>Activity</p>}
        asideLabel="Recent activity"
      >
        <h1>Dashboard</h1>
      </DashboardLayout>
    );

    expect(
      screen.getByRole("navigation", { name: "Projects" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("banner")
    ).toHaveTextContent("Topbar");

    expect(
      screen.getByRole("main")
    ).toHaveTextContent("Dashboard");

    expect(
      screen.getByRole("complementary", {
        name: "Recent activity",
      })
    ).toHaveTextContent("Activity");
  });

  it("supports a main-only layout", () => {
    const { container } = render(
      <DashboardLayout>
        <p>Only content</p>
      </DashboardLayout>
    );

    const layout = container.querySelector(
      ".pimolu-dashboard-layout"
    );

    expect(layout).toHaveAttribute("data-sidebar", "false");
    expect(layout).toHaveAttribute("data-aside", "false");
    expect(
      container.querySelector(
        ".pimolu-dashboard-layout__sidebar"
      )
    ).toBeNull();
    expect(
      container.querySelector(
        ".pimolu-dashboard-layout__aside"
      )
    ).toBeNull();
  });

  it("exposes the sidebar and aside widths", () => {
    const { container } = render(
      <DashboardLayout
        sidebar={<span>Sidebar</span>}
        aside={<span>Aside</span>}
        sidebarWidth="18rem"
        asideWidth={320}
      >
        <p>Content</p>
      </DashboardLayout>
    );

    const layout = container.querySelector(
      ".pimolu-dashboard-layout"
    ) as HTMLElement;

    expect(
      layout.style.getPropertyValue(
        "--pimolu-dashboard-sidebar-width"
      )
    ).toBe("18rem");

    expect(
      layout.style.getPropertyValue(
        "--pimolu-dashboard-aside-width"
      )
    ).toBe("320px");
  });

  it("marks sticky regions and merges a custom class", () => {
    const { container } = render(
      <DashboardLayout
        sidebar={<span>Sidebar</span>}
        navbar={<span>Navbar</span>}
        stickySidebar
        stickyNavbar
        className="custom-layout"
      >
        <p>Content</p>
      </DashboardLayout>
    );

    const layout = container.querySelector(
      ".pimolu-dashboard-layout"
    );

    expect(layout).toHaveClass(
      "pimolu-dashboard-layout",
      "custom-layout"
    );
    expect(layout).toHaveAttribute(
      "data-sticky-sidebar",
      "true"
    );
    expect(layout).toHaveAttribute(
      "data-sticky-navbar",
      "true"
    );
  });

  it("keeps custom attributes and the main landmark", () => {
    render(
      <DashboardLayout data-testid="layout" aria-label="Workspace">
        <p>Content</p>
      </DashboardLayout>
    );

    expect(
      screen.getByTestId("layout")
    ).toHaveAttribute("aria-label", "Workspace");

    expect(screen.getByRole("main")).toHaveTextContent(
      "Content"
    );
  });
});
