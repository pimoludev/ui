type GuideTerms = { important: readonly string[]; code: readonly string[] };

// Editorial selections stay separate from the searchable, plain-text guide content.
const guideTerms: Record<string, GuideTerms> = {
  "": { important: ["React components", "shared CSS", "platform-neutral design data", "behavior and typed APIs", "visual presets", "published on npm", "129 families", "brand, radius and density", "semantic tokens", "future directions"], code: ["PimoluProvider", "className", "style", "pnpm add @pimolu/react@beta @pimolu/web-styles@beta"] },
  "quick-start": { important: ["React 18", "React 19", "shared stylesheet", "current release", "client module", "components, hooks and the Provider", "lockfile", "copyable source"], code: ["@pimolu/react", "@pimolu/web-styles", "@pimolu/themes", "@pimolu/design-tokens", "@pimolu/core", "@beta", "PimoluProvider", "app/globals.css", "globals.css", "0.1.0-beta.4"] },
  "design-principles": { important: ["shared decisions", "tokens and reusable components", "reference preset", "consistent spacing", "heading hierarchy", "contained scrolling region", "keyboard model", "Visible labels", "focus indicators", "Accessibility", "semantic variables", "state and business rules"], code: ["className", "style"] },
  frameworks: { important: ["React with TypeScript", "working integration reference", "peer ranges", "App Router", "compiled ESM and TypeScript declarations", "client module", "future directions", "accessibility implementation"], code: ["@pimolu/web-styles/styles.css", "PimoluProvider", "transpilePackages", "app/layout.tsx"] },
  nextjs: { important: ["compiled ESM and declarations", "client module", "root layout and metadata", "global CSS entry", "validated cookie", "same initial value", "System mode", "initial server render"], code: ["transpilePackages", "use client", "globals.css", "app/layout.tsx", "lib/preferences.ts", "components/site-provider.tsx", "matchMedia", "window"] },
  colors: { important: ["semantic colors", "generated theme data", "readable text", "explicit label", "paired foreground tokens", "both modes", "visible focus"], code: ["primary", "surface", "foreground", "--pimolu-*", "forced-colors", "packages/design-tokens/src/tokens.json", "packages/themes/src/themes.json"] },
  theming: { important: ["palette and visual character", "independent overrides", "uncontrolled provider", "application owns the state", "six-digit hex color", "persistence strategy", "Never hand-edit dist"], code: ["theme", "stylePreset", "radius", "density", "defaultTheme/defaultStylePreset", "theme/stylePreset", "brandColor", "usePimoluTheme", "resolvedTheme", "PimoluProvider", "persist", "build:all", "audit:themes"] },
  "dark-mode": { important: ["light, dark and system", "validated cookie", "same initial value", "same application structure", "semantic CSS variables", "both modes", "application state"], code: ["PimoluProvider", "prefers-color-scheme", "usePimoluTheme", "resolvedTheme", "SiteProvider", "lib/preferences.ts", "matchMedia", "window"] },
  customization: { important: ["semantic tone, appearance, size and state", "typed classNames maps", "internal parts", "CSS priority", "preview only", "semantic tokens", "responsive behavior", "actual API"], code: ["className", "containerClassName", "classNames", "inputClassName", "style", "value/onValueChange", "value/onChange", "onValueChange", "onChange", "useForm.register", "form.values", "form.setValue", "FormError"] },
  styling: { important: ["behavior and typed APIs", "shared stylesheet", "spacing and responsiveness", "different elements", "Import one entry only", "layer order", "without !important", "typed classNames maps", "portalled content", "semantic variables", "CSS layers"], code: ["@pimolu/web-styles", "className", "containerClassName", "layered.css", "styles.css", "classNames", "DialogContent", "DrawerContent", "aria-selected", "aria-disabled", "focus-visible"] },
  animation: { important: ["short transition", "final state", "reduced-motion treatments", "layout shifts", "application dependency", "static state", "focus, Escape and dismissal"], code: ["transition: all", "motion/react", "reducedMotion", "MotionConfig"] },
  composition: { important: ["related content", "modal behavior", "controlled state", "default value", "exact callback", "semantic markup", "responsive behavior", "accessible name"], code: ["Card", "Dialog", "Button", "Link", "Select", "onValueChange", "Table", "DataTable", "DataGrid", "DashboardLayout", "AppShell", "DialogTrigger", "Tooltip"] },
  accessibility: { important: ["visible labels", "accessible names", "status text", "focus visibility", "arrow navigation", "focus returns", "user preferences", "contained scrolling region", "focus outlines", "not a blanket WCAG certification", "keyboard and screen-reader testing"], code: ["aria-label", "Tabs", "Select", "Command", "Escape", "RTL", "forced-colors", "prefers-reduced-motion", "DataGrid"] },
  agents: { important: ["verified architecture", "snapshots", "actual public API", "real browser", "private environment files or credentials", "explicit maintainer decision", "no distributed Pimolu MCP server", "source-of-truth pipeline"], code: ["AGENTS.md", "docs/ai/PROJECT_CONTEXT.md", ".agents/skills", "/llms.txt", "npx"] },
  contributing: { important: ["repository build pipeline", "preserve your local changes", "every component family", "fresh source checkout", "website has its own checks", "public APIs, shared CSS, tests", "visual or accessibility limits"], code: ["Node 20", "Node 22.6", "packageManager", "port 3001", "workspace:*", "dist", "build:all", "AGENTS.md", "docs/ai/PROJECT_CONTEXT.md"] },
};

export type GuideTextPart = { text: string; kind: "text" | "important" | "code" };

/** Preserve every character; annotate at most three distinct terms per paragraph. */
export function emphasizeGuideText(slug: string, text: string): GuideTextPart[] {
  const terms = guideTerms[slug];
  if (!terms) return [{ text, kind: "text" }];
  const candidates = [
    ...terms.important.map((value) => ({ value, kind: "important" as const })),
    ...terms.code.map((value) => ({ value, kind: "code" as const })),
  ].sort((a, b) => b.value.length - a.value.length);
  const escaped = candidates.map(({ value }) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matcher = new RegExp(`(^|[^\\p{L}\\p{N}_-])(${escaped.join("|")})(?![\\p{L}\\p{N}_-])`, "gu");
  const parts: GuideTextPart[] = [];
  const seen = new Set<string>();
  let cursor = 0;
  let match: RegExpExecArray | null;
  while (seen.size < 3 && (match = matcher.exec(text))) {
    const term = match[2];
    if (seen.has(term)) continue;
    const start = match.index + match[1].length;
    if (start > cursor) parts.push({ text: text.slice(cursor, start), kind: "text" });
    parts.push({ text: term, kind: candidates.find((candidate) => candidate.value === term)!.kind });
    cursor = start + term.length;
    seen.add(term);
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), kind: "text" });
  return parts;
}
