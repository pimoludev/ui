import type { ReactNode } from "react";

import {
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsLayout } from "./docs-layout";

function Example(props: {
  sidebar?: ReactNode;
  toc?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <DocsLayout
      header={<div>Docs header</div>}
      sidebar={
        props.sidebar ?? (
          <nav aria-label="Sections">
            <a href="#installation">Installation</a>
          </nav>
        )
      }
      toc={
        props.toc ?? (
          <nav aria-label="On this page">
            <a href="#installation">Installation</a>
          </nav>
        )
      }
      footer={props.footer ?? <div>Docs footer</div>}
    >
      <h1>Installation</h1>
      <p>Install Pimolu UI with pnpm.</p>
    </DocsLayout>
  );
}

describe("Pimolu DocsLayout", () => {
  it("relie le lien d'évitement au contenu principal", () => {
    const { container } = render(<Example />);

    const main = screen.getByRole("main");

    const skip = screen.getByRole("link", {
      name: "Skip to content",
    });

    expect(skip).toHaveAttribute("href", `#${main.id}`);

    expect(main).toHaveAttribute("tabindex", "-1");

    expect(
      container.querySelector(
        ".pimolu-docs-layout"
      )?.firstElementChild
    ).toBe(skip);
  });

  it("rend le header, les asides et le footer", () => {
    render(<Example />);

    expect(
      screen.getByText("Docs header")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("complementary", {
        name: "Documentation sidebar",
      })
    ).toContainElement(
      screen.getByRole("navigation", {
        name: "Sections",
      })
    );

    expect(
      screen.getByRole("complementary", {
        name: "Table of contents",
      })
    ).toContainElement(
      screen.getByRole("navigation", {
        name: "On this page",
      })
    );

    expect(
      screen.getByText("Docs footer")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Installation",
      })
    ).toBeInTheDocument();
  });

  it("applique les largeurs en pixels ou en unités CSS", () => {
    const { container } = render(
      <DocsLayout
        sidebar={<div>Sidebar</div>}
        sidebarWidth={240}
        tocWidth="12rem"
        style={{ color: "red" }}
      >
        Content
      </DocsLayout>
    );

    const root = container.querySelector(
      ".pimolu-docs-layout"
    ) as HTMLElement;

    expect(
      root.style.getPropertyValue(
        "--pimolu-docs-sidebar-width"
      )
    ).toBe("240px");

    expect(
      root.style.getPropertyValue(
        "--pimolu-docs-toc-width"
      )
    ).toBe("12rem");

    expect(root.style.color).toBe("red");
  });

  it("active les colonnes collantes avec sticky", () => {
    const { container, rerender } = render(
      <DocsLayout sidebar={<div>Sidebar</div>}>
        Content
      </DocsLayout>
    );

    const root = container.querySelector(
      ".pimolu-docs-layout"
    ) as HTMLElement;

    expect(root).not.toHaveAttribute("data-sticky");

    rerender(
      <DocsLayout sticky sidebar={<div>Sidebar</div>}>
        Content
      </DocsLayout>
    );

    expect(root).toHaveAttribute(
      "data-sticky",
      "true"
    );
  });

  it("adapte les colonnes présentes", () => {
    const { container } = render(
      <DocsLayout sidebar={null}>
        Content only
      </DocsLayout>
    );

    const root = container.querySelector(
      ".pimolu-docs-layout"
    ) as HTMLElement;

    expect(root).toHaveAttribute(
      "data-sidebar",
      "false"
    );

    expect(root).toHaveAttribute("data-toc", "false");

    expect(
      screen.queryByRole("complementary")
    ).toBeNull();

    expect(
      screen.getByRole("main")
    ).toHaveTextContent("Content only");
  });

  it("transmet les attributs natifs et la classe", () => {
    const { container } = render(
      <DocsLayout
        sidebar={<div>Sidebar</div>}
        id="guide"
        className="custom-docs"
        aria-label="Guide shell"
      >
        Content
      </DocsLayout>
    );

    const root = container.querySelector(
      ".pimolu-docs-layout"
    ) as HTMLElement;

    expect(root).toHaveAttribute("id", "guide");

    expect(root).toHaveClass(
      "pimolu-docs-layout",
      "custom-docs"
    );

    expect(root).toHaveAttribute(
      "aria-label",
      "Guide shell"
    );
  });
});
