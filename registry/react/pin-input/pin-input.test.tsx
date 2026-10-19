import { useState } from "react";

import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PinInput } from "./pin-input";

describe("Pimolu PinInput", () => {
  it("renders six labelled cells and names the group", () => {
    render(
      <>
        <PinInput label="Verification code" />

        <PinInput label="Disabled code" disabled />
      </>
    );

    const group = screen.getByRole("group", {
      name: "Verification code",
    });

    const cells = within(group).getAllByRole("textbox");

    expect(cells).toHaveLength(6);

    expect(
      within(group).getByRole("textbox", {
        name: "Verification code, digit 1 of 6",
      })
    ).toHaveAttribute("autocomplete", "one-time-code");

    expect(cells[0]).toHaveAttribute(
      "inputmode",
      "numeric"
    );

    const disabledGroup = screen.getByRole("group", {
      name: "Disabled code",
    });

    within(disabledGroup)
      .getAllByRole("textbox")
      .forEach((cell) => {
        expect(cell).toBeDisabled();
      });
  });

  it("supports custom lengths and visual groups", () => {
    render(
      <PinInput
        label="Recovery code"
        length={6}
        groups={[3, 3]}
      />
    );

    const group = screen.getByRole("group", {
      name: "Recovery code",
    });

    expect(
      within(group).getAllByRole("textbox")
    ).toHaveLength(6);

    expect(
      group.querySelectorAll(
        ".pimolu-pin-input__group"
      )
    ).toHaveLength(2);
  });

  it("fills the cells, advances focus and completes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onComplete = vi.fn();

    render(
      <PinInput
        label="Security code"
        length={4}
        onValueChange={onValueChange}
        onComplete={onComplete}
      />
    );

    const cells = screen.getAllByRole("textbox");

    cells[0].focus();

    await user.keyboard("1234");

    expect(cells[0]).toHaveValue("1");
    expect(cells[1]).toHaveValue("2");
    expect(cells[2]).toHaveValue("3");
    expect(cells[3]).toHaveValue("4");
    expect(cells[3]).toHaveFocus();

    expect(onValueChange).toHaveBeenLastCalledWith([
      "1",
      "2",
      "3",
      "4",
    ]);

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("supports controlled cell arrays", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    function Controlled() {
      const [code, setCode] = useState([
        "",
        "",
        "",
        "",
      ]);

      return (
        <>
          <PinInput
            label="Controlled code"
            length={4}
            value={code}
            onValueChange={setCode}
            onComplete={onComplete}
          />

          <button
            type="button"
            onClick={() =>
              setCode(["", "", "", ""])
            }
          >
            Reset code
          </button>
        </>
      );
    }

    render(<Controlled />);

    const cells = screen.getAllByRole("textbox");

    cells[0].focus();

    await user.keyboard("9876");

    expect(cells[0]).toHaveValue("9");
    expect(cells[1]).toHaveValue("8");
    expect(cells[2]).toHaveValue("7");
    expect(cells[3]).toHaveValue("6");

    expect(onComplete).toHaveBeenLastCalledWith("9876");

    await user.click(
      screen.getByRole("button", {
        name: "Reset code",
      })
    );

    cells[0].focus();

    await user.keyboard("1111");

    expect(cells[0]).toHaveValue("1");
    expect(cells[3]).toHaveValue("1");

    expect(onComplete).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenLastCalledWith("1111");
  });

  it("distributes a pasted code across the cells", () => {
    render(
      <PinInput label="Pasted code" length={6} />
    );

    const cells = screen.getAllByRole("textbox");

    cells[1].focus();

    fireEvent.paste(cells[1], {
      clipboardData: {
        getData: () => "34 56-78",
      },
    });

    expect(cells[1]).toHaveValue("3");
    expect(cells[2]).toHaveValue("4");
    expect(cells[3]).toHaveValue("5");
    expect(cells[4]).toHaveValue("6");
    expect(cells[5]).toHaveValue("7");
    expect(cells[5]).toHaveFocus();
  });

  it("handles Backspace, Delete and the navigation keys", async () => {
    const user = userEvent.setup();

    render(
      <PinInput
        label="Keyboard code"
        length={4}
        defaultValue={["1", "2", "3", "4"]}
      />
    );

    const cells = screen.getAllByRole("textbox");

    cells[2].focus();

    await user.keyboard("{Backspace}");

    expect(cells[2]).toHaveValue("");
    expect(cells[2]).toHaveFocus();

    await user.keyboard("{Backspace}");

    expect(cells[1]).toHaveValue("");
    expect(cells[1]).toHaveFocus();

    cells[3].focus();
    await user.keyboard("{Delete}");
    expect(cells[3]).toHaveValue("");

    await user.keyboard("{Home}");
    expect(cells[0]).toHaveFocus();

    await user.keyboard("{End}");
    expect(cells[3]).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(cells[2]).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(cells[3]).toHaveFocus();
  });

  it("filters characters according to the type", async () => {
    const user = userEvent.setup();

    render(
      <>
        <PinInput label="Numeric code" length={2} />

        <PinInput
          label="Alpha code"
          length={2}
          type="alphanumeric"
        />
      </>
    );

    const numeric = within(
      screen.getByRole("group", {
        name: "Numeric code",
      })
    ).getAllByRole("textbox");

    numeric[0].focus();

    await user.keyboard("a");
    expect(numeric[0]).toHaveValue("");

    await user.keyboard("1");
    expect(numeric[0]).toHaveValue("1");
    expect(numeric[1]).toHaveFocus();

    const alpha = within(
      screen.getByRole("group", {
        name: "Alpha code",
      })
    ).getAllByRole("textbox");

    alpha[0].focus();

    await user.keyboard("a");
    expect(alpha[0]).toHaveValue("a");
    expect(alpha[1]).toHaveFocus();
  });

  it("masks cells, wires the error and auto-focuses", () => {
    render(
      <PinInput
        label="Masked code"
        mask
        error
        errorMessage="This code has expired."
        autoFocus
      />
    );

    const group = screen.getByRole("group", {
      name: "Masked code",
    });

    const cells = Array.from(
      group.querySelectorAll("input")
    );

    expect(cells).toHaveLength(6);

    cells.forEach((cell) => {
      expect(cell).toHaveAttribute(
        "type",
        "password"
      );
      expect(cell).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    expect(cells[0]).toHaveFocus();

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent(
      "This code has expired."
    );

    expect(cells[0]).toHaveAttribute(
      "aria-describedby",
      error.id
    );
  });
});
