"use client";

import { useEffect, useState } from "react";
import { Button, Spinner, Card, CardHeader, CardTitle, CardContent } from "@pimolu/react";

export function DemoExample() {
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => { setPending(false); setSaved(true); }, 1200);
    return () => clearTimeout(timer);
  }, [pending]);
  return <Card><CardHeader><CardTitle>Activity and feedback</CardTitle></CardHeader><CardContent><div className="pg-stack"><div className="pg-row"><Spinner label="Example activity indicator" /><span>An indeterminate status with a readable label.</span></div><Button disabled={pending} aria-busy={pending || undefined} onClick={() => { setSaved(false); setPending(true); }} startIcon={pending ? <Spinner size="sm" decorative /> : undefined}>{pending ? "Saving locally…" : "Simulate saving"}</Button><p role="status">{saved ? "Demo saved. No network request was made." : pending ? "Simulating a short pending action." : "Try a local asynchronous action."}</p></div></CardContent></Card>;
}
