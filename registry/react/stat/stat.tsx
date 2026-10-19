import { forwardRef, useId } from "react";

import type {
  PimoluStatProps,
  PimoluStatTrend,
} from "./stat.types";

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

const trendLabels: Record<PimoluStatTrend, string> = {
  up: "Increased",
  down: "Decreased",
  neutral: "No change",
};

function TrendIcon({ trend }: { trend: PimoluStatTrend }) {
  return (
    <svg
      className="pimolu-stat__trend-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {trend === "up" && (
        <path d="M12 19V5M5 12l7-7 7 7" />
      )}

      {trend === "down" && (
        <path d="M12 5v14M5 12l7 7 7-7" />
      )}

      {trend === "neutral" && (
        <path d="M5 12h14" />
      )}
    </svg>
  );
}

/* =========================================
   STAT
========================================= */

export const Stat = forwardRef<
  HTMLDivElement,
  PimoluStatProps
>(function Stat(
  {
    label,
    value,
    delta,
    trend = "neutral",
    description,
    icon,
    size = "md",
    className,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const labelId = `pimolu-stat-${generatedId}-label`;

  const hasDelta = delta != null;

  return (
    <div
      {...props}
      ref={ref}
      role="group"
      aria-labelledby={labelId}
      data-trend={hasDelta ? trend : undefined}
      className={classes(
        "pimolu-stat",
        `pimolu-stat--${size}`,
        className
      )}
    >
      {icon != null && (
        <span
          className="pimolu-stat__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <div className="pimolu-stat__body">
        <span
          id={labelId}
          className="pimolu-stat__label"
        >
          {label}
        </span>

        <div className="pimolu-stat__value-row">
          <span className="pimolu-stat__value">
            {value}
          </span>

          {hasDelta && (
            <span
              className="pimolu-stat__delta"
              data-trend={trend}
            >
              {/* The icon and the hidden word keep the direction
                  understandable without colour perception. */}
              <TrendIcon trend={trend} />

              <span className="pimolu-stat__sr-only">
                {trendLabels[trend]}{" "}
              </span>

              <span className="pimolu-stat__delta-value">
                {delta}
              </span>
            </span>
          )}
        </div>

        {description != null && (
          <p className="pimolu-stat__description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

Stat.displayName = "PimoluStat";
