import type { MotionProps } from "motion/react";
import { pimoluMotionTokens } from "@pimolu/design-tokens/motion";

/** Opt-in recipes. Spread a recipe, then override any Motion prop you need. */
export const pimoluMotionPresets = {
  press: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  reveal: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: pimoluMotionTokens.duration.enter / 1000 },
  },
  layout: {
    layout: "position",
    transition: { layout: { type: "spring", stiffness: 350, damping: 30 } },
  },
} satisfies Record<string, MotionProps>;
