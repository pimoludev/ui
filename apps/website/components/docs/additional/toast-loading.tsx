"use client";

import { useState } from "react";
import { Button, toast, Toaster } from "@pimolu/react";

export function DemoExample() {
  const [id, setId] = useState<string>();

  function completeUpload() {
    if (!id) return;
    toast.update(id, {
      title: "Upload complete",
      description: "Your project is ready to share.",
      variant: "success",
    });
    setId(undefined);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => setId(toast.loading("Uploading project…", { id: "project-upload" }))}>
        Start upload
      </Button>
      <Button appearance="outline" disabled={!id} onClick={completeUpload}>
        Complete upload
      </Button>
      <Toaster position="bottom-right" label="Upload notifications" />
    </div>
  );
}
