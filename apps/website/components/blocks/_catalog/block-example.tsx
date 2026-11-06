"use client";

import { useSyncExternalStore } from "react";
import { CodeBlock, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from "@pimolu/react";
import type { Block } from "@/content/blocks";
import { blockPreviews } from "./block-previews";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function BlockExample({ block, source }: { block: Block; source: string }) {
  // Mount interactive previews on the client so early input cannot be lost
  // while React hydrates a server-rendered form.
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const Preview = blockPreviews[block.slug];
  return <Tabs defaultValue="preview" variant="segmented" className="example-switcher block-example">
    <TabsList aria-label={`${block.title} example view`}>
      <TabsTrigger value="preview" disabled={!ready}>Preview</TabsTrigger>
      <TabsTrigger value="code" disabled={!ready}>Code</TabsTrigger>
    </TabsList>
    <TabsContent value="preview"><div className="block-preview">{ready ? <Preview /> : <Skeleton width="100%" height={320} />}</div></TabsContent>
    <TabsContent value="code"><CodeBlock code={source} language="tsx" filename={block.file.split("/").at(-1)} maxHeight={720} wrap /></TabsContent>
  </Tabs>;
}
