"use client";

import { Anchor, Prose } from "@pimolu/react";

export function DemoExample() {
  return <Prose><p>Give sections stable, shareable destinations without a separate table of links.</p><Anchor id="preview-linked-section" level={2}>A section worth sharing</Anchor><p>The permalink is a real link to this heading. This preview has its own document so its fragment cannot collide with the surrounding API reference.</p></Prose>;
}
