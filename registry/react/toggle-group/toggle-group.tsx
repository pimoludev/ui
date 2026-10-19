"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import type {
  PimoluToggleGroupItemProps,
  PimoluToggleGroupProps,
} from "./toggle-group.types";

import { Toggle } from "../toggle/toggle";

import type {
  PimoluToggleSize,
  PimoluToggleVariant,
} from "../toggle/toggle.variants";

interface ToggleGroupContextValue {
  variant: PimoluToggleVariant;
  size: PimoluToggleSize;

  disabled: boolean;

  selected: (value: string) => boolean;
  toggle: (value: string) => void;
}

const ToggleGroupContext =
  createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup(component: string) {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <ToggleGroup>.`
    );
  }

  return context;
}

function classes(
  base: string,
  ...extra: Array<string | false | undefined>
) {
  return [base, ...extra].filter(Boolean).join(" ");
}

export function ToggleGroup(props: PimoluToggleGroupProps) {
  const {
    children,

    variant = "default",
    size = "md",
    orientation = "horizontal",
    disabled = false,

    className,
  } = props;

  const multiple = props.type === "multiple";

  const controlledValue = props.value;

  const [singleValue, setSingleValue] = useState(
    multiple
      ? ""
      : (props.defaultValue as string | undefined) ?? ""
  );

  const [multipleValue, setMultipleValue] = useState<
    string[]
  >(
    multiple
      ? (props.defaultValue as string[] | undefined) ?? []
      : []
  );

  const value: string | string[] =
    controlledValue !== undefined
      ? controlledValue
      : multiple
        ? multipleValue
        : singleValue;

  function selected(item: string) {
    return multiple
      ? (value as string[]).includes(item)
      : value === item;
  }

  function toggle(item: string) {
    if (multiple) {
      const current = (value as string[]) ?? [];

      const next = current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item];

      if (controlledValue === undefined) {
        setMultipleValue(next);
      }

      (
        props.onValueChange as
          | ((value: string[]) => void)
          | undefined
      )?.(next);

      return;
    }

    if (value === item) return;

    if (controlledValue === undefined) {
      setSingleValue(item);
    }

    (
      props.onValueChange as
        | ((value: string) => void)
        | undefined
    )?.(item);
  }

  return (
    <ToggleGroupContext.Provider
      value={{
        variant,
        size,
        disabled,
        selected,
        toggle,
      }}
    >
      <div
        role="group"
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        data-orientation={orientation}
        className={classes(
          "pimolu-toggle-group",
          orientation === "vertical" &&
            "pimolu-toggle-group--vertical",
          className
        )}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  value,
  disabled,
  children,
  className,
}: PimoluToggleGroupItemProps) {
  const group = useToggleGroup("ToggleGroupItem");

  return (
    <Toggle
      pressed={group.selected(value)}
      onPressedChange={() => group.toggle(value)}
      variant={group.variant}
      size={group.size}
      disabled={group.disabled || disabled}
      className={classes(
        "pimolu-toggle-group__item",
        className
      )}
    >
      {children}
    </Toggle>
  );
}
