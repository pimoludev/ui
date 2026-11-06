"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "@pimolu/react";

export function CompactAuthenticationVerificationBlock() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [complete, setComplete] = useState(false);
  return (
    <section className="mx-auto max-w-md space-y-6 px-5 py-12 sm:py-16">
      <Card className="space-y-6 p-6 sm:p-8">
        <Badge variant={complete ? "success" : "primary"}>
          {complete ? "Complete in preview" : "One more step"}
        </Badge>
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Confirm your email</h2>
          <p className="text-sm text-muted">Enter your email and the six-digit code.</p>
        </header>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const ok = code === "123456";
            setComplete(ok);
            setMessage(
              ok
                ? "Demo email verified locally. No identity check performed."
                : "Use the demo code 123456.",
            );
          }}
        >
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            fullWidth
          />
          <p className="text-sm text-muted">Demo code: 123456. No email is sent.</p>
          <Button type="submit" fullWidth>
            Verify demo email
          </Button>
          <Button
            appearance="ghost"
            onClick={() => setMessage("A sample resend was prepared. No email sent.")}
          >
            Prepare resend
          </Button>
        </form>
      </Card>
      <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
        {message}
      </p>
    </section>
  );
}
