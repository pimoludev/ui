"use client";

import {
  createContext,
  forwardRef,
  useContext,
} from "react";

import type {
  PimoluButtonGroupOrientation,
  PimoluButtonGroupProps,
  PimoluButtonGroupSeparatorProps,
} from "./button-group.types";

interface ButtonGroupContextValue {
  orientation: PimoluButtonGroupOrientation;
}

const ButtonGroupContext =
  createContext<ButtonGroupContextValue | null>(null);

export const ButtonGroup = forwardRef<
  HTMLDivElement,
  PimoluButtonGroupProps
>(function ButtonGroup(
  {
    children,
    orientation = "horizontal",
    attached = true,
    className,
    role = "group",
    ...props
  },
  ref
) {
  const classes = [
    "pimolu-button-group",
    `pimolu-button-group--${orientation}`,
    attached && "pimolu-button-group--attached",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ButtonGroupContext.Provider value={{ orientation }}>
      <div
        {...props}
        ref={ref}
        role={role}
        data-orientation={orientation}
        data-attached={attached ? "true" : "false"}
        className={classes}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
});

ButtonGroup.displayName = "PimoluButtonGroup";

export function ButtonGroupSeparator({
  orientation,
  className,
  ...props
}: PimoluButtonGroupSeparatorProps) {
  const group = useContext(ButtonGroupContext);

  const resolvedOrientation: PimoluButtonGroupOrientation =
    orientation ??
    (group?.orientation === "vertical"
      ? "horizontal"
      : "vertical");

  return (
    <span
      {...props}
      role="separator"
      aria-orientation={resolvedOrientation}
      data-orientation={resolvedOrientation}
      className={[
        "pimolu-button-group__separator",
        `pimolu-button-group__separator--${resolvedOrientation}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

ButtonGroupSeparator.displayName =
  "PimoluButtonGroupSeparator";
