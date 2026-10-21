import { afterEach, describe, expect, it, vi } from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CodeBlock } from "./code-block";

function mockClipboard(
  writeText: (text: string) => Promise<void>
) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
  Reflect.deleteProperty(document, "execCommand");
});

describe("CodeBlock", () => {
  it("renders source as text without injecting HTML", () => {
    const source =
      '<script>alert("x")</script>\n<div class="demo">Hi</div>';

    const { container } = render(
      <CodeBlock code={source} language="html" />
    );

    const code = container.querySelector(
      ".pimolu-codeblock__code"
    );

    expect(code?.textContent).toBe(source);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector(".demo")).toBeNull();
  });

  it("shows the file name and the language label", () => {
    render(
      <CodeBlock
        code="export const answer = 42;"
        language="tsx"
        filename="answer.tsx"
      />
    );

    expect(screen.getByText("answer.tsx")).toBeInTheDocument();
    expect(screen.getByText("tsx")).toBeInTheDocument();
  });

  it("renders line numbers only when asked", () => {
    const { container, rerender } = render(
      <CodeBlock code={"const a = 1;\nconst b = 2;"} />
    );

    expect(
      container.querySelectorAll(
        ".pimolu-codeblock__line-number"
      )
    ).toHaveLength(0);

    rerender(
      <CodeBlock
        code={"const a = 1;\nconst b = 2;"}
        showLineNumbers
      />
    );

    const numbers = Array.from(
      container.querySelectorAll(
        ".pimolu-codeblock__line-number"
      )
    ).map((node) => node.textContent);

    expect(numbers).toEqual(["1", "2"]);
  });

  it("highlights strings, comments, numbers and keywords", () => {
    const { container } = render(
      <CodeBlock
        code={
          'const answer = 42;\n// "not a string"\nconst label = "Pimolu";'
        }
      />
    );

    expect(
      container.querySelector(
        ".pimolu-codeblock__token--keyword"
      )
    ).toHaveTextContent("const");

    expect(
      container.querySelector(
        ".pimolu-codeblock__token--number"
      )
    ).toHaveTextContent("42");

    expect(
      container.querySelector(
        ".pimolu-codeblock__token--comment"
      )
    ).toHaveTextContent('// "not a string"');

    expect(
      container.querySelector(
        ".pimolu-codeblock__token--string"
      )
    ).toHaveTextContent('"Pimolu"');
  });

  it("copies the raw source and announces success", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(async () => undefined);

    mockClipboard(writeText);

    const source = "const value = 42;";

    render(
      <CodeBlock
        code={source}
        copyLabel="Copy code"
        copiedLabel="Code copied"
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Copy code" })
    );

    expect(writeText).toHaveBeenCalledWith(source);

    expect(
      await screen.findByRole("button", {
        name: "Code copied",
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Code copied"
    );
  });

  it("announces a failed copy and keeps the copy action", async () => {
    const user = userEvent.setup();

    mockClipboard(async () => {
      throw new Error("Clipboard denied");
    });

    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => false),
    });

    render(<CodeBlock code="const value = 42;" />);

    await user.click(
      screen.getByRole("button", { name: "Copy" })
    );

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Unable to copy"
      );
    });

    expect(
      screen.getByRole("button", { name: "Copy" })
    ).toBeInTheDocument();
  });

  it("marks the requested lines and leaves the others plain", () => {
    const { container } = render(
      <CodeBlock
        code={"line one\nline two\nline three"}
        highlightLines={[2]}
      />
    );

    const lines = container.querySelectorAll(
      ".pimolu-codeblock__line"
    );

    expect(lines[1]).toHaveClass(
      "pimolu-codeblock__line--highlighted"
    );

    expect(lines[0]).not.toHaveClass(
      "pimolu-codeblock__line--highlighted"
    );
  });

  it("caps its height, wraps on request and can hide the copy action", () => {
    const { container } = render(
      <CodeBlock
        code="const value = 42;"
        maxHeight={120}
        wrap
        copyable={false}
      />
    );

    const root = container.querySelector(".pimolu-codeblock");
    const pre = container.querySelector(
      ".pimolu-codeblock__pre"
    );

    expect(root).toHaveClass("pimolu-codeblock--wrap");
    expect(pre).toHaveStyle({ maxHeight: "120px" });
    expect(screen.queryByRole("button")).toBeNull();
  });
});
