import type { GuideDoc } from "./docs.ts";

export const handbookGuides: GuideDoc[] = [
  {
    slug: "quick-start", title: "Quick start", group: "Getting started",
    description: "From npm installation to your first Pimolu screen.",
    sections: [
      { id: "start", title: "Install Pimolu", paragraphs: ["In an existing React 18 or React 19 application, install the components and shared stylesheet package from npm. You do not need a repository checkout or a Pimolu build step.", "The current release is 0.1.0-beta.1. Use @beta explicitly while evaluating the preview; APIs and visual tokens can change before the stable release."], language: "bash", code: "npm install @pimolu/react@beta @pimolu/web-styles@beta\n\n# Or with pnpm\npnpm add @pimolu/react@beta @pimolu/web-styles@beta" },
      { id: "styles", title: "Load Pimolu styles", paragraphs: ["Import the shared stylesheet once in your app's global CSS file. It provides the component styles, themes and visual presets. In Next.js, use app/globals.css and import that file from the root layout."], language: "css", filename: "globals.css", code: '@import "@pimolu/web-styles/styles.css";' },
      { id: "first-screen", title: "Compose your first screen", paragraphs: ["Wrap your screen in PimoluProvider and import the components you use. The shared stylesheet is loaded separately from globals.css. For Next.js, keep the Provider in a client module, as shown in the Next.js guide. Pimolu owns component styles; your application owns the layout."], language: "tsx", filename: "welcome.tsx", code: '"use client";\n\nimport {\n  Button,\n  Card,\n  CardContent,\n  CardHeader,\n  CardTitle,\n  PimoluProvider,\n} from "@pimolu/react";\n\nexport function Welcome() {\n  return (\n    <PimoluProvider defaultTheme="system">\n      <Card>\n        <CardHeader>\n          <CardTitle>Make room for your next idea.</CardTitle>\n        </CardHeader>\n        <CardContent>\n          <Button onClick={() => window.alert("Your screen is ready.")}>\n            Start building\n          </Button>\n        </CardContent>\n      </Card>\n    </PimoluProvider>\n  );\n}' },
      { id: "packages", title: "Choose the packages you need", paragraphs: ["@pimolu/react contains components, hooks and the Provider. @pimolu/web-styles contains component CSS, theme variables and presets. Together they are the usual starting point for a React or Next.js application.", "@pimolu/themes exposes palettes and visual-token data, @pimolu/design-tokens exposes primitive tokens, and @pimolu/core provides framework-independent class variant utilities. Add one directly to your dependencies if your application imports it directly; you do not need to install all five explicitly to render a Button."] },
      { id: "versions", title: "Keep release versions aligned", paragraphs: ["The current npm release is 0.1.0-beta.1 for all five packages. Both latest and beta currently resolve to it; beta is still a prerelease, not a stable API guarantee. Commit your application's lockfile and update directly installed Pimolu packages together.", "To reproduce this exact preview, use the version rather than a moving tag."], language: "bash", code: "npm install @pimolu/react@0.1.0-beta.1 @pimolu/web-styles@0.1.0-beta.1" },
      { id: "next-step", title: "Choose your next step", paragraphs: ["The Next.js guide provides the root layout and client Provider. Components contains four examples per family, copyable source and source-derived TypeScript APIs."] },
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
      { id: "next", title: "Next.js App Router", paragraphs: ["apps/website and examples/nextjs use the App Router. Published packages contain compiled ESM and TypeScript declarations, so no Pimolu-specific transpilePackages setting is needed. Load the shared CSS once in app/layout.tsx and keep the Provider and event handlers in a client module. The Next.js guide shows the complete setup."] },
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
    description: "Use CSS by default, or opt into Pimolu Motion components and portal transitions.",
    sections: [
  {
    "id": "purpose",
    "title": "Motion remains optional",
    "paragraphs": [
      "Pimolu works with its existing CSS transitions by default. @pimolu/react never imports Motion. Applications that need gesture, layout or portal animations can opt into the separate @pimolu/motion adapter.",
      "The new module is implemented in this repository but has not been published on npm. Its provider and DOM-ref changes also require this workspace build; they are not part of the published 0.1.0-beta.1 React package. The five existing npm packages remain unchanged until the next coordinated release."
    ]
  },
  {
    "id": "setup",
    "title": "Try the workspace module",
    "paragraphs": [
      "Inside this pnpm workspace, declare @pimolu/motion as workspace:* and install motion in the consuming application. Run pnpm install and pnpm build:all from the repository root. Continue loading @pimolu/web-styles/styles.css from globals.css.",
      "After the module and its compatible React version are published, installation will become pnpm add @pimolu/motion motion. Do not run that command against npm before publication."
    ]
  },
  {
    "id": "motion-components",
    "title": "Animate a Pimolu component",
    "paragraphs": [
      "MotionButton retains the Button API, DOM ref, classes and tokens. It consumes Motion props such as whileHover, whileTap, animate, layout and transition. Disabled or loading buttons suppress interactive hover, tap, focus and drag gestures.",
      "Adapters default to the user's reduced-motion preference. Spatial and layout animations are reduced; Motion can still animate opacity. Animate properties that do not compete with the component's own positioning or drag behavior."
    ],
    "language": "tsx",
    "code": "\"use client\";\n\nimport { MotionButton } from \"@pimolu/motion\";\n\nexport function AnimatedAction() {\n  return (\n    <MotionButton\n      whileHover={{ scale: 1.05 }}\n      whileTap={{ scale: 0.95 }}\n      transition={{ type: \"spring\" }}\n    >\n      Save changes\n    </MotionButton>\n  );\n}"
  },
  {
    "id": "global-engine",
    "title": "Opt into the global engine",
    "paragraphs": [
      "Supply motionEngine explicitly to PimoluProvider. Passing a driver object keeps Motion outside the core dependency graph; a magic string would require a hidden Motion import or registration. Classic Pimolu buttons gain subtle feedback, and supported panels use the driver's entrance and exit durations.",
      "The driver covers Dialog, AlertDialog, Drawer, Popover, dropdown/context/navigation menus, Menubar, HoverCard, Tooltip, Toast, Tabs and Accordion. Components built on these primitives inherit the integration. Custom imperative charts, canvases, media playback and virtualized rows keep their own behavior; the engine does not animate every DOM node.",
      "Pimolu keeps mounting, keyboard navigation, positioning, focus restoration and scroll lock. Closing surfaces become inert until removal, and reopening cancels the obsolete exit. Reduced motion closes retained surfaces immediately."
    ],
    "language": "tsx",
    "code": "\"use client\";\n\nimport type { ReactNode } from \"react\";\nimport { PimoluProvider } from \"@pimolu/react\";\nimport { motionEngine } from \"@pimolu/motion\";\n\nexport function Providers({ children }: { children: ReactNode }) {\n  return (\n    <PimoluProvider animationEngine={motionEngine}>\n      {children}\n    </PimoluProvider>\n  );\n}"
  },
  {
    "id": "portal",
    "title": "Animate a portal without changing its API",
    "paragraphs": [
      "MotionDialog, MotionDrawer and other logical roots enable the engine for their descendants and portals. They retain the original Pimolu props; logical roots do not accept DOM animation props such as whileHover. Keep using the existing content and title components.",
      "Do not assume AnimatePresence controls a panel that Pimolu mounts internally. For arbitrary custom motion inside a panel, compose MotionBox. Keep durations bounded so focus restoration and body scroll lock finish promptly."
    ],
    "language": "tsx",
    "code": "\"use client\";\n\nimport {\n  Button,\n  DialogContent,\n  DialogTitle,\n  DialogTrigger,\n} from \"@pimolu/react\";\nimport { MotionDialog } from \"@pimolu/motion\";\n\nexport function AnimatedDialog() {\n  return (\n    <MotionDialog>\n      <DialogTrigger>\n        <Button>Open dialog</Button>\n      </DialogTrigger>\n      <DialogContent>\n        <DialogTitle>Your workspace</DialogTitle>\n        <p>Focus and Escape are managed by Pimolu.</p>\n      </DialogContent>\n    </MotionDialog>\n  );\n}"
  },
  {
    "id": "contracts",
    "title": "Know the animation target",
    "paragraphs": [
        "Ordinary CSS feedback now shares generated timing tokens: 120ms feedback, 150ms controls, 180ms entrances and 200ms layout. CSS exit durations retain their existing presence contract. Use pimoluMotionPresets.press, reveal or layout from the optional module for springs, coordinated exits or keyed reordering. Override Motion props after spreading a recipe. Compare both engines on the Playground's Motion integration page before choosing one for your application.",
      "motionComponentModes identifies every exported adapter: dom targets animate the same native element as their public ref; container targets animate a local outer surface while keeping the public ref on the original control; engine targets retain the original compound or generic API and enable inherited panel behavior.",
      "For example, MotionCombobox animates an outer surface while its ref still points to the input. MotionDataGrid keeps its generic row inference and is an engine target: wrap it in MotionBox if you want to animate the complete grid. Public imperative refs are never silently replaced by DOM refs.",
      "A CSS-only subtree can override an inherited driver with animationEngine=css. MotionProvider is an alternative when the theme Provider already exists. Create custom drivers with createMotionEngine({ enterDuration, exitDuration, interactions }); durations are milliseconds between 0 and 10000.",
      "A transform establishes a containing block for fixed descendants. Prefer opacity for application layouts containing viewport-fixed UI. Test keyboard focus, Escape, rapid reopening, RTL and every preset in the actual application."
    ]
  },
  {
    "id": "local-css",
    "title": "Keep a subtree on CSS",
    "paragraphs": [
      "Explicit Motion components remain opt-in. A nested PimoluProvider with animationEngine=css blocks the inherited global driver for its subtree and portals."
    ],
    "language": "tsx",
    "code": "\"use client\";\n\nimport { Button, PimoluProvider } from \"@pimolu/react\";\nimport { motionEngine } from \"@pimolu/motion\";\n\nexport function MixedAnimation() {\n  return (\n    <PimoluProvider animationEngine={motionEngine}>\n      <Button>Motion feedback</Button>\n      <PimoluProvider animationEngine=\"css\">\n        <Button>CSS feedback</Button>\n      </PimoluProvider>\n    </PimoluProvider>\n  );\n}"
  }
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
      { id: "llms", title: "A machine-readable documentation map", paragraphs: ["This site exposes /llms.txt with canonical guide, component and blog links. It is generated from the same content sources as the site, and describes the published packages and supported integrations. Use it to find the relevant reference, then inspect the actual public API and examples."] },
      { id: "workflow", title: "Make changes reviewable", paragraphs: ["Ask an assistant to identify the real component API, CSS source, tests and consumers before proposing a change. Regenerate normal build outputs, validate the affected app and inspect interactive states in a real browser. A passing typecheck does not prove visual quality.", "Never provide private environment files or credentials as project context. Commit, push, package publication and CI changes require an explicit maintainer decision."] },
      { id: "future", title: "MCP is a future integration", paragraphs: ["There is no distributed Pimolu MCP server or public component-install CLI in the current repository. Do not invent an npx command, server URL or agent integration. A future server could expose verified APIs and examples; it should follow the same source-of-truth pipeline as this documentation."] },
    ],
  },
];
