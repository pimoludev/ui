"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  type ReactElement,
} from "react";

import type {
  PimoluFieldsetProps,
  PimoluFormControlProps,
  PimoluFormFieldProps,
  PimoluFormGroupProps,
  PimoluFormMessageProps,
} from "./form-field.types";

import { Label } from "../label/label";

interface FormFieldContextValue {
  controlId: string;
  messageId: string;
  hasMessage: boolean;
  hasError: boolean;
  required: boolean;
  disabled: boolean;
}

const FormFieldContext =
  createContext<FormFieldContextValue | null>(null);

function useFormField(component: string) {
  const context = useContext(FormFieldContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <FormField>.`
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

/* =========================================
   FORM FIELD
========================================= */

export function FormField({ classNames,
  children,
  label,
  id,
  helperText,
  errorMessage,
  required = false,
  optional = false,
  optionalLabel,
  invalid = false,
  disabled = false,
  className,
}: PimoluFormFieldProps) {
  const [partClasses, scopeParts] = usePartClasses("form-field", classNames, true);

  const generatedId = useId();

  const controlId = id ?? `pimolu-field-${generatedId}`;
  const messageId = `${controlId}-message`;

  const hasError = invalid || Boolean(errorMessage);
  const message = errorMessage ?? helperText;
  const hasMessage = Boolean(message);

  return scopeParts((
    <FormFieldContext.Provider
      value={{
        controlId,
        messageId,
        hasMessage,
        hasError,
        required,
        disabled,
      }}
    >
      <div
        className={mergeClasses(classes(
          "pimolu-form-field",
          disabled && "pimolu-form-field--disabled",
          className
        ), partClasses.root)}
      >
        {label && (
          <Label
            className={partClasses.label}
            htmlFor={controlId}
            required={required}
            optional={optional}
            optionalLabel={optionalLabel}
            disabled={disabled}
          >
            {label}
          </Label>
        )}

        {children}

        {message && (
          <FormMessage
            className={partClasses.message}
            id={messageId}
            variant={hasError ? "error" : "helper"}
          >
            {message}
          </FormMessage>
        )}
      </div>
    </FormFieldContext.Provider>
  ));
}

/* =========================================
   FORM CONTROL
========================================= */

interface ControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function FormControl({
  children,
}: PimoluFormControlProps) {
  const field = useFormField("FormControl");

  if (!isValidElement(children)) return children;

  const control = children as ReactElement<
    Record<string, unknown>
  >;

  const props = control.props as ControlProps;

  const describedBy =
    [
      props["aria-describedby"],
      field.hasMessage ? field.messageId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return cloneElement(control, {
    id: field.controlId,

    "aria-describedby": describedBy,

    "aria-invalid":
      props["aria-invalid"] ??
      (field.hasError ? true : undefined),

    required:
      props.required ??
      (field.required ? true : undefined),

    disabled:
      field.disabled ? true : props.disabled,
  });
}

/* =========================================
   FORM MESSAGE
========================================= */

export function FormMessage({ classNames,
  children,
  variant = "helper",
  id,
  className,
}: PimoluFormMessageProps) {
  const [partClasses, scopeParts] = usePartClasses("form-field", classNames, true);

  if (!children) return scopeParts(null);

  return scopeParts((
    <p
      id={id}
      role={variant === "error" ? "alert" : undefined}
      className={mergeClasses(classes(
        "pimolu-form-message",
        `pimolu-form-message--${variant}`,
        className
      ), partClasses.root)}
    >
      {children}
    </p>
  ));
}

/* =========================================
   FORM GROUP
========================================= */

export function FormGroup({ classNames,
  children,
  label,
  description,
  orientation = "vertical",
  className,
}: PimoluFormGroupProps) {
  const [partClasses, scopeParts] = usePartClasses("form-field", classNames, true);

  const generatedId = useId();
  const labelId = `pimolu-form-group-${generatedId}`;

  return scopeParts((
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      data-orientation={orientation}
      className={mergeClasses(classes(
        "pimolu-form-group",
        `pimolu-form-group--${orientation}`,
        className
      ), partClasses.root)}
    >
      {label && (
        <span
          id={labelId}
          className={mergeClasses("pimolu-form-group__label", partClasses.label)}
        >
          {label}
        </span>
      )}

      {description && (
        <p className={mergeClasses("pimolu-form-group__description", partClasses.description)}>
          {description}
        </p>
      )}

      <div className={mergeClasses("pimolu-form-group__items", partClasses.items)}>
        {children}
      </div>
    </div>
  ));
}

/* =========================================
   FIELDSET
========================================= */

export function Fieldset({ classNames,
  children,
  legend,
  description,
  disabled = false,
  className,
}: PimoluFieldsetProps) {
  const [partClasses, scopeParts] = usePartClasses("form-field", classNames, true);

  const generatedId = useId();

  const descriptionId = description
    ? `pimolu-fieldset-${generatedId}`
    : undefined;

  return scopeParts((
    <fieldset
      disabled={disabled}
      aria-describedby={descriptionId}
      className={mergeClasses(classes("pimolu-fieldset", className), partClasses.root)}
    >
      <legend className={mergeClasses("pimolu-fieldset__legend", partClasses.legend)}>
        {legend}
      </legend>

      {description && (
        <p
          id={descriptionId}
          className={mergeClasses("pimolu-fieldset__description", partClasses.description)}
        >
          {description}
        </p>
      )}

      <div className={mergeClasses("pimolu-fieldset__items", partClasses.items)}>
        {children}
      </div>
    </fieldset>
  ));
}
