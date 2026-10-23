"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePimoluAnimationEngine, usePimoluExitDuration } from "../animation/animation-engine";

function reducedSnapshot() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function subscribeReduced(listener: () => void) {
  const media = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  media?.addEventListener("change", listener);
  return () => media?.removeEventListener("change", listener);
}
const serverReduced = () => false;

/** Retain removed live-region items for a bounded driver exit, without duplicating the store. */
export function useRetainedItems<Item extends { id: string }>(items: readonly Item[]) {
  const engine = usePimoluAnimationEngine();
  const duration = usePimoluExitDuration(0);
  const [retained, setRetained] = useState<readonly Item[]>(items);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const reduced = useSyncExternalStore(subscribeReduced, reducedSnapshot, serverReduced);
  const active = Boolean(engine) && !reduced;
  const currentIds = new Set(items.map((item) => item.id));
  const visible = active ? [...items, ...retained.filter((item) => !currentIds.has(item.id))] : items;

  useEffect(() => {
    const ids = new Set(items.map((item) => item.id));
    for (const [id, timer] of timers.current) if (ids.has(id) || !active) { clearTimeout(timer); timers.current.delete(id); }
    if (!active) { setRetained(items); return; }
    for (const item of retained) if (!ids.has(item.id) && !timers.current.has(item.id)) {
      timers.current.set(item.id, setTimeout(() => {
        timers.current.delete(item.id);
        setRetained((previous) => previous.filter((entry) => entry.id !== item.id));
      }, duration));
    }
    const merged = [...items, ...retained.filter((item) => !ids.has(item.id))];
    if (merged.length !== retained.length || merged.some((item, index) => item !== retained[index])) setRetained(merged);
  }, [items, retained, active, duration]);
  useEffect(() => {
    const pending = timers.current;
    return () => { for (const timer of pending.values()) clearTimeout(timer); pending.clear(); };
  }, []);
  return visible.map((item) => ({ item, closing: !currentIds.has(item.id) }));
}
