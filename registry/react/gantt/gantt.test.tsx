import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Gantt } from "./gantt";
import type { PimoluGanttTask } from "./gantt.types";

const TODAY = new Date(2026, 9, 15, 10, 0);

const tasks: PimoluGanttTask[] = [
  {
    id: "discovery",
    name: "Discovery",
    start: new Date(2026, 8, 28),
    end: new Date(2026, 9, 2),
    progress: 100,
    group: "Plan",
    color: "#0ea5e9",
  },
  {
    id: "design",
    name: "Design system",
    start: new Date(2026, 9, 1),
    end: new Date(2026, 9, 9),
    progress: 60,
    dependencies: ["discovery"],
    group: "Plan",
  },
  {
    id: "build",
    name: "Build UI",
    start: new Date(2026, 9, 8),
    end: new Date(2026, 9, 20),
    progress: 25,
    dependencies: ["design"],
    group: "Delivery",
  },
];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Pimolu Gantt", () => {
  it("derives the range from the tasks and renders a semantic table", () => {
    render(<Gantt tasks={tasks} />);

    expect(
      screen.getByRole("table", {
        name: "Project timeline",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sep 28 – Oct 20, 2026")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("rowheader", { name: "Plan" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("rowheader", {
        name: "Delivery",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "View Discovery",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Discovery: September 28, 2026 to October 2, 2026. 100% complete."
      )
    ).toBeInTheDocument();
  });

  it("renders bars with text dates, progress and click handling", async () => {
    const user = userEvent.setup();
    const onTaskClick = vi.fn();

    render(
      <Gantt
        tasks={tasks}
        onTaskClick={onTaskClick}
      />
    );

    const bar = screen.getByRole("button", {
      name: /Design system, October 1, 2026 to October 9, 2026, 60% complete/,
    });

    expect(bar).toHaveAttribute("data-progress", "60");
    expect(
      bar.querySelector(
        ".pimolu-gantt__bar-progress"
      )
    ).toHaveStyle({ width: "60%" });

    await user.click(bar);

    expect(onTaskClick).toHaveBeenCalledTimes(1);
    expect(onTaskClick).toHaveBeenCalledWith(
      tasks[1]
    );
  });

  it("supports day, week and month scales", async () => {
    const user = userEvent.setup();
    const onScaleChange = vi.fn();

    render(
      <Gantt
        tasks={tasks}
        onScaleChange={onScaleChange}
      />
    );

    await user.click(
      screen.getByRole("radio", { name: "Week" })
    );

    expect(onScaleChange).toHaveBeenCalledWith("week");
    expect(
      screen.getByText("Sep 28")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Oct 19")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("radio", { name: "Month" })
    );

    expect(onScaleChange).toHaveBeenLastCalledWith(
      "month"
    );
    expect(
      screen.getByText("September 2026")
    ).toBeInTheDocument();
    expect(
      screen.getByText("October 2026")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sep 1 – Oct 31, 2026")
    ).toBeInTheDocument();
  });

  it("pans an uncontrolled range and reports the next start", async () => {
    const user = userEvent.setup();
    const onStartChange = vi.fn();

    render(
      <Gantt
        tasks={tasks}
        onStartChange={onStartChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Previous period",
      })
    );

    const nextStart = onStartChange.mock
      .calls[0][0] as Date;

    expect(nextStart.getFullYear()).toBe(2026);
    expect(nextStart.getMonth()).toBe(8);
    expect(nextStart.getDate()).toBe(5);
    expect(
      screen.getByText("Sep 5 – 27, 2026")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Next period",
      })
    );

    expect(
      screen.getByText("Sep 28 – Oct 20, 2026")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Today" })
    );

    expect(
      (onStartChange.mock.lastCall?.[0] as Date).getDate()
    ).toBe(15);
  });

  it("keeps a controlled start fixed while reporting navigation", async () => {
    const user = userEvent.setup();
    const onStartChange = vi.fn();

    render(
      <Gantt
        tasks={tasks}
        start={new Date(2026, 8, 28)}
        onStartChange={onStartChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next period",
      })
    );

    expect(onStartChange).toHaveBeenCalledTimes(1);
    expect(
      (onStartChange.mock.calls[0][0] as Date).getDate()
    ).toBe(21);
    expect(
      screen.getByText("Sep 28 – Oct 20, 2026")
    ).toBeInTheDocument();
  });

  it("zooms the timeline and reports the multiplier", async () => {
    const user = userEvent.setup();
    const onZoomChange = vi.fn();

    const { container } = render(
      <Gantt
        tasks={tasks}
        onZoomChange={onZoomChange}
      />
    );

    const canvas = container.querySelector(
      ".pimolu-gantt__canvas"
    ) as HTMLElement;

    expect(
      canvas.style.getPropertyValue(
        "--pimolu-gantt-timeline-width"
      )
    ).toBe("1012px");

    await user.click(
      screen.getByRole("button", {
        name: "Zoom in",
      })
    );

    expect(onZoomChange).toHaveBeenCalledWith(1.25);
    expect(
      canvas.style.getPropertyValue(
        "--pimolu-gantt-timeline-width"
      )
    ).toBe("1265px");
  });

  it.each(["day", "week", "month"] as const)(
    "keeps zoom proportional in the %s scale and respects its limits",
    async (scale) => {
      const user = userEvent.setup();
      const { container } = render(<Gantt tasks={tasks} defaultScale={scale} />);
      const canvas = container.querySelector(".pimolu-gantt__canvas") as HTMLElement;
      const width = () => parseFloat(canvas.style.getPropertyValue("--pimolu-gantt-timeline-width"));
      const initialWidth = width();
      const decrease = screen.getByRole("button", { name: "Zoom out" });
      const increase = screen.getByRole("button", { name: "Zoom in" });

      for (const name of ["Previous period", "Next period", "Zoom out", "Zoom in"]) {
        const button = screen.getByRole("button", { name });
        expect(button.querySelector("svg")).not.toBeNull();
        expect(button.querySelector(".pimolu-button__label svg")).toBeNull();
      }

      await user.click(decrease);
      expect(width()).toBe(Math.round(initialWidth * 0.75));
      await user.click(decrease);
      expect(width()).toBe(Math.round(initialWidth * 0.5));
      expect(decrease).toBeDisabled();

      increase.focus();
      await user.keyboard("{Enter}");
      expect(width()).toBe(Math.round(initialWidth * 0.75));
      for (let step = 0; step < 5; step++) await user.click(increase);
      expect(width()).toBe(initialWidth * 2);
      expect(increase).toBeDisabled();
      expect(container.querySelector(".pimolu-gantt__zoom-value")).toHaveTextContent("200%");
    }
  );

  it("draws dependency links and a today marker, both optional", () => {
    const { container, rerender } = render(
      <Gantt tasks={tasks} />
    );

    expect(
      container.querySelector(
        '[data-dependency="discovery->design"]'
      )
    ).not.toBeNull();

    expect(
      container.querySelector(
        '[data-dependency="design->build"]'
      )
    ).not.toBeNull();

    expect(
      container.querySelector(
        '[data-today-marker="true"]'
      )
    ).not.toBeNull();

    rerender(
      <Gantt
        tasks={tasks}
        showDependencies={false}
        showToday={false}
      />
    );

    expect(
      container.querySelector(
        '[data-dependency="discovery->design"]'
      )
    ).toBeNull();

    expect(
      container.querySelector(
        '[data-today-marker="true"]'
      )
    ).toBeNull();
  });

  it("accepts an explicit date range", () => {
    render(
      <Gantt
        tasks={tasks}
        start={new Date(2026, 8, 1)}
        end={new Date(2026, 8, 30)}
      />
    );

    expect(
      screen.getByText("Sep 1 – 30, 2026")
    ).toBeInTheDocument();
  });

  it("shows an empty state when there are no tasks", () => {
    render(<Gantt tasks={[]} />);

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("No tasks to display.");
    expect(
      screen.queryByRole("table")
    ).not.toBeInTheDocument();
  });
});
