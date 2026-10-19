import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { AspectRatio } from "./aspect-ratio";

describe("Pimolu AspectRatio", () => {
  it("defaults to 16 / 9 and renders a content wrapper", () => {
    render(
      <AspectRatio data-testid="ratio">
        <img src="/cover.svg" alt="Cover" />
      </AspectRatio>
    );

    const ratio = screen.getByTestId("ratio");

    expect(ratio).toHaveClass("pimolu-aspect-ratio");

    expect(
      ratio.style.getPropertyValue("--pimolu-aspect-ratio")
    ).toBe(String(16 / 9));

    const image = screen.getByRole("img", {
      name: "Cover",
    });

    expect(image.parentElement).toHaveClass(
      "pimolu-aspect-ratio__content"
    );
  });

  it("accepts square, classic and custom ratios", () => {
    render(
      <>
        <AspectRatio data-testid="square" ratio={1} />
        <AspectRatio data-testid="classic" ratio={4 / 3} />
        <AspectRatio data-testid="custom" ratio={2.5} />
      </>
    );

    expect(
      screen
        .getByTestId("square")
        .style.getPropertyValue("--pimolu-aspect-ratio")
    ).toBe("1");

    expect(
      screen
        .getByTestId("classic")
        .style.getPropertyValue("--pimolu-aspect-ratio")
    ).toBe(String(4 / 3));

    expect(
      screen
        .getByTestId("custom")
        .style.getPropertyValue("--pimolu-aspect-ratio")
    ).toBe("2.5");
  });

  it("ignores non-positive and non-finite ratios", () => {
    render(
      <>
        <AspectRatio data-testid="zero" ratio={0} />
        <AspectRatio data-testid="negative" ratio={-2} />
        <AspectRatio
          data-testid="infinite"
          ratio={Number.POSITIVE_INFINITY}
        />
      </>
    );

    for (const id of ["zero", "negative", "infinite"]) {
      expect(
        screen
          .getByTestId(id)
          .style.getPropertyValue(
            "--pimolu-aspect-ratio"
          )
      ).toBe("");
    }
  });

  it("renders the requested element and forwards its ref", () => {
    const ref = createRef<HTMLElement>();

    render(
      <AspectRatio
        as="figure"
        ref={ref}
        data-testid="ratio"
        aria-label="Gallery"
      />
    );

    expect(screen.getByTestId("ratio").tagName).toBe(
      "FIGURE"
    );

    expect(ref.current?.tagName).toBe("FIGURE");

    expect(
      screen.getByRole("figure", { name: "Gallery" })
    ).toBeInTheDocument();
  });
});
