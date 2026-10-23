import { lazy, Suspense } from "react";
import { PageHeader } from "../section";

const Examples = lazy(() => import("../motion-integration-examples").then(({ MotionIntegrationExamples }) => ({ default: MotionIntegrationExamples })));

export function MotionIntegrationPage() {
  return <div className="pg-motion-page">
    <PageHeader title="Optional Motion" hint="The same Pimolu design, with explicit Motion props or an injected global engine. This module is available in the workspace, pending its first npm release." />
    <Suspense fallback={<p role="status">Loading the optional Motion examples…</p>}>
      <Examples />
    </Suspense>
  </div>;
}
