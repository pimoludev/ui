import {
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApiTable } from "./api-table";

const rows = [
  {
    name: "variant",
    type: '"primary" | "secondary"',
    default: '"primary"',
    description: "Visual treatment of the button.",
  },
  {
    name: "loading",
    type: "boolean",
    required: true,
    description: "Shows a spinner and disables the button.",
  },
  {
    name: "legacy",
    type: "string",
    deprecated: true,
    description: "Use variant instead.",
  },
];

describe("Pimolu ApiTable", () => {
  it("rend un tableau sémantique nommé par sa légende", () => {
    render(
      <ApiTable
        title="Button props"
        caption="Every prop accepted by Button."
        rows={rows}
      />
    );

    expect(
      screen.getByText("Button props")
    ).toHaveClass("pimolu-api-table__title");

    expect(
      screen.getByRole("table", {
        name: "Every prop accepted by Button.",
      })
    ).toHaveClass("pimolu-api-table__table");
  });

  it("utilise le titre comme nom quand il n'y a pas de légende", () => {
    render(<ApiTable title="Button props" rows={rows} />);

    expect(
      screen.getByRole("table", {
        name: "Button props",
      })
    ).toBeInTheDocument();
  });

  it("affiche les noms, types, valeurs par défaut et descriptions", () => {
    render(<ApiTable rows={rows} />);

    const table = screen.getByRole("table");

    expect(
      within(table).getByRole("columnheader", {
        name: "Name",
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole("columnheader", {
        name: "Type",
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole("columnheader", {
        name: "Default",
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole("columnheader", {
        name: "Description",
      })
    ).toBeInTheDocument();

    const name = screen.getByText("variant");

    expect(name.tagName).toBe("CODE");

    expect(name).toHaveClass("pimolu-api-table__code");

    expect(
      screen.getByText('"primary"')
    ).toHaveClass("pimolu-api-table__code");

    expect(
      screen.getByText(
        "Shows a spinner and disables the button."
      )
    ).toBeInTheDocument();
  });

  it("affiche les badges requis et dépréciés", () => {
    render(<ApiTable rows={rows} />);

    expect(
      screen.getByText("Required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Deprecated")
    ).toBeInTheDocument();

    const deprecatedRow = screen
      .getByText("legacy")
      .closest("tr");

    expect(deprecatedRow).toHaveAttribute(
      "data-deprecated",
      "true"
    );

    expect(
      screen.getAllByText("—")
    ).toHaveLength(2);
  });

  it("applique la densité et les attributs natifs", () => {
    const { container } = render(
      <ApiTable
        id="api"
        className="custom-api-table"
        density="sm"
        rows={rows}
      />
    );

    const root = container.querySelector(
      ".pimolu-api-table"
    );

    expect(root).toHaveAttribute("id", "api");

    expect(root).toHaveClass(
      "pimolu-api-table",
      "custom-api-table"
    );

    expect(
      screen.getByRole("table")
    ).toHaveClass("pimolu-table--sm");
  });

  it("affiche l'état vide et un conteneur défilable", () => {
    render(
      <ApiTable
        rows={[]}
        emptyMessage="Nothing documented yet."
      />
    );

    const empty = screen.getByText(
      "Nothing documented yet."
    );

    expect(empty).toHaveClass(
      "pimolu-api-table__empty"
    );

    expect(empty).toHaveAttribute("colspan", "4");

    const table = screen.getByRole("table");
    const wrapper = table.parentElement;

    expect(wrapper).toHaveClass(
      "pimolu-table__wrapper",
      "pimolu-api-table__scroll"
    );

    expect(wrapper).toHaveAttribute("tabindex", "0");
  });
});
