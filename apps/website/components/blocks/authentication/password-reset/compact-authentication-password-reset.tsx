"use client";

import { useRef, useState } from "react";
import { Button, PasswordInput } from "@pimolu/react";

export function CompactAuthenticationPasswordResetBlock() {
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <section className="grid min-h-[480px] place-items-center px-5 py-12 sm:py-16">
      <div className="w-full max-w-sm space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Account recovery
          </p>
          <h2
            ref={heading}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight"
          >
            {complete ? "Password ready" : "Set a new password"}
          </h2>
          <p className="text-sm text-muted">
            {complete
              ? "Your new password passed the local checks."
              : "Choose a password with at least 10 characters."}
          </p>
        </header>
        {complete ? (
          <Button
            appearance="outline"
            fullWidth
            onClick={() => {
              setComplete(false);
              setMessage("");
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            Try another password
          </Button>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              if (data.get("password") !== data.get("confirm")) {
                setMessage("Passwords must match.");
                return;
              }
              // Validate the reset token and save the password on your server.
              setComplete(true);
              setMessage("New password validated locally. No account was changed.");
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            <PasswordInput
              label="New password"
              name="password"
              autoComplete="new-password"
              minLength={10}
              required
              fullWidth
            />
            <PasswordInput
              label="Confirm new password"
              name="confirm"
              autoComplete="new-password"
              minLength={10}
              required
              fullWidth
            />
            <Button type="submit" fullWidth>
              Validate new password
            </Button>
          </form>
        )}
        <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
          {message}
        </p>
      </div>
    </section>
  );
}
