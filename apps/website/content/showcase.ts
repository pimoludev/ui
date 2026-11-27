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

// Add completed projects here, newest first. Images are real project captures in public/images/showcase/.
export const showcaseProjects: readonly ShowcaseProject[] = [
  {
    slug: "pimolu-games",
    name: "Pimolu Games",
    description: "A cinematic FPS website showcase with game modes, a battle pass, a gameplay gallery and a player setup panel.",
    category: "Gaming",
    url: "https://games.pimolu.com/",
    image: {
      light: "/images/showcase/pimolu-games.webp",
      dark: "/images/showcase/pimolu-games.webp",
      alt: "Pimolu Games landing page featuring a cinematic game hero, mode cards and a battle pass preview.",
    },
    technologies: ["Pimolu UI", "Next.js"],
  },
  {
    slug: "pimolu-headset",
    name: "Pimolu Headset",
    description: "A headphone concept storefront with an editorial product presentation, finish selection and a demo shopping cart.",
    category: "E-commerce",
    url: "https://pimolu-headset.pimolu.com/",
    image: {
      light: "/images/showcase/pimolu-headset.webp",
      dark: "/images/showcase/pimolu-headset.webp",
      alt: "Pimolu Headset storefront featuring champagne headphones, finish options and an add-to-cart action.",
    },
    technologies: ["Pimolu UI"],
  },
  {
    slug: "mecanes",
    name: "MECANES",
    description: "A digital development studio creating websites, applications, custom software and Unreal Engine solutions.",
    category: "Agency & studio",
    url: "https://www.mecanes.fr/",
    image: {
      light: "/images/showcase/mecanes.webp",
      dark: "/images/showcase/mecanes.webp",
      alt: "MECANES studio homepage with its blue emblem and web, apps, software and Unreal Engine services.",
    },
    technologies: ["Pimolu UI"],
  },
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
