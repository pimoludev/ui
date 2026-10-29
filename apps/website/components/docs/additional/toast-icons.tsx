"use client";

import { Button, toast, Toaster } from "@pimolu/react";

export function DemoExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast({
        title: "Invitation received",
        description: "Ada invited you to the design workspace.",
        icon: <span>✉</span>,
        dismissLabel: "Close invitation",
      })}>Custom icon</Button>
      <Button appearance="outline" onClick={() => toast.info("A quiet update", { icon: null })}>
        Without icon
      </Button>
      <Button appearance="outline" onClick={() => toast.success("Preferences saved", {
        dismissible: false,
        duration: 2500,
      })}>Without close button</Button>
      <Button appearance="ghost" onClick={() => toast.dismiss()}>Dismiss all</Button>
      <Toaster position="bottom-right" label="Icon examples" />
    </div>
  );
}
