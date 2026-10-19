import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PinInput,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

function VerificationCard() {
  const [code, setCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [completed, setCompleted] = useState<
    string | null
  >(null);

  const complete = code.every(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-factor verification</CardTitle>

        <CardDescription>
          Enter the six-digit code from your authenticator
          app. The code is grouped as 3 + 3 for easier
          reading.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="pg-stack">
          <PinInput
            label="Authentication code"
            length={6}
            groups={[3, 3]}
            value={code}
            onValueChange={(next: string[]) => {
              setCode(next);
              setCompleted(null);
            }}
            onComplete={setCompleted}
          />

          <div className="pg-row">
            <Badge
              variant={complete ? "success" : "neutral"}
            >
              {complete ? "Complete" : "Waiting"}
            </Badge>

            <Button size="sm" disabled={!complete}>
              Verify
            </Button>

            <Button
              size="sm"
              appearance="ghost"
              onClick={() => {
                setCode(["", "", "", "", "", ""]);
                setCompleted(null);
              }}
            >
              Reset
            </Button>
          </div>

          <p className="pg-meta">
            {completed
              ? `onComplete received "${completed}".`
              : "The verification action stays disabled until every cell is filled."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PinInputPage() {
  return (
    <>
      <PageHeader
        title="Pin Input"
        hint="One input per cell, with paste distribution, Backspace, Delete, arrow/Home/End navigation, optional groups, masking and an alphanumeric mode. Styles come from @pimolu/web-styles/pin-input.css."
      />

      <Section
        title="Default"
        hint="Six numeric cells, one-time-code autocomplete on the first cell and a labelled group."
      >
        <div className="pg-grid pg-grid--start">
          <PinInput label="Uncontrolled code" />

          <PinInput
            label="Four digits"
            length={4}
            helperText="Try pasting 12 34 to fill both remaining cells."
          />
        </div>
      </Section>

      <Section
        title="Grouped and alphanumeric"
        hint="groups splits the cells visually without changing the single group label. type=alphanumeric accepts letters and digits."
      >
        <div className="pg-grid pg-grid--start">
          <PinInput
            label="Grouped recovery code"
            length={8}
            groups={[4, 4]}
          />

          <PinInput
            label="Invite code"
            length={6}
            groups={[3, 3]}
            type="alphanumeric"
            helperText="Letters and digits are both accepted."
          />
        </div>
      </Section>

      <Section
        title="States"
        hint="mask renders password cells; error marks every cell invalid and links the message; disabled and read-only lock the group."
      >
        <div className="pg-grid pg-grid--start">
          <PinInput
            label="Masked code"
            mask
            defaultValue={["1", "2", "3", "4"]}
            length={4}
          />

          <PinInput
            label="Expired code"
            length={4}
            defaultValue={["9", "8", "7", "6"]}
            error
            errorMessage="This code has expired. Request a new one."
          />

          <PinInput
            label="Disabled"
            length={4}
            defaultValue={["1", "2"]}
            disabled
          />

          <PinInput
            label="Read only"
            length={4}
            defaultValue={["4", "2", "0", "0"]}
            readOnly
          />
        </div>
      </Section>

      <Section
        title="Paste and completion"
        hint="A pasted code fills the cells from the current position. onComplete fires once, when the last empty cell is filled."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <VerificationCard />

          <Card>
            <CardHeader>
              <CardTitle>Keyboard reference</CardTitle>

              <CardDescription>
                Every cell is a real input, so the group
                works with a keyboard and a screen reader.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <p className="pg-meta">
                  Type a digit to fill the cell and advance.
                </p>

                <p className="pg-meta">
                  Backspace clears the cell, or the previous
                  cell when the current one is empty.
                </p>

                <p className="pg-meta">
                  Delete clears the current cell. Arrow keys,
                  Home and End move focus without editing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
