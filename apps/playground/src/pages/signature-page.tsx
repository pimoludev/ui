import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Signature,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const SAMPLE_SIGNATURE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200"><rect width="600" height="200" fill="#ffffff"/><path d="M90 132c34-56 52-84 68-84s8 92 28 92 30-64 48-64 12 44 30 44 30-34 46-34 18 18 34 18 24-10 40-22" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/></svg>`
)}`;

function ContractSignature() {
  const [signature, setSignature] = useState<
    string | null
  >(null);

  return (
    <div className="pg-stack">
      <Signature
        label="Authorised signature"
        description="Draw with a mouse, pen or touch. Complete a tap on Clear to start over, or use Delete from the keyboard. Moving a finger across an action does not activate it."
        value={signature}
        onChange={setSignature}
        undo
      />

      <div className="pg-row">
        <Badge
          variant={signature ? "success" : "secondary"}
        >
          {signature
            ? "Signature captured"
            : "Not signed yet"}
        </Badge>

        <Button
          size="sm"
          appearance="ghost"
          disabled={signature === null}
          onClick={() => setSignature(null)}
        >
          Reset agreement
        </Button>
      </div>
    </div>
  );
}

export function SignaturePage() {
  return (
    <>
      <PageHeader
        title="Signature"
        hint="A high-DPI canvas signature pad with pointer, pen and touch input. onChange and onEnd receive a PNG data URL, or null when the pad is empty or a canvas export is unavailable."
      />

      <Section
        title="Basic"
        hint="Draw inside the dashed area. The clear and undo actions live under the pad, and the canvas itself is focusable for keyboard clearing."
      >
        <div className="pg-grid pg-grid--start">
          <Signature
            label="Signature"
            description="Sign above the line. The pad is 600 by 200 CSS pixels and scales down with its container."
          />

          <Signature
            label="Signature with undo"
            undo
            clearLabel="Clear and start over"
            penColor="#1d4ed8"
            lineWidth={3}
          />
        </div>
      </Section>

      <Section
        title="Controlled"
        hint="value is a data URL; the badge follows the captured signature and Reset sets it back to null."
      >
        <Card>
          <CardHeader>
            <CardTitle>Consulting agreement</CardTitle>
            <CardDescription>
              The parent owns the value. Clearing the pad emits null
              and disables the reset action.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ContractSignature />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="States"
        hint="Read-only displays an existing signature without accepting input. Disabled blocks drawing and dims the pad."
      >
        <div className="pg-stack">
          <Signature
            label="Signed copy"
            description="Read-only: this signature is part of the signed document."
            defaultValue={SAMPLE_SIGNATURE}
            readOnly
          />

          <Signature
            label="Archived signature"
            description="The archived agreement no longer accepts changes."
            defaultValue={SAMPLE_SIGNATURE}
            disabled
          />
        </div>
      </Section>

      <Section
        title="Examples"
        hint="Two real documents that need a handwritten mark."
      >
        <div className="pg-grid pg-grid--start">
          <Card>
            <CardHeader>
              <CardTitle>Delivery confirmation</CardTitle>
              <CardDescription>
                The courier captures a signature on a small tablet.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Signature
                label="Received by"
                width={480}
                height={160}
                lineWidth={2.5}
                clearLabel="Clear signature"
              />
            </CardContent>

            <CardFooter>
              <Badge variant="warning">
                Awaiting signature
              </Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Studio rental</CardTitle>
              <CardDescription>
                A read-only copy of the signature stored with the
                contract.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Signature
                label="Signature on file"
                defaultValue={SAMPLE_SIGNATURE}
                readOnly
                width={480}
                height={160}
              />
            </CardContent>

            <CardFooter>
              <Badge variant="success">
                Signed 12 May 2026
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </Section>
    </>
  );
}
