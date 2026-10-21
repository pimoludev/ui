import { createRef } from "react";

import {
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Prose } from "./prose";

describe("Pimolu Prose", () => {
  it("rend un conteneur div avec la taille md par défaut", () => {
    render(
      <Prose>
        <p>Article content.</p>
      </Prose>
    );

    const wrapper = screen
      .getByText("Article content.")
      .closest(".pimolu-prose");

    expect(wrapper?.tagName).toBe("DIV");

    expect(wrapper).toHaveClass(
      "pimolu-prose",
      "pimolu-prose--md"
    );
  });

  it.each(["sm", "md", "lg"] as const)(
    "applique la taille %s",
    (size) => {
      render(
        <Prose size={size}>
          <p>Size {size}</p>
        </Prose>
      );

      expect(
        screen
          .getByText(`Size ${size}`)
          .closest(".pimolu-prose")
      ).toHaveClass(`pimolu-prose--${size}`);
    }
  );

  it("rend l'élément demandé avec as", () => {
    render(
      <Prose as="article" aria-label="Guide">
        <p>Semantic article.</p>
      </Prose>
    );

    const article = screen.getByRole("article", {
      name: "Guide",
    });

    expect(article).toHaveClass(
      "pimolu-prose",
      "pimolu-prose--md"
    );
  });

  it("préserve la sémantique du contenu riche", () => {
    render(
      <Prose>
        <h2>Overview</h2>
        <p>
          Read the <a href="/docs">documentation</a>.
        </p>
        <ul>
          <li>Tokens</li>
          <li>Components</li>
        </ul>
        <blockquote>
          <p>One design system.</p>
        </blockquote>
        <table>
          <caption>Tokens</caption>
          <tbody>
            <tr>
              <th scope="row">Primary</th>
              <td>#4F46E5</td>
            </tr>
          </tbody>
        </table>
      </Prose>
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Overview",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "documentation",
      })
    ).toHaveAttribute("href", "/docs");

    expect(
      screen.getAllByRole("listitem")
    ).toHaveLength(2);

    expect(
      screen.getByRole("table", {
        name: "Tokens",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("One design system.")
    ).toBeInTheDocument();
  });

  it("transmet la classe, les attributs et la ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Prose
        ref={ref}
        id="release-notes"
        className="custom-prose"
        data-testid="prose"
      >
        <p>Release notes.</p>
      </Prose>
    );

    expect(ref.current?.tagName).toBe("DIV");

    const wrapper = screen.getByTestId("prose");

    expect(wrapper).toHaveAttribute(
      "id",
      "release-notes"
    );

    expect(wrapper).toHaveClass(
      "pimolu-prose",
      "custom-prose"
    );
  });
});
