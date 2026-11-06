"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@pimolu/react";

export function LaunchCtaBlock() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-border bg-primary/10 p-8 sm:p-12">
      <div className="flex flex-wrap items-center justify-between gap-8">
        <header className="max-w-xl space-y-4">
          <Badge variant="primary">YOUR NEXT CHAPTER</Badge>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
            Less setup.
            <br />
            More shipping.
          </h2>
          <p className="text-muted">
            A clear next step for the people who are ready to try your product.
          </p>
        </header>
        <Button
          size="lg"
          onClick={(event) => {
            event.currentTarget.focus();
            setOpen(true);
          }}
        >
          Request early access
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Try the next chapter</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Access request prepared. No email has been sent.");
            }}
          >
            <Input
              label="Early access email"
              type="email"
              name="email"
              required
              fullWidth
            />
            <Button type="submit">Prepare access request</Button>
            <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
              {message}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
