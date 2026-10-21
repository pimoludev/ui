"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, CodeBlock, Link, usePimoluTheme } from "@pimolu/react";

export interface AdditionalExample {
  id: string;
  title: string;
  description: string;
  origin: string;
}

function ExampleCard({ family, example }: { family: string; example: AdditionalExample }) {
  const theme = usePimoluTheme();
  const iframe = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(440);
  const [source, setSource] = useState<string>();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sourceId = useId();
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
  async function toggleCode() {
    if (open) { setOpen(false); return; }
    if (source) { setOpen(true); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/examples/${family}/${example.id}`);
      if (!response.ok) throw new Error("Source unavailable");
      const data = await response.json();
      setSource(data.source); setOpen(true);
    } catch { setError("The source could not be loaded. Try again."); }
    finally { setBusy(false); }
  }
  return <section className="additional-example" aria-labelledby={`${family}-${example.id}`}>
    <div className="additional-example-heading"><div><h3 id={`${family}-${example.id}`}>{example.title}</h3><p>{example.description}</p></div><Link href={url} external>Open preview</Link></div>
    <iframe ref={iframe} className="additional-example-frame" title={`${family}: ${example.title}`} src={url} style={{ height }} loading="lazy" />
    <div className="additional-example-actions"><Button appearance="outline" size="sm" variant="neutral" loading={busy} aria-expanded={open} aria-controls={sourceId} onClick={toggleCode}>{open ? "Hide code" : "Show code"}</Button><span>Independent interactive example</span></div>
    {error && <p role="alert">{error}</p>}
    <div id={sourceId} hidden={!open}>{source && <CodeBlock code={source} language="tsx" filename={`${family}-${example.id}.tsx`} maxHeight={480} wrap />}</div>
  </section>;
}

export function AdditionalExamples({ family, examples }: { family: string; examples: AdditionalExample[] }) {
  return <div className="additional-examples">{examples.map((example) => <ExampleCard key={example.id} family={family} example={example} />)}</div>;
}
