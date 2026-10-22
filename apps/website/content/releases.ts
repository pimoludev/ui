export type ReleaseNote = {
  slug: string;
  title: string;
  status: "Preview" | "Development";
  date?: string;
  tag?: string;
  summary: string;
  sections: Array<{ id: string; title: string; label: string; items: string[] }>;
};

export const releaseNotes: ReleaseNote[] = [{
  slug: "0.1.0-beta.1",
  title: "0.1.0-beta.1",
  status: "Preview" as const,
  date: "2026-10-22",
  tag: "v0.1.0-beta.1",
  summary: "The first public preview: five prepared packages, 129 component families and a complete documentation site.",
  sections: [
    { id: "packages", title: "Prepared packages", label: "Preview", items: [
      "Five library packages share the 0.1.0-beta.1 version: design-tokens, themes, core, react and web-styles.",
      "Every package passes npm pack --dry-run with its expected entry points and contents. No package has been published to npm.",
      "React ships as one ESM bundle with TypeScript declarations and the use client directive; core compiles to ESM.",
      "The tag v0.1.0-beta.1 marks the source state. A public npm release and a deployed preview remain separate decisions.",
    ] },
    { id: "library", title: "The library", label: "Available in the source", items: [
      "129 React component families, from everyday controls to data surfaces, application layouts and media.",
      "Shared CSS with seven visual presets, light and dark modes, brand color, radius and density settings.",
      "Platform-neutral palette and visual-token data, with generated web assets and integrity checks.",
    ] },
    { id: "documentation", title: "A reference you can build from", label: "Website", items: [
      "An illustrated catalogue with search, categories and a direct path to each component's API.",
      "Four real examples per family: interactive previews, readable copyable code and source-derived public types.",
      "Integration and design-system guides, a palette explorer and original engineering articles in the journal.",
    ] },
    { id: "limits", title: "Known limits", label: "Preview", items: [
      "The component API and visual tokens may still change before 0.1.0 stable.",
      "The full 131-page visual matrix across seven presets and both modes is not finished.",
      "The seven complex-component assistive-technology reviews and the complete Firefox/WebKit gate remain open.",
      "No npm package or public website preview is live yet; this entry records the prepared source release.",
    ] },
  ],
}, {
  slug: "unreleased",
  title: "Unreleased",
  status: "Development" as const,
  summary: "A shared visual foundation, a complete React reference and a clearer path from exploration to implementation.",
  sections: [
    { id: "library", title: "The library", label: "Available in the workspace", items: [
      "129 React component families, from everyday controls to data surfaces, application layouts and media.",
      "Shared CSS with seven visual presets, light and dark modes, brand color, radius and density settings.",
      "Platform-neutral palette and visual-token data, with generated web assets and integrity checks.",
    ] },
    { id: "documentation", title: "A reference you can build from", label: "Website", items: [
      "An illustrated catalogue with search, categories and a direct path to each component's API.",
      "Four real examples per family: interactive previews, readable copyable code and source-derived public types.",
      "Integration and design-system guides, a palette explorer and original engineering articles in the journal.",
    ] },
    { id: "refinements", title: "Interaction refinements", label: "Refined", items: [
      "Anchored menus apply logical alignment before viewport clamping; DropdownMenu focuses commands after its portal mounts.",
      "Scheduler exposes a grid keyboard model, including RTL navigation and focus return from a cell action.",
      "Kanban capacity limits no longer mark operable cards in full columns as disabled.",
    ] },
    { id: "before-release", title: "Before a public release", label: "Still in progress", items: [
      "The library packages are prepared at 0.1.0-beta.1, but no npm publication or supported installation CLI is announced.",
      "Deeper assistive-technology and visual review remains necessary for complex families and complete application workflows.",
      "React Native, Angular, direct CDN adapters and a Pimolu MCP server remain future directions.",
    ] },
  ],
}];
