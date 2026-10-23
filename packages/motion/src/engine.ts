import { animate } from "motion";
import { pimoluMotionTokens } from "@pimolu/design-tokens/motion";
import type { PimoluAnimationEngine } from "@pimolu/react";

export interface MotionEngineOptions {
  /** Exit duration in milliseconds. Defaults to 180. */
  exitDuration?: number;
  /** Entrance duration in milliseconds. Defaults to the shared 180ms token. */
  enterDuration?: number;
  /** Delegate subtle hover/press feedback to Motion. Defaults to true. */
  interactions?: boolean;
}

const panels = ["dialog__content", "dialog__overlay", "drawer__content", "drawer__overlay", "popover", "dropdown-menu__content", "context-menu__content", "menubar__content", "navigation-menu__content", "hover-card__content", "tooltip", "toast", "tabs__panel", "accordion__content"]
  .map((name) => `.pimolu-${name}`).join(",");
const controls = "button, [role=button], [role=tab], [role=radio], a.pimolu-link";

/** A scoped DOM driver: no React component replacement or extra interactive wrapper. */
export function createMotionEngine(options: MotionEngineOptions = {}): PimoluAnimationEngine {
  const exitDuration = options.exitDuration ?? pimoluMotionTokens.duration.enter;
  const enterDuration = options.enterDuration ?? pimoluMotionTokens.duration.enter;
  if (![exitDuration, enterDuration].every((n) => Number.isFinite(n) && n >= 0 && n <= 10000)) {
    throw new RangeError("Motion durations must be between 0 and 10000 milliseconds.");
  }
  return {
    name: "motion", exitDuration,
    mount(scope) {
      const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      type Playback = ReturnType<typeof animate>;
      const states = new Map<HTMLElement, {
        animation: string; transition: string; opacity: string; marker: string | null;
        base: number; inert: boolean; phase?: string; playing?: Playback;
      }>();
      const owns = (node: HTMLElement) => node.closest("[data-pimolu-animation-scope], [data-pimolu-animation-block]") === scope
        && !node.hasAttribute("data-pimolu-motion-explicit");
      function prepare(node: HTMLElement) {
        let state = states.get(node);
        if (!state) {
          const animation = node.style.animation;
          node.style.animation = "none";
          const opacity = Number(getComputedStyle(node).opacity);
          state = { animation, transition: node.style.transition, opacity: node.style.opacity,
            inert: node.inert, marker: node.getAttribute("data-pimolu-animation"), base: Number.isFinite(opacity) ? opacity : 1 };
          node.style.transition = "none";
          node.setAttribute("data-pimolu-animation", "motion");
          states.set(node, state);
        }
        return state;
      }
      function play(node: HTMLElement, phase: string) {
        if (!owns(node) || node.hidden || phase === "closed") return;
        const state = prepare(node);
        if (state.phase === phase) return;
        const reversing = state.phase === "closing";
        const currentOpacity = Number(getComputedStyle(node).opacity);
        state.phase = phase;
        state.playing?.stop();
        const closing = phase === "closing";
        node.inert = closing || state.inert;
        if (media?.matches) {
          node.style.opacity = closing ? "0" : state.opacity;
          return;
        }
        const from = closing || reversing ? currentOpacity : 0;
        const playback = animate(node, { opacity: [from, closing ? 0 : state.base] }, {
          duration: (closing ? exitDuration : enterDuration) / 1000, ease: "easeOut",
        });
        state.playing = playback;
        void playback.finished.then(() => {
          if (states.get(node)?.playing !== playback) return;
          playback.stop();
          state.playing = undefined;
          node.style.opacity = closing ? "0" : state.opacity;
        }).catch(() => {});
      }
      function release(node: HTMLElement) {
        const state = states.get(node);
        if (!state) return;
        state.playing?.stop();
        node.style.animation = state.animation;
        node.style.transition = state.transition;
        node.style.opacity = state.opacity;
        node.inert = state.inert;
        if (state.marker === null) node.removeAttribute("data-pimolu-animation");
        else node.setAttribute("data-pimolu-animation", state.marker);
        states.delete(node);
      }
      function scan() {
        for (const node of scope.querySelectorAll<HTMLElement>(panels)) {
          if (owns(node)) play(node, node.getAttribute("data-pimolu-presence") ?? node.getAttribute("data-state") ?? "open");
        }
        for (const node of states.keys()) if (!scope.contains(node) || !owns(node)) release(node);
      }
      const observer = new MutationObserver(scan);
      observer.observe(scope, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-state", "data-pimolu-presence", "hidden"] });
      function interaction(event: Event) {
        if (options.interactions === false || !(event.target instanceof Element)) return;
        const node = event.target.closest<HTMLElement>(controls);
        if (!node || !scope.contains(node) || !owns(node) || node.closest("[data-pimolu-motion-explicit-container]") || !node.closest('[class*="pimolu-"]')) return;
        if (node.matches(":disabled, [aria-disabled=true], [aria-busy=true]")) return;
        if ((event instanceof MouseEvent || event instanceof FocusEvent) && event.relatedTarget instanceof Node && node.contains(event.relatedTarget)) return;
        const state = prepare(node);
        state.playing?.stop();
        const leaving = event.type === "pointerout" || event.type === "pointerup" || event.type === "pointercancel" || event.type === "focusout";
        const opacity = leaving ? state.base : state.base * (event.type === "pointerdown" ? 0.8 : 0.92);
        if (media?.matches) { node.style.opacity = leaving ? state.opacity : String(opacity); return; }
        state.playing = animate(node, { opacity }, { duration: pimoluMotionTokens.duration.feedback / 1000 });
      }
      const events = ["pointerover", "pointerout", "pointerdown", "pointerup", "pointercancel", "focusin", "focusout"];
      for (const event of events) scope.addEventListener(event, interaction);
      function reduce() { if (media?.matches) for (const [node, state] of states) { state.playing?.stop(); node.style.opacity = state.phase === "closing" ? "0" : state.opacity; } }
      media?.addEventListener("change", reduce);
      scan();
      return () => {
        observer.disconnect();
        for (const event of events) scope.removeEventListener(event, interaction);
        media?.removeEventListener("change", reduce);
        for (const node of states.keys()) release(node);
      };
    },
  };
}

export const motionEngine = /* @__PURE__ */ createMotionEngine();
