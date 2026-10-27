"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { PimoluClassNames, PimoluComponentParts } from "../customization/customization.types";

// Only compound families distribute classes to other component instances.
// This list is checked against all source consumers by the contract tests.
export const scopedPartFamilies: ReadonlySet<string> = new Set([
  "accordion", "breadcrumbs", "button-group", "card", "chart", "chat",
  "context-menu", "description-list", "dialog", "drawer", "dropdown-menu",
  "file-manager", "form", "hero", "image", "input", "input-group",
  "kanban", "list", "menubar", "navbar", "navigation-menu", "popover",
  "sidebar", "stat", "stepper", "table", "tabs", "theme-builder", "timeline",
  "toast", "toggle-group", "toolbar", "tree-table", "tree-view",
]);

type PartClasses = Readonly<Record<string, string | undefined>>;
type PartScopes = Readonly<Record<string, PartClasses>>;
const empty: PartClasses = Object.freeze({});
const PartContext = createContext<PartScopes>({});

/** Distribute additive classes across compound parts, never across nested roots. */
export function usePartClasses<Family extends keyof PimoluComponentParts>(
  family: Family,
  supplied: PimoluClassNames<Family> | undefined,
  root: boolean,
) {
  const parent = useContext(PartContext);
  const inherited = parent[family];
  const local = useMemo(() => supplied && Object.values(supplied).some(Boolean) ? supplied : undefined, [supplied]);
  const parts = useMemo(() => {
    if (root) return local ?? empty;
    if (local === inherited) return inherited ?? empty;
    return local ? { ...inherited, ...local } : inherited ?? empty;
  }, [root, local, inherited]);
  const scope = useMemo(() => {
    if (parts === inherited || (parts === empty && !inherited)) return parent;
    return { ...parent, [family]: parts };
  }, [family, parts, inherited, parent]);
  // Wrapper components may forward named parts to a different primitive. Its
  // root must receive only the wrapper's explicit root, never an ancestor root.
  const forwardedParts = useMemo(() => parts === empty ? undefined : { ...parts, root: local?.root }, [parts, local]);

  function scopeParts(children: ReactNode): ReactNode {
    return scopedPartFamilies.has(family)
      ? <PartContext.Provider value={scope}>{children}</PartContext.Provider>
      : children;
  }

  return [parts, scopeParts, forwardedParts] as const;
}
