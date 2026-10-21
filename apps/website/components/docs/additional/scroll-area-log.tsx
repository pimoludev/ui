"use client";

import { ScrollArea } from "@pimolu/react";

export function DemoExample() {

return (<ScrollArea maxHeight={220} tabIndex={0} aria-label="Deployment activity"><ol>{Array.from({length:30},(_,i) => <li key={i} style={{padding:"12px"}}>Step {i+1}: deployment check complete</li>)}</ol></ScrollArea>);
}
