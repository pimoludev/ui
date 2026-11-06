"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PinInput,
} from "@pimolu/react";

export function VerificationCodeBlock() {
  const [cells, setCells] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const complete = cells.filter(Boolean).length === 6;

  return (
    <div className="mx-auto w-full max-w-lg p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <Badge variant="primary">One more step</Badge>
          <CardTitle>Verify your email.</CardTitle>
          <p className="text-sm text-muted">
            Enter the six-digit code. For this local preview, use 123456.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (cells.join("") !== "123456") {
                setError("That code does not match. Try the demo code 123456.");
                setMessage("");
                return;
              }
              setError("");
              setMessage(
                "Code accepted in this local preview. No account has been verified on a server.",
              );
            }}
          >
            <PinInput
              label="Verification code"
              length={6}
              groups={[3, 3]}
              value={cells}
              className="w-full"
              classNames={{
                groups: "flex-nowrap",
                group: "flex-1",
                cell: "min-w-0 flex-1",
              }}
              onValueChange={(value) => {
                setCells(value);
                setError("");
                setMessage("");
              }}
              error={Boolean(error)}
              errorMessage={error}
            />
            <Button type="submit" fullWidth disabled={!complete}>
              Verify code
            </Button>
            <Button
              appearance="ghost"
              variant="neutral"
              fullWidth
              onClick={() => {
                setCells([]);
                setError("");
                setMessage("");
              }}
            >
              Clear code
            </Button>
            <p role="status" className={message ? "text-sm text-muted" : "sr-only"}>
              {message}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
