"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Keep the server-rendered content visible, including without JavaScript. */
export function HomeReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className="home-reveal" initial={{ y: 12 }} whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
