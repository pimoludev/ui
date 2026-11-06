"use client";

import { useRef, useState } from "react";
import { Button, Card, Input } from "@pimolu/react";

export function MarketAuthenticationPasswordResetBlock() {
  const [email, setEmail] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <section className="grid min-h-[480px] place-items-center px-5 py-12 sm:py-16">
      <div className="w-full max-w-sm space-y-6">
        <p className="text-center text-sm font-semibold tracking-tight">
          orbit / workspace
        </p>
        <Card className="space-y-6 p-6 sm:p-8">
          <div
            className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>
          <header className="space-y-2">
            <h2
              ref={heading}
              tabIndex={-1}
              className="text-2xl font-semibold tracking-tight"
            >
              {requestedEmail ? "Check your inbox" : "Forgot your password?"}
            </h2>
            <p className="break-words text-sm leading-relaxed text-muted">
              {requestedEmail
                ? `Reset request ready for ${requestedEmail}.`
                : "Enter your work email to get a reset link."}
            </p>
          </header>
          {requestedEmail ? (
            <div className="space-y-3">
              <Button
                fullWidth
                onClick={() =>
                  setMessage("Another reset request prepared. No email sent.")
                }
              >
                Resend reset link
              </Button>
              <Button
                appearance="ghost"
                fullWidth
                onClick={() => {
                  setRequestedEmail("");
                  setMessage("");
                  requestAnimationFrame(() => heading.current?.focus());
                }}
              >
                Use another email
              </Button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                // Replace this local transition with your reset request service.
                setRequestedEmail(email.trim());
                setMessage("Request prepared. No email sent by this preview.");
                requestAnimationFrame(() => heading.current?.focus());
              }}
            >
              <Input
                label="Account email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
              />
              <Button type="submit" fullWidth>
                Send reset link
              </Button>
            </form>
          )}
          <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
            {message}
          </p>
        </Card>
      </div>
    </section>
  );
}
