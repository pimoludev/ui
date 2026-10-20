import { useState } from "react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Code,
  Input,
  QRCode,
  type PimoluQRCodeLevel,
} from "@pimolu/react";

import { PageHeader, Section } from "../section";

const LEVELS: PimoluQRCodeLevel[] = [
  "L",
  "M",
  "Q",
  "H",
];

const VCARD = `BEGIN:VCARD
VERSION:3.0
FN:Jean Dupont
ORG:Pimolu UI
TITLE:Design engineer
EMAIL:jean@pimolu.dev
URL:https://pimolu.dev
END:VCARD`;

export function QRCodePage() {
  const [value, setValue] = useState(
    "https://pimolu.dev/components/qr-code"
  );

  return (
    <>
      <PageHeader
        title="QRCode"
        hint="An offline QR encoder with no dependency and no remote API. Byte-mode UTF-8 payloads select versions 1–10, Reed-Solomon correction follows the requested L/M/Q/H level, and the result is a crisp SVG path. Empty values and payloads beyond version 10 throw instead of silently producing an unreadable code."
      />

      <Section
        title="Live value"
        hint="Type any short text or URL. The matrix, version and mask update immediately; colors stay scanner-friendly."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <div className="pg-stack">
            <Input
              label="Value"
              value={value}
              onValueChange={setValue}
              helperText={`${value.length} character(s) · UTF-8 byte mode`}
              placeholder="https://pimolu.dev"
            />

            {value.trim() ? (
              <QRCode
                value={value}
                size={220}
                level="M"
                aria-label="QR code for the current value"
              />
            ) : (
              <p className="pg-muted">
                Enter at least one character to draw a
                code.
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why SVG?</CardTitle>
              <CardDescription>
                A vector path stays sharp at any size,
                prints cleanly and needs no image
                pipeline.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="pg-muted">
                <li>
                  Versions 1–10 cover roughly 271 bytes
                  at level L and 119 bytes at level H.
                </li>
                <li>
                  Levels trade capacity for resilience:
                  H survives more damage.
                </li>
                <li>
                  The quiet zone defaults to four
                  modules and can be changed with margin.
                </li>
                <li>
                  No logo overlay: scanners are more
                  reliable without one.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Error correction levels"
        hint="The same payload at L, M, Q and H. Higher levels add Reed-Solomon codewords and can increase the version, but tolerate more damage."
      >
        <div className="pg-grid">
          {LEVELS.map((level) => (
            <Card key={level}>
              <CardHeader>
                <CardTitle>
                  <span className="pg-row">
                    <Badge variant="secondary">
                      Level {level}
                    </Badge>
                  </span>
                </CardTitle>

                <CardDescription>
                  {level === "L" && "Low · most capacity"}
                  {level === "M" && "Medium · balanced"}
                  {level === "Q" && "Quartile · robust"}
                  {level === "H" && "High · most resilient"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <QRCode
                  value="https://pimolu.dev/components/qr-code"
                  level={level}
                  size={160}
                  aria-label={`QR code at level ${level}`}
                  title={`Pimolu · level ${level}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Colors and size"
        hint="Keep a strong dark-on-light contrast for cameras. The light background is part of the symbol, so transparency is not recommended."
      >
        <div className="pg-grid pg-grid--two pg-grid--start">
          <div className="pg-stack">
            <QRCode
              value="https://pimolu.dev"
              size={200}
              darkColor="#1e1b4b"
              lightColor="#eef2ff"
              aria-label="Indigo QR code"
            />

            <span className="pg-meta">
              Indigo on a pale wash · 200 px
            </span>
          </div>

          <div className="pg-stack">
            <QRCode
              value="https://pimolu.dev"
              size="100%"
              margin={2}
              aria-label="Fluid QR code"
            />

            <span className="pg-meta">
              Fluid width · quiet zone of two modules
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Real-world payloads"
        hint="A URL, a contact card and an email action all fit in a single code. The vCard is plain text with line breaks encoded as bytes."
      >
        <div className="pg-grid">
          <Card>
            <CardHeader>
              <CardTitle>Website</CardTitle>
              <CardDescription>
                The shortest payload also produces the
                smallest version.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <QRCode
                  value="https://pimolu.dev"
                  size={150}
                  aria-label="Pimolu website QR code"
                />

                <Code>https://pimolu.dev</Code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>
                A mailto URI opens the default mail app.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <QRCode
                  value="mailto:hello@pimolu.dev?subject=Pimolu%20UI"
                  size={150}
                  level="Q"
                  aria-label="Email Pimolu QR code"
                />

                <Code>
                  mailto:hello@pimolu.dev?subject=Pimolu%20UI
                </Code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact card</CardTitle>
              <CardDescription>
                vCard text, saved straight into the
                address book.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pg-stack">
                <QRCode
                  value={VCARD}
                  size={150}
                  level="M"
                  aria-label="Pimolu contact card QR code"
                />

                <Code block>{VCARD}</Code>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
