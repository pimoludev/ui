import {
  render,
  screen,
  fireEvent,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  Sparkline,
} from "./chart";
import { createRef } from "react";

const revenue = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 18 },
  { label: "Mar", value: 14 },
  { label: "Apr", value: 24 },
];

describe("Pimolu Chart", () => {
  it("explores formatted categories using one Tab stop, arrows, Home, End and Escape", async () => {
    const user = userEvent.setup();
    render(<BarChart aria-label="Revenue" data={revenue} valueFormatter={(value) => `$${value}`} />);
    const explorer = screen.getByRole("group", { name: "Revenue: explore values" });
    await user.tab();
    expect(explorer).toHaveFocus();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Jan");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tooltip")).toHaveTextContent("$18");
    await user.keyboard("{End}{ArrowRight}");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Apr");
    await user.keyboard("{Home}{ArrowLeft}");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Jan");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(explorer).toHaveFocus();
  });

  it("supports touch on a donut segment and allows opting out without leaking props to DOM", () => {
    const { container, rerender } = render(<DonutChart aria-label="Sources" data={revenue} />);
    const segment = container.querySelectorAll(".pimolu-chart__segment")[1];
    fireEvent.pointerDown(segment, { pointerType: "touch" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Feb");
    expect(screen.getByRole("tooltip")).toHaveTextContent("27%");
    const explorer = screen.getByRole("group");
    fireEvent.focus(explorer);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Feb");
    fireEvent.keyDown(explorer, { key: "Escape" });
    fireEvent.pointerMove(segment);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.pointerDown(segment, { pointerType: "touch" });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Feb");
    rerender(<DonutChart aria-label="Sources" data={revenue} showTooltip={false} />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(container.firstChild).not.toHaveAttribute("showTooltip");
  });

  it("keeps missing observations as gaps and only fills AreaChart", () => {
    const { container, rerender } = render(<LineChart series={[{ name: "Orders", values: [4, 9, NaN, 6, 12] }]} curve="smooth" />);
    const path = container.querySelector(".pimolu-chart__line")?.getAttribute("d") ?? "";
    expect(path.match(/M/g)).toHaveLength(2);
    expect(path).toContain("C");
    expect(path).not.toMatch(/NaN|Infinity/);
    expect(container.querySelector(".pimolu-chart__area")).toBeNull();
    rerender(<AreaChart series={[{ name: "Orders", values: [4, 9, NaN, 6, 12] }]} curve="smooth" areaFill="solid" />);
    expect(container.querySelector(".pimolu-chart__area")?.getAttribute("d")?.match(/Z/g)).toHaveLength(2);
  });

  it("preserves the chart DOM ref and the fixed viewBox option", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<LineChart ref={ref} width={480} height={240} responsive={false}
      series={[{ name: "Revenue", values: [10, 18] }]} />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(screen.getByRole("img")).toHaveAttribute("viewBox", "0 0 480 240");
    expect(ref.current).not.toHaveAttribute("responsive");
  });

  it("uses unique gradient ids and reports unavailable series without inventing values", async () => {
    const user = userEvent.setup();
    const { container } = render(<>
      <AreaChart aria-label="Orders" labels={["Mon", "Tue"]} series={[{ name: "Paid", values: [8, 12] }, { name: "Trial", values: [3] }]} />
      <AreaChart series={[{ name: "Other", values: [2, 4] }]} />
    </>);
    const gradients = [...container.querySelectorAll("linearGradient")].map((element) => element.id);
    expect(new Set(gradients).size).toBe(3);
    await user.tab();
    await user.keyboard("{End}");
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Tue");
    expect(within(tooltip).getByText("—")).toBeInTheDocument();
    expect(tooltip).toHaveAttribute("aria-live", "polite");
  });
  it("renders bars, value labels, a labelled image and a hidden data table", () => {
    const { container } = render(
      <BarChart
        aria-label="Revenue by month"
        data={revenue}
        showValues
      />
    );

    const image = screen.getByRole("img", {
      name: "Revenue by month",
    });

    expect(image).toHaveClass("pimolu-chart__svg");
    expect(image.querySelector("title")).toHaveTextContent(
      "Revenue by month"
    );
    expect(image.querySelector("desc")).toHaveTextContent(
      "Bar chart with 4 categories"
    );

    expect(
      container.querySelectorAll(".pimolu-chart__bar")
    ).toHaveLength(4);

    expect(
      container.querySelectorAll(
        ".pimolu-chart__value-label"
      )
    ).toHaveLength(4);

    const table = screen.getByRole("table", {
      name: "Revenue by month data",
    });

    expect(table).toHaveTextContent("Jan");
    expect(table).toHaveTextContent("24");
  });

  it("scales bars against an explicit max", () => {
    const { container } = render(
      <BarChart
        aria-label="Scaled bars"
        data={[
          { label: "Half", value: 50 },
          { label: "Full", value: 100 },
        ]}
        max={100}
        width={400}
        height={300}
      />
    );

    const bars = container.querySelectorAll(
      ".pimolu-chart__bar"
    );

    const half = Number(
      bars[0].getAttribute("height")
    );
    const full = Number(
      bars[1].getAttribute("height")
    );

    expect(full).toBeGreaterThan(half);
    expect(half).toBeCloseTo(full / 2, 4);
  });

  it("groups and stacks series, including a stack total", () => {
    const series = [
      { name: "Online", values: [30, 20] },
      { name: "Retail", values: [40, 60] },
    ];

    const { container, rerender } = render(
      <BarChart
        aria-label="Sales by quarter"
        labels={["Q1", "Q2"]}
        series={series}
        showLegend
      />
    );

    expect(
      container.querySelectorAll(".pimolu-chart__bar")
    ).toHaveLength(4);

    expect(
      screen.getByRole("list", {
        name: "Sales by quarter legend",
      })
    ).toHaveTextContent("Online");

    const groupedBars = container.querySelectorAll(
      ".pimolu-chart__bar"
    );

    expect(
      groupedBars[0].getAttribute("x")
    ).not.toBe(groupedBars[1].getAttribute("x"));

    rerender(
      <BarChart
        aria-label="Sales by quarter"
        labels={["Q1", "Q2"]}
        series={series}
        stacked
        showValues
      />
    );

    const stackedBars = container.querySelectorAll(
      ".pimolu-chart__bar"
    );

    expect(stackedBars).toHaveLength(4);

    expect(
      stackedBars[0].getAttribute("x")
    ).toBe(stackedBars[1].getAttribute("x"));

    expect(
      stackedBars[0].getAttribute("y")
    ).not.toBe(stackedBars[1].getAttribute("y"));

    expect(
      Array.from(
        container.querySelectorAll(
          ".pimolu-chart__value-label"
        )
      ).map((node) => node.textContent)
    ).toEqual(["70", "80"]);
  });

  it("draws horizontal bars with axis titles", () => {
    const { container } = render(
      <BarChart
        aria-label="Revenue by channel"
        data={[
          { label: "Direct", value: 12 },
          { label: "Search", value: 36 },
        ]}
        horizontal
        showValues
        xAxisLabel="Revenue"
        yAxisLabel="Channel"
      />
    );

    expect(
      container.querySelector(".pimolu-chart")
    ).toHaveClass("pimolu-chart--horizontal");

    const bars = container.querySelectorAll(
      ".pimolu-chart__bar"
    );

    expect(
      Number(bars[1].getAttribute("width"))
    ).toBeGreaterThan(
      Number(bars[0].getAttribute("width"))
    );

    expect(
      screen.getByText("Revenue")
    ).toHaveClass("pimolu-chart__axis-title");

    expect(
      screen.getByText("Channel")
    ).toHaveClass("pimolu-chart__axis-title");
  });

  it("renders an empty state without an image or table", () => {
    const { container } = render(
      <BarChart
        aria-label="Empty revenue"
        data={[]}
        emptyLabel="Nothing to plot"
      />
    );

    expect(
      screen.getByText("Nothing to plot")
    ).toHaveAttribute("role", "status");

    expect(
      screen.queryByRole("img")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("table")
    ).not.toBeInTheDocument();

    expect(
      container.querySelector(".pimolu-chart")
    ).toHaveClass("pimolu-chart--empty");
  });

  it("renders line series with points, grid, legend and table", () => {
    const { container } = render(
      <LineChart
        aria-label="Revenue trend"
        labels={["Jan", "Feb", "Mar"]}
        series={[
          { name: "Desktop", values: [12, 18, 15] },
          { name: "Mobile", values: [8, 14, 21] },
        ]}
        showPoints
      />
    );

    expect(
      container.querySelectorAll(".pimolu-chart__line")
    ).toHaveLength(2);

    expect(
      container.querySelectorAll(".pimolu-chart__point")
    ).toHaveLength(6);

    expect(
      container.querySelectorAll(".pimolu-chart__grid")
        .length
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole("list", {
        name: "Revenue trend legend",
      })
    ).toHaveTextContent("Mobile");

    expect(
      screen.getByRole("table", {
        name: "Revenue trend data",
      })
    ).toHaveTextContent("Desktop");
  });

  it("renders an area chart and can omit grid and legend", () => {
    const { container } = render(
      <AreaChart
        aria-label="Traffic area"
        labels={["Mon", "Tue", "Wed"]}
        series={[
          { name: "Sessions", values: [120, 180, 150] },
        ]}
        showGrid={false}
        showLegend={false}
      />
    );

    expect(
      container.querySelectorAll(
        ".pimolu-chart__area"
      )
    ).toHaveLength(1);

    expect(
      container.querySelectorAll(".pimolu-chart__line")
    ).toHaveLength(1);

    expect(
      container.querySelectorAll(".pimolu-chart__point")
    ).toHaveLength(0);

    expect(
      container.querySelectorAll(".pimolu-chart__grid")
    ).toHaveLength(0);

    expect(
      screen.queryByRole("list")
    ).not.toBeInTheDocument();
  });

  it("uses a custom value formatter everywhere", () => {
    const { container } = render(
      <BarChart
        aria-label="Formatted revenue"
        data={[
          { label: "Jan", value: 10 },
          { label: "Feb", value: 20 },
        ]}
        showValues
        valueFormatter={(value) => `$${value}k`}
      />
    );

    const labels = Array.from(
      container.querySelectorAll(
        ".pimolu-chart__value-label"
      )
    ).map((node) => node.textContent);

    expect(labels).toEqual(["$10k", "$20k"]);

    expect(
      screen.getByRole("table", {
        name: "Formatted revenue data",
      })
    ).toHaveTextContent("$20k");
  });

  it("renders donut segments, centre text, legend and colours", () => {
    const { container } = render(
      <DonutChart
        aria-label="Traffic sources"
        data={[
          {
            label: "Direct",
            value: 60,
            color: "#123456",
          },
          { label: "Search", value: 40 },
        ]}
        centerValue="1,200"
        centerLabel="Sessions"
      />
    );

    const segments = container.querySelectorAll(
      ".pimolu-chart__segment"
    );

    expect(segments).toHaveLength(2);

    expect(
      segments[0].getAttribute("style")
    ).toContain("#123456");

    expect(
      screen.getByText("1,200")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sessions")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("list", {
        name: "Traffic sources legend",
      })
    ).toHaveTextContent("60%");

    expect(
      screen.getByRole("table", {
        name: "Traffic sources data",
      })
    ).toHaveTextContent("40%");
  });

  it("renders a donut empty state", () => {
    render(
      <DonutChart
        aria-label="Empty traffic"
        data={[]}
      />
    );

    expect(
      screen.getByText("No data available")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("img")
    ).not.toBeInTheDocument();
  });

  it("renders a sparkline path, optional area and data table", () => {
    const { container } = render(
      <Sparkline
        aria-label="Weekly trend"
        data={[4, 7, 5, 9, 6]}
        area
      />
    );

    const image = screen.getByRole("img", {
      name: "Weekly trend",
    });

    expect(image).toHaveAttribute(
      "viewBox",
      "0 0 160 40"
    );

    expect(
      container
        .querySelector(".pimolu-chart__line")
        ?.getAttribute("d")
    ).toContain("M");

    expect(
      container.querySelectorAll(
        ".pimolu-chart__area"
      )
    ).toHaveLength(1);

    expect(
      screen.getByRole("table", {
        name: "Weekly trend data",
      })
    ).toHaveTextContent("#5");
  });
});
