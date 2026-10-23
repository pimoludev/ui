export type PimoluGanttScale = "day" | "week" | "month";

/** A task displayed on the Gantt timeline. */
export interface PimoluGanttTask {
  /** Stable identifier, also used to resolve dependencies. */
  id: string;

  /** Visible task name. */
  name: string;

  /** First day of the task. The time part is ignored. */
  start: Date;

  /** Last day of the task, inclusive. The time part is ignored. */
  end: Date;

  /** Completion percentage, clamped to 0–100. Defaults to 0. */
  progress?: number;

  /** IDs of tasks that must finish before this one starts. */
  dependencies?: readonly string[];

  /** Optional bar accent colour. */
  color?: string;

  /** Optional group heading. Tasks sharing a group are rendered together. */
  group?: string;
}

export interface PimoluGanttProps {
  /** Tasks to display. */
  tasks: readonly PimoluGanttTask[];

  /**
   * Controlled first day of the visible range. When omitted, the range is
   * derived from the tasks, unless a navigation or Today action moved it.
   */
  start?: Date;

  /** Initial visible start when uncontrolled. Defaults to the task range. */
  defaultStart?: Date;

  /** Last day of the visible range, inclusive. Defaults to the task range. */
  end?: Date;

  /** Called with the next visible start after navigation or Today. */
  onStartChange?: (start: Date) => void;

  /** Controlled timeline scale. */
  scale?: PimoluGanttScale;

  /** Initial scale when uncontrolled. Defaults to "day". */
  defaultScale?: PimoluGanttScale;

  /** Called when the Day/Week/Month control changes. */
  onScaleChange?: (scale: PimoluGanttScale) => void;

  /** Controlled zoom multiplier between 0.5 and 2. Defaults to 1. */
  zoom?: number;

  /** Initial zoom when uncontrolled. Defaults to 1. */
  defaultZoom?: number;

  /** Called when the zoom controls change the multiplier. */
  onZoomChange?: (zoom: number) => void;

  /** Draw SVG dependency links between tasks. Defaults to true. */
  showDependencies?: boolean;

  /** Draw a vertical marker for today when it is inside the range. Defaults to true. */
  showToday?: boolean;

  /** BCP 47 locale used for date labels. Defaults to "en-US". */
  locale?: string;

  /** Called when a task bar or task name is activated. */
  onTaskClick?: (task: PimoluGanttTask) => void;

  /** Maximum height of the scrollable chart. */
  maxHeight?: number | string;

  /** Class applied to the outer Gantt. */
  className?: string;

  /** Accessible name of the timeline table. Defaults to "Project timeline". */
  "aria-label"?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}
