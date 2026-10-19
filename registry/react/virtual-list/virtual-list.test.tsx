import { createRef } from "react";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { VirtualList } from "./virtual-list";

const items = Array.from(
  { length: 10_000 },
  (_, index) => `Row ${index}`
);

describe("Pimolu VirtualList", () => {
  it("renders only the visible window of a 10,000 item list", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={30}
        height={300}
        aria-label="Audit log"
        renderItem={(item) => item}
      />
    );

    const list = screen.getByRole("list", {
      name: "Audit log",
    });

    const rows = screen.getAllByRole("listitem");

    expect(rows.length).toBeLessThan(20);
    expect(rows[0]).toHaveTextContent("Row 0");
    expect(rows[0]).toHaveAttribute(
      "aria-setsize",
      "10000"
    );
    expect(rows[0]).toHaveAttribute(
      "aria-posinset",
      "1"
    );

    expect(
      container.querySelector(
        ".pimolu-virtual-list__spacer"
      )
    ).toHaveStyle({ height: "300000px" });

    expect(list).toHaveStyle({ height: "300px" });
  });

  it("moves the window when the list is scrolled", () => {
    const onScroll = vi.fn();

    render(
      <VirtualList
        items={items}
        itemHeight={30}
        height={300}
        onScroll={onScroll}
        renderItem={(item) => item}
      />
    );

    const list = screen.getByRole("list");

    fireEvent.scroll(list, {
      target: { scrollTop: 3000 },
    });

    expect(onScroll).toHaveBeenCalledOnce();

    expect(
      screen.queryByText("Row 0")
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Row 100")
    ).toBeInTheDocument();

    /* Overscan keeps rows above the viewport mounted. */
    expect(
      screen.getByText("Row 97")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Row 250")
    ).not.toBeInTheDocument();
  });

  it("supports itemCount with an index renderer", () => {
    render(
      <VirtualList
        itemCount={1000}
        itemHeight={20}
        height={200}
        renderItem={(index) => (
          <span>Item {index}</span>
        )}
      />
    );

    const rows = screen.getAllByRole("listitem");

    expect(rows).toHaveLength(13);
    expect(rows[0]).toHaveTextContent("Item 0");
    expect(rows[9]).toHaveTextContent("Item 9");
  });

  it("only asks for keys of the rendered rows", () => {
    const getKey = vi.fn((item: string) => item);

    render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        getKey={getKey}
        renderItem={(item) => item}
      />
    );

    expect(getKey).toHaveBeenCalled();
    expect(getKey.mock.calls.length).toBeLessThan(20);
    expect(getKey).toHaveBeenCalledWith("Row 0", 0);
  });

  it("honours the overscan setting", () => {
    const { rerender } = render(
      <VirtualList
        items={items}
        itemHeight={30}
        height={300}
        overscan={0}
        renderItem={(item) => item}
      />
    );

    expect(
      screen.getAllByRole("listitem")
    ).toHaveLength(10);

    rerender(
      <VirtualList
        items={items}
        itemHeight={30}
        height={300}
        overscan={5}
        renderItem={(item) => item}
      />
    );

    expect(
      screen.getAllByRole("listitem")
    ).toHaveLength(15);
  });

  it("exposes the list semantics, a native scroll target and a ref", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <VirtualList
        ref={ref}
        items={items}
        itemHeight={30}
        height={300}
        aria-label="Files"
        className="custom-list"
        renderItem={(item) => item}
      />
    );

    const list = screen.getByRole("list", {
      name: "Files",
    });

    expect(list).toHaveAttribute("tabindex", "0");
    expect(list).toHaveClass(
      "pimolu-virtual-list",
      "custom-list"
    );

    expect(ref.current).toBe(list);
  });

  it("respects a custom tabIndex and an empty data source", () => {
    const { container } = render(
      <VirtualList
        items={[]}
        itemHeight={24}
        height={120}
        tabIndex={-1}
        renderItem={(item) => item}
      />
    );

    const list = screen.getByRole("list");

    expect(list).toHaveAttribute("tabindex", "-1");

    expect(
      screen.queryAllByRole("listitem")
    ).toHaveLength(0);

    expect(
      container.querySelector(
        ".pimolu-virtual-list__spacer"
      )
    ).toHaveStyle({ height: "0px" });
  });

  it("positions rows absolutely with the fixed item height", () => {
    render(
      <VirtualList
        items={items}
        itemHeight={30}
        height={300}
        renderItem={(item) => item}
      />
    );

    const list = screen.getByRole("list");

    fireEvent.scroll(list, {
      target: { scrollTop: 3000 },
    });

    const row = screen
      .getByText("Row 100")
      .closest('[role="listitem"]') as HTMLElement;

    expect(row).toHaveAttribute("data-index", "100");
    expect(row.style.top).toBe("3000px");
    expect(row.style.height).toBe("30px");

    expect(list).toHaveAttribute(
      "data-total-items",
      "10000"
    );
  });
});
