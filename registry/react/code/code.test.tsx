import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Code, Kbd } from "./code";

describe("Pimolu Code and Kbd", () => {
  it("renders inline code", () => {
    render(<Code>pnpm build</Code>);

    const code = screen.getByText("pnpm build");

    expect(code.tagName).toBe("CODE");
    expect(code).toHaveClass(
      "pimolu-code",
      "pimolu-code-kbd--sm"
    );
  });

  it("renders a block inside a pre", () => {
    render(<Code block>const answer = 42;</Code>);

    const code = screen.getByText("const answer = 42;");

    expect(code.tagName).toBe("CODE");
    expect(code.parentElement?.tagName).toBe("PRE");
    expect(code.parentElement).toHaveClass(
      "pimolu-code-block"
    );
  });

  it("applies the size axis", () => {
    render(<Code size="lg">inline</Code>);

    expect(screen.getByText("inline")).toHaveClass(
      "pimolu-code-kbd--lg"
    );
  });

  it("renders a keyboard key", () => {
    render(<Kbd>Esc</Kbd>);

    const kbd = screen.getByText("Esc");

    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toHaveClass(
      "pimolu-kbd",
      "pimolu-code-kbd--sm"
    );
  });

  it("applies the Kbd size", () => {
    render(<Kbd size="md">Enter</Kbd>);

    expect(screen.getByText("Enter")).toHaveClass(
      "pimolu-kbd",
      "pimolu-code-kbd--md"
    );
  });

  it("forwards refs and native attributes", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Code ref={ref} title="example">
        code
      </Code>
    );

    expect(ref.current).toBe(screen.getByText("code"));
    expect(ref.current).toHaveAttribute(
      "title",
      "example"
    );
  });
});
