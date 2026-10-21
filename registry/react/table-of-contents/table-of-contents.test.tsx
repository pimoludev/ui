import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TableOfContents } from "./table-of-contents";

const items = [
  { id: "installation", label: "Installation" },
  { id: "pnpm", label: "With pnpm", level: 3 as const },
  { id: "themes", label: "Themes" },
];

describe("Pimolu TableOfContents", () => {
  it("rend une navigation nommée et son titre par défaut", () => {
    render(<TableOfContents items={items} />);

    expect(
      screen.getByRole("navigation", {
        name: "On this page",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("On this page")
    ).toHaveClass("pimolu-table-of-contents__title");
  });

  it("accepte un titre et un aria-label personnalisés", () => {
    render(
      <TableOfContents
        items={items}
        title="Contents"
        aria-label="Article sections"
      />
    );

    expect(
      screen.getByRole("navigation", {
        name: "Article sections",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Contents")
    ).toBeInTheDocument();
  });

  it("imbrique les entrées de niveau 3 dans une liste ordonnée", () => {
    const { container } = render(
      <TableOfContents items={items} />
    );

    const nested = container.querySelector(
      ".pimolu-table-of-contents__list--nested"
    );

    expect(nested?.tagName).toBe("OL");

    expect(
      nested?.closest("li")
    ).toHaveTextContent("Installation");

    expect(
      within(nested as HTMLElement).getByRole("link", {
        name: "With pnpm",
      })
    ).toHaveAttribute("href", "#pnpm");
  });

  it("marque l'entrée active avec aria-current=location", () => {
    render(
      <TableOfContents
        items={items}
        activeId="pnpm"
      />
    );

    expect(
      screen.getByRole("link", {
        name: "With pnpm",
      })
    ).toHaveAttribute("aria-current", "location");

    expect(
      screen.getByRole("link", {
        name: "Installation",
      })
    ).not.toHaveAttribute("aria-current");
  });

  it("appelle onNavigate avec l'entrée activée", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(
      <TableOfContents
        items={items}
        onNavigate={onNavigate}
      />
    );

    await user.click(
      screen.getByRole("link", {
        name: "Themes",
      })
    );

    expect(onNavigate).toHaveBeenCalledOnce();

    expect(onNavigate).toHaveBeenCalledWith(items[2]);
  });

  it("accepte une entrée de niveau 3 sans parent", () => {
    const { container } = render(
      <TableOfContents
        items={[
          {
            id: "standalone",
            label: "Standalone",
            level: 3,
          },
        ]}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Standalone",
      })
    ).toHaveAttribute("href", "#standalone");

    expect(
      container.querySelector(
        ".pimolu-table-of-contents__list--nested"
      )
    ).toBeNull();
  });
});
