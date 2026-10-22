import type { GuideDoc } from "./docs.ts";

export const handbookGuides: GuideDoc[] = [
  {
    slug: "quick-start", title: "Quick start", group: "Getting started",
    description: "From a workspace checkout to your first Pimolu screen.",
    sections: [
      { id: "start", title: "Start with the workspace", paragraphs: ["Pimolu currently runs from this pnpm monorepo. Use the pinned pnpm version and Node 22.6 or newer for the website. The five library packages are prepared at 0.1.0-beta.1 and pass npm pack --dry-run; a public npm installation is not available yet.", "After installing the workspace dependencies, generate the shared assets and open the Playground. In an existing checkout, preserve your local changes."], language: "bash", code: "pnpm install\npnpm build:all\npnpm dev:playground" },
      { id: "first-screen", title: "Compose your first screen", paragraphs: ["Import the shared stylesheet once at your application's entry. Place interactive components below a client boundary in Next.js. Pimolu owns component styles; your application owns the layout."], language: "tsx", filename: "welcome.tsx", code: '"use client";\n\nimport { Button, Card, CardContent, CardHeader, CardTitle } from "@pimolu/react";\n\nexport function Welcome() {\n  return (\n    <Card>\n      <CardHeader>\n        <CardTitle>Make room for your next idea.</CardTitle>\n      </CardHeader>\n      <CardContent>\n        <Button onClick={() => window.alert("Your workspace is ready.")}>\n          Start building\n        </Button>\n      </CardContent>\n    </Card>\n  );\n}' },
      { id: "next-step", title: "Choose your next step", paragraphs: ["Installation explains the complete setup and validation commands. The Next.js guide provides the root layout and client Provider. Components contains four examples per family, copyable source and source-derived TypeScript APIs."] },
    ],
  },
  {
    slug: "design-principles", title: "Design principles", group: "Getting started",
    description: "Precise defaults. Room for your identity.",
    sections: [
      { id: "identity", title: "One system. Your identity.", paragraphs: ["A coherent interface starts with shared decisions: how space is measured, which colors carry meaning, how focus is shown and how actions respond. Pimolu centralizes these decisions in tokens and reusable components.", "Pimolu Adaptive — Precise, Premium & Customizable is the current design direction. Default is the reference preset. Adaptive remains an existing compatible preset while its long-term role as a palette is evaluated."] },
      { id: "precision", title: "Give content space", paragraphs: ["Use consistent spacing and a clear heading hierarchy. Let fields and actions wrap or stack before their labels become cramped. A table may need a contained scrolling region; the entire page should not overflow.", "Depth, borders and typography are deliberate choices. Pick a preset rather than adding unrelated shadows or weights to every component. Keep decorative effects subordinate to the task."] },
      { id: "behavior", title: "Keep behavior dependable", paragraphs: ["An appearance change should preserve the component's API, keyboard model and meaning. Visible labels, focus indicators, feedback and real HTML controls are part of the design.", "Accessibility is a continuous verification task, not a certification implied by a component count. Review the actual composition with a keyboard, assistive technology and the preferences your application supports."] },
      { id: "ownership", title: "Customize at the right level", paragraphs: ["Use Provider settings for the product identity, semantic variables for shared styling and className or style for local layout. Keep generated theme outputs separate from their source data. A visual preset changes presentation; application code still owns state and business rules."] },
    ],
  },
  {
    slug: "frameworks", title: "Frameworks", group: "Getting started",
    description: "A clear map of supported integrations and future adapters.",
    sections: [
      { id: "react", title: "React and Vite", paragraphs: ["The implemented component registry is React with TypeScript. The Playground is a Vite application and a working integration reference. Import @pimolu/web-styles/styles.css at the entry and compose the application below PimoluProvider.", "The React and React DOM peer ranges are ^18.0.0 || ^19.0.0. This website runs React 19. Test the version your application uses; a declared peer range is not evidence that every workflow was checked on every minor version."] },
      { id: "next", title: "Next.js App Router", paragraphs: ["apps/website and examples/nextjs use the App Router. Transpile the source-only React and core packages, load the shared CSS once and keep interactive imports below a client boundary. The Next.js guide shows the complete setup."] },
      { id: "desktop", title: "Desktop and native ambitions", paragraphs: ["An Electron renderer can potentially use the existing React web implementation, but there is no dedicated Electron integration verified by this site. React Native, Angular and direct CDN adapters are future directions, not currently shipped registries.", "Platform-neutral palette and visual-token data are a foundation for future adapters. A native component will need its own rendering, interaction and accessibility implementation; web CSS cannot simply be reused as a native stylesheet."] },
    ],
  },
  {
    slug: "colors", title: "Colors", group: "Design system",
    description: "Explore the real light and dark palettes, then use their semantic roles.",
    sections: [
      { id: "palette", title: "The palette explorer", paragraphs: ["Compare the eight key semantic colors in every existing preset. The explorer reads generated theme data; it does not introduce another palette. Its controls are independent of the site appearance."] },
      { id: "semantics", title: "Choose meaning before a color value", paragraphs: ["Use primary for the product accent, surface for raised content and foreground for readable text. Success, warning and danger communicate a status alongside an explicit label. Background and border establish the composition without competing with the content.", "Primitives live in packages/design-tokens/src/tokens.json. Semantic aliases live in packages/themes/src/themes.json; named presets have their own palette source. Generated CSS uses --pimolu-* variables."], language: "css", code: ".project-summary {\n  background: var(--pimolu-surface);\n  color: var(--pimolu-surface-foreground);\n  border: 1px solid var(--pimolu-border);\n}\n\n.project-summary__status {\n  color: var(--pimolu-success);\n}" },
      { id: "contrast", title: "Review color in context", paragraphs: ["Use paired foreground tokens when placing text on a colored background. Check the exact text size, opacity, state and surface in both modes. Do not assume that a swatch alone proves contrast compliance.", "Do not communicate an error with color alone. Keep text or an icon with an accessible label, and preserve visible focus in forced-colors mode."] },
    ],
  },
  {
    slug: "dark-mode", title: "Dark mode", group: "Design system",
    description: "Light, dark and system are independent from your visual preset.",
    sections: [
      { id: "modes", title: "Follow the user's preference", paragraphs: ["PimoluProvider supports light, dark and system. System resolves the browser's prefers-color-scheme preference. Use usePimoluTheme to change the mode and read resolvedTheme when you need a concrete light or dark value."], language: "tsx", code: '"use client";\n\nimport { Button, usePimoluTheme } from "@pimolu/react";\n\nexport function ColorModeButton() {\n  const { resolvedTheme, setTheme } = usePimoluTheme();\n  return (\n    <Button\n      appearance="outline"\n      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}\n    >\n      Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode\n    </Button>\n  );\n}' },
      { id: "server", title: "Keep the first render consistent", paragraphs: ["For a saved explicit preference in Next.js, validate its cookie on the server and pass the same initial value to the client Provider. This website's SiteProvider and lib/preferences.ts are working references.", "Render the same application structure on the server and client. Avoid reading window or matchMedia during the server render, and do not suppress hydration errors to conceal a mismatch."] },
      { id: "surfaces", title: "Review every surface", paragraphs: ["Use semantic CSS variables instead of maintaining separate hardcoded application palettes. Inspect fields, borders, disabled states, images, overlays and focus in both modes. Changing the mode must not reset application state or hide information."] },
    ],
  },
  {
    slug: "styling", title: "Styling", group: "Design system",
    description: "Shared component CSS, application layout and scoped overrides.",
    sections: [
      { id: "shared", title: "Load the shared CSS once", paragraphs: ["The React package exports behavior and typed APIs; @pimolu/web-styles exports the generated shared stylesheet. Pimolu does not require Tailwind to style its components. This website uses Tailwind for its own application layout.", "Build assets from the workspace before importing generated theme and style exports. Modify their source data or styles, then regenerate; never hand-edit dist files."] },
      { id: "layout", title: "Keep layout local", paragraphs: ["Use Stack, Flex, Grid or your application's CSS for spacing and responsiveness. Inspect each component's API: className and containerClassName may target different elements. Input, for example, distinguishes the input from its surrounding field wrapper."], language: "css", code: ".account-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: var(--pimolu-spacing-3, 12px);\n}\n\n@media (max-width: 480px) {\n  .account-actions {\n    flex-direction: column;\n    align-items: stretch;\n  }\n}" },
      { id: "scope", title: "Scope your refinements", paragraphs: ["Prefer public props and semantic variables before targeting internal component classes. Keep a page-specific override inside an application class. Broad selectors can accidentally restyle nested components, such as Tabs inside a documentation preview.", "CSS layers determine precedence before specificity. The website places Pimolu component styles before its local components and utility layers, without Tailwind Preflight resetting library defaults."] },
    ],
  },
  {
    slug: "animation", title: "Animation", group: "Design system",
    description: "Motion should explain a change and respect the person using it.",
    sections: [
      { id: "purpose", title: "Animate a meaningful transition", paragraphs: ["Use a short transition to clarify hover, opening or a state change. Avoid perpetual movement around forms and reading content. Preserve the final state when motion is reduced; an animation should never be required to understand the interface.", "Pimolu's shared CSS includes reduced-motion treatments. Review custom application animation separately, including components with continuous progress or media."] },
      { id: "css", title: "Provide a quiet CSS alternative", paragraphs: ["Keep motion scoped to the element that changes. Avoid transition: all and layout shifts during keyboard navigation."], language: "css", code: ".resource-link {\n  transition: border-color 160ms ease;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .resource-link {\n    transition: none;\n  }\n}" },
      { id: "motion", title: "Using Motion in an application", paragraphs: ["This website already uses motion/react. Motion is an application dependency, not a required Pimolu peer dependency. If your application uses it, configure reducedMotion on MotionConfig and choose an appropriate static state.", "Do not add a second animation framework just to animate Pimolu. Verify focus, Escape and dismissal during animated overlays, not only after their transition finishes."], language: "tsx", code: '"use client";\n\nimport type { ReactNode } from "react";\nimport { MotionConfig, motion } from "motion/react";\n\nexport function Reveal({ children }: { children: ReactNode }) {\n  return (\n    <MotionConfig reducedMotion="user">\n      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>\n        {children}\n      </motion.div>\n    </MotionConfig>\n  );\n}' },
    ],
  },
  {
    slug: "composition", title: "Composition", group: "Design system",
    description: "Build interfaces from small, readable parts with clear ownership.",
    sections: [
      { id: "parts", title: "Compose structure and behavior", paragraphs: ["Card groups related content; its header and title establish hierarchy. Dialog supplies modal behavior, while its trigger, content, title and footer declare the composition. These parts remain ordinary React elements with explicit responsibilities.", "Use real Button and Link components for interaction. A Card surface is not automatically a button. Avoid nested buttons, links inside links and clickable generic div elements."] },
      { id: "state", title: "Let the application own the workflow", paragraphs: ["Use controlled state when other parts of your application need to read or change a value. Use a default value when a component can own its local interaction. Verify the exact callback in the API: not every family calls it onChange.", "For example, the styled Select uses onValueChange. Form integration needs the real name and value contract, rather than assuming that a styled control behaves exactly like a native select element."] },
      { id: "choice", title: "Choose the smallest useful abstraction", paragraphs: ["Table provides semantic markup; DataTable adds common local data behavior; DataGrid handles richer ownership and column features. Start with the simplest family that meets the workflow.", "DashboardLayout composes a workspace with sidebar and navbar. AppShell is a general layout structure. Keep responsive behavior and landmark names explicit when combining layouts, and avoid nested main regions."] },
      { id: "triggers", title: "Keep trigger props intact", paragraphs: ["DialogTrigger, Tooltip and other wrappers depend on their child forwarding props and a ref. Pimolu Button supports this composition. If you create a custom trigger, retain its accessible name, event handlers and focus target."] },
    ],
  },
  {
    slug: "agents", title: "AI and developer tooling", group: "For agents",
    description: "Give assistants verified context instead of guessed APIs.",
    sections: [
      { id: "context", title: "Start with the repository context", paragraphs: ["AGENTS.md points to docs/ai/PROJECT_CONTEXT.md and the verified architecture, design-system, component and development guides. These are snapshots: re-read the implementation relevant to the task before editing.", "The repository includes specialized .agents/skills for component work, accessibility, theme integrity, documentation, testing and release preparation. Use the smallest relevant set, preserve local work and never claim tests ran when they did not."] },
      { id: "llms", title: "A machine-readable documentation map", paragraphs: ["This site exposes /llms.txt with canonical guide, component and blog links. It is generated from the same content sources as the site, and describes the current workspace distribution. Use it to find the relevant reference, then inspect the actual public API and examples."] },
      { id: "workflow", title: "Make changes reviewable", paragraphs: ["Ask an assistant to identify the real component API, CSS source, tests and consumers before proposing a change. Regenerate normal build outputs, validate the affected app and inspect interactive states in a real browser. A passing typecheck does not prove visual quality.", "Never provide private environment files or credentials as project context. Commit, push, package publication and CI changes require an explicit maintainer decision."] },
      { id: "future", title: "MCP is a future integration", paragraphs: ["There is no distributed Pimolu MCP server or public component-install CLI in the current repository. Do not invent an npx command, server URL or agent integration. A future server could expose verified APIs and examples; it should follow the same source-of-truth pipeline as this documentation."] },
    ],
  },
];
