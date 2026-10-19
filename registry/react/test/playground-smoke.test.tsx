
import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import App from "../../../apps/playground/src/App";
import { pages } from "../../../apps/playground/src/router";

afterEach(() => {
  window.location.hash = "";
});

/**
 * Every entry in the playground router must render a real page and be
 * highlighted in the sidebar. A route added without its page, or a page
 * missing from `pageComponents`, fails here instead of showing a blank
 * screen.
 */
describe("playground routes", () => {
  it.each(
    pages.map((page) => [page.id, page.label])
  )(
    "#/%s renders a page and marks it current",
    (id, label) => {
      window.location.hash = `#/${id}`;

      render(<App />);

      expect(
        screen.getByRole("heading", { level: 1 })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("link", { current: "page" })
      ).toHaveTextContent(label);
    }
  );
});
