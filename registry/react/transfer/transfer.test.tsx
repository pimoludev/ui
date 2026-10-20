
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Transfer } from "./transfer";

const people = [
  {
    key: "alice",
    label: "Alice",
    description: "Product designer",
  },
  {
    key: "bob",
    label: "Bob",
    description: "Front-end engineer",
  },
  {
    key: "carol",
    label: "Carol",
    description: "Operations lead",
  },
];

describe("Pimolu Transfer", () => {
  it("renders both lists with titles and counts", () => {
    render(
      <Transfer
        data={people}
        defaultTargetKeys={["carol"]}
        titles={["Available", "Selected"]}
      />
    );

    const source = screen.getByRole("group", {
      name: "Available",
    });

    const target = screen.getByRole("group", {
      name: "Selected",
    });

    expect(source).toHaveTextContent("Alice");
    expect(source).toHaveTextContent("Bob");
    expect(source).not.toHaveTextContent("Carol");

    expect(target).toHaveTextContent("Carol");
    expect(target).not.toHaveTextContent("Alice");

    expect(
      within(source).getByText("2")
    ).toBeInTheDocument();

    expect(
      within(target).getByText("1")
    ).toBeInTheDocument();
  });

  it("moves checked items to the target list", async () => {
    const user = userEvent.setup();

    render(
      <Transfer
        data={people}
        titles={["Available", "Selected"]}
        showMoveAll={false}
      />
    );

    await user.click(
      within(
        screen.getByRole("group", {
          name: "Available",
        })
      ).getByRole("checkbox", {
        name: /Alice/,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Move selected to the right",
      })
    );

    const target = screen.getByRole("group", {
      name: "Selected",
    });

    expect(
      within(target).getByRole("checkbox", {
        name: /Alice/,
      })
    ).toBeInTheDocument();

    expect(
      within(
        screen.getByRole("group", {
          name: "Available",
        })
      ).queryByRole("checkbox", {
        name: /Alice/,
      })
    ).toBeNull();
  });

  it("moves checked items back to the source list", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Transfer
        data={people}
        targetKeys={["alice", "bob"]}
        onChange={onChange}
        titles={["Available", "Selected"]}
        showMoveAll={false}
      />
    );

    await user.click(
      within(
        screen.getByRole("group", {
          name: "Selected",
        })
      ).getByRole("checkbox", {
        name: /Alice/,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Move selected to the left",
      })
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(["bob"]);
  });

  it("moves every enabled item at once", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Transfer
        data={[
          { key: "a", label: "Alpha" },
          { key: "b", label: "Beta" },
          {
            key: "c",
            label: "Gamma",
            disabled: true,
          },
        ]}
        onChange={onChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Move all to the right",
      })
    );

    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("supports a controlled target list", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Transfer
        data={people}
        targetKeys={["bob"]}
        onChange={onChange}
        titles={["Available", "Selected"]}
        showMoveAll={false}
      />
    );

    await user.click(
      within(
        screen.getByRole("group", {
          name: "Available",
        })
      ).getByRole("checkbox", {
        name: /Alice/,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Move selected to the right",
      })
    );

    expect(onChange).toHaveBeenCalledWith([
      "bob",
      "alice",
    ]);

    /* The parent did not echo the new keys. */
    expect(
      within(
        screen.getByRole("group", {
          name: "Available",
        })
      ).getByRole("checkbox", {
        name: /Alice/,
      })
    ).toBeInTheDocument();
  });

  it("filters each list with its own search field", async () => {
    const user = userEvent.setup();

    render(
      <Transfer
        data={people}
        searchable
        titles={["Available", "Selected"]}
      />
    );

    const source = screen.getByRole("group", {
      name: "Available",
    });

    await user.type(
      within(source).getByRole("searchbox", {
        name: "Search Available",
      }),
      "engineer"
    );

    expect(
      within(source).getByText("Bob")
    ).toBeInTheDocument();

    expect(
      within(source).queryByText("Alice")
    ).toBeNull();

    expect(
      within(source).queryByText("Carol")
    ).toBeNull();

    /* The header count still reflects the whole list. */
    expect(
      within(source).getByText("3")
    ).toBeInTheDocument();
  });

  it("keeps disabled items out of the selection", async () => {
    const user = userEvent.setup();

    render(
      <Transfer
        data={[
          { key: "a", label: "Alpha" },
          {
            key: "b",
            label: "Beta",
            disabled: true,
          },
        ]}
      />
    );

    const source = screen.getByRole("group", {
      name: "Source",
    });

    expect(
      within(source).getByRole("checkbox", {
        name: /Beta/,
      })
    ).toBeDisabled();

    await user.click(
      within(source).getByRole("checkbox", {
        name: /Beta/,
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Move selected to the right",
      })
    ).toBeDisabled();
  });

  it("shows an empty state for a list without items", () => {
    render(
      <Transfer
        data={people}
        defaultTargetKeys={[
          "alice",
          "bob",
          "carol",
        ]}
        titles={["Available", "Selected"]}
      />
    );

    expect(
      within(
        screen.getByRole("group", {
          name: "Available",
        })
      ).getByRole("status")
    ).toHaveTextContent("No items.");
  });

  it("renders custom item content", () => {
    render(
      <Transfer
        data={people}
        render={(item) => (
          <strong>Member: {item.label}</strong>
        )}
      />
    );

    expect(
      screen.getByText("Member: Alice")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: "Alice",
      })
    ).toBeInTheDocument();
  });

  it("applies the list height and the disabled state", () => {
    render(
      <Transfer
        data={people}
        searchable
        disabled
        listHeight={180}
        titles={["Available", "Selected"]}
      />
    );

    const source = screen.getByRole("group", {
      name: "Available",
    });

    expect(
      within(source).getByRole("list", {
        name: "Available",
      })
    ).toHaveStyle({ height: "180px" });

    expect(
      within(source).getByRole("searchbox")
    ).toBeDisabled();

    expect(
      within(source).getByRole("checkbox", {
        name: /Alice/,
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Move selected to the right",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Move all to the right",
      })
    ).toBeDisabled();
  });
});
