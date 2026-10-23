"use client";

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

import { forwardRef } from "react";
export const FormField = forwardRef<HTMLDivElement, PimoluFormFieldProps>(function FormField({
  style: motionStyle,
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
}, ref) {
  const generatedId = useId();

  const controlId = id ?? `pimolu-field-${generatedId}`;
  const messageId = `${controlId}-message`;

  const hasError = invalid || Boolean(errorMessage);
  const message = errorMessage ?? helperText;
  const hasMessage = Boolean(message);

  return (
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
      <div ref={ref} style={motionStyle}
        className={classes(
          "pimolu-form-field",
          disabled && "pimolu-form-field--disabled",
          className
        )}
      >
        {label && (
          <Label
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
            id={messageId}
            variant={hasError ? "error" : "helper"}
          >
            {message}
          </FormMessage>
        )}
      </div>
    </FormFieldContext.Provider>
  );
});

FormField.displayName = "PimoluFormField";

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

export const FormMessage = forwardRef<HTMLParagraphElement, PimoluFormMessageProps>(function FormMessage({
  style: motionStyle,
  children,
  variant = "helper",
  id,
  className,
}, ref) {
  if (!children) return null;

  return (
    <p ref={ref} style={motionStyle}
      id={id}
      role={variant === "error" ? "alert" : undefined}
      className={classes(
        "pimolu-form-message",
        `pimolu-form-message--${variant}`,
        className
      )}
    >
      {children}
    </p>
  );
});

FormMessage.displayName = "PimoluFormMessage";

/* =========================================
   FORM GROUP
========================================= */

export const FormGroup = forwardRef<HTMLDivElement, PimoluFormGroupProps>(function FormGroup({
  style: motionStyle,
  children,
  label,
  description,
  orientation = "vertical",
  className,
}, ref) {
  const generatedId = useId();
  const labelId = `pimolu-form-group-${generatedId}`;

  return (
    <div ref={ref} style={motionStyle}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      data-orientation={orientation}
      className={classes(
        "pimolu-form-group",
        `pimolu-form-group--${orientation}`,
        className
      )}
    >
      {label && (
        <span
          id={labelId}
          className="pimolu-form-group__label"
        >
          {label}
        </span>
      )}

      {description && (
        <p className="pimolu-form-group__description">
          {description}
        </p>
      )}

      <div className="pimolu-form-group__items">
        {children}
      </div>
    </div>
  );
});

FormGroup.displayName = "PimoluFormGroup";

/* =========================================
   FIELDSET
========================================= */

export const Fieldset = forwardRef<HTMLFieldSetElement, PimoluFieldsetProps>(function Fieldset({
  style: motionStyle,
  children,
  legend,
  description,
  disabled = false,
  className,
}, ref) {
  const generatedId = useId();

  const descriptionId = description
    ? `pimolu-fieldset-${generatedId}`
    : undefined;

  return (
    <fieldset ref={ref} style={motionStyle}
      disabled={disabled}
      aria-describedby={descriptionId}
      className={classes("pimolu-fieldset", className)}
    >
      <legend className="pimolu-fieldset__legend">
        {legend}
      </legend>

      {description && (
        <p
          id={descriptionId}
          className="pimolu-fieldset__description"
        >
          {description}
        </p>
      )}

      <div className="pimolu-fieldset__items">
        {children}
      </div>
    </fieldset>
  );
});

Fieldset.displayName = "PimoluFieldset";
