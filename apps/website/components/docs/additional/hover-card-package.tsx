"use client";

import { Button, HoverCard, HoverCardTrigger, HoverCardContent, Link } from "@pimolu/react";

export function DemoExample() {

return (<HoverCard placement="right" openDelay={100} closeDelay={200}><HoverCardTrigger><Button appearance="outline">@pimolu/react</Button></HoverCardTrigger><HoverCardContent label="React package details"><p>TypeScript components with shared design tokens.</p><Link href="/docs/quick-start" target="_top">Quick start guide</Link></HoverCardContent></HoverCard>);
}
