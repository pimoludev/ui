import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroEyebrow,
  HeroMedia,
  HeroTitle,
} from "./hero";

describe("Pimolu Hero", () => {
  it("renders the compound content and the default h1 title", () => {
    render(
      <Hero>
        <HeroContent>
          <HeroEyebrow>Pimolu UI 1.0</HeroEyebrow>
          <HeroTitle>Build once, ship everywhere</HeroTitle>
          <HeroDescription>
            One system for web and native surfaces.
          </HeroDescription>
          <HeroActions>
            <button type="button">Get started</button>
          </HeroActions>
        </HeroContent>
      </Hero>
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build once, ship everywhere",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pimolu UI 1.0")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Get started" })
    ).toBeInTheDocument();
  });

  it("supports a section-level title and native attributes", () => {
    const { container } = render(
      <Hero
        aria-label="Marketing section"
        data-testid="hero"
        variant="muted"
        align="center"
        size="sm"
      >
        <HeroContent>
          <HeroTitle as="h2">A calmer hero</HeroTitle>
        </HeroContent>
      </Hero>
    );

    const root = screen.getByTestId("hero");

    expect(root).toHaveAttribute(
      "aria-label",
      "Marketing section"
    );
    expect(root).toHaveAttribute("data-variant", "muted");
    expect(root).toHaveAttribute("data-align", "center");
    expect(root).toHaveAttribute("data-size", "sm");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "A calmer hero",
      })
    ).toBeInTheDocument();

    expect(
      container.querySelector(".pimolu-hero__content")
    ).toBeInTheDocument();
  });

  it("renders media on the right by default", () => {
    const { container } = render(
      <Hero media={<div data-testid="visual">Visual</div>}>
        <HeroContent>
          <HeroTitle as="h2">With a visual</HeroTitle>
        </HeroContent>
      </Hero>
    );

    const root = container.querySelector(
      ".pimolu-hero"
    );

    expect(root).toHaveAttribute("data-media", "true");
    expect(root).toHaveAttribute(
      "data-media-position",
      "right"
    );
    expect(screen.getByTestId("visual")).toBeInTheDocument();
  });

  it("supports bottom media and omits the media slot when empty", () => {
    const { rerender, container } = render(
      <Hero
        mediaPosition="bottom"
        media={
          <HeroMedia>
            <span>Bottom visual</span>
          </HeroMedia>
        }
      >
        <HeroContent>
          <HeroTitle as="h2">Bottom media</HeroTitle>
        </HeroContent>
      </Hero>
    );

    expect(
      container.querySelector(".pimolu-hero__media-slot")
    ).toBeInTheDocument();

    expect(
      container.querySelector(".pimolu-hero")
    ).toHaveAttribute(
      "data-media-position",
      "bottom"
    );

    rerender(
      <Hero>
        <HeroContent>
          <HeroTitle as="h2">No media</HeroTitle>
        </HeroContent>
      </Hero>
    );

    expect(
      container.querySelector(".pimolu-hero__media-slot")
    ).toBeNull();
  });

  it("merges custom classes and forwards a ref", () => {
    const ref = createRef<HTMLElement>();

    const { container } = render(
      <Hero ref={ref} className="custom-hero">
        <HeroContent className="custom-content">
          <HeroTitle as="h2">Classes</HeroTitle>
        </HeroContent>
      </Hero>
    );

    expect(
      container.querySelector(".pimolu-hero")
    ).toHaveClass("pimolu-hero", "custom-hero");

    expect(
      container.querySelector(".pimolu-hero__content")
    ).toHaveClass(
      "pimolu-hero__content",
      "custom-content"
    );

    expect(ref.current?.tagName).toBe("SECTION");
  });
});
