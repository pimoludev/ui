export const siteUrl = "https://pimolu.com";
export const siteTitle = "Pimolu UI — One system. Your identity.";
export const siteDescription = "A customizable React UI library built on shared design tokens, expressive presets and thoughtful defaults.";

export function indexablePaths(entries: readonly { href: string }[], guides: readonly { slug: string }[]): string[] {
  return [...new Set(["/", "/components", "/themes", "/releases", ...guides.map(({ slug }) => slug ? `/docs/${slug}` : "/docs"), ...entries.map(({ href }) => href)])];
}
