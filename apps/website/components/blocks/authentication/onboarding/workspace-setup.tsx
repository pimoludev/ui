"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from "@pimolu/react";

export function WorkspaceSetupBlock() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [size, setSize] = useState("Just me");
  const [saved, setSaved] = useState(false);
  return (
    <div className="mx-auto max-w-lg p-5 sm:p-8">
      <Card size="lg">
        <CardHeader>
          <Badge variant="primary">Step {step} of 2</Badge>
          <CardTitle>
            {step === 1 ? "A home for your team." : "Make yourself at home."}
          </CardTitle>
          <p className="text-sm text-muted">A short setup, with room to grow.</p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (step === 1) setStep(2);
              else setSaved(true);
            }}
          >
            {step === 1 ? (
              <>
                <Input
                  label="Workspace name"
                  required
                  value={name}
                  onValueChange={setName}
                  fullWidth
                />
                <Select
                  label="Team size"
                  value={size}
                  onValueChange={setSize}
                  fullWidth
                >
                  <option>Just me</option>
                  <option>2-10 people</option>
                  <option>11-50 people</option>
                  <option>More than 50</option>
                </Select>
                <Button type="submit" fullWidth>
                  Continue setup
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2 rounded-xl border border-border p-5">
                  <p className="text-xl font-medium">{name}</p>
                  <p className="text-sm text-muted">{size}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    appearance="outline"
                    onClick={() => {
                      setStep(1);
                      setSaved(false);
                    }}
                  >
                    Back to details
                  </Button>
                  <Button type="submit">Create workspace</Button>
                </div>
              </>
            )}
            <p role="status" className={saved ? "text-sm text-muted" : "sr-only"}>
              {saved
                ? `${name} is ready in this local preview. Nothing was stored on a server.`
                : ""}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
