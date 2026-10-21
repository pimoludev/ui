"use client";

import { useRef, useState } from "react";
import { Button, Card, CardContent, Tour } from "@pimolu/react";

export function DemoExample() {
const target = useRef<HTMLHeadingElement>(null); const [open, setOpen] = useState(false); const [finished, setFinished] = useState(false);
return (<div className="pg-stack"><Button onClick={() => setOpen(true)}>Start introduction</Button><Card><CardContent><h2 ref={target}>Your workspace</h2><p>Review your projects and share progress.</p></CardContent></Card><Tour open={open} onOpenChange={setOpen} steps={[{target,title:"Workspace overview",description:"This is the real heading referenced by the tour."}]} showSkip={false} onFinish={() => setFinished(true)} /><p role="status">{finished ? "Introduction completed." : "Ready to explore."}</p></div>);
}
