
import type { PimoluClassNames } from "../customization/customization.types";
import type {
  ReactNode,
} from "react";

import type { PimoluAccordionVariant } from "./accordion.variants";

export type { PimoluAccordionVariant };

interface AccordionBaseProps {
  children: ReactNode;

  /** Visual treatment. Defaults to "default". */
  variant?: PimoluAccordionVariant;

  /** Animate expansion and collapse. Defaults to true; reduced motion is respected. */
  animated?: boolean;

  /**
   * In single mode, allow closing the open item. Defaults to false.
   */
  collapsible?: boolean;

  className?: string;
}

interface AccordionSingleProps {
  type?: "single";

  value?: string;
  defaultValue?: string;

  onValueChange?: (value: string | undefined) => void;
}

interface AccordionMultipleProps {
  type: "multiple";

  value?: string[];
  defaultValue?: string[];

  onValueChange?: (value: string[]) => void;
}

export type PimoluAccordionProps = (AccordionBaseProps &
  (AccordionSingleProps | AccordionMultipleProps)) & { classNames?: PimoluClassNames<"accordion"> };

export interface PimoluAccordionItemProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"accordion">;

  /** Value shared with the trigger and content. */
  value: string;

  disabled?: boolean;

  children: ReactNode;

  className?: string;
}

export interface PimoluAccordionTriggerProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"accordion">;

  children: ReactNode;
  className?: string;
}

export interface PimoluAccordionContentProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"accordion">;

  children: ReactNode;
  className?: string;
}
