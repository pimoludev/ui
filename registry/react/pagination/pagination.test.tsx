import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./pagination";

describe("Pimolu Pagination", () => {
  it("renders pages, ellipses and an active page", () => {
    render(<Pagination pageCount={12} />);

    expect(
      screen.getByRole("navigation", {
        name: "Pagination",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Page 1" })
    ).toHaveAttribute("aria-current", "page");

    expect(
      screen.getByRole("button", { name: "Page 12" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Previous page",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Next page" })
    ).not.toBeDisabled();
  });

  it("changes page on click", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={12}
        defaultPage={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Next page" })
    );

    expect(onPageChange).toHaveBeenCalledWith(6);

    fireEvent.click(
      screen.getByRole("button", { name: "Page 7" })
    );

    expect(onPageChange).toHaveBeenLastCalledWith(7);
  });

  it("follows the page prop when controlled", () => {
    const onPageChange = vi.fn();

    const { rerender } = render(
      <Pagination
        page={5}
        pageCount={12}
        onPageChange={onPageChange}
      />
    );

    expect(
      screen.getByRole("button", { name: "Page 5" })
    ).toHaveAttribute("aria-current", "page");

    fireEvent.click(
      screen.getByRole("button", { name: "Page 5" })
    );

    expect(onPageChange).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Page 6" })
    );

    expect(onPageChange).toHaveBeenCalledWith(6);

    rerender(
      <Pagination
        page={6}
        pageCount={12}
        onPageChange={onPageChange}
      />
    );

    expect(
      screen.getByRole("button", { name: "Page 6" })
    ).toHaveAttribute("aria-current", "page");
  });

  it("disables both arrows on a single page", () => {
    render(<Pagination pageCount={1} />);

    expect(
      screen.getByRole("button", {
        name: "Previous page",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Next page" })
    ).toBeDisabled();
  });

  it("uses the size axis and custom labels", () => {
    render(
      <Pagination
        pageCount={4}
        size="lg"
        previousLabel="Précédent"
        nextLabel="Suivant"
      />
    );

    expect(
      screen.getByRole("navigation")
    ).toHaveClass(
      "pimolu-pagination",
      "pimolu-pagination--lg"
    );

    expect(
      screen.getByRole("button", { name: "Précédent" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Suivant" })
    ).toBeInTheDocument();
  });

  it("can hide the siblings around the current page", () => {
    render(
      <Pagination pageCount={12} siblingCount={0} />
    );

    expect(
      screen.queryByRole("button", { name: "Page 2" })
    ).toBeNull();

    expect(
      screen.getAllByText("…").length
    ).toBeGreaterThan(0);
  });
});
