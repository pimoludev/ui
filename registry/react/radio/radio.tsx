"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ChangeEvent,
} from "react";

import type {
  PimoluRadioProps,
  PimoluRadioGroupProps,
  PimoluRadioSize,
  PimoluRadioVariant,
} from "./radio.types";

import {
  radioGroupVariants,
  radioVariants,
} from "./radio.variants";

/* =========================================
   INTERNAL CONTEXT
========================================= */

interface RadioContextValue {
  name: string;
  size: PimoluRadioSize;
  variant: PimoluRadioVariant;

  controlled: boolean;
  value?: string;
  defaultValue?: string;

  disabled: boolean;
  required: boolean;

  onValueChange?: (value: string) => void;
}

const RadioContext =
  createContext<RadioContextValue | null>(null);

/* =========================================
   RADIO GROUP
========================================= */

export const RadioGroup = forwardRef<
  HTMLFieldSetElement,
  PimoluRadioGroupProps
>(function RadioGroup(
  {
    id,
    name,

    value,
    defaultValue,
    onValueChange,

    label,
    description,

    size = "md",
    variant = "primary",
    orientation = "vertical",

    disabled = false,
    required = false,

    className,
    children,

    "aria-describedby": ariaDescribedBy,

    ...props
  },
  ref
) {
  const generatedId = useId();

  const groupId =
    id ?? `pimolu-radio-group-${generatedId}`;

  const groupName =
    name ?? `pimolu-radio-${generatedId}`;

  const descriptionId = description
    ? `${groupId}-description`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    descriptionId,
  ].filter(Boolean).join(" ") || undefined;

  const contextValue: RadioContextValue = {
    name: groupName,
    size,
    variant,

    controlled: value !== undefined,
    value,
    defaultValue,

    disabled,
    required,
    onValueChange,
  };

  const groupClassName = [
    radioGroupVariants({ orientation }),
    className,
  ].filter(Boolean).join(" ");

  return (
    <RadioContext.Provider value={contextValue}>
      <fieldset
        {...props}
        ref={ref}
        id={groupId}
        className={groupClassName}
        disabled={disabled}
        aria-describedby={describedBy}
        data-orientation={orientation}
      >
        {label && (
          <legend className="pimolu-radio-group__legend">
            {label}
          </legend>
        )}

        {description && (
          <p
            id={descriptionId}
            className="pimolu-radio-group__description"
          >
            {description}
          </p>
        )}

        <div className="pimolu-radio-group__options">
          {children}
        </div>
      </fieldset>
    </RadioContext.Provider>
  );
});

RadioGroup.displayName = "PimoluRadioGroup";

/* =========================================
   RADIO
========================================= */

export const Radio = forwardRef<
  HTMLInputElement,
  PimoluRadioProps
>(function Radio(
  {
    id,
    value,
    label,
    description,

    size,
    variant,

    disabled = false,
    required = false,

    checked,
    defaultChecked,
    name,

    onChange,

    className,
    style,

    "aria-describedby": ariaDescribedBy,

    ...props
  },
  ref
) {
  const group = useContext(RadioContext);

  const generatedId = useId();

  const radioId =
    id ?? `pimolu-radio-${generatedId}`;

  const descriptionId = description
    ? `${radioId}-description`
    : undefined;

  const describedBy = [
    ariaDescribedBy,
    descriptionId,
  ].filter(Boolean).join(" ") || undefined;

  const resolvedSize =
    size ?? group?.size ?? "md";

  const resolvedVariant =
    variant ?? group?.variant ?? "primary";

  const resolvedDisabled =
    disabled || group?.disabled || false;

  const resolvedRequired =
    required || group?.required || false;

  const resolvedName =
    group?.name ?? name;

  /* Native controlled / uncontrolled modes */

  const resolvedChecked = group
    ? group.controlled
      ? group.value === value
      : undefined
    : checked;

  const resolvedDefaultChecked = group
    ? group.controlled
      ? undefined
      : group.defaultValue === value
    : defaultChecked;

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    onChange?.(event);

    if (event.currentTarget.checked) {
      group?.onValueChange?.(value);
    }
  }

  const radioClassName = [
    radioVariants({
      size: resolvedSize,
      variant: resolvedVariant,
    }),
    resolvedDisabled && "pimolu-radio--disabled",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={radioClassName}
      style={style}
    >
      <span className="pimolu-radio__control">
        <input
          {...props}
          ref={ref}
          id={radioId}
          type="radio"
          className="pimolu-radio__input"
          name={resolvedName}
          value={value}
          checked={resolvedChecked}
          defaultChecked={resolvedDefaultChecked}
          disabled={resolvedDisabled}
          required={resolvedRequired}
          onChange={handleChange}
          aria-describedby={describedBy}
        />

        <span
          className="pimolu-radio__circle"
          aria-hidden="true"
        />
      </span>

      {(label || description) && (
        <span className="pimolu-radio__content">
          {label && (
            <label
              htmlFor={radioId}
              className="pimolu-radio__label"
            >
              {label}
            </label>
          )}

          {description && (
            <span
              id={descriptionId}
              className="pimolu-radio__description"
            >
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
});

Radio.displayName = "PimoluRadio";
