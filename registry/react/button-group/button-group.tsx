"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


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
  { classNames,
    children,
    orientation = "horizontal",
    attached = true,
    className,
    role = "group",
    ...props
  },
  ref
) {
  const [partClasses, scopeParts] = usePartClasses("button-group", classNames, true);

  const classes = [
    "pimolu-button-group",
    `pimolu-button-group--${orientation}`,
    attached && "pimolu-button-group--attached",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return scopeParts((
    <ButtonGroupContext.Provider value={{ orientation }}>
      <div
        {...props}
        ref={ref}
        role={role}
        data-orientation={orientation}
        data-attached={attached ? "true" : "false"}
        className={mergeClasses(classes, partClasses.root)}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  ));
});

ButtonGroup.displayName = "PimoluButtonGroup";

export function ButtonGroupSeparator({ classNames,
  orientation,
  className,
  ...props
}: PimoluButtonGroupSeparatorProps) {
  const [partClasses, scopeParts] = usePartClasses("button-group", classNames, false);

  const group = useContext(ButtonGroupContext);

  const resolvedOrientation: PimoluButtonGroupOrientation =
    orientation ??
    (group?.orientation === "vertical"
      ? "horizontal"
      : "vertical");

  return scopeParts((
    <span
      {...props}
      role="separator"
      aria-orientation={resolvedOrientation}
      data-orientation={resolvedOrientation}
      className={mergeClasses([
        "pimolu-button-group__separator",
        `pimolu-button-group__separator--${resolvedOrientation}`,
        className,
      ]
        .filter(Boolean)
        .join(" "), partClasses.separator, classNames?.root)}
    />
  ));
}

ButtonGroupSeparator.displayName =
  "PimoluButtonGroupSeparator";
