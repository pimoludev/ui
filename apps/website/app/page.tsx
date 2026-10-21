import { Badge, Link, PageHeader } from "@/components/ui";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="site-main mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
      <div className="max-w-3xl space-y-8">
        <Badge variant="secondary">Pimolu UI · React</Badge>
        <PageHeader title="One system. Your identity." description="Build with a shared visual language. Shape it into something that feels like you." />
        <p className="max-w-2xl text-lg leading-relaxed text-muted">Composable React components, shared CSS and expressive presets. A foundation for interfaces that stay consistent as your product grows.</p>
        <div className="flex flex-wrap gap-6">
          <Link href="/docs">Explore the foundations →</Link>
          <Link href="/themes" variant="muted">Find your visual style →</Link>
        </div>
      </div>
      <div className="mt-16 grid gap-8 border-t border-border pt-8 md:grid-cols-3">
        {[["01", "Compose", "Start with typed React components and familiar HTML behavior."], ["02", "Customize", "Use the same tokens across your components, layouts and themes."], ["03", "Make it yours", "Keep a consistent foundation while giving your product its own identity."]].map(([number, title, text]) => (
          <section key={number} className="space-y-3"><span className="text-sm text-primary">{number}</span><h2 className="text-xl">{title}</h2><p className="text-muted">{text}</p></section>
        ))}
      </div>
    </main>
  );
}
