import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DescriptionItem,
  DescriptionList,
} from "./description-list";

describe("Pimolu DescriptionList", () => {
  it("renders native description semantics", () => {
    render(
      <DescriptionList>
        <DescriptionItem
          term="Status"
          details="Active"
        />

        <DescriptionItem
          term="Owner"
          details="Ada Lovelace"
        />
      </DescriptionList>
    );

    const list = screen.getByText("Status")
      .closest("dl");

    expect(list).toBeInTheDocument();

    expect(
      screen.getByText("Status").tagName
    ).toBe("DT");

    expect(
      screen.getByText("Active").tagName
    ).toBe("DD");
  });

  it("applies the layout, variant and size axes", () => {
    render(
      <DescriptionList
        layout="inline"
        variant="bordered"
        size="lg"
      >
        <DescriptionItem term="Key" details="Value" />
      </DescriptionList>
    );

    const list = screen.getByText("Key").closest("dl");

    expect(list).toHaveClass(
      "pimolu-description-list",
      "pimolu-description-list--inline",
      "pimolu-description-list--bordered",
      "pimolu-description-list--lg"
    );
  });

  it("can render rich details", () => {
    render(
      <DescriptionList>
        <DescriptionItem
          term="Plan"
          details={<strong>Pro</strong>}
        />
      </DescriptionList>
    );

    expect(
      screen.getByText("Pro").closest("dd")
    ).not.toBeNull();
  });
});
