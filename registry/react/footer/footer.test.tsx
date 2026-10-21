import {
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./footer";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Components", href: "/components" },
      { label: "Themes", href: "/themes" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About", href: "/about" }],
  },
];

describe("Pimolu Footer", () => {
  it("rend un footer sémantique avec marque et mentions", () => {
    render(
      <Footer
        brand={<strong>Pimolu UI</strong>}
        description="One design system for web and native."
        columns={columns}
        copyright="© 2026 Pimolu"
        bottom={<a href="/privacy">Privacy</a>}
      />
    );

    const footer = screen.getByRole("contentinfo");

    expect(footer.tagName).toBe("FOOTER");

    expect(
      within(footer).getByText("Pimolu UI")
    ).toBeInTheDocument();

    expect(
      within(footer).getByText(
        "One design system for web and native."
      )
    ).toHaveClass("pimolu-footer__description");

    expect(
      within(footer).getByText("© 2026 Pimolu")
    ).toHaveClass("pimolu-footer__copyright");

    expect(
      within(footer).getByRole("link", {
        name: "Privacy",
      })
    ).toHaveAttribute("href", "/privacy");
  });

  it("nomme chaque colonne comme une navigation", () => {
    render(<Footer columns={columns} />);

    const product = screen.getByRole("navigation", {
      name: "Product",
    });

    const company = screen.getByRole("navigation", {
      name: "Company",
    });

    expect(
      within(product).getAllByRole("link")
    ).toHaveLength(2);

    expect(
      within(product).getByRole("link", {
        name: "Components",
      })
    ).toHaveAttribute("href", "/components");

    expect(
      within(company).getByRole("link", {
        name: "About",
      })
    ).toHaveAttribute("href", "/about");
  });

  it("gère les liens externes", () => {
    render(
      <Footer
        columns={[
          {
            title: "Community",
            links: [
              {
                label: "GitHub",
                href: "https://github.com/pimolu",
                external: true,
              },
            ],
          },
        ]}
      />
    );

    const link = screen.getByRole("link", {
      name: /GitHub/,
    });

    expect(link).toHaveAttribute("target", "_blank");

    expect(link).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );

    expect(link).toHaveTextContent(
      "opens in a new tab"
    );
  });

  it("affiche les actions avec la marque", () => {
    render(
      <Footer
        brand="Pimolu"
        description="Ship faster."
        actions={
          <button type="button">Get started</button>
        }
        columns={[]}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Get started",
      })
    ).toBeInTheDocument();

    expect(
      document.querySelector(
        ".pimolu-footer__brand-mark"
      )
    ).toHaveTextContent("Pimolu");
  });

  it("supporte un footer minimal sans marque ni colonnes", () => {
    render(
      <Footer
        id="site-footer"
        className="custom-footer"
        columns={[]}
        copyright="© 2026 Pimolu"
      />
    );

    const footer = screen.getByRole("contentinfo");

    expect(footer).toHaveAttribute("id", "site-footer");

    expect(footer).toHaveClass(
      "pimolu-footer",
      "custom-footer"
    );

    expect(
      document.querySelector(".pimolu-footer__brand")
    ).toBeNull();

    expect(
      screen.queryByRole("navigation")
    ).toBeNull();
  });
  it("preserves surface defaults and supports an unframed transparent appearance", () => {
    const { container, rerender } = render(<Footer columns={[]} />);
    expect(container.firstChild).toHaveClass("pimolu-footer--surface");
    expect(container.firstChild).toHaveAttribute("data-bordered", "true");
    rerender(<Footer columns={[]} appearance="transparent" bordered={false} />);
    expect(container.firstChild).toHaveClass("pimolu-footer--transparent");
    expect(container.firstChild).not.toHaveAttribute("data-bordered");
  });

});
