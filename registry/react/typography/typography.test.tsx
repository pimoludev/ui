import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Heading,
  Paragraph,
  Text,
} from "./typography";

describe("Pimolu Typography", () => {
  it("renders a span by default", () => {
    render(<Text>Inline text</Text>);

    expect(screen.getByText("Inline text").tagName).toBe(
      "SPAN"
    );

    expect(screen.getByText("Inline text")).toHaveClass(
      "pimolu-text",
      "pimolu-typography--sm",
      "pimolu-typography--weight-normal",
      "pimolu-typography--tone-default"
    );
  });

  it("renders a paragraph with the paragraph defaults", () => {
    render(<Paragraph>Body copy</Paragraph>);

    const paragraph = screen.getByText("Body copy");

    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveClass(
      "pimolu-paragraph",
      "pimolu-typography--md"
    );
  });

  it("applies size, weight and tone", () => {
    render(
      <Text
        size="xl"
        weight="bold"
        tone="danger"
      >
        Alert
      </Text>
    );

    expect(screen.getByText("Alert")).toHaveClass(
      "pimolu-typography--xl",
      "pimolu-typography--weight-bold",
      "pimolu-typography--tone-danger"
    );
  });

  it("maps the heading level to a tag and a default size", () => {
    render(
      <>
        <Heading level={1}>First</Heading>
        <Heading level={3}>Third</Heading>
        <Heading level={6}>Sixth</Heading>
      </>
    );

    const first = screen.getByRole("heading", {
      level: 1,
    });

    expect(first.tagName).toBe("H1");
    expect(first).toHaveClass(
      "pimolu-typography--3xl",
      "pimolu-typography--weight-semibold"
    );

    expect(
      screen.getByRole("heading", { level: 3 })
    ).toHaveClass("pimolu-typography--xl");

    expect(
      screen.getByRole("heading", { level: 6 })
    ).toHaveClass("pimolu-typography--sm");
  });

  it("lets an explicit heading size override the level", () => {
    render(
      <Heading level={1} size="lg" tone="muted">
        Small first level
      </Heading>
    );

    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveClass(
      "pimolu-typography--lg",
      "pimolu-typography--tone-muted"
    );
  });

  it("forwards refs and native attributes", () => {
    const ref = createRef<HTMLHeadingElement>();

    render(
      <Heading ref={ref} level={2} id="title">
        Title
      </Heading>
    );

    expect(ref.current).toBe(
      screen.getByRole("heading", { level: 2 })
    );
    expect(ref.current).toHaveAttribute("id", "title");
  });
});
