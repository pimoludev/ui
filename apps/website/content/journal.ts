import type { GuideSection } from "./docs.ts";

export interface JournalPost {
  slug: string;
  title: string;
  description: string;
  category: "Engineering" | "Design system" | "Accessibility";
  date: string;
  artwork: "system" | "palette" | "interaction";
  sections: GuideSection[];
}

export const journalPosts: JournalPost[] = [
  {
    slug: "one-system-many-identities",
    title: "One system, many identities",
    description: "Why Pimolu separates color, visual character and component behavior — and what that means for your product.",
    category: "Design system", date: "2026-10-22", artwork: "palette",
    sections: [
      { id: "starting-point", title: "An identity is more than an accent color", paragraphs: ["Two products can share an indigo button and still feel entirely different. Typography, proportions, surface contrast, corner treatments and the way an action responds all contribute to identity. Treating a theme as a single hex value leaves most of that work scattered through the application.", "Pimolu's answer is a set of independent decisions. Color mode describes the viewing environment. A visual preset describes the character of the interface. Brand, radius and density refine the product. Keeping those axes separate makes a change easier to explain and easier to review."] },
      { id: "roles", title: "Start with roles, then choose values", paragraphs: ["A component should ask for a surface or a primary foreground, rather than for a particular shade of violet. Semantic roles let the light and dark palettes make different choices while preserving the meaning of the interface.", "That distinction also keeps application CSS small. A summary panel can use the surface, foreground and border tokens without declaring another palette. The preset changes the values beneath those names; the application continues to describe the same relationship."] },
      { id: "character", title: "Visual character belongs in data", paragraphs: ["Pimolu keeps palette and visual-token sources apart. Borders, shadows, radius, typography and press effects are represented in platform-neutral visual data. The web build translates those decisions into CSS variables.", "Default, Monochrome, Cartoon, Glass, Luxury, Neo-Brutalism and Adaptive remain available. They are compatible starting points, not a requirement to use seven styles in a single product. Default is the reference direction; Adaptive's longer-term role as a palette is still being evaluated."] },
      { id: "local", title: "Leave room for the application", paragraphs: ["A library cannot decide the right spacing for every dashboard, checkout and creative portfolio. Pimolu components own their internal presentation; application layouts own the relationship between them. Start with Provider settings, then use local classes for composition.", "The website's Design Lab experiments and the component gallery serve different purposes. An experiment can explore an identity. A reference should show the actual component clearly. Neither is a reason to silently replace the public token system."] },
      { id: "verify", title: "Review the system in context", paragraphs: ["A palette does not prove readability by itself. Review text on its actual surface, visible focus, disabled states and feedback. Check a complete workflow at a narrow width before treating the visual direction as finished.", "The color explorer in the documentation reads the generated palettes directly. Use it to understand the roles, then try a component's interactive examples. The goal is a recognizable system that still gives your product its own voice."] },
    ],
  },
  {
    slug: "from-tokens-to-components",
    title: "From tokens to a working interface",
    description: "A guided look at the build pipeline connecting design data, shared CSS and the React registry.",
    category: "Engineering", date: "2026-10-22", artwork: "system",
    sections: [
      { id: "layers", title: "Three layers with different jobs", paragraphs: ["Pimolu is a pnpm monorepo. The React registry provides component behavior and typed APIs. Shared web styles provide presentation. Design tokens and themes provide the values those styles consume. An application brings the layers together.", "That separation prevents a visual change from becoming a rewrite of every React component. It also makes the source of a decision easier to find: interaction belongs with the component, reusable styling belongs in web-styles, and shared values belong in the token and theme sources."] },
      { id: "build", title: "Why a fresh checkout needs a build", paragraphs: ["The React and core packages expose TypeScript source. Theme and web-style packages expose generated assets. A workspace can therefore resolve the React import while still lacking a generated stylesheet. Building all assets prepares both sides of the integration.", "The root build command generates the design tokens and base themes. build:all also prepares preset palettes, visual assets and the shared component CSS bundle. Use the broader command when preparing a fresh checkout."], language: "bash", code: "pnpm install\npnpm build:all\npnpm dev:website" },
      { id: "truth", title: "Keep generated files downstream", paragraphs: ["Primitive tokens live in packages/design-tokens/src/tokens.json. Semantic aliases live in packages/themes/src/themes.json. Preset palette and visual sources add their own controlled variations. Build scripts validate and resolve that data before generating outputs.", "Editing a dist file directly creates a temporary illusion: the next build overwrites it. Follow a rendered value back to its source, make the smallest change there, then regenerate and review its consumers."] },
      { id: "docs", title: "Documentation is another consumer", paragraphs: ["This website reads the actual component inventory and TypeScript declarations. Its API references are generated, while example selections and usage advice are authored. All 129 families have four examples. Their copied source is checked independently so a working preview does not hide a broken import in the code tab.", "The catalogue uses light and dark captures of the real components. Those are orientation aids. The component reference provides the interactive state, configuration and code needed to understand the behavior."] },
      { id: "future", title: "A useful foundation, not a completed adapter", paragraphs: ["Platform-neutral token data creates a path toward more renderers. It does not make a web Dialog a React Native Dialog. Each adapter still needs a rendering strategy, keyboard or touch model, accessibility semantics and its own validation.", "React and Next.js are the implemented path today. The most valuable architectural rule is to keep the data reusable while being explicit about the implementation that actually exists."] },
    ],
  },
  {
    slug: "a-component-is-not-a-workflow",
    title: "A component is not a complete workflow",
    description: "Keyboard paths, focus return and room to breathe: the details that make composed interfaces dependable.",
    category: "Accessibility", date: "2026-10-22", artwork: "interaction",
    sections: [
      { id: "composition", title: "The gaps appear between components", paragraphs: ["A button can have a good accessible name and a dialog can contain focus correctly, yet their composition can still be confusing. The button might open the wrong panel, a save action might silently close it, or focus might return to an element no longer on screen.", "Reviewing the complete task is therefore different from reviewing its parts. Start at the entry point, follow the keyboard path, trigger an error and leave the interaction. That sequence reveals what an isolated prop gallery cannot."] },
      { id: "focus", title: "Focus is part of the interaction", paragraphs: ["When an overlay opens, the initial focus should make sense for the task. Escape and dismissal need an intelligible result. On return, focus should land at a useful control without jumping the document unexpectedly.", "Pimolu's anchored menu work illustrates how timing matters. Positioning must account for alignment before clamping to the viewport. Focus must follow the real portal mount rather than an effect that can run before its content exists. These details need browser checks in addition to jsdom tests."] },
      { id: "space", title: "Responsive means preserving the task", paragraphs: ["Fitting a layout into a smaller rectangle is not enough. A toolbar may technically fit while its labels wrap into unreadable fragments. A filter group may look aligned while leaving no useful width for the actual input.", "Stack sections when their content needs the space. Keep data scrolling inside a named, contained region. Decide deliberately whether mobile navigation collapses to a rail or opens an overlay: those are different interactions, even if both involve a sidebar."] },
      { id: "preferences", title: "Honor more than light and dark", paragraphs: ["Reduced motion, forced colors and RTL each expose a different assumption. A state expressed only by a background color may disappear in forced colors. A physical left offset may be wrong in RTL. A long entrance animation may delay a keyboard user from reaching the task.", "Preserve text labels, visible focus and a stable final state. Test the actual composed page with the preferences enabled, rather than assuming that a component's internal CSS covers application styling too."] },
      { id: "evidence", title: "Report the evidence precisely", paragraphs: ["TypeScript, unit tests, browser checks and assistive-technology review answer different questions. A pass count should name its scope. An automated accessibility scan does not certify the entire library, and a screenshot does not prove keyboard behavior.", "Pimolu's public documentation keeps that distinction visible. Use the accessibility notes to prepare a review, then test your own data, language, preset and workflow. The outcome is a more dependable product, not just a larger list of components."] },
    ],
  },
];

export function readingMinutes(post: JournalPost): number {
  const words = post.sections.flatMap((section) => section.paragraphs).join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatJournalDate(date: string): string {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
