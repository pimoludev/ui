export const releaseNotes = [{
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
      "Core React, themes and web-style packages are private workspace packages. Public npm distribution and a supported installation CLI are not announced.",
      "Deeper assistive-technology and visual review remains necessary for complex families and complete application workflows.",
      "React Native, Angular, direct CDN adapters and a Pimolu MCP server remain future directions.",
    ] },
  ],
}];
