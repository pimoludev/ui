"use client";

import { Button, toast, Toaster } from "@pimolu/react";

export function ToastExample() {
  return <div>
    <Button onClick={() => toast({ title: "Your draft is ready.", description: "A local demonstration of a success notification.", variant: "success", duration: 5000 })}>Show notification</Button>
    <Toaster position="bottom-right" label="Documentation notifications" />
  </div>;
}
