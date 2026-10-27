
import type { PimoluClassNames } from "../customization/customization.types";

import type { CSSProperties, ReactNode } from "react";

export interface PimoluTransferItem {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface PimoluTransferProps {
  /** Additive classes for stable named parts, including composed descendants. */
  classNames?: PimoluClassNames<"transfer">;

  data: readonly PimoluTransferItem[];

  /** Controlled keys of the target (right) list. */
  targetKeys?: readonly string[];

  /** Initial target keys when uncontrolled. */
  defaultTargetKeys?: readonly string[];

  /** Called with the next target keys after a move. */
  onChange?: (targetKeys: string[]) => void;

  /** [source title, target title]. */
  titles?: readonly [string, string];

  /** Render a search field above each list. */
  searchable?: boolean;

  /** Disable every checkbox, search field and move control. */
  disabled?: boolean;

  /** Show the number of items in each list header. */
  showCount?: boolean;

  /** Show the "move all" controls next to the selected-item controls. */
  showMoveAll?: boolean;

  /** Height of each scrollable list. Defaults to 240. */
  listHeight?: number | string;

  /** Custom content for an item; replaces the label and description. */
  render?: (item: PimoluTransferItem) => ReactNode;

  emptyMessage?: string;

  className?: string;
  style?: CSSProperties;

  "aria-label"?: string;
}
