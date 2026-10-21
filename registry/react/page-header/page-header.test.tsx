import { createRef } from "react";

import {
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "./page-header";

describe("Pimolu PageHeader", () => {
  it("rend un header sémantique avec un seul h1", () => {
    render(
      <PageHeader
        title="Buttons"
        description="A button triggers an action or an event."
      />
    );

    const header = screen.getByRole("banner");

    expect(header.tagName).toBe("HEADER");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Buttons",
      })
    ).toHaveClass("pimolu-page-header__title");

    expect(
      screen.getByText(
        "A button triggers an action or an event."
      )
    ).toHaveClass("pimolu-page-header__description");
  });

  it("affiche l'eyebrow, les métadonnées et les actions", () => {
    render(
      <PageHeader
        eyebrow="Components"
        title="Themes"
        description="Colour palettes and visual tokens."
        meta={<span>Updated 12 October 2026</span>}
        actions={
          <button type="button">Edit this page</button>
        }
      />
    );

    expect(
      screen.getByText("Components")
    ).toHaveClass("pimolu-page-header__eyebrow");

    expect(
      screen
        .getByText("Updated 12 October 2026")
        .closest(".pimolu-page-header__meta")
    ).not.toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Edit this page",
      })
    ).toBeInTheDocument();
  });

  it("construit le fil d'Ariane avec Breadcrumbs", () => {
    render(
      <PageHeader
        title="Installation"
        breadcrumbs={[
          { label: "Docs", href: "/docs" },
          {
            label: "Components",
            href: "/docs/components",
          },
          { label: "Installation" },
        ]}
      />
    );

    const nav = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });

    expect(
      within(nav).getByRole("link", {
        name: "Docs",
      })
    ).toHaveAttribute("href", "/docs");

    expect(
      within(nav).getByRole("link", {
        name: "Components",
      })
    ).toHaveAttribute("href", "/docs/components");

    expect(
      within(nav).getByText("Installation")
    ).toHaveAttribute("aria-current", "page");
  });

  it("ignore un fil vide et accepte un noeud prêt à l'emploi", () => {
    const { rerender } = render(
      <PageHeader title="Changelog" breadcrumbs={[]} />
    );

    expect(
      screen.queryByRole("navigation", {
        name: "Breadcrumb",
      })
    ).toBeNull();

    rerender(
      <PageHeader
        title="Changelog"
        breadcrumbs={
          <span data-testid="custom-crumbs">
            Custom trail
          </span>
        }
      />
    );

    expect(
      screen.getByTestId("custom-crumbs")
    ).toHaveTextContent("Custom trail");
  });

  it("applique l'alignement centré", () => {
    render(
      <PageHeader
        align="center"
        title="A design system for every platform"
        description="One set of tokens, two renderers."
      />
    );

    const header = screen.getByRole("banner");

    expect(header).toHaveAttribute("data-align", "center");

    expect(header).toHaveClass(
      "pimolu-page-header--center"
    );
  });

  it("transmet la ref et les attributs natifs", () => {
    const ref = createRef<HTMLElement>();

    render(
      <PageHeader
        ref={ref}
        id="introduction"
        className="custom-header"
        title="Introduction"
      />
    );

    expect(ref.current?.tagName).toBe("HEADER");

    expect(ref.current).toHaveAttribute(
      "id",
      "introduction"
    );

    expect(ref.current).toHaveClass(
      "pimolu-page-header",
      "custom-header"
    );
  });

  it("permet de rendre le titre en h2 dans une section", () => {
    render(
      <PageHeader
        titleAs="h2"
        title="Installation"
        description="Section example"
      />
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Installation",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { level: 1 })
    ).toBeNull();
  });
});
