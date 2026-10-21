import { describe, expect, it, vi } from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  it("renders a searchbox with the default placeholder", () => {
    render(<SearchInput />);

    const field = screen.getByRole("searchbox", {
      name: "Search",
    });

    expect(field).toHaveAttribute(
      "placeholder",
      "Search…"
    );
  });

  it("uses the visible label as the accessible name", () => {
    render(<SearchInput label="Search the docs" />);

    expect(
      screen.getByRole("searchbox", {
        name: "Search the docs",
      })
    ).toBeInTheDocument();
  });

  it("updates an uncontrolled query and reports every change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SearchInput onValueChange={onValueChange} />
    );

    const field = screen.getByRole("searchbox");

    await user.type(field, "pimolu");

    expect(field).toHaveValue("pimolu");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "pimolu"
    );
  });

  it("does not change a controlled value without its parent", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SearchInput
        value="components"
        onValueChange={onValueChange}
      />
    );

    const field = screen.getByRole("searchbox");

    await user.type(field, "x");

    expect(onValueChange).toHaveBeenCalledWith(
      "componentsx"
    );

    expect(field).toHaveValue("components");
  });

  it("submits the current query on Enter", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchInput
        defaultValue="tokens"
        onSearch={onSearch}
      />
    );

    await user.type(
      screen.getByRole("searchbox"),
      "{Enter}"
    );

    expect(onSearch).toHaveBeenCalledWith("tokens");
  });

  it("clears on Escape and keeps the field focused", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SearchInput onValueChange={onValueChange} />
    );

    const field = screen.getByRole("searchbox");

    await user.type(field, "abc{Escape}");

    expect(field).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(field).toHaveFocus();
  });

  it("offers an accessible clear action", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SearchInput
        defaultValue="neo-brutalism"
        onValueChange={onValueChange}
      />
    );

    const field = screen.getByRole("searchbox");

    await user.click(
      screen.getByRole("button", {
        name: "Clear search",
      })
    );

    expect(field).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("renders the shortcut as a Kbd and exposes the size", () => {
    const { container } = render(
      <SearchInput
        size="lg"
        shortcut="⌘K"
        className="docs-search"
      />
    );

    const shortcut = screen.getByText("⌘K");

    expect(shortcut.tagName).toBe("KBD");

    const root = container.querySelector(
      ".pimolu-search-input"
    );

    expect(root).toHaveClass(
      "pimolu-search-input--lg",
      "docs-search"
    );
  });
});
