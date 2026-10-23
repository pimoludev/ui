"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

/** Optional animation driver supplied by an application, never imported by React core. */
export interface PimoluAnimationEngine {
  readonly name: string;
  /** Duration in ms of the driver's exit animations (not its entrance animations). */
  readonly exitDuration: number;
  /** Observe/animate this scope only. Must restore resources on cleanup. */
  mount: (scope: HTMLElement) => () => void;
}

const AnimationContext = createContext<PimoluAnimationEngine | null>(null);

export function usePimoluAnimationEngine() {
  return useContext(AnimationContext);
}

/** A scoped driver also applies to React portals through their inherited context. */
export function PimoluAnimationProvider({ engine, children, scope = true }: { engine?: "css" | PimoluAnimationEngine; children: ReactNode; scope?: boolean }) {
  const parent = usePimoluAnimationEngine();
  const resolved = engine === "css" ? null : engine ?? parent;
  const content = scope ? <AnimationScope>{children}</AnimationScope> : children;
  return <AnimationContext.Provider value={resolved}>{engine === "css" && parent
    ? <div data-pimolu-animation-block="" style={{ display: "contents" }}>{content}</div>
    : content}</AnimationContext.Provider>;
}

export function AnimationScope({ children }: { children: ReactNode }) {
  const engine = usePimoluAnimationEngine();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (engine && ref.current) return engine.mount(ref.current);
  }, [engine]);
  if (!engine) return children;
  return <div ref={ref} data-pimolu-animation-scope={engine.name} style={{ display: "contents" }}>{children}</div>;
}

/** A small scheduling margin lets the last animation frame finish before unmount. */
export function usePimoluExitDuration(cssDuration: number) {
  const engine = usePimoluAnimationEngine();
  return engine ? Math.max(0, engine.exitDuration) + 34 : cssDuration;
}
