import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./app-shell";

describe("Pimolu AppShell", () => {
  it("renders the banner, main and contentinfo landmarks", () => {
    render(
      <AppShell header={<span>Header</span>}>
        <p>Workspace content</p>
      </AppShell>
    );

    expect(
      screen.getByRole("banner")
    ).toHaveTextContent("Header");

    expect(screen.getByRole("main")).toHaveTextContent(
      "Workspace content"
    );

    expect(
      screen.queryByRole("contentinfo")
    ).toBeNull();
  });

  it("adds a labelled footer when one is passed", () => {
    render(
      <AppShell
        header="Header"
        footer={<span>Status: operational</span>}
      >
        Main
      </AppShell>
    );

    expect(
      screen.getByRole("contentinfo")
    ).toHaveTextContent("Status: operational");
  });

  it("exposes labelled complementary landmarks for sidebar and aside", () => {
    render(
      <AppShell
        header="Header"
        sidebar={<nav>Navigation</nav>}
        aside={<p>Activity</p>}
        sidebarLabel="Workspace navigation"
        asideLabel="Recent activity"
      >
        Main
      </AppShell>
    );

    expect(
      screen.getByRole("complementary", {
        name: "Workspace navigation",
      })
    ).toHaveTextContent("Navigation");

    expect(
      screen.getByRole("complementary", {
        name: "Recent activity",
      })
    ).toHaveTextContent("Activity");
  });

  it("does not render optional regions when they are omitted", () => {
    render(<AppShell header="Header">Main</AppShell>);

    expect(
      screen.queryByRole("complementary")
    ).toBeNull();

    const shell = screen.getByRole("main").parentElement;

    expect(shell).toHaveAttribute("data-sidebar", "false");
    expect(shell).toHaveAttribute("data-aside", "false");
  });

  it("turns width props into CSS custom properties", () => {
    render(
      <AppShell
        header="Header"
        sidebar="Sidebar"
        aside="Aside"
        sidebarWidth={220}
        asideWidth="15rem"
      >
        Main
      </AppShell>
    );

    const shell = screen.getByRole("main").parentElement!;

    expect(shell.style.getPropertyValue(
      "--pimolu-app-shell-sidebar-width"
    )).toBe("220px");

    expect(shell.style.getPropertyValue(
      "--pimolu-app-shell-aside-width"
    )).toBe("15rem");
  });

  it("marks a sticky header", () => {
    render(
      <AppShell header="Header" stickyHeader>
        Main
      </AppShell>
    );

    const shell = screen.getByRole("main").parentElement!;

    expect(shell).toHaveAttribute(
      "data-sticky-header",
      "true"
    );
  });

  it("keeps the class, style and attributes it receives", () => {
    render(
      <AppShell
        header="Header"
        className="custom-shell"
        style={{ minHeight: 480 }}
        data-testid="shell"
        aria-label="Acme application"
      >
        Main
      </AppShell>
    );

    const shell = screen.getByTestId("shell");

    expect(shell).toHaveClass(
      "pimolu-app-shell",
      "custom-shell"
    );

    expect(shell).toHaveStyle({ minHeight: "480px" });
    expect(shell).toHaveAttribute(
      "aria-label",
      "Acme application"
    );
  });

  it("keeps the same region order in the DOM", () => {
    render(
      <AppShell
        header="Header"
        sidebar="Sidebar"
        aside="Aside"
        footer="Footer"
      >
        Main
      </AppShell>
    );

    const shell = screen.getByRole("main").parentElement!;

    expect(
      Array.from(shell.children).map((child) =>
        child.className.replace("pimolu-app-shell__", "")
      )
    ).toEqual([
      "header",
      "sidebar",
      "main",
      "aside",
      "footer",
    ]);
  });
});
