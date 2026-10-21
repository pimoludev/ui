"use client";

import { useState } from "react";
import { Hero, HeroContent, HeroEyebrow, HeroTitle, HeroDescription, HeroActions, Button, Card, CardHeader, CardTitle, CardContent, Stat } from "@pimolu/react";

export function DemoExample() {
  const [joined, setJoined] = useState(false);
  return <Hero variant="gradient" media={<Card><CardHeader><CardTitle>Studio workspace</CardTitle></CardHeader><CardContent><Stat label="Your next project" value="One system" description="An illustrative product composition" /></CardContent></Card>}>
    <HeroContent><HeroEyebrow>A composed product introduction</HeroEyebrow><HeroTitle as="h2">A workspace that feels like yours.</HeroTitle><HeroDescription>Bring your team&apos;s projects together with a visual language you can make your own.</HeroDescription><HeroActions><Button onClick={() => setJoined(!joined)}>{joined ? "You're on the demo list" : "Join the demo list"}</Button></HeroActions><p role="status">{joined ? "Your choice is saved locally for this preview." : "Try the action. No account or request is created."}</p></HeroContent>
  </Hero>;
}
