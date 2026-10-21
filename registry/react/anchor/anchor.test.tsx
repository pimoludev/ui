import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Anchor } from "./anchor";

function setClipboard(
  writeText: ReturnType<typeof vi.fn>
) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: undefined,
  });
});

describe("Pimolu Anchor", () => {
  it("rend un titre de niveau 2 avec son id et son lien", () => {
    render(<Anchor id="installation">Installation</Anchor>);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Installation",
    });

    expect(heading).toHaveAttribute("id", "installation");

    expect(heading).toHaveClass(
      "pimolu-anchor__heading"
    );

    const link = screen.getByRole("link", {
      name: "Copy link to section",
    });

    expect(
      within(heading).getByRole("link", {
        name: "Copy link to section",
      })
    ).toBe(link);

    expect(link).toHaveAttribute("href", "#installation");

    expect(link).toHaveAttribute(
      "aria-describedby",
      "installation-anchor-label"
    );

    expect(
      within(link).getByText("#")
    ).toHaveAttribute("aria-hidden", "true");
  });

  it.each([1, 2, 3, 4, 5, 6] as const)(
    "rend un titre de niveau %s",
    (level) => {
      render(
        <Anchor id={`section-${level}`} level={level}>
          Section {level}
        </Anchor>
      );

      expect(
        screen.getByRole("heading", {
          level,
          name: `Section ${level}`,
        })
      ).toHaveAttribute("id", `section-${level}`);
    }
  );

  it("copie l'URL absolue et affiche le retour visuel", async () => {
    const writeText = vi
      .fn()
      .mockResolvedValue(undefined);

    const onCopy = vi.fn();
    const user = userEvent.setup();

    setClipboard(writeText);

    render(
      <Anchor id="theming" onCopy={onCopy}>
        Theming
      </Anchor>
    );

    await user.click(
      screen.getByRole("link", {
        name: "Copy link to section",
      })
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce();
    });

    expect(writeText.mock.calls[0][0]).toMatch(
      /#theming$/
    );

    expect(onCopy).toHaveBeenCalledWith(
      expect.stringMatching(/#theming$/)
    );

    expect(
      await screen.findByText("Copied")
    ).toHaveAttribute("data-visible", "true");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Copied"
    );
  });

  it("accepte une destination et un libellé personnalisés", () => {
    render(
      <Anchor
        id="usage"
        href="/docs/usage"
        copyLabel="Lier cette section"
      >
        Usage
      </Anchor>
    );

    expect(
      screen.getByRole("link", {
        name: "Lier cette section",
      })
    ).toHaveAttribute("href", "/docs/usage");

    expect(
      screen.getByRole("heading", {
        name: "Usage",
      })
    ).toBeInTheDocument();
  });

  it("n'affiche pas de confirmation si le presse-papiers échoue", async () => {
    const writeText = vi
      .fn()
      .mockRejectedValue(new Error("denied"));

    const onCopy = vi.fn();
    const user = userEvent.setup();

    setClipboard(writeText);

    render(
      <Anchor id="failure" onCopy={onCopy}>
        Failure
      </Anchor>
    );

    await user.click(
      screen.getByRole("link", {
        name: "Copy link to section",
      })
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce();
    });

    expect(onCopy).not.toHaveBeenCalled();

    expect(screen.queryByText("Copied")).toBeNull();

    expect(
      screen.getByRole("status")
    ).toBeEmptyDOMElement();
  });

  it("transmet les attributs du titre et la classe du wrapper", () => {
    render(
      <Anchor
        id="props"
        className="custom-anchor"
        data-testid="anchor-heading"
      >
        Props
      </Anchor>
    );

    const heading = screen.getByTestId(
      "anchor-heading"
    );

    expect(heading.tagName).toBe("H2");

    expect(heading).toHaveAttribute("id", "props");

    expect(heading.parentElement).toHaveClass(
      "pimolu-anchor",
      "custom-anchor"
    );
  });
});
