"use client";

import { useRef, useState } from "react";
import { Button, Card, Input } from "@pimolu/react";

export function MarketAuthenticationVerificationBlock() {
  const [email, setEmail] = useState("alex@example.com");
  const [editing, setEditing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <section className="grid min-h-[480px] place-items-center px-5 py-12 sm:py-16">
      <Card className="w-full max-w-md space-y-6 p-6 text-center sm:p-10">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {complete ? (
              <path d="m5 12 4 4L19 6" />
            ) : (
              <>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4 7 8 6 8-6" />
              </>
            )}
          </svg>
        </div>
        <header className="space-y-2">
          <h2
            ref={heading}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight"
          >
            {complete ? "You're all set" : "Check your email"}
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            {complete
              ? "The verified state is ready to preview."
              : "Use the verification link for"}
          </p>
          {!complete && <p className="break-words text-sm font-medium">{email}</p>}
        </header>
        {editing ? (
          <form
            className="space-y-4 text-left"
            onSubmit={(event) => {
              event.preventDefault();
              setEditing(false);
              setMessage("Verification request prepared. No email sent.");
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            <Input
              label="Email to verify"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
            />
            <Button type="submit" fullWidth>
              Update email
            </Button>
          </form>
        ) : complete ? (
          <Button
            appearance="outline"
            fullWidth
            onClick={() => {
              setComplete(false);
              setMessage("");
            }}
          >
            Restart preview
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              fullWidth
              onClick={() => setMessage("Verification email prepared. No email sent.")}
            >
              Resend verification email
            </Button>
            <Button appearance="ghost" fullWidth onClick={() => setEditing(true)}>
              Change email address
            </Button>
          </div>
        )}
        <div className="space-y-3 border-t border-border pt-5">
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
          {!complete && !editing && (
            <Button
              size="sm"
              appearance="outline"
              onClick={() => {
                // In production, this state must come from server-side token validation.
                setComplete(true);
                setMessage(
                  "Demo verification confirmed locally. No email ownership was checked.",
                );
                requestAnimationFrame(() => heading.current?.focus());
              }}
            >
              Simulate verified email
            </Button>
          )}
        </div>
      </Card>
    </section>
  );
}
