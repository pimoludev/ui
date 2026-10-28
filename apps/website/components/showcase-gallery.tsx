"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Image, Link, SegmentedControl } from "@pimolu/react";
import { showcaseProjects } from "@/content/showcase";

export function ShowcaseGallery() {
  const [category, setCategory] = useState("all");
  const categories = [...new Set(showcaseProjects.map((project) => project.category))];
  const visibleProjects = category === "all" ? showcaseProjects : showcaseProjects.filter((project) => `category:${project.category}` === category);

  useEffect(() => {
    // A search result can target a project while another category is selected.
    function revealProject(event: Event) {
      const slug = (event as CustomEvent<string>).detail;
      if (!showcaseProjects.some((project) => project.slug === slug)) return;
      setCategory("all");
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: "start" }));
    }
    window.addEventListener("pimolu:showcase-project", revealProject);
    return () => window.removeEventListener("pimolu:showcase-project", revealProject);
  }, []);

  return <section className="showcase-collection" aria-labelledby="showcase-collection-title">
    <div className="showcase-section-heading">
      <div><p className="showcase-eyebrow">The collection</p><h2 id="showcase-collection-title">Explore projects</h2></div>
      <span aria-live="polite">{visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}</span>
    </div>
    {categories.length > 0 && <div className="showcase-filters">
      <SegmentedControl aria-label="Filter projects by category" value={category} onValueChange={setCategory} options={[
        { value: "all", label: "All" },
        ...categories.map((value) => ({ value: `category:${value}`, label: value })),
      ]} />
    </div>}
    <div className="showcase-grid">
      {visibleProjects.map((project, index) => <article key={project.slug} id={project.slug} className="showcase-project">
        <Link href={project.url} external={/^https?:\/\//.test(project.url)} showExternalIcon={false} className="showcase-card-link" aria-label={`Visit ${project.name}`}>
        <Card className="showcase-card">
          <div className="showcase-project-media">
              <Image src={project.image.light} alt={project.image.alt} width={1440} height={1000} aspectRatio={1.44} rounded="none" containerClassName="showcase-capture showcase-capture--light" loading={index === 0 ? "eager" : "lazy"} />
              <Image src={project.image.dark} alt="" aria-hidden="true" width={1440} height={1000} aspectRatio={1.44} rounded="none" containerClassName="showcase-capture showcase-capture--dark" loading={index === 0 ? "eager" : "lazy"} />
          </div>
          <CardContent className="showcase-project-copy">
            <h3>{project.name}</h3>
            <p>{project.category}</p>
          </CardContent>
        </Card>
        </Link>
      </article>)}
    </div>
  </section>;
}
