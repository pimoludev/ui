"use client";

import {
  Input,
  QRCode,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@pimolu/react";
import { useState } from "react";

export function CustomizationExample() {
  const [value, setValue] = useState(
    "https://pimolu.dev/components/qr-code"
  );
  return (
    <>
      {
        (<>
          <div className="pg-grid pg-grid--two pg-grid--start">
            <div className="pg-stack">
              <Input
                label="Value"
                value={value}
                onValueChange={setValue}
                helperText={`${value.length} character(s) · UTF-8 byte mode`}
                placeholder="https://pimolu.dev"
              />
              {
                value.trim()
                  ? (
                    <QRCode
                      value={value}
                      size={220}
                      level="M"
                      aria-label="QR code for the current value"
                      classNames={{
                        root: "custom-qr-code-root"
                      }}
                    />
                  )
                  : (
                    <p className="pg-muted">
                      Enter at least one character to draw a code.
                    </p>
                  )
              }
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Why SVG?</CardTitle>
                <CardDescription>
                  A vector path stays sharp at any size, prints cleanly and needs
                  no image pipeline.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="pg-muted">
                  <li>
                    Versions 1–10 cover roughly 271 bytes at level L and 119 bytes
                    at level H.
                  </li>
                  <li>
                    Levels trade capacity for resilience: H survives more damage.
                  </li>
                  <li>
                    The quiet zone defaults to four modules and can be changed with
                    margin.
                  </li>
                  <li>
                    No logo overlay: scanners are more reliable without one.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-qr-code-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
`
        }
      </style>
    </>
  );
}
