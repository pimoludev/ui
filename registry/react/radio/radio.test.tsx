
import { createRef, useState } from "react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  Radio,
  RadioGroup,
} from "./radio";

describe("Pimolu Radio & RadioGroup", () => {
  it("renders a native labeled group", () => {
    render(
      <RadioGroup label="Framework">
        <Radio value="react" label="React" />
        <Radio value="angular" label="Angular" />
      </RadioGroup>
    );

    expect(
      screen.getByRole("group", {
        name: "Framework",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "React",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "Angular",
      })
    ).toBeInTheDocument();
  });

  it("supports an uncontrolled default value", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup
        label="Framework"
        defaultValue="react"
      >
        <Radio value="react" label="React" />
        <Radio value="nextjs" label="Next.js" />
      </RadioGroup>
    );

    const react = screen.getByRole("radio", {
      name: "React",
    });

    const nextjs = screen.getByRole("radio", {
      name: "Next.js",
    });

    expect(react).toBeChecked();
    expect(nextjs).not.toBeChecked();

    await user.click(nextjs);

    expect(nextjs).toBeChecked();
    expect(react).not.toBeChecked();
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();

    function Example() {
      const [value, setValue] = useState("react");

      return (
        <RadioGroup
          label="Framework"
          value={value}
          onValueChange={setValue}
        >
          <Radio value="react" label="React" />
          <Radio value="angular" label="Angular" />
        </RadioGroup>
      );
    }

    render(<Example />);

    const react = screen.getByRole("radio", {
      name: "React",
    });

    const angular = screen.getByRole("radio", {
      name: "Angular",
    });

    expect(react).toBeChecked();

    await user.click(angular);

    expect(angular).toBeChecked();
    expect(react).not.toBeChecked();
  });

  it("keeps separate groups independent", async () => {
    const user = userEvent.setup();

    render(
      <>
        <RadioGroup label="Frontend">
          <Radio value="react" label="React" />
          <Radio value="vue" label="Vue" />
        </RadioGroup>

        <RadioGroup label="Backend">
          <Radio value="node" label="Node.js" />
          <Radio value="python" label="Python" />
        </RadioGroup>
      </>
    );

    const react = screen.getByRole("radio", {
      name: "React",
    });

    const node = screen.getByRole("radio", {
      name: "Node.js",
    });

    expect(react.getAttribute("name")).not.toBe(
      node.getAttribute("name")
    );

    await user.click(react);
    await user.click(node);

    expect(react).toBeChecked();
    expect(node).toBeChecked();
  });

  it("calls group and native change callbacks", async () => {
    const user = userEvent.setup();

    const onValueChange = vi.fn();
    const onChange = vi.fn();

    render(
      <RadioGroup
        label="Framework"
        onValueChange={onValueChange}
      >
        <Radio
          value="react"
          label="React"
          onChange={onChange}
        />
      </RadioGroup>
    );

    await user.click(
      screen.getByRole("radio", {
        name: "React",
      })
    );

    expect(onValueChange).toHaveBeenCalledWith(
      "react"
    );

    expect(onChange).toHaveBeenCalledOnce();
  });

  it("supports native FormData", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <RadioGroup
          label="Framework"
          name="framework"
        >
          <Radio value="react" label="React" />
          <Radio value="angular" label="Angular" />
        </RadioGroup>
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Preferences",
    }) as HTMLFormElement;

    expect(
      new FormData(form).has("framework")
    ).toBe(false);

    await user.click(
      screen.getByRole("radio", {
        name: "Angular",
      })
    );

    expect(
      new FormData(form).get("framework")
    ).toBe("angular");
  });

  it("supports native form reset", async () => {
    const user = userEvent.setup();

    render(
      <form>
        <RadioGroup
          label="Framework"
          name="framework"
          defaultValue="react"
        >
          <Radio value="react" label="React" />
          <Radio value="angular" label="Angular" />
        </RadioGroup>

        <button type="reset">Reset</button>
      </form>
    );

    const react = screen.getByRole("radio", {
      name: "React",
    });

    const angular = screen.getByRole("radio", {
      name: "Angular",
    });

    await user.click(angular);
    expect(angular).toBeChecked();

    await user.click(
      screen.getByRole("button", {
        name: "Reset",
      })
    );

    expect(react).toBeChecked();
    expect(angular).not.toBeChecked();
  });

  it("supports keyboard interaction", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup label="Framework">
        <Radio value="react" label="React" />
        <Radio value="angular" label="Angular" />
      </RadioGroup>
    );

    const react = screen.getByRole("radio", {
      name: "React",
    });

    await user.tab();

    expect(react).toHaveFocus();

    await user.keyboard(" ");

    expect(react).toBeChecked();
  });

  it("supports required validation", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Registration">
        <RadioGroup
          label="Plan"
          name="plan"
          required
        >
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      </form>
    );

    const form = screen.getByRole("form", {
      name: "Registration",
    }) as HTMLFormElement;

    const free = screen.getByRole("radio", {
      name: "Free",
    });

    expect(free).toBeRequired();
    expect(form.checkValidity()).toBe(false);

    await user.click(free);

    expect(form.checkValidity()).toBe(true);
  });

  it("disables the entire group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        label="Unavailable options"
        disabled
        onValueChange={onValueChange}
      >
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );

    const option = screen.getByRole("radio", {
      name: "Option A",
    });

    expect(option).toBeDisabled();

    await user.click(option);

    expect(option).not.toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports individual disabled radios", () => {
    render(
      <RadioGroup label="Options">
        <Radio
          value="a"
          label="Option A"
          disabled
        />

        <Radio value="b" label="Option B" />
      </RadioGroup>
    );

    expect(
      screen.getByRole("radio", {
        name: "Option A",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("radio", {
        name: "Option B",
      })
    ).not.toBeDisabled();
  });

  it("connects descriptions", () => {
    render(
      <RadioGroup
        label="Plan"
        description="Choose one plan."
      >
        <Radio
          value="pro"
          label="Pro"
          description="For professional teams."
        />
      </RadioGroup>
    );

    expect(
      screen.getByRole("group", {
        name: "Plan",
      })
    ).toHaveAccessibleDescription(
      "Choose one plan."
    );

    expect(
      screen.getByRole("radio", {
        name: "Pro",
      })
    ).toHaveAccessibleDescription(
      "For professional teams."
    );
  });

  it("supports standalone native radios", () => {
    render(
      <Radio
        name="choice"
        value="yes"
        label="Yes"
        defaultChecked
      />
    );

    const radio = screen.getByRole("radio", {
      name: "Yes",
    });

    expect(radio).toBeChecked();
    expect(radio).toHaveAttribute("name", "choice");
  });

  it("forwards refs to native elements", () => {
    const groupRef =
      createRef<HTMLFieldSetElement>();

    const radioRef =
      createRef<HTMLInputElement>();

    render(
      <RadioGroup
        ref={groupRef}
        label="Options"
      >
        <Radio
          ref={radioRef}
          value="a"
          label="Option A"
        />
      </RadioGroup>
    );

    expect(groupRef.current?.tagName).toBe(
      "FIELDSET"
    );

    expect(radioRef.current?.tagName).toBe(
      "INPUT"
    );
  });

  it("inherits size and variant with local overrides", () => {
    render(
      <RadioGroup
        label="Options"
        orientation="horizontal"
        size="lg"
        variant="success"
        data-testid="group"
      >
        <Radio value="a" label="Option A" />

        <Radio
          value="b"
          label="Option B"
          size="sm"
          variant="danger"
        />
      </RadioGroup>
    );

    expect(
      screen.getByTestId("group")
    ).toHaveClass(
      "pimolu-radio-group--horizontal"
    );

    expect(
      screen.getByRole("radio", {
        name: "Option A",
      }).closest(".pimolu-radio")
    ).toHaveClass(
      "pimolu-radio--lg",
      "pimolu-radio--success"
    );

    expect(
      screen.getByRole("radio", {
        name: "Option B",
      }).closest(".pimolu-radio")
    ).toHaveClass(
      "pimolu-radio--sm",
      "pimolu-radio--danger"
    );
  });
});
