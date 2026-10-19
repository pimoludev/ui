import { useState } from "react";

import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TagsInput } from "./tags-input";

describe("Pimolu TagsInput", () => {
  it("adds a tag with Enter and clears the input", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TagsInput
        label="Skills"
        placeholder="Add a skill"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Skills",
    });

    expect(input).toHaveAttribute(
      "placeholder",
      "Add a skill"
    );

    await user.type(input, "react{Enter}");

    expect(screen.getByText("react")).toBeInTheDocument();

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();

    expect(onValueChange).toHaveBeenLastCalledWith([
      "react",
    ]);
  });

  it("commits tags with the comma delimiter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TagsInput
        label="Frameworks"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Frameworks",
    });

    await user.type(input, "react, vue,");

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("vue")).toBeInTheDocument();

    expect(onValueChange).toHaveBeenLastCalledWith([
      "react",
      "vue",
    ]);

    expect(input).toHaveValue("");
  });

  it("splits, trims and deduplicates pasted tags", () => {
    render(<TagsInput label="Topics" />);

    const input = screen.getByRole("textbox", {
      name: "Topics",
    });

    fireEvent.paste(input, {
      clipboardData: {
        getData: () =>
          " design, frontend,\naccessibility, design ",
      },
    });

    expect(screen.getByText("design")).toBeInTheDocument();
    expect(
      screen.getByText("frontend")
    ).toBeInTheDocument();
    expect(
      screen.getByText("accessibility")
    ).toBeInTheDocument();

    const root = input.closest(
      ".pimolu-tags-input"
    ) as HTMLElement;

    expect(
      within(root).getAllByRole("listitem")
    ).toHaveLength(3);
  });

  it("removes a tag from its accessible button", async () => {
    const user = userEvent.setup();

    render(
      <TagsInput
        label="Stack"
        defaultValue={["react", "vue"]}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Stack",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Remove react",
      })
    );

    expect(
      screen.queryByText("react")
    ).not.toBeInTheDocument();

    expect(screen.getByText("vue")).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("removes the last tag with Backspace and clears with Escape", async () => {
    const user = userEvent.setup();

    render(
      <TagsInput
        label="Labels"
        defaultValue={["alpha", "beta"]}
      />
    );

    const input = screen.getByRole("textbox", {
      name: "Labels",
    });

    input.focus();

    await user.keyboard("{Backspace}");

    expect(
      screen.queryByText("beta")
    ).not.toBeInTheDocument();

    expect(screen.getByText("alpha")).toBeInTheDocument();

    await user.type(input, "gamma");
    expect(input).toHaveValue("gamma");

    await user.keyboard("{Escape}");

    expect(input).toHaveValue("");
    expect(
      screen.queryByText("gamma")
    ).not.toBeInTheDocument();
  });

  it("enforces maxTags and allows duplicates on demand", async () => {
    const user = userEvent.setup();

    render(
      <>
        <TagsInput
          label="Limited"
          maxTags={2}
        />

        <TagsInput
          label="Repeated"
          defaultValue={["a"]}
          allowDuplicates
        />
      </>
    );

    const limited = screen.getByRole("textbox", {
      name: "Limited",
    });

    await user.type(
      limited,
      "a{Enter}a{Enter}b{Enter}c{Enter}"
    );

    const limitedRoot = limited.closest(
      ".pimolu-tags-input"
    ) as HTMLElement;

    expect(
      within(limitedRoot).getAllByRole("listitem")
    ).toHaveLength(2);

    expect(
      within(limitedRoot).queryByText("c")
    ).not.toBeInTheDocument();

    const repeated = screen.getByRole("textbox", {
      name: "Repeated",
    });

    await user.type(repeated, "a{Enter}");

    const repeatedRoot = repeated.closest(
      ".pimolu-tags-input"
    ) as HTMLElement;

    expect(
      within(repeatedRoot).getAllByText("a")
    ).toHaveLength(2);
  });

  it("supports disabled and read-only states", async () => {
    const user = userEvent.setup();

    render(
      <>
        <TagsInput
          label="Disabled"
          defaultValue={["blocked"]}
          disabled
        />

        <TagsInput
          label="Read only"
          defaultValue={["locked"]}
          readOnly
        />
      </>
    );

    const disabled = screen.getByRole("textbox", {
      name: "Disabled",
    });

    const readonly = screen.getByRole("textbox", {
      name: "Read only",
    });

    expect(disabled).toBeDisabled();
    expect(readonly).toHaveAttribute("readonly");

    expect(
      screen.getByRole("button", {
        name: "Remove blocked",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Remove locked",
      })
    ).toBeDisabled();

    await user.type(disabled, "new");
    await user.type(readonly, "new");

    expect(disabled).toHaveValue("");
    expect(readonly).toHaveValue("");
  });

  it("supports controlled tags and error wiring", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [tags, setTags] = useState([
        "frontend",
      ]);

      return (
        <TagsInput
          label="Topics"
          value={tags}
          errorMessage="Keep at least one topic."
          onValueChange={(next) => {
            onValueChange(next);
            setTags(next);
          }}
        />
      );
    }

    render(<Controlled />);

    const input = screen.getByRole("textbox", {
      name: "Topics",
    });

    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    const describedBy = (
      input.getAttribute("aria-describedby") ?? ""
    ).split(" ");

    expect(describedBy).toContain(error.id);

    await user.type(input, "backend{Enter}");

    expect(screen.getByText("backend")).toBeInTheDocument();

    expect(onValueChange).toHaveBeenLastCalledWith([
      "frontend",
      "backend",
    ]);
  });
});
