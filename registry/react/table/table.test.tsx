import { createRef } from "react";

import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function PricingTable() {
  return (
    <Table caption="Plan comparison">
      <TableHeader>
        <TableRow>
          <TableHead>Plan</TableHead>
          <TableHead aria-sort="ascending">
            Seats
          </TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableHead scope="row">Starter</TableHead>
          <TableCell>3</TableCell>
          <TableCell>$0</TableCell>
        </TableRow>

        <TableRow>
          <TableHead scope="row">Pro</TableHead>
          <TableCell>20</TableCell>
          <TableCell>$29</TableCell>
        </TableRow>
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Monthly total</TableCell>
          <TableCell>$29</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe("Pimolu Table", () => {
  it("renders a semantic table inside a scroll wrapper", () => {
    render(<PricingTable />);

    const table = screen.getByRole("table", {
      name: "Plan comparison",
    });

    expect(table).toHaveClass(
      "pimolu-table",
      "pimolu-table--md"
    );

    const wrapper = table.parentElement;

    expect(wrapper).toHaveClass(
      "pimolu-table__wrapper"
    );

    expect(wrapper).toHaveAttribute("tabindex", "0");

    expect(
      screen.getAllByRole("rowgroup")
    ).toHaveLength(3);

    expect(
      screen.getByRole("columnheader", {
        name: "Plan",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("rowheader", {
        name: "Pro",
      })
    ).toBeInTheDocument();

    const proRow = screen
      .getByRole("rowheader", {
        name: "Pro",
      })
      .closest("tr");

    expect(
      within(proRow as HTMLTableRowElement).getByRole(
        "cell",
        { name: "$29" }
      )
    ).toBeInTheDocument();
  });

  it("renders the caption prop first", () => {
    render(<PricingTable />);

    const caption = screen
      .getByRole("table", {
        name: "Plan comparison",
      })
      .querySelector("caption");

    expect(caption).toHaveTextContent(
      "Plan comparison"
    );

    expect(caption).toHaveClass(
      "pimolu-table__caption"
    );

    expect(caption).toBe(
      screen.getByRole("table").firstElementChild
    );
  });

  it("supports TableCaption as a child", () => {
    render(
      <Table>
        <TableCaption>
          Weekly revenue
        </TableCaption>

        <TableBody>
          <TableRow>
            <TableCell>Monday</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(
      screen.getByRole("table", {
        name: "Weekly revenue",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Weekly revenue")
    ).toHaveClass("pimolu-table__caption");
  });

  it("applies density, striped, bordered and sticky flags", () => {
    render(
      <Table
        density="lg"
        striped
        bordered
        stickyHeader
      >
        <TableBody>
          <TableRow>
            <TableCell>One</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(
      screen.getByRole("table")
    ).toHaveClass(
      "pimolu-table--lg",
      "pimolu-table--striped",
      "pimolu-table--bordered",
      "pimolu-table--sticky-header"
    );
  });

  it("defaults scope to col and accepts a row scope", () => {
    render(<PricingTable />);

    expect(
      screen.getByRole("columnheader", {
        name: "Plan",
      })
    ).toHaveAttribute("scope", "col");

    expect(
      screen.getByRole("rowheader", {
        name: "Starter",
      })
    ).toHaveAttribute("scope", "row");
  });

  it("passes native attributes through", () => {
    render(<PricingTable />);

    expect(
      screen.getByRole("columnheader", {
        name: "Seats",
      })
    ).toHaveAttribute("aria-sort", "ascending");

    expect(
      screen.getByRole("cell", {
        name: "Monthly total",
      })
    ).toHaveAttribute("colspan", "2");
  });

  it("forwards its ref and supports a custom wrapper", () => {
    const ref = createRef<HTMLTableElement>();

    render(
      <Table
        ref={ref}
        className="custom-table"
        containerClassName="custom-wrapper"
        containerProps={{ "aria-label": "Scrollable table" }}
      >
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(ref.current?.tagName).toBe("TABLE");

    expect(ref.current).toHaveClass(
      "custom-table"
    );

    const wrapper =
      screen.getByLabelText("Scrollable table");

    expect(wrapper).toHaveClass(
      "pimolu-table__wrapper",
      "custom-wrapper"
    );

    fireEvent.scroll(wrapper);
  });
});
