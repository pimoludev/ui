import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TreeView } from "./tree-view";

const items = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "app.tsx" },
      { id: "styles", label: "styles.css" },
    ],
  },
  { id: "readme", label: "README.md" },
  {
    id: "tests",
    label: "tests",
    children: [{ id: "unit", label: "unit.test.ts" }],
  },
];

describe("Pimolu TreeView", () => {
  it("renders the tree and expands default ids", () => {
    render(
      <TreeView
        items={items}
        defaultExpandedIds={["src"]}
        aria-label="Files"
      />
    );

    expect(
      screen.getByRole("tree", { name: "Files" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("treeitem", { name: "src" })
    ).toHaveAttribute("aria-expanded", "true");

    expect(
      screen.getByRole("treeitem", { name: "app.tsx" })
    ).toBeVisible();

    expect(
      screen.queryByRole("treeitem", {
        name: "unit.test.ts",
      })
    ).toBeNull();
  });

  it("expands and collapses on click and selects the node", () => {
    const onSelectedChange = vi.fn();

    render(
      <TreeView
        items={items}
        aria-label="Files"
        onSelectedChange={onSelectedChange}
      />
    );

    const src = screen.getByRole("treeitem", {
      name: "src",
    });

    fireEvent.click(src);

    expect(onSelectedChange).toHaveBeenCalledWith("src");
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(src).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("treeitem", { name: "app.tsx" })
    ).toBeVisible();

    fireEvent.click(src);

    expect(src).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("treeitem", {
        name: "app.tsx",
      })
    ).toBeNull();
  });

  it("moves focus with the arrow keys", () => {
    render(
      <TreeView
        items={items}
        defaultExpandedIds={["src"]}
        aria-label="Files"
      />
    );

    const src = screen.getByRole("treeitem", {
      name: "src",
    });

    const readme = screen.getByRole("treeitem", {
      name: "README.md",
    });

    src.focus();

    fireEvent.keyDown(src, { key: "ArrowDown" });
    expect(
      screen.getByRole("treeitem", { name: "app.tsx" })
    ).toHaveFocus();

    fireEvent.keyDown(
      screen.getByRole("treeitem", { name: "app.tsx" }),
      { key: "ArrowDown" }
    );
    expect(
      screen.getByRole("treeitem", { name: "styles.css" })
    ).toHaveFocus();

    fireEvent.keyDown(
      screen.getByRole("treeitem", { name: "styles.css" }),
      { key: "End" }
    );
    expect(
      screen.getByRole("treeitem", { name: "tests" })
    ).toHaveFocus();

    fireEvent.keyDown(readme, { key: "Home" });
    expect(src).toHaveFocus();
  });

  it("expands with ArrowRight and collapses with ArrowLeft", () => {
    render(
      <TreeView items={items} aria-label="Files" />
    );

    const src = screen.getByRole("treeitem", {
      name: "src",
    });

    src.focus();

    fireEvent.keyDown(src, { key: "ArrowRight" });

    expect(src).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(src, { key: "ArrowRight" });

    expect(
      screen.getByRole("treeitem", { name: "app.tsx" })
    ).toHaveFocus();

    fireEvent.keyDown(
      screen.getByRole("treeitem", { name: "app.tsx" }),
      { key: "ArrowLeft" }
    );

    expect(src).toHaveFocus();
  });

  it("selects with Enter and Space", () => {
    const onSelectedChange = vi.fn();

    render(
      <TreeView
        items={items}
        aria-label="Files"
        onSelectedChange={onSelectedChange}
      />
    );

    const readme = screen.getByRole("treeitem", {
      name: "README.md",
    });

    readme.focus();

    fireEvent.keyDown(readme, { key: "Enter" });

    expect(onSelectedChange).toHaveBeenCalledWith("readme");

    fireEvent.keyDown(readme, { key: " " });

    expect(onSelectedChange).toHaveBeenCalledTimes(2);
  });

  it("skips disabled nodes in keyboard navigation", () => {
    render(
      <TreeView
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two", disabled: true },
          { id: "three", label: "Three" },
        ]}
        aria-label="Files"
      />
    );

    const one = screen.getByRole("treeitem", {
      name: "One",
    });

    one.focus();

    fireEvent.keyDown(one, { key: "ArrowDown" });

    expect(
      screen.getByRole("treeitem", { name: "Three" })
    ).toHaveFocus();
  });

  it("follows controlled expanded and selected props", () => {
    const onExpandedChange = vi.fn();

    const { rerender } = render(
      <TreeView
        items={items}
        expandedIds={[]}
        selectedId="src"
        aria-label="Files"
        onExpandedChange={onExpandedChange}
      />
    );

    const src = screen.getByRole("treeitem", {
      name: "src",
    });

    expect(src).toHaveAttribute("aria-selected", "true");

    fireEvent.click(src);

    expect(onExpandedChange).toHaveBeenCalledWith(["src"]);
    expect(src).toHaveAttribute("aria-expanded", "false");

    rerender(
      <TreeView
        items={items}
        expandedIds={["src"]}
        selectedId="src"
        aria-label="Files"
        onExpandedChange={onExpandedChange}
      />
    );

    expect(src).toHaveAttribute("aria-expanded", "true");
  });
});
