import type {
  ChangeEvent,
  FormEvent,
  FormHTMLAttributes,
  ReactNode,
} from "react";

import type { ButtonProps } from "../button/button";

/* =========================================
   VALUES AND ERRORS
========================================= */

/** A form is a flat object of named fields. */
export type FormValues = object;

/** One message per invalid field. */
export type FormErrors<T extends FormValues> = Partial<
  Record<Extract<keyof T, string>, string>
>;

/** Synchronous or asynchronous validation of the whole form. */
export type FormValidate<T extends FormValues> = (
  values: T
) =>
  | FormErrors<T>
  | void
  | Promise<FormErrors<T> | void>;

/** Submission handler, called only after validation succeeds. */
export type FormSubmitHandler<T extends FormValues> = (
  values: T
) => void | Promise<void>;

/* =========================================
   HOOK
========================================= */

export interface UseFormOptions<T extends FormValues> {
  /** Initial values; also the values restored by `reset()`. */
  defaultValues: T;

  /** Whole-form validation. Return a map of messages to block submit. */
  validate?: FormValidate<T>;

  /** Called with the current values when the form is valid. */
  onSubmit?: FormSubmitHandler<T>;
}

/**
 * Props spread on one native control. They are typed broadly so the same
 * registration works with an `<input>`, a `<textarea>`, a native `<select>`
 * or the Pimolu `Input` and `Textarea` wrappers.
 *
 * `register` reads `event.target.value` (or `checked` for a checkbox), so use
 * it on controls that emit a native `onChange`. Components that only report
 * through `onValueChange` (Select's styled listbox, CurrencyInput,
 * MaskedInput, PhoneInput, ...) should be controlled with `values[name]`,
 * `onValueChange={(value) => setValue(name, value)}` and `formId` for
 * `aria-describedby`.
 */
export interface PimoluFormRegistration {
  name: string;

  value?: string | number | readonly string[];

  checked?: boolean;

  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;

  "aria-invalid"?: true;

  "aria-describedby"?: string;
}

export interface UseFormReturn<T extends FormValues> {
  /** Current values, updated by `setValue` and `register`. */
  values: T;

  /** Current validation messages, keyed by field name. */
  errors: FormErrors<T>;

  /** True while an async `onSubmit` is pending. */
  isSubmitting: boolean;

  /** Stable id prefix shared with `FormError`. */
  formId: string;

  /** Set one field and clear its error. */
  setValue<K extends Extract<keyof T, string>>(
    name: K,
    value: T[K]
  ): void;

  /** Merge several values and clear their errors. */
  setValues(values: Partial<T>): void;

  /** Set or clear one field error programmatically. */
  setError(name: Extract<keyof T, string>, message?: string): void;

  /** Clear every error, or only one field. */
  clearErrors(name?: Extract<keyof T, string>): void;

  /** Props that bind a native or Pimolu control to a field. */
  register<K extends Extract<keyof T, string>>(
    name: K
  ): PimoluFormRegistration;

  /** Validate, then submit. Returns whether the form was valid. */
  handleSubmit(
    event?: FormEvent<HTMLFormElement>
  ): Promise<boolean>;

  /** Restore the initial values, or merge new ones. */
  reset(nextValues?: Partial<T>): void;
}

/* =========================================
   COMPONENTS
========================================= */

export interface PimoluFormProps<T extends FormValues = FormValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** The value returned by `useForm`. */
  form: UseFormReturn<T>;

  /** Disable the browser validation UI. Defaults to true. */
  noValidate?: boolean;

  children?: ReactNode;
}

export interface PimoluFormErrorProps {
  /** Registered field name. */
  name: string;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluFormSubmitProps
  extends Omit<ButtonProps, "type" | "loading"> {
  children?: ReactNode;
}
