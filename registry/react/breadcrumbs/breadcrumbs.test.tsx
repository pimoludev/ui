import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "./breadcrumbs";

describe("Pimolu Breadcrumbs", () => {
  it("renders a named navigation landmark", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>Projects</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(
      screen.getByRole("navigation", {
        name: "Breadcrumb",
      })
    ).toBeInTheDocument();
  });

  it("renders links and the current page", () => {
    render(
      <Breadcrumbs label="You are here">
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(
      screen.getByRole("navigation", {
        name: "You are here",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Docs" })
    ).toHaveAttribute("href", "/docs");

    expect(
      screen.getByText("Components")
    ).toHaveAttribute("aria-current", "page");
  });

  it("hides separators from assistive technology", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>›</BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumbs>
    );

    const separator = screen.getByText("›");

    expect(
      separator.closest("[aria-hidden='true']")
    ).not.toBeNull();
  });
});
