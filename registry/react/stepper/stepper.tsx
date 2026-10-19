"use client";

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

export function Stepper({
  children,
  activeStep: controlledActiveStep,
  defaultActiveStep = 1,
  onStepChange,
  orientation = "horizontal",
  clickable = false,
  "aria-label": ariaLabel,
  className,
}: PimoluStepperProps) {
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

  return (
    <StepperContext.Provider
      value={{
        activeStep,
        clickable,
        onStepChange: change,
      }}
    >
      <ol
        aria-label={ariaLabel}
        className={classes(
          "pimolu-stepper",
          `pimolu-stepper--${orientation}`,
          className
        )}
      >
        {children}
      </ol>
    </StepperContext.Provider>
  );
}

export function StepperItem({
  step,
  title,
  description,
  disabled = false,
  children,
  className,
}: PimoluStepperItemProps) {
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
        className="pimolu-stepper__marker"
        aria-hidden="true"
      >
        {state === "complete" ? "✓" : step}
      </span>

      <span className="pimolu-stepper__text">
        <span className="pimolu-stepper__title">
          {title}
        </span>

        {description && (
          <span className="pimolu-stepper__description">
            {description}
          </span>
        )}

        {children}
      </span>
    </>
  );

  return (
    <li
      className={classes(
        "pimolu-stepper__item",
        className
      )}
      data-state={state}
      aria-current={
        state === "active" ? "step" : undefined
      }
    >
      {stepper.clickable && !disabled ? (
        <button
          type="button"
          className="pimolu-stepper__button"
          onClick={() => stepper.onStepChange?.(step)}
        >
          {content}
        </button>
      ) : (
        <div className="pimolu-stepper__button">
          {content}
        </div>
      )}
    </li>
  );
}
