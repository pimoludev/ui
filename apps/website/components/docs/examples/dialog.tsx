"use client";

import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@pimolu/react";

export function DialogExample() {
  return <Dialog>
    <DialogTrigger><Button>Review the invitation</Button></DialogTrigger>
    <DialogContent size="sm">
      <DialogHeader><DialogTitle>You are invited.</DialogTitle><DialogDescription>Join the Orbit design workspace and build something together.</DialogDescription></DialogHeader>
      <DialogFooter><DialogClose><Button appearance="outline" variant="neutral">Close invitation</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}
