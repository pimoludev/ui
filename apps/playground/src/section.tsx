import type { ReactNode } from "react";

export function PageHeader({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <header className="pg-page">
      <h1 className="pg-page-title">{title}</h1>
      {hint ? <p className="pg-page-hint">{hint}</p> : null}
    </header>
  );
}

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="pg-section">
      <h2 className="pg-section__title">{title}</h2>
      {hint ? <p className="pg-section__hint">{hint}</p> : null}
      {children}
    </section>
  );
}
