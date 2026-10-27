
import type { PimoluClassNames } from "../customization/customization.types";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";
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

function TrendIcon({ classNames, trend }: {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"stat">;
 trend: PimoluStatTrend }) {
  const [partClasses, scopeParts] = usePartClasses("stat", classNames, false);

  return scopeParts((
    <svg
      className={mergeClasses("pimolu-stat__trend-icon", partClasses.trendIcon)}
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
  ));
}

/* =========================================
   STAT
========================================= */

export const Stat = forwardRef<
  HTMLDivElement,
  PimoluStatProps
>(function Stat(
  { classNames,
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
  const [partClasses, scopeParts] = usePartClasses("stat", classNames, true);

  const generatedId = useId();
  const labelId = `pimolu-stat-${generatedId}-label`;

  const hasDelta = delta != null;

  return scopeParts((
    <div
      {...props}
      ref={ref}
      role="group"
      aria-labelledby={labelId}
      data-trend={hasDelta ? trend : undefined}
      className={mergeClasses(classes(
        "pimolu-stat",
        `pimolu-stat--${size}`,
        className
      ), partClasses.root)}
    >
      {icon != null && (
        <span
          className={mergeClasses("pimolu-stat__icon", partClasses.icon)}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <div className={mergeClasses("pimolu-stat__body", partClasses.body)}>
        <span
          id={labelId}
          className={mergeClasses("pimolu-stat__label", partClasses.label)}
        >
          {label}
        </span>

        <div className={mergeClasses("pimolu-stat__value-row", partClasses.valueRow)}>
          <span className={mergeClasses("pimolu-stat__value", partClasses.value)}>
            {value}
          </span>

          {hasDelta && (
            <span
              className={mergeClasses("pimolu-stat__delta", partClasses.delta)}
              data-trend={trend}
            >
              {/* The icon and the hidden word keep the direction
                  understandable without colour perception. */}
              <TrendIcon trend={trend} />

              <span className={mergeClasses("pimolu-stat__sr-only", partClasses.srOnly)}>
                {trendLabels[trend]}{" "}
              </span>

              <span className={mergeClasses("pimolu-stat__delta-value", partClasses.deltaValue)}>
                {delta}
              </span>
            </span>
          )}
        </div>

        {description != null && (
          <p className={mergeClasses("pimolu-stat__description", partClasses.description)}>
            {description}
          </p>
        )}
      </div>
    </div>
  ));
});

Stat.displayName = "PimoluStat";
