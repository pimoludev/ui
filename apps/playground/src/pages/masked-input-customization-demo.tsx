"use client";

import { MaskedInput } from "@pimolu/react";

export function CustomizationExample() {

  return (
    <>
      {
        (<>
          <div className="pg-grid">
            <div className="pg-panel">
              <div className="pg-stack">
                <MaskedInput
                  label="Phone (US)"
                  mask="(999) 999-9999"
                  placeholder="(415) 555-2671"
                  fullWidth
                  classNames={{
                    root: "custom-masked-input-root",
                    label: "custom-masked-input-label"
                  }}
                />
                <MaskedInput
                  label="Date"
                  mask="99/99/9999"
                  placeholder="31/12/2026"
                  fullWidth
                  classNames={{
                    root: "custom-masked-input-root",
                    label: "custom-masked-input-label"
                  }}
                />
                <MaskedInput
                  label="Canadian postal code"
                  mask="a9a 9a9"
                  placeholder="K1A 0B1"
                  fullWidth
                  classNames={{
                    root: "custom-masked-input-root",
                    label: "custom-masked-input-label"
                  }}
                />
                <MaskedInput
                  label="Mixed reference"
                  mask="**-9999"
                  placeholder="AB-1234"
                  fullWidth
                  classNames={{
                    root: "custom-masked-input-root",
                    label: "custom-masked-input-label"
                  }}
                />
              </div>
            </div>
          </div>
        </>)
      }
      <style>
        {
          `
.custom-masked-input-root:not(:focus-visible):not(:focus-within) {
  outline: 1px dashed var(--pimolu-primary);
  outline-offset: 2px;
}
.custom-masked-input-label {
  font-weight: 600;
}
`
        }
      </style>
    </>
  );
}
