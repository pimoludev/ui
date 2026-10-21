"use client";

import { useState } from "react";
import { Button, VisuallyHidden, Input, Card, CardHeader, CardTitle, CardContent } from "@pimolu/react";

export function DemoExample() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  return <Card><CardHeader><CardTitle>Accessible compact controls</CardTitle></CardHeader><CardContent><div className="pg-stack">
    <div className="pg-row"><Button iconOnly appearance="outline" disabled={page === 1} onClick={() => setPage(page - 1)}><span aria-hidden="true">←</span><VisuallyHidden>Previous page</VisuallyHidden></Button><span role="status">Page {page}</span><Button iconOnly appearance="outline" onClick={() => setPage(page + 1)}><span aria-hidden="true">→</span><VisuallyHidden>Next page</VisuallyHidden></Button></div>
    <VisuallyHidden id="example-hidden-search-label">Search the documentation</VisuallyHidden><Input aria-labelledby="example-hidden-search-label" placeholder="Search documentation…" value={query} onValueChange={setQuery} fullWidth /><p className="pg-meta">{query ? `Searching locally for “${query}”.` : "The search input is named by visually hidden text."}</p>
  </div></CardContent></Card>;
}
