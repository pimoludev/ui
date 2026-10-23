import { forwardRef, createElement, useCallback, useRef, type ComponentType, type ReactNode, type ElementType, type ComponentPropsWithRef, type ForwardRefExoticComponent } from "react";
import { motion, MotionConfig, isValidMotionProp, useReducedMotion, type MotionProps } from "motion/react";
import { PimoluAnimationProvider } from "@pimolu/react";
import { motionEngine } from "./engine";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user"><PimoluAnimationProvider engine={motionEngine}>{children}</PimoluAnimationProvider></MotionConfig>;
}

export type PimoluMotionComponent<Component extends ElementType> = ForwardRefExoticComponent<
  Omit<ComponentPropsWithRef<Component>, keyof MotionProps> & MotionProps
>;

export interface PimoluMotionComponentOptions {
  svg?: boolean;
  /** Composite fields preserve their control ref and animate a separate outer surface. */
  container?: boolean;
}

/** Typed, ref-preserving adapter for a native DOM target. No wrapper element. */
export function createMotionComponent<Props extends object>(Component: ComponentType<Props>, options: PimoluMotionComponentOptions = {}): PimoluMotionComponent<ComponentType<Props>> {
  const Base = motion.create(Component, options.svg ? { type: "svg" } : undefined);
  type PropsWithMotion = Omit<Props, keyof MotionProps> & MotionProps;
  const Adapter = forwardRef<unknown, PropsWithMotion>((props, ref) => {
    const reduced = useReducedMotion();
    const saved = useRef<{ node: Element; explicit: string | null; engine: string | null } | null>(null);
    const cleanup = useRef<(() => void) | undefined>(undefined);
    const attach = useCallback((node: unknown) => {
      if (saved.current && saved.current.node !== node) {
        const { node: previous, explicit, engine } = saved.current;
        if (explicit === null) previous.removeAttribute("data-pimolu-motion-explicit");
        else previous.setAttribute("data-pimolu-motion-explicit", explicit);
        if (engine === null) previous.removeAttribute("data-pimolu-animation");
        else previous.setAttribute("data-pimolu-animation", engine);
        saved.current = null;
      }
      if (node instanceof Element && !saved.current) {
        saved.current = { node, explicit: node.getAttribute("data-pimolu-motion-explicit"), engine: node.getAttribute("data-pimolu-animation") };
        node.setAttribute("data-pimolu-motion-explicit", "");
        node.setAttribute("data-pimolu-animation", "motion");
      }
      const previousCleanup = cleanup.current;
      if (previousCleanup) { previousCleanup(); cleanup.current = undefined; }
      if (typeof ref === "function") {
        if (node === null && previousCleanup) return;
        const result = ref(node);
        if (typeof result === "function") cleanup.current = result;
      } else if (ref) ref.current = node;
    }, [ref]);
    const flags = props as PropsWithMotion & { disabled?: boolean; loading?: boolean };
    const blocked = flags.disabled || flags.loading || reduced;
    const forwarded = {
      ...props, ref: attach,
      "data-pimolu-motion-explicit": "",
      "data-pimolu-animation": "motion",
      ...(blocked ? { whileHover: undefined, whileTap: undefined, whileFocus: undefined, drag: false } : {}),
      ...(reduced ? { layout: false } : {}),
    };
    if (options.container) {
      const componentProps: Record<string, unknown> = {};
      const surfaceProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(props)) {
        if (key !== "children" && (isValidMotionProp(key) || key === "style")) surfaceProps[key] = value;
        else componentProps[key] = value;
      }
      if (blocked) Object.assign(surfaceProps, { whileHover: undefined, whileTap: undefined, whileFocus: undefined, drag: false });
      if (reduced) surfaceProps.layout = false;
      const Surface = motion.div as ComponentType<Record<string, unknown>>;
      return <MotionConfig reducedMotion="user">{createElement(Surface, {
        ...surfaceProps, "data-pimolu-motion-explicit-container": "", className: "pimolu-motion-surface",
        children: createElement(Component, { ...componentProps, ref } as Props),
      })}</MotionConfig>;
    }
    return <MotionConfig reducedMotion="user">{createElement(Base as ComponentType<object>, forwarded)}</MotionConfig>;
  });
  Adapter.displayName = `Motion(${Component.displayName ?? "Pimolu"})`;
  return Adapter as unknown as PimoluMotionComponent<ComponentType<Props>>;
}

/** Compound roots keep their Pimolu API and opt their portals into the driver. */
export function withMotionEngine<Props extends object>(Component: ComponentType<Props>) {
  const Adapter = (props: Props) => <PimoluAnimationProvider engine={motionEngine} scope={false}>{createElement(Component, props)}</PimoluAnimationProvider>;
  Adapter.displayName = `Motion(${Component.displayName ?? "Pimolu"})`;
  return Adapter;
}
