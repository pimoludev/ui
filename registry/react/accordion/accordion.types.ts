import type {
  ReactNode,
} from "react";

import type { PimoluAccordionVariant } from "./accordion.variants";

export type { PimoluAccordionVariant };

interface AccordionBaseProps {
  children: ReactNode;

  /** Visual treatment. Defaults to "default". */
  variant?: PimoluAccordionVariant;

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

export type PimoluAccordionProps = AccordionBaseProps &
  (AccordionSingleProps | AccordionMultipleProps);

export interface PimoluAccordionItemProps {
  /** Value shared with the trigger and content. */
  value: string;

  disabled?: boolean;

  children: ReactNode;

  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluAccordionTriggerProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}

export interface PimoluAccordionContentProps {
  children: ReactNode;
  className?: string;
  /** Inline styles on the native animation target. */
  style?: import("react").CSSProperties;

}
