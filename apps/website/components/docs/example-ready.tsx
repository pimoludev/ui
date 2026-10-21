"use client";

import { useEffect, useRef, type ComponentType } from "react";

/** The harness announces mount after the lazy module's real effects are installed. */
export function readyExample(Example: ComponentType) {
  return function ReadyExample() {
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => { container.current?.setAttribute("data-example-hydrated", "true"); }, []);
    return <div className="example-ready" ref={container}><Example /></div>;
  };
}
