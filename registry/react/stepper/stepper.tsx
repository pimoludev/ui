"use client";
import { usePartClasses } from "../internal/use-part-classes";
import { mergeClasses } from "../internal/merge-classes";


import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type {
  PimoluStepperItemProps,
  PimoluStepperProps,
} from "./stepper.types";

interface StepperContextValue {
  activeStep: number;
  clickable: boolean;
  onStepChange?: (step: number) => void;
}

const StepperContext =
  createContext<StepperContextValue | null>(null);

function useStepper(component: string) {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error(
      `${component} must be used inside <Stepper>.`
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

export function Stepper({ classNames,
  children,
  activeStep: controlledActiveStep,
  defaultActiveStep = 1,
  onStepChange,
  orientation = "horizontal",
  clickable = false,
  "aria-label": ariaLabel,
  className,
}: PimoluStepperProps) {
  const [partClasses, scopeParts] = usePartClasses("stepper", classNames, true);

  const [uncontrolledStep, setUncontrolledStep] =
    useState(defaultActiveStep);

  const isControlled = controlledActiveStep !== undefined;

  const activeStep = isControlled
    ? controlledActiveStep
    : uncontrolledStep;

  function change(step: number) {
    if (!isControlled) {
      setUncontrolledStep(step);
    }

    onStepChange?.(step);
  }

  return scopeParts((
    <StepperContext.Provider
      value={{
        activeStep,
        clickable,
        onStepChange: change,
      }}
    >
      <ol
        aria-label={ariaLabel}
        className={mergeClasses(classes(
          "pimolu-stepper",
          `pimolu-stepper--${orientation}`,
          className
        ), partClasses.root)}
      >
        {children}
      </ol>
    </StepperContext.Provider>
  ));
}

export function StepperItem({ classNames,
  step,
  title,
  description,
  disabled = false,
  children,
  className,
}: PimoluStepperItemProps) {
  const [partClasses, scopeParts] = usePartClasses("stepper", classNames, false);

  const stepper = useStepper("StepperItem");

  const state =
    disabled
      ? "disabled"
      : step < stepper.activeStep
        ? "complete"
        : step === stepper.activeStep
          ? "active"
          : "upcoming";

  const content: ReactNode = (
    <>
      <span
        className={mergeClasses("pimolu-stepper__marker", partClasses.marker, classNames?.root)}
        aria-hidden="true"
      >
        {state === "complete" ? "✓" : step}
      </span>

      <span className={mergeClasses("pimolu-stepper__text", partClasses.text, classNames?.root)}>
        <span className={mergeClasses("pimolu-stepper__title", partClasses.title)}>
          {title}
        </span>

        {description && (
          <span className={mergeClasses("pimolu-stepper__description", partClasses.description)}>
            {description}
          </span>
        )}

        {children}
      </span>
    </>
  );

  return scopeParts((
    <li
      className={mergeClasses(classes(
        "pimolu-stepper__item",
        className
      ), partClasses.item, classNames?.root)}
      data-state={state}
      aria-current={
        state === "active" ? "step" : undefined
      }
    >
      {stepper.clickable && !disabled ? (
        <button
          type="button"
          className={mergeClasses("pimolu-stepper__button", partClasses.button)}
          onClick={() => stepper.onStepChange?.(step)}
        >
          {content}
        </button>
      ) : (
        <div className={mergeClasses("pimolu-stepper__button", partClasses.button)}>
          {content}
        </div>
      )}
    </li>
  ));
}
