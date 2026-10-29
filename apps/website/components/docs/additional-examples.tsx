"use client";

import { useEffect, useRef, useState } from "react";
import { Button, CodeBlock, Link, Tabs, TabsList, TabsTrigger, TabsContent, usePimoluTheme } from "@pimolu/react";

export interface AdditionalExample {
  id: string;
  title: string;
  description: string;
  origin: string;
}

export function ExampleCard({ family, example, initialSource, filename, showHeading = true, surface = "additional" }: {
  family: string;
  example: AdditionalExample;
  initialSource?: string;
  filename?: string;
  showHeading?: boolean;
  /** Setup cards reuse the card UI but are not part of the "More examples" set. */
  surface?: "additional" | "setup";
}) {
  const prefix = surface === "setup" ? "setup-example" : "additional-example";
  const theme = usePimoluTheme();
  const iframe = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(440);
  const [source, setSource] = useState<string | undefined>(initialSource);
  const [view, setView] = useState("preview");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const query = new URLSearchParams({ example: example.id, theme: theme.resolvedTheme, preset: theme.stylePreset });
  if (theme.radius) query.set("radius", theme.radius);
  if (theme.density) query.set("density", theme.density);
  if (theme.brandColor) query.set("brand", theme.brandColor);
  const url = `/preview/${family}?${query}`;
  useEffect(() => {
    function resize(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== iframe.current?.contentWindow || event.data?.type !== "pimolu-example-height" || !Number.isFinite(event.data.height)) return;
      setHeight(Math.max(300, Math.min(900, Math.ceil(event.data.height))));
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);
  async function loadCode() {
    if (source || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/examples/${family}/${example.id}`);
      if (!response.ok) throw new Error("Source unavailable");
      const data = await response.json();
      setSource(data.source);
    } catch { setError("The source could not be loaded. Try again."); }
    finally { setBusy(false); }
  }
  return <section className={prefix} aria-labelledby={`${family}-${example.id}`}>
    <div className={`${prefix}-heading`}>
      {showHeading ? <div><h3 id={`${family}-${example.id}`}>{example.title}</h3><p>{example.description}</p></div>
        : <span id={`${family}-${example.id}`} className="sr-only">{example.title}</span>}
      <Link href={url} external>Open preview</Link>
    </div>
    <Tabs className="example-switcher" variant="segmented" size="sm" value={view} onValueChange={(value) => { setView(value); if (value === "code") void loadCode(); }}>
      <TabsList aria-label={`${example.title} example view`}><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList>
      <TabsContent value="preview"><iframe ref={iframe} className={`${prefix}-frame`} title={`${family}: ${example.title}`} src={url} style={{ height }} loading="lazy" /></TabsContent>
      <TabsContent value="code">
        {busy && <p className="example-code-status" role="status">Loading example source…</p>}
        {error && <div className="example-code-status"><p role="alert">{error}</p><Button appearance="outline" size="sm" onClick={loadCode}>Try again</Button></div>}
        {source && <CodeBlock code={source} language="tsx" filename={filename ?? `${family}-${example.id}.tsx`} maxHeight={520} wrap />}
      </TabsContent>
    </Tabs>
  </section>;
}

export function AdditionalExamples({ family, examples }: { family: string; examples: AdditionalExample[] }) {
  return <div className="additional-examples">{examples.map((example) => <ExampleCard key={example.id} family={family} example={example} />)}</div>;
}
