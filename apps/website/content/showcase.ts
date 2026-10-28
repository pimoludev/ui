export interface ShowcaseProject {
  slug: string;
  name: string;
  description: string;
  category: string;
  year?: string;
  url: string;
  repository?: string;
  image: { light: string; dark: string; alt: string };
  technologies: readonly string[];
}

// Add completed projects here. Images are real project captures in public/images/showcase/.
export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    slug: "project-workspace",
    name: "Project Workspace",
    description: "A SaaS landing page for a workspace that helps teams plan projects and organize tasks.",
    category: "SaaS",
    url: "https://saas-landing.pimolu.com/",
    image: {
      light: "/images/showcase/saas-landing.webp",
      dark: "/images/showcase/saas-landing-dark.webp",
      alt: "Project Workspace landing page with a workspace dashboard preview.",
    },
    technologies: ["Pimolu UI", "Next.js"],
  },
];
