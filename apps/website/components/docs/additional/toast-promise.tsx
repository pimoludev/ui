"use client";

import { Button, toast, Toaster } from "@pimolu/react";

function exportReport(shouldFail: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("The connection was interrupted."));
      else resolve("Quarterly report");
    }, 1600);
  });
}

export function DemoExample() {
  function startExport(shouldFail: boolean) {
    toast.promise(() => exportReport(shouldFail), {
      loading: "Preparing your export…",
      success: (name) => `${name} is ready`,
      error: (error) => error instanceof Error ? error.message : "Export failed",
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => startExport(false)}>Export report</Button>
      <Button appearance="outline" onClick={() => startExport(true)}>Simulate a failure</Button>
      <Toaster position="bottom-right" label="Export notifications" />
    </div>
  );
}
