import type {
  HTMLAttributes,
  ReactNode,
} from "react";

export type PimoluAnchorLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Section heading with a self-link. Activating the link copies the
 * absolute URL of the section to the clipboard and announces the
 * result, while the browser also moves to the hash target.
 */
export interface PimoluAnchorProps
  extends Omit<
    HTMLAttributes<HTMLHeadingElement>,
    "id" | "className" | "children" | "onCopy"
  > {
  /** Id of the heading and of its hash target. */
  id: string;

  /** Heading level, 1 to 6. Defaults to 2. */
  level?: PimoluAnchorLevel;

  /** Heading text. */
  children: ReactNode;

  /** Accessible name of the self-link. Defaults to "Copy link to section". */
  copyLabel?: string;

  /** Destination of the self-link. Defaults to "#<id>". */
  href?: string;

  /** Called with the copied URL after a successful clipboard write. */
  onCopy?: (value: string) => void;

  /** Class applied to the wrapper that hosts the heading and the link. */
  className?: string;
}
