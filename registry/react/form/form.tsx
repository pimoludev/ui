"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Button } from "../button/button";

import type {
  FormErrors,
  FormValues,
  PimoluFormErrorProps,
  PimoluFormProps,
  PimoluFormRegistration,
  PimoluFormSubmitProps,
  UseFormOptions,
  UseFormReturn,
} from "./form.types";

/* =========================================
   HELPERS
========================================= */

function classNames(
  ...values: Array<string | false | undefined>
) {
  return values.filter(Boolean).join(" ");
}

/** Extract the next value from any native form control. */
function readControlValue(
  target:
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
): unknown {
  if (target instanceof HTMLInputElement) {
    if (target.type === "checkbox") return target.checked;
    if (target.type === "radio") return target.value;
    if (target.type === "number" || target.type === "range") {
      return target.value === "" ? null : target.valueAsNumber;
    }
  }

  return target.value;
}

function normalizeErrors<T extends FormValues>(
  errors: FormErrors<T> | void
): FormErrors<T> {
  if (!errors) return {} as FormErrors<T>;

  const clean: Record<string, string> = {};

  const entries = Object.entries(errors) as Array<
    [string, string | undefined]
  >;

  for (const [name, message] of entries) {
    if (message) clean[name] = message;
  }

  return clean as FormErrors<T>;
}

/* =========================================
   CONTEXT
========================================= */

interface FormContextValue {
  formId: string;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext(component: string) {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Form>.`
    );
  }

  return context;
}

/* =========================================
   USE FORM
========================================= */

export function useForm<T extends FormValues>({
  defaultValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const formId = useId();

  const [values, setValuesState] = useState<T>(
    () => ({ ...defaultValues })
  );

  const [errors, setErrorsState] = useState<FormErrors<T>>(
    {}
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* `reset()` restores the values given on the first render. */
  const initialValues = useRef<T>({ ...defaultValues });

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  function setValue<K extends Extract<keyof T, string>>(
    name: K,
    value: T[K]
  ) {
    setValuesState((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorsState((previous) => {
      if (!previous[name]) return previous;

      const next = { ...previous };
      delete next[name];

      return next;
    });
  }

  function setValues(nextValues: Partial<T>) {
    setValuesState((previous) => ({
      ...previous,
      ...nextValues,
    }));

    setErrorsState((previous) => {
      if (Object.keys(previous).length === 0) {
        return previous;
      }

      const next = { ...previous };

      for (const name of Object.keys(nextValues)) {
        delete next[name as Extract<keyof T, string>];
      }

      return next;
    });
  }

  function setError(
    name: Extract<keyof T, string>,
    message?: string
  ) {
    setErrorsState((previous) => {
      const next = { ...previous };

      if (message) {
        next[name] = message;
      } else {
        delete next[name];
      }

      return next;
    });
  }

  function clearErrors(
    name?: Extract<keyof T, string>
  ) {
    if (!name) {
      setErrorsState({} as FormErrors<T>);
      return;
    }

    setErrorsState((previous) => {
      if (!previous[name]) return previous;

      const next = { ...previous };
      delete next[name];

      return next;
    });
  }

  function register<K extends Extract<keyof T, string>>(
    name: K
  ): PimoluFormRegistration {
    const key = String(name);
    const value = values[name];
    const message = errors[name];

    const registration: PimoluFormRegistration = {
      name: key,

      onChange: (
        event: ChangeEvent<
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
        >
      ) => {
        setValue(
          name,
          readControlValue(event.currentTarget) as T[K]
        );
      },

      "aria-invalid": message ? true : undefined,

      "aria-describedby": message
        ? `${formId}-${key}-error`
        : undefined,
    };

    /* Checkboxes read `checked`; every other control reads `value`. */
    if (typeof value === "boolean") {
      registration.checked = value;
    } else {
      registration.value = value as
        | string
        | number
        | readonly string[]
        | undefined;
    }

    return registration;
  }

  async function handleSubmit(
    event?: FormEvent<HTMLFormElement>
  ) {
    event?.preventDefault();

    let nextErrors: FormErrors<T> = {};

    if (validate) {
      nextErrors = normalizeErrors(await validate(values));
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrorsState(nextErrors);
      return false;
    }

    setErrorsState({} as FormErrors<T>);

    if (!onSubmit) return true;

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      return true;
    } finally {
      if (mounted.current) {
        setIsSubmitting(false);
      }
    }
  }

  function reset(nextValues?: Partial<T>) {
    setValuesState({
      ...initialValues.current,
      ...nextValues,
    });

    setErrorsState({} as FormErrors<T>);
    setIsSubmitting(false);
  }

  return {
    values,
    errors,
    isSubmitting,
    formId,
    setValue,
    setValues,
    setError,
    clearErrors,
    register,
    handleSubmit,
    reset,
  };
}

/* =========================================
   FORM
========================================= */

export function Form<T extends FormValues = FormValues>({
  form,
  noValidate = true,
  className,
  children,
  ...props
}: PimoluFormProps<T>) {
  return (
    <FormContext.Provider
      value={{
        formId: form.formId,
        errors: form.errors as unknown as Record<
          string,
          string | undefined
        >,
        isSubmitting: form.isSubmitting,
      }}
    >
      <form
        {...props}
        noValidate={noValidate}
        className={classNames("pimolu-form", className)}
        onSubmit={(event) => {
          void form.handleSubmit(event);
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

/* =========================================
   FORM ERROR
========================================= */

export function FormError({
  name,
  className,
}: PimoluFormErrorProps) {
  const { errors, formId } = useFormContext("FormError");

  const message = errors[name];

  if (!message) return null;

  return (
    <p
      id={`${formId}-${name}-error`}
      role="alert"
      className={classNames(
        "pimolu-form__error",
        className
      )}
    >
      {message}
    </p>
  );
}

/* =========================================
   FORM SUBMIT
========================================= */

export function FormSubmit({
  children = "Submit",
  className,
  ...props
}: PimoluFormSubmitProps) {
  const { isSubmitting } = useFormContext("FormSubmit");

  return (
    <Button
      {...props}
      type="submit"
      loading={isSubmitting}
      className={classNames(
        "pimolu-form__submit",
        className
      )}
    >
      {children}
    </Button>
  );
}
